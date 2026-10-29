/**
 * A Coragem para Romper e Recomeçar — Planilha de inscrições + e-mails automáticos
 * ---------------------------------------------------------------------------
 * Este código roda no Google Apps Script, DENTRO da planilha do evento
 * (Extensões > Apps Script). Ele faz três coisas:
 *
 *   1. RESERVAR: quando alguém abre o checkout, guarda uma reserva de 30 min
 *      e diz se ainda há vaga (limite de VAGAS_TOTAL).
 *   2. CONFIRMAR: quando o Mercado Pago aprova o pagamento, marca a linha como
 *      "pago", gera o código da inscrição e envia os e-mails.
 *   3. E-MAILS: envia a confirmação para a cliente e um aviso para a organizadora,
 *      pelo Gmail da conta dona desta planilha.
 *
 * Quem chama este código são as funções do site na Vercel (pasta /api).
 * Toda chamada precisa trazer o SEGREDO correto; sem ele, nada acontece.
 *
 * CONFIGURAÇÃO: tudo que muda (data, endereço, link do grupo...) fica em
 * Configurações do projeto (ícone de engrenagem) > Propriedades do script.
 * Veja a lista em PROPRIEDADES_NECESSARIAS abaixo.
 */

// ===================== Configuração =====================

const NOME_ABA = 'Inscrições';
const MINUTOS_RESERVA = 30;

const CABECALHO = [
  'Reservado em',      // A
  'Referência',        // B
  'Status',            // C  reservado | pago | expirado
  'Nome',              // D
  'E-mail',            // E
  'WhatsApp',          // F
  'Reserva expira em', // G
  'ID do pagamento',   // H
  'Valor (R$)',        // I
  'Forma de pagamento',// J
  'Pago em',           // K
  'Código',            // L
  'E-mail enviado em', // M
  'Check-in',          // N  
  'Observações',       // O
];

// Posição de cada coluna (começando em 0)
const COL = {
  reservadoEm: 0, referencia: 1, status: 2, nome: 3, email: 4, whatsapp: 5,
  expiraEm: 6, paymentId: 7, valor: 8, forma: 9, pagoEm: 10, codigo: 11,
  emailEnviadoEm: 12, checkin: 13, obs: 14,
};

const PROPRIEDADES_NECESSARIAS = [
  'SEGREDO',               // texto longo e aleatório; o MESMO valor vai na Vercel (PLANILHA_SEGREDO)
  'VAGAS_TOTAL',           // ex.: 30
  'ORGANIZADORA_EMAIL',    // quem recebe o aviso de cada inscrição
  'EVENTO_NOME',           // ex.: A Coragem para Romper e Recomeçar
  'EVENTO_DATA_TEXTO',     // ex.: Domingo, 22 de novembro de 2026
  'EVENTO_HORARIO_TEXTO',  // ex.: Início às 14h (horário de Brasília)
  'EVENTO_INICIO_ISO',     // ex.: 2026-11-22T14:00:00-03:00 (para o botão da agenda)
  'EVENTO_ENDERECO',       // endereço completo (só vai no e-mail)
  'LINK_GRUPO_WHATSAPP',   // ex.: https://chat.whatsapp.com/...
  'WHATSAPP_CONTATO',      // só dígitos, ex.: 5581999999999
  'NOME_REMETENTE',        // ex.: A Coragem para Romper e Recomeçar
  'POLITICA_CANCELAMENTO', // texto da política
];

// ===================== Entrada (chamada pelo site) =====================

function doPost(e) {
  let pedido;
  try {
    pedido = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (erro) {
    return responder({ ok: false, erro: 'json_invalido' });
  }

  const props = PropertiesService.getScriptProperties();
  const segredo = props.getProperty('SEGREDO');
  if (!segredo || pedido.segredo !== segredo) {
    return responder({ ok: false, erro: 'nao_autorizado' });
  }

  const trava = LockService.getScriptLock();
  try {
    trava.waitLock(15000); // uma operação por vez: evita vender a mesma vaga duas vezes
  } catch (erro) {
    return responder({ ok: false, erro: 'ocupado' });
  }

  try {
    if (pedido.acao === 'reservar') return responder(reservar(pedido));
    if (pedido.acao === 'confirmar') return responder(confirmar(pedido));
    if (pedido.acao === 'status') return responder(consultarStatus(pedido));
    return responder({ ok: false, erro: 'acao_desconhecida' });
  } catch (erro) {
    // O registro de execuções do Google não mostra logs de chamadas anônimas,
    // então o motivo volta na resposta (só para quem tem o SEGREDO) e fica salvo em ULTIMO_ERRO.
    const detalhe = String((erro && erro.message) || erro).slice(0, 300);
    console.error('Erro em ' + pedido.acao + ': ' + detalhe);
    try {
      props.setProperty('ULTIMO_ERRO', new Date().toISOString() + ' | ' + pedido.acao + ' | ' + detalhe);
    } catch (e2) { /* ignora */ }
    return responder({ ok: false, erro: 'erro_interno', detalhe: detalhe });
  } finally {
    SpreadsheetApp.flush();
    trava.releaseLock();
  }
}

/** Abrir a URL no navegador só confirma que o script está publicado. Não mostra dados. */
function doGet() {
  return ContentService.createTextOutput('Planilha do evento: ok');
}

function responder(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===================== 1. Reservar =====================

function reservar(pedido) {
  const nome = limparTexto(pedido.nome, 120);
  const email = limparTexto(pedido.email, 200).toLowerCase();
  const whatsapp = String(pedido.whatsapp || '').replace(/\D/g, '').slice(0, 13);

  if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, erro: 'dados_invalidos' };
  }

  const aba = obterAba();
  const agora = new Date();
  const linhas = lerLinhas(aba);
  const total = Number(propriedade('VAGAS_TOTAL', '30'));

  // Reservas vencidas viram "expirado"
  linhas.forEach(function (l) {
    if (l.valores[COL.status] === 'reservado' && new Date(l.valores[COL.expiraEm]) <= agora) {
      aba.getRange(l.numero, COL.status + 1).setValue('expirado');
      l.valores[COL.status] = 'expirado';
    }
  });

  // A mesma pessoa abrindo o checkout de novo reaproveita a própria reserva
  const minhaReserva = linhas.find(function (l) {
    return l.valores[COL.status] === 'reservado' && String(l.valores[COL.email]).toLowerCase() === email;
  });
  if (minhaReserva) {
    const novaExpiracao = new Date(agora.getTime() + MINUTOS_RESERVA * 60000);
    aba.getRange(minhaReserva.numero, COL.nome + 1).setValue(nome);
    aba.getRange(minhaReserva.numero, COL.whatsapp + 1).setValue(whatsapp);
    aba.getRange(minhaReserva.numero, COL.expiraEm + 1).setValue(novaExpiracao);
    return { ok: true, referencia: String(minhaReserva.valores[COL.referencia]), expiraEm: novaExpiracao.toISOString() };
  }

  const pagos = contar(linhas, 'pago');
  const reservasAtivas = contar(linhas, 'reservado');

  if (pagos >= total) return { ok: false, erro: 'esgotado' };
  if (pagos + reservasAtivas >= total) return { ok: false, erro: 'reservas_cheias' };

  const referencia = 'romper-' + Utilities.getUuid();
  const expiraEm = new Date(agora.getTime() + MINUTOS_RESERVA * 60000);
  const linha = new Array(CABECALHO.length).fill('');
  linha[COL.reservadoEm] = agora;
  linha[COL.referencia] = referencia;
  linha[COL.status] = 'reservado';
  linha[COL.nome] = nome;
  linha[COL.email] = email;
  linha[COL.whatsapp] = whatsapp;
  linha[COL.expiraEm] = expiraEm;
  aba.appendRow(linha);

  return { ok: true, referencia: referencia, expiraEm: expiraEm.toISOString() };
}

// ===================== Consultar status (página /obrigado) =====================

/**
 * Só leitura. Devolve apenas "pago", "aguardando", "expirado" ou "desconhecida".
 * Nenhum dado pessoal sai daqui: a página /obrigado usa isso para saber se o
 * servidor já confirmou o pagamento (o webhook do Mercado Pago é quem grava "pago").
 */
function consultarStatus(pedido) {
  const referencia = limparTexto(pedido.referencia, 80);
  if (!referencia) return { ok: false, erro: 'dados_invalidos' };
  const linha = lerLinhas(obterAba()).find(function (l) {
    return String(l.valores[COL.referencia]) === referencia;
  });
  if (!linha) return { ok: true, situacao: 'desconhecida' };
  const status = String(linha.valores[COL.status]);
  if (status === 'pago') return { ok: true, situacao: 'pago' };
  if (status === 'expirado') return { ok: true, situacao: 'expirado' };
  return { ok: true, situacao: 'aguardando' };
}

// ===================== 2. Confirmar pagamento =====================

function confirmar(pedido) {
  const referencia = limparTexto(pedido.referencia, 80);
  const paymentId = String(pedido.paymentId || '').replace(/\D/g, '');
  if (!referencia || !paymentId) return { ok: false, erro: 'dados_invalidos' };

  const aba = obterAba();
  const linhas = lerLinhas(aba);
  const total = Number(propriedade('VAGAS_TOTAL', '30'));
  let linha = linhas.find(function (l) { return String(l.valores[COL.referencia]) === referencia; });

  // Sem reserva encontrada (raro): cria a linha com os dados que o Mercado Pago informou
  if (!linha) {
    const nova = new Array(CABECALHO.length).fill('');
    nova[COL.reservadoEm] = new Date();
    nova[COL.referencia] = referencia;
    nova[COL.status] = 'reservado';
    nova[COL.nome] = limparTexto(pedido.nomePagador, 120) || '(sem nome)';
    const emailMP = limparTexto(pedido.emailPagador, 200).toLowerCase();
    nova[COL.email] = emailValido(emailMP) ? emailMP : '';
    nova[COL.obs] = 'Linha criada no pagamento (reserva não encontrada; ref ' + referencia + ').';
    aba.appendRow(nova);
    linha = { numero: aba.getLastRow(), valores: nova };
    linhas.push(linha);
  }

  const v = linha.valores;
  const jaPago = v[COL.status] === 'pago';

  // Mesmo pagamento avisado de novo: só reenvia o e-mail se ele ainda não saiu
  if (jaPago && String(v[COL.paymentId]) === paymentId) {
    if (v[COL.emailEnviadoEm]) return { ok: true, jaProcessado: true };
    enviarEmailsDaLinha(aba, linha.numero, v, contar(linhas, 'pago'), total, '');
    return { ok: true, reenviado: true };
  }

  // Outro pagamento para uma inscrição que já estava paga: pagamento em duplicidade
  if (jaPago && String(v[COL.paymentId]) !== paymentId) {
    acrescentarObs(aba, linha.numero, v, 'Pagamento extra ' + paymentId + ' (duplicidade, avaliar reembolso).');
    avisarOrganizadora(
      '⚠️ Pagamento em duplicidade: ' + v[COL.nome],
      'A inscrição ' + v[COL.codigo] + ' (' + v[COL.email] + ') recebeu um segundo pagamento: ' +
      paymentId + '.\nConfira no Mercado Pago e avalie o reembolso.'
    );
    return { ok: true, duplicidade: true };
  }

  // Primeira confirmação
  const codigo = gerarCodigoUnico(linhas);
  const agora = new Date();
  v[COL.status] = 'pago';
  v[COL.paymentId] = paymentId;
  v[COL.valor] = Number(pedido.valor) || '';
  v[COL.forma] = traduzirForma(pedido.forma);
  v[COL.pagoEm] = agora;
  v[COL.codigo] = codigo;
  const emailDoMP = limparTexto(pedido.emailPagador, 200).toLowerCase();
  if (!emailValido(String(v[COL.email])) && emailValido(emailDoMP)) v[COL.email] = emailDoMP;
  aba.getRange(linha.numero, 1, 1, CABECALHO.length).setValues([v]);

  // v é a mesma linha que está em "linhas", então esta contagem já inclui a inscrição atual
  const pagosAgora = contar(linhas, 'pago');
  let alerta = '';
  if (pagosAgora > total) {
    alerta = 'ATENÇÃO: esta inscrição passou do limite (' + pagosAgora + ' de ' + total +
      '). Decida se é possível encaixar ou se será feito o reembolso.';
    acrescentarObs(aba, linha.numero, v, 'Acima do limite de vagas.');
  }

  enviarEmailsDaLinha(aba, linha.numero, v, pagosAgora, total, alerta);
  return { ok: true, codigo: codigo, numero: pagosAgora };
}

// ===================== 3. E-mails =====================

function enviarEmailsDaLinha(aba, numeroLinha, v, numero, total, alerta) {
  const email = String(v[COL.email] || '').trim();
  if (!emailValido(email)) {
    // Sem e-mail válido: a inscrição continua paga, a organizadora confirma pelo WhatsApp.
    // "E-mail enviado em" recebe um aviso para o sistema não ficar tentando de novo.
    acrescentarObs(aba, numeroLinha, v, 'E-mail inválido ("' + email + '"): confirmar pelo WhatsApp. Depois de corrigir o e-mail, apague "E-mail enviado em" e rode enviarEmailsPendentes.');
    aba.getRange(numeroLinha, COL.emailEnviadoEm + 1).setValue('NÃO ENVIADO (e-mail inválido)');
    try {
      avisarOrganizadora(
        '⚠️ Inscrição paga sem e-mail válido (' + numero + '/' + total + '): ' + v[COL.nome],
        [alerta,
          'O pagamento foi aprovado, mas o e-mail da inscrição é inválido: "' + email + '".',
          'Confirme a vaga pelo WhatsApp e envie o endereço e o link do grupo.',
          '',
          'Nome: ' + v[COL.nome],
          'WhatsApp: ' + (v[COL.whatsapp] || '-'),
          'Código: ' + v[COL.codigo],
          'ID do pagamento (Mercado Pago): ' + v[COL.paymentId],
          'Planilha: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()].filter(function (x) { return x !== ''; }).join('\n')
      );
    } catch (erro) {
      console.error('Falha no aviso à organizadora: ' + erro);
    }
    return;
  }

  enviarEmailCliente({ nome: String(v[COL.nome]), email: email, codigo: String(v[COL.codigo]) });
  aba.getRange(numeroLinha, COL.emailEnviadoEm + 1).setValue(new Date());

  // O aviso para a organizadora não pode impedir a confirmação da cliente
  try {
    const assunto = (alerta ? '⚠️ ' : '') + 'Nova inscrição (' + numero + '/' + total + '): ' + v[COL.nome];
    const corpo = [
      alerta,
      'Nome: ' + v[COL.nome],
      'E-mail: ' + v[COL.email],
      'WhatsApp: ' + (v[COL.whatsapp] || '-'),
      'Código: ' + v[COL.codigo],
      'Valor: R$ ' + v[COL.valor] + ' (' + v[COL.forma] + ')',
      'ID do pagamento (Mercado Pago): ' + v[COL.paymentId],
      '',
      'Inscrições pagas: ' + numero + ' de ' + total + '.',
      'Planilha: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
    ].filter(function (x) { return x !== ''; }).join('\n');
    avisarOrganizadora(assunto, corpo);
  } catch (erro) {
    console.error('Falha no aviso à organizadora: ' + erro);
  }
}

function enviarEmailCliente(dados) {
  const p = obterPropriedades();
  const primeiroNome = dados.nome.split(' ')[0] || dados.nome;
  const linkAgenda = montarLinkAgenda(p);
  const linkContato = p.WHATSAPP_CONTATO ? 'https://wa.me/' + p.WHATSAPP_CONTATO : '';

  const botao = function (href, texto, cor) {
    return '<a href="' + esc(href) + '" style="display:inline-block;background:' + cor +
      ';color:#FDFBF7;text-decoration:none;font-weight:600;padding:14px 26px;border-radius:999px;margin:6px 4px;">' +
      esc(texto) + '</a>';
  };

  const html =
    '<div style="background:#F4EFEA;padding:24px 12px;font-family:Helvetica,Arial,sans-serif;color:#3D2C24;">' +
    '<div style="max-width:560px;margin:0 auto;background:#FDFBF7;border-radius:20px;padding:32px 24px;">' +
    '<p style="margin:0;color:#C87D55;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Inscrição confirmada</p>' +
    '<h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;line-height:1.25;margin:12px 0 8px;">' +
    'Sua vaga está garantida, ' + esc(primeiroNome) + '! 🤍</h1>' +
    '<p style="font-size:16px;line-height:1.6;color:#5A4439;">Recebemos o seu pagamento para <strong>' + esc(p.EVENTO_NOME) +
    '</strong>. Que alegria ter você nesta travessia.</p>' +

    '<div style="background:#F4EFEA;border-radius:16px;padding:18px 20px;margin:22px 0;font-size:15px;line-height:1.7;">' +
    '<div><strong>📅 Data:</strong> ' + esc(p.EVENTO_DATA_TEXTO) + '</div>' +
    '<div><strong>🕑 Início:</strong> ' + esc(p.EVENTO_HORARIO_TEXTO) + '</div>' +
    '<div><strong>📍 Endereço:</strong> ' + esc(p.EVENTO_ENDERECO) + '</div>' +
    '</div>' +

    '<div style="text-align:center;border:1px dashed #C87D55;border-radius:16px;padding:16px;margin:0 0 22px;">' +
    '<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#5A4439;">Seu código de inscrição</div>' +
    '<div style="font-family:Georgia,serif;font-size:26px;letter-spacing:3px;color:#C87D55;margin-top:6px;">' + esc(dados.codigo) + '</div>' +
    '<div style="font-size:13px;color:#5A4439;margin-top:6px;">Apresente este código na entrada (no celular ou impresso).</div>' +
    '</div>' +

    '<div style="text-align:center;">' +
    (p.LINK_GRUPO_WHATSAPP ? botao(p.LINK_GRUPO_WHATSAPP, 'Entrar no grupo do evento', '#5F6F5B') : '') +
    (linkAgenda ? botao(linkAgenda, 'Adicionar à agenda', '#A35F3F') : '') +
    '</div>' +

    '<p style="font-size:15px;line-height:1.6;color:#5A4439;margin-top:22px;">Chegue 10 minutos antes. ' +
    'Todo o material e os cuidados do encontro estão inclusos.</p>' +
    (p.POLITICA_CANCELAMENTO ? '<p style="font-size:13px;line-height:1.6;color:#5A4439;"><strong>Política de cancelamento:</strong> ' +
      esc(p.POLITICA_CANCELAMENTO) + '</p>' : '') +
    (linkContato ? '<p style="font-size:14px;color:#5A4439;">Dúvidas? <a href="' + esc(linkContato) +
      '" style="color:#C87D55;">Fale com a gente no WhatsApp</a> ou responda este e-mail.</p>' : '') +
    '<p style="font-size:12px;color:#8a7a72;margin-top:24px;">Se você não fez esta inscrição, ignore este e-mail.</p>' +
    '</div></div>';

  const texto = [
    'Sua vaga está garantida, ' + primeiroNome + '!',
    '',
    p.EVENTO_NOME,
    'Data: ' + p.EVENTO_DATA_TEXTO,
    'Início: ' + p.EVENTO_HORARIO_TEXTO,
    'Endereço: ' + p.EVENTO_ENDERECO,
    '',
    'Seu código de inscrição: ' + dados.codigo,
    p.LINK_GRUPO_WHATSAPP ? 'Grupo do evento: ' + p.LINK_GRUPO_WHATSAPP : '',
    linkAgenda ? 'Adicionar à agenda: ' + linkAgenda : '',
    '',
    'Chegue 10 minutos antes.',
    p.POLITICA_CANCELAMENTO ? 'Política de cancelamento: ' + p.POLITICA_CANCELAMENTO : '',
    linkContato ? 'Dúvidas: ' + linkContato : '',
  ].join('\n');

  MailApp.sendEmail({
    to: dados.email,
    subject: 'Inscrição confirmada — ' + p.EVENTO_NOME,
    body: texto,
    htmlBody: html,
    name: p.NOME_REMETENTE || p.EVENTO_NOME,
    replyTo: p.ORGANIZADORA_EMAIL || undefined,
  });
}

function avisarOrganizadora(assunto, corpo) {
  const destino = propriedade('ORGANIZADORA_EMAIL', '');
  if (!destino) return;
  MailApp.sendEmail({ to: destino, subject: assunto, body: corpo, name: propriedade('NOME_REMETENTE', 'Inscrições') });
}

function montarLinkAgenda(p) {
  const inicio = new Date(p.EVENTO_INICIO_ISO);
  if (isNaN(inicio.getTime())) return '';
  // A agenda do Google exige um fim: usa EVENTO_DURACAO_MIN se existir (opcional), senão 90 min.
  // Esse fim só aparece no lembrete da agenda, não no texto do e-mail.
  const fim = new Date(inicio.getTime() + Number(p.EVENTO_DURACAO_MIN || 90) * 60000);
  const formatar = function (d) { return Utilities.formatDate(d, 'UTC', "yyyyMMdd'T'HHmmss'Z'"); };
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(p.EVENTO_NOME) +
    '&dates=' + formatar(inicio) + '/' + formatar(fim) +
    '&details=' + encodeURIComponent('Chegue 10 minutos antes. Leve seu código de inscrição.') +
    '&location=' + encodeURIComponent(p.EVENTO_ENDERECO || '');
}

// ===================== Ferramentas para você rodar no editor =====================

/**
 * PASSO 1: rode esta função (▶ Executar). Ela cria o SEGREDO automaticamente
 * nas Propriedades do script e mostra o valor no registro de execução.
 * Copie esse valor para a variável PLANILHA_SEGREDO na Vercel.
 */
function gerarSegredo() {
  const segredo = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '');
  PropertiesService.getScriptProperties().setProperty('SEGREDO', segredo);
  console.log('SEGREDO criado. Copie para a Vercel (PLANILHA_SEGREDO): ' + segredo);
}

/**
 * RODE ESTA FUNÇÃO UMA VEZ (botão ▶ Executar) depois de preencher as propriedades.
 * Ela cria o cabeçalho da planilha, confere as propriedades, pede as permissões
 * do Google e envia um e-mail de exemplo para a organizadora.
 */
function configurarEvento() {
  const aba = obterAba();
  const p = obterPropriedades();
  const faltando = PROPRIEDADES_NECESSARIAS.filter(function (k) { return !p[k]; });
  if (faltando.length) {
    throw new Error('Preencha estas Propriedades do script antes: ' + faltando.join(', '));
  }
  if (String(p.SEGREDO).length < 24) throw new Error('O SEGREDO precisa ter pelo menos 24 caracteres.');

  enviarEmailCliente({ nome: 'Organizadora (TESTE)', email: p.ORGANIZADORA_EMAIL, codigo: 'ROMPER-TESTE' });
  console.log('Tudo certo! Aba "' + aba.getName() + '" pronta e e-mail de teste enviado para ' + p.ORGANIZADORA_EMAIL +
    '. Cota de e-mails restante hoje: ' + MailApp.getRemainingDailyQuota());
}

/**
 * DIAGNÓSTICO: tenta enviar agora o e-mail das inscrições pagas que ficaram sem e-mail.
 * Rode no editor (▶ Executar): se houver erro, ele aparece aqui mesmo, com o motivo.
 */
function enviarEmailsPendentes() {
  const aba = obterAba();
  const linhas = lerLinhas(aba);
  const total = Number(propriedade('VAGAS_TOTAL', '30'));
  const pendentes = linhas.filter(function (l) { return l.valores[COL.status] === 'pago' && !l.valores[COL.emailEnviadoEm]; });
  console.log('Último erro registrado: ' + propriedade('ULTIMO_ERRO', '(nenhum)'));
  console.log('Linhas: ' + linhas.map(function (l) { return l.numero + '=' + l.valores[COL.status]; }).join(', '));
  if (!pendentes.length) { console.log('Nenhuma inscrição paga sem e-mail.'); return; }
  pendentes.forEach(function (l) {
    console.log('Enviando para a linha ' + l.numero + ' (' + l.valores[COL.email] + ', ' + l.valores[COL.codigo] + ')...');
    enviarEmailsDaLinha(aba, l.numero, l.valores, contar(linhas, 'pago'), total, '');
    console.log('Enviado.');
  });
}

/** Mostra quantas inscrições pagas e reservas ativas existem agora. */
function verResumo() {
  const linhas = lerLinhas(obterAba());
  console.log('Pagas: ' + contar(linhas, 'pago') + ' | Reservas ativas: ' + contar(linhas, 'reservado') +
    ' | Vagas: ' + propriedade('VAGAS_TOTAL', '30') + ' | E-mails restantes hoje: ' + MailApp.getRemainingDailyQuota());
}

/**
 * Reenvia o e-mail de confirmação para uma inscrição paga.
 * Troque o código abaixo e rode a função no editor.
 */
function reenviarEmail() {
  const CODIGO = 'ROMPER-XXXXXX'; // ← troque pelo código da inscrição
  const aba = obterAba();
  const linha = lerLinhas(aba).find(function (l) { return l.valores[COL.codigo] === CODIGO; });
  if (!linha) throw new Error('Código não encontrado: ' + CODIGO);
  enviarEmailCliente({ nome: String(linha.valores[COL.nome]), email: String(linha.valores[COL.email]), codigo: CODIGO });
  aba.getRange(linha.numero, COL.emailEnviadoEm + 1).setValue(new Date());
  console.log('E-mail reenviado para ' + linha.valores[COL.email]);
}

// ===================== Funções auxiliares =====================

function obterAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(NOME_ABA);
  if (!aba) aba = planilha.insertSheet(NOME_ABA);
  if (aba.getLastRow() === 0) {
    aba.appendRow(CABECALHO);
    aba.setFrozenRows(1);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold').setBackground('#F4EFEA');
    // WhatsApp e ID do pagamento como TEXTO (senão o Sheets mostra 5,58E+12)
    [COL.whatsapp, COL.paymentId, COL.codigo].forEach(function (c) {
      aba.getRange(1, c + 1, aba.getMaxRows(), 1).setNumberFormat('@');
    });
  }
  return aba;
}

/** Lê as linhas de dados (sem o cabeçalho). numero = número real da linha na planilha. */
function lerLinhas(aba) {
  const ultima = aba.getLastRow();
  if (ultima < 2) return [];
  return aba.getRange(2, 1, ultima - 1, CABECALHO.length).getValues().map(function (valores, i) {
    return { numero: i + 2, valores: valores };
  });
}

function contar(linhas, status) {
  const agora = new Date();
  return linhas.filter(function (l) {
    if (l.valores[COL.status] !== status) return false;
    if (status === 'reservado') return new Date(l.valores[COL.expiraEm]) > agora;
    return true;
  }).length;
}

function gerarCodigoUnico(linhas) {
  const alfabeto = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sem 0/O, 1/I/L para não confundir
  const existentes = {};
  linhas.forEach(function (l) { existentes[l.valores[COL.codigo]] = true; });
  for (let tentativa = 0; tentativa < 50; tentativa++) {
    const bytes = Utilities.getUuid().replace(/-/g, '');
    let codigo = 'ROMPER-';
    for (let i = 0; i < 6; i++) codigo += alfabeto[parseInt(bytes.substr(i * 2, 2), 16) % alfabeto.length];
    if (!existentes[codigo]) return codigo;
  }
  throw new Error('Não foi possível gerar um código único');
}

function traduzirForma(tipo) {
  const mapa = { bank_transfer: 'Pix', credit_card: 'Cartão de crédito', debit_card: 'Cartão de débito', account_money: 'Saldo Mercado Pago', ticket: 'Boleto' };
  return mapa[tipo] || String(tipo || '');
}

function acrescentarObs(aba, numeroLinha, v, texto) {
  v[COL.obs] = (v[COL.obs] ? v[COL.obs] + ' | ' : '') + texto;
  aba.getRange(numeroLinha, COL.obs + 1).setValue(v[COL.obs]);
}

function obterPropriedades() {
  return PropertiesService.getScriptProperties().getProperties();
}

function propriedade(chave, padrao) {
  const valor = PropertiesService.getScriptProperties().getProperty(chave);
  return valor === null || valor === '' ? padrao : valor;
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || ''));
}

function limparTexto(valor, max) {
  return String(valor || '').replace(/[\u0000-\u001F]/g, ' ').trim().slice(0, max);
}

function esc(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
