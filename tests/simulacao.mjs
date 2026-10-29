/**
 * Simulação completa do fluxo de inscrição, sem internet e sem dinheiro.
 *
 * Roda o código REAL das funções da Vercel (api/) e do Apps Script (apps-script/Codigo.gs),
 * trocando apenas o que é externo por versões falsas ("mocks"):
 *   - Mercado Pago  -> um fetch falso que guarda preferências e devolve pagamentos
 *   - Google Sheets -> uma planilha em memória (array de linhas)
 *   - Gmail         -> uma lista que registra os e-mails "enviados"
 *
 * Como rodar:  npm run test:simulacao
 * Cada linha com ✓ é um cenário que passou. Se algo quebrar, aparece um AssertionError
 * dizendo o valor esperado e o valor recebido.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const erroOriginal = console.error;
console.error = () => {}; // os cenários de falha geram erros de propósito
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------------- Planilha falsa + serviços do Google ----------------
const props = {
  SEGREDO: 'segredo-de-teste-com-mais-de-24-caracteres',
  VAGAS_TOTAL: '3',
  ORGANIZADORA_EMAIL: 'org@exemplo.com',
  EVENTO_NOME: 'A Coragem para Romper e Recomeçar',
  EVENTO_DATA_TEXTO: 'Sábado, 25 de outubro de 2026',
  EVENTO_HORARIO_TEXTO: '14h às 15h30',
  EVENTO_INICIO_ISO: '2026-10-25T14:00:00-03:00',
  EVENTO_DURACAO_MIN: '90',
  EVENTO_ENDERECO: 'Rua Exemplo, 123',
  LINK_GRUPO_WHATSAPP: 'https://chat.whatsapp.com/abc',
  WHATSAPP_CONTATO: '5581900000000',
  NOME_REMETENTE: 'Romper',
  POLITICA_CANCELAMENTO: 'Reembolso de 50%...',
};
const grade = []; // linhas da aba
const emails = [];
let falharEmail = false;
let agoraFalso = null;
const RealDate = Date;
class FakeDate extends RealDate {
  constructor(...a) { if (a.length === 0 && agoraFalso) super(agoraFalso); else super(...a); }
  static now() { return agoraFalso ? agoraFalso : RealDate.now(); }
}
const aba = {
  getName: () => 'Inscrições',
  getLastRow: () => grade.length,
  appendRow: (l) => grade.push([...l]),
  setFrozenRows() {},
  getMaxRows: () => 1000,
  getRange(r, c, nr = 1, nc = 1) {
    return {
      setValue(v) { grade[r - 1][c - 1] = v; return this; },
      setValues(vals) { vals.forEach((row, i) => row.forEach((v, j) => (grade[r - 1 + i][c - 1 + j] = v))); return this; },
      getValues() { return grade.slice(r - 1, Math.min(grade.length, r - 1 + nr)).map((row) => row.slice(c - 1, c - 1 + nc).map((x) => x ?? '')); },
      setFontWeight() { return this; }, setBackground() { return this; }, setNumberFormat() { return this; },
    };
  },
};
const contexto = {
  console, JSON, Math, Number, String, Array, Object, parseInt, isNaN, encodeURIComponent,
  Date: FakeDate,
  SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => aba, insertSheet: () => aba, getUrl: () => 'https://planilha' }), flush() {} },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (k in props ? props[k] : null), getProperties: () => ({ ...props }) }) },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (t) => ({ t, setMimeType() { return this; } }) },
  MailApp: {
    sendEmail(o) { if (falharEmail) throw new Error('cota'); emails.push(o); },
    getRemainingDailyQuota: () => 99,
  },
  Utilities: {
    getUuid: () => crypto.randomUUID(),
    formatDate: (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''),
  },
};
vm.createContext(contexto);
vm.runInContext(fs.readFileSync(`${REPO}/apps-script/Codigo.gs`, 'utf8'), contexto);
const appsScript = (corpo) => JSON.parse(contexto.doPost({ postData: { contents: corpo } }).t);

// ---------------- Mercado Pago falso ----------------
const pagamentos = {};
const preferencias = [];
let mpFora = false;
globalThis.fetch = async (url, opts = {}) => {
  url = String(url);
  const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
  if (url === 'https://script.google.com/macros/s/TESTE/exec') return new Response(JSON.stringify(appsScript(opts.body)));
  if (url === 'https://api.mercadopago.com/checkout/preferences') {
    if (mpFora) return json(500, { message: 'fora' });
    assert.equal(opts.headers.Authorization, 'Bearer TOKEN-TESTE');
    const pref = JSON.parse(opts.body);
    preferencias.push(pref);
    return json(201, { id: 'pref' + preferencias.length, init_point: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=pref' + preferencias.length });
  }
  const m = url.match(/^https:\/\/api\.mercadopago\.com\/v1\/payments\/(\d+)$/);
  if (m) return pagamentos[m[1]] ? json(200, pagamentos[m[1]]) : json(404, {});
  throw new Error('URL inesperada ' + url);
};

Object.assign(process.env, {
  MP_ACCESS_TOKEN: 'TOKEN-TESTE', SITE_URL: 'https://romper.vercel.app/',
  PLANILHA_URL: 'https://script.google.com/macros/s/TESTE/exec', PLANILHA_SEGREDO: props.SEGREDO,
  PRECO_REAIS: '59.00', VENDAS_ABERTAS: 'true',
});
const { default: criar } = await import(pathToFileURL(`${REPO}/api/criar-checkout.js`).href);
const { default: webhook } = await import(pathToFileURL(`${REPO}/api/webhook-mercadopago.js`).href);
const { default: statusInscricao } = await import(pathToFileURL(`${REPO}/api/status-inscricao.js`).href);
const consultar = (ref) => chamar(statusInscricao, { method: 'GET', url: `/api/status-inscricao?ref=${encodeURIComponent(ref)}` });

function chamar(handler, { method = 'POST', body, url = '/' } = {}) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 200, headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.statusCode = c; return this; },
      json(o) { resolve({ status: this.statusCode, body: o }); },
      end() { resolve({ status: this.statusCode, body: null }); },
    };
    handler({ method, body, url }, res);
  });
}
const linha = (ref) => grade.find((l) => l[1] === ref);
const ok = (msg) => console.log('  ✓', msg);

// ---------------- Cenários ----------------
console.log('Validação');
assert.equal((await chamar(criar, { method: 'GET' })).status, 405); ok('GET recusado');
assert.equal((await chamar(criar, { body: { nome: 'A', email: 'x', whatsapp: '1', cpf: '52998224725' } })).status, 400); ok('dados inválidos → 400');
const resp1 = await chamar(criar, { body: { nome: 'Ana Souza', email: 'ana@ex.com', whatsapp: '5581999998888', cpf: '52998224725', preco: 1 } });
assert.equal(resp1.status, 200);
const p1 = preferencias.at(-1);
assert.equal(p1.items[0].unit_price, 59); ok('preço vem do servidor (ignora "preco" do navegador)');
assert.equal(p1.notification_url, 'https://romper.vercel.app/api/webhook-mercadopago'); ok('notification_url sem barra dupla');
assert.match(p1.expiration_date_to, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}-03:00$/); ok('data no formato do Mercado Pago: ' + p1.expiration_date_to);
assert.equal(p1.back_urls.success, 'https://romper.vercel.app/obrigado');
const refAna = p1.external_reference;
assert.equal(resp1.body.referencia, refAna); ok('resposta devolve a referência da inscrição (para a página /obrigado)');
assert.equal(p1.auto_return, 'all'); assert.equal(p1.back_urls.pending, 'https://romper.vercel.app/obrigado?situacao=pendente');
ok('volta ao site em qualquer resultado (auto_return "all") com as 3 URLs de retorno');
assert.equal(linha(refAna)[2], 'reservado'); ok('reserva criada na planilha');

console.log('Mesma pessoa abrindo de novo');
await chamar(criar, { body: { nome: 'Ana Souza', email: 'ANA@ex.com', whatsapp: '5581999998888', cpf: '52998224725' } });
assert.equal(preferencias.at(-1).external_reference, refAna);
assert.equal(grade.length, 2); ok('reaproveita a reserva (não ocupa outra vaga)');

console.log('Limite de vagas (VAGAS_TOTAL=3)');
await chamar(criar, { body: { nome: 'Bia Lima', email: 'bia@ex.com', whatsapp: '5581999997777', cpf: '52998224725' } });
const refBia = preferencias.at(-1).external_reference;
await chamar(criar, { body: { nome: 'Cris Melo', email: 'cris@ex.com', whatsapp: '5581999996666', cpf: '52998224725' } });
const refCris = preferencias.at(-1).external_reference;
let r = await chamar(criar, { body: { nome: 'Dani Reis', email: 'dani@ex.com', whatsapp: '5581999995555', cpf: '52998224725' } });
assert.deepEqual([r.status, r.body.erro], [409, 'reservas_cheias']); ok('4ª pessoa: "reservas_cheias" enquanto 3 estão pagando');

console.log('Webhook');
pagamentos['1001'] = { id: 1001, status: 'pending', external_reference: refAna, transaction_amount: 59, payment_type_id: 'bank_transfer', payer: { email: 'ana@ex.com' } };
r = await chamar(webhook, { body: { type: 'payment', data: { id: '1001' } } });
assert.equal(linha(refAna)[2], 'reservado'); assert.equal(emails.length, 0); ok('pagamento pendente não confirma');
r = await consultar(refAna);
assert.deepEqual([r.status, r.body.situacao], [200, 'aguardando']); ok('status da inscrição: "aguardando" enquanto o Pix não cai');
pagamentos['1001'].status = 'approved';
r = await chamar(webhook, { body: { type: 'payment', data: { id: '1001' } } });
assert.equal(r.status, 200);
const ana = linha(refAna);
assert.equal(ana[2], 'pago'); assert.match(ana[11], /^ROMPER-[A-Z2-9]{6}$/); assert.equal(ana[9], 'Pix');
assert.equal(emails.length, 2); assert.equal(emails[0].to, 'ana@ex.com'); assert.equal(emails[1].to, 'org@exemplo.com');
assert.match(emails[0].htmlBody, /Rua Exemplo, 123/); assert.match(emails[0].htmlBody, /chat\.whatsapp\.com/);
assert.match(emails[1].subject, /\(1\/3\)/); ok('aprovado → planilha "pago", código ' + ana[11] + ', e-mail cliente + aviso "1/3"');
r = await consultar(refAna);
assert.deepEqual([r.status, r.body.situacao], [200, 'pago']); assert.deepEqual(Object.keys(r.body), ['situacao']);
ok('status da inscrição: "pago" depois do webhook, sem nenhum dado pessoal na resposta');
assert.equal((await consultar('romper-' + crypto.randomUUID())).body.situacao, 'desconhecida'); ok('referência desconhecida → "desconhecida"');
assert.equal((await consultar('qualquer coisa')).status, 400); ok('referência em formato inválido → 400');
assert.equal((await chamar(statusInscricao, { method: 'POST', body: {} })).status, 405); ok('status só aceita GET');
await chamar(webhook, { body: { type: 'payment', data: { id: '1001' } } });
await chamar(webhook, { url: '/api/webhook-mercadopago?data.id=1001&type=payment', body: {} });
assert.equal(emails.length, 2); ok('aviso repetido (corpo e URL) não duplica e-mail');

r = await chamar(webhook, { body: { type: 'merchant_order', data: { id: '999999' } } });
assert.equal(r.body.ignorado, true); ok('merchant_order ignorado');
r = await chamar(webhook, { body: { type: 'payment', data: { id: '424242' } } });
assert.equal(r.status, 200); assert.equal(emails.length, 2); ok('aviso falso (pagamento inexistente) não confirma nada');
pagamentos['5555'] = { id: 5555, status: 'approved', external_reference: 'outro-evento-1', transaction_amount: 10, payer: {} };
await chamar(webhook, { body: { type: 'payment', data: { id: '5555' } } });
assert.equal(emails.length, 2); ok('pagamento de outra venda da conta é ignorado');

console.log('Falha no e-mail → Mercado Pago tenta de novo');
pagamentos['1002'] = { id: 1002, status: 'approved', external_reference: refBia, transaction_amount: 59, payment_type_id: 'credit_card', payer: { email: 'bia@ex.com' } };
falharEmail = true;
r = await chamar(webhook, { body: { type: 'payment', data: { id: '1002' } } });
assert.equal(r.status, 500); assert.equal(linha(refBia)[2], 'pago'); assert.equal(linha(refBia)[12], ''); ok('e-mail falhou → 500 (retry), já marcado pago');
falharEmail = false;
r = await chamar(webhook, { body: { type: 'payment', data: { id: '1002' } } });
assert.equal(r.status, 200); assert.notEqual(linha(refBia)[12], ''); assert.equal(emails.at(-2).to, 'bia@ex.com'); ok('nova tentativa envia o e-mail');

console.log('Reservas expiradas e limite');
agoraFalso = RealDate.now() + 31 * 60000; // 31 minutos depois
r = await chamar(criar, { body: { nome: 'Dani Reis', email: 'dani@ex.com', whatsapp: '5581999995555', cpf: '52998224725' } });
assert.equal(r.status, 200); assert.equal(linha(refCris)[2], 'expirado'); ok('reserva vencida da Cris liberou a vaga para a Dani');
const refDani = preferencias.at(-1).external_reference;
r = await chamar(criar, { body: { nome: 'Eva Dias', email: 'eva@ex.com', whatsapp: '5581999994444', cpf: '52998224725' } });
assert.equal(r.body.erro, 'reservas_cheias'); ok('2 pagas + 1 reserva = cheio');
pagamentos['1003'] = { id: 1003, status: 'approved', external_reference: refDani, transaction_amount: 59, payment_type_id: 'credit_card', payer: { email: 'dani@ex.com' } };
await chamar(webhook, { body: { type: 'payment', data: { id: '1003' } } });
r = await chamar(criar, { body: { nome: 'Eva Dias', email: 'eva@ex.com', whatsapp: '5581999994444', cpf: '52998224725' } });
assert.equal(r.body.erro, 'esgotado'); ok('3 pagas → "esgotado"');

console.log('Pix pago depois de expirar (acima do limite)');
pagamentos['1004'] = { id: 1004, status: 'approved', external_reference: refCris, transaction_amount: 59, payment_type_id: 'bank_transfer', payer: { email: 'cris@ex.com' } };
await chamar(webhook, { body: { type: 'payment', data: { id: '1004' } } });
assert.equal(linha(refCris)[2], 'pago'); assert.match(emails.at(-1).subject, /^⚠️ Nova inscrição \(4\/3\)/); assert.match(linha(refCris)[14], /limite/);
ok('registrada, cliente recebe e-mail e organizadora recebe alerta "4/3"');

console.log('Duplicidade');
pagamentos['1005'] = { ...pagamentos['1001'], id: 1005 };
await chamar(webhook, { body: { type: 'payment', data: { id: '1005' } } });
assert.match(emails.at(-1).subject, /duplicidade/); assert.match(linha(refAna)[14], /1005/); ok('segundo pagamento da mesma reserva gera alerta de reembolso');

console.log('Segurança e configuração');
assert.equal(appsScript(JSON.stringify({ acao: 'reservar', segredo: 'errado', nome: 'X Y', email: 'x@y.com' })).erro, 'nao_autorizado'); ok('planilha recusa segredo errado');
process.env.VENDAS_ABERTAS = 'false';
assert.equal((await chamar(criar, { body: { nome: 'Fe Luz', email: 'fe@ex.com', whatsapp: '5581999993333', cpf: '52998224725' } })).body.erro, 'esgotado'); ok('VENDAS_ABERTAS=false fecha as vendas');
process.env.VENDAS_ABERTAS = 'true'; props.VAGAS_TOTAL = '30'; mpFora = true;
r = await chamar(criar, { body: { nome: 'Fe Luz', email: 'fe@ex.com', whatsapp: '5581999993333', cpf: '52998224725' } });
assert.deepEqual([r.status, r.body.erro], [502, 'indisponivel']); ok('Mercado Pago fora do ar → mensagem amigável');
mpFora = false;
delete process.env.MP_ACCESS_TOKEN;
assert.equal((await chamar(criar, { body: { nome: 'Fe Luz', email: 'fe@ex.com', whatsapp: '5581999993333', cpf: '52998224725' } })).status, 500); ok('sem token → 500 sem vazar detalhes');

const corpoNome = appsScript(JSON.stringify({ acao: 'reservar', segredo: props.SEGREDO, nome: '<b>Xss</b> Teste', email: 'xss@ex.com', whatsapp: '81999990000', cpf: '52998224725' }));
pagamentos['1006'] = { id: 1006, status: 'approved', external_reference: corpoNome.referencia, transaction_amount: 59, payer: {} };
process.env.MP_ACCESS_TOKEN = 'TOKEN-TESTE';
await chamar(webhook, { body: { type: 'payment', data: { id: '1006' } } });
const htmlXss = emails.find((e) => e.to === 'xss@ex.com').htmlBody;
assert.ok(!htmlXss.includes('<b>Xss'), 'HTML do nome escapado'); ok('nome com HTML é escapado no e-mail');

console.log('E-mail mascarado pelo Mercado Pago (caso real)');
const antes = emails.length;
pagamentos['1007'] = { id: 1007, status: 'approved', external_reference: 'romper-referencia-desconhecida', transaction_amount: 1, payment_type_id: 'bank_transfer', payer: { email: 'XXXXXXXXXXX' } };
r = await chamar(webhook, { body: { type: 'payment', data: { id: '1007' } } });
assert.equal(r.status, 200);
const lm = linha('romper-referencia-desconhecida');
assert.equal(lm[2], 'pago'); assert.equal(lm[4], ''); assert.match(lm[12], /NÃO ENVIADO/); assert.match(lm[14], /inválido/);
assert.equal(emails.length, antes + 1); assert.match(emails.at(-1).subject, /sem e-mail válido/);
await chamar(webhook, { body: { type: 'payment', data: { id: '1007' } } });
assert.equal(emails.length, antes + 1); ok('e-mail mascarado: inscrição paga, alerta à organizadora, sem travar nem repetir');
const refE = appsScript(JSON.stringify({ acao: 'reservar', segredo: props.SEGREDO, nome: 'Gi Paz', email: 'gi@ex.com', whatsapp: '81999990001', cpf: '52998224725' })).referencia;
pagamentos['1008'] = { id: 1008, status: 'approved', external_reference: refE, transaction_amount: 59, payment_type_id: 'bank_transfer', payer: { email: 'XXXXXXXXXXX' } };
await chamar(webhook, { body: { type: 'payment', data: { id: '1008' } } });
assert.equal(linha(refE)[4], 'gi@ex.com'); assert.equal(emails.find((e) => e.to === 'gi@ex.com') !== undefined, true); ok('reserva encontrada: usa o e-mail digitado, ignora o mascarado');

console.log(`\nTodos os cenários passaram. Planilha final: ${grade.length - 1} linhas.`);
console.table(grade.slice(1).map((l) => ({ status: l[2], nome: l[3], email: l[4], codigo: l[11] })));
