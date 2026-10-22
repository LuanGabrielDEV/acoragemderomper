# Lançamento oficial — do teste de R$ 1 à divulgação

Siga **na ordem**. Cada parte termina com uma conferência (✅). Se alguma falhar, pare e resolva antes
de seguir.

| Parte | O que é | Tempo |
|---|---|---|
| 0 | Aplicar as últimas mudanças do código | 10 min |
| 1 | Conferir pendências de conteúdo | 10 min |
| 2 | Planilha oficial na conta do evento | 20 min |
| 3 | Mercado Pago: chave Pix e credenciais de produção | 15 min |
| 4 | Vercel: variáveis de produção | 10 min |
| 5 | Teste com dinheiro real (R$ 1) | 20 min |
| 6 | Voltar ao preço oficial e limpar os testes | 10 min |
| 7 | Divulgação | — |

**Regras de ouro**
- Mudou variável na **Vercel**? **Redeploy.**
- Mudou propriedade no **Apps Script**? Vale **na hora**.
- Mudou o **código** do Apps Script? **Gerenciar implantações > Editar > Nova versão.**
- Token de produção e SEGREDO **nunca** vão para chat, WhatsApp, e-mail ou GitHub.

---

## Parte 0 — Aplicar as últimas mudanças do código

O que mudou:
- duração removida do site; fica só o horário de início, "Início às 14h (horário de Brasília)"
- imagem de compartilhamento com endereço completo, para o link mostrar a foto no WhatsApp e no Instagram
- imagem de Detalhes otimizada (de 2 MB para 228 KB)
- rodapé com "© 2026 Coragem para Romper e Recomeçar"
- e-mail de confirmação: "Horário" passou a ser "Início", e a duração deixou de ser obrigatória
- este guia

1. No VS Code, terminal na pasta do projeto:
   ```powershell
   git checkout main
   git pull
   git status
   git log --oneline -1
   ```
   ✅ `git status` sem alterações pendentes e o último commit `08eeb37` ("Nome e e-mail da inscrição na
   mensagem do WhatsApp..."). Se for outro commit ou houver alterações, pare e peça ajuda antes de seguir.
2. Coloque o arquivo `lancamento-oficial-arquivos.zip` na pasta do projeto e extraia **na raiz**,
   substituindo os arquivos:
   ```powershell
   Expand-Archive -Path .\lancamento-oficial-arquivos.zip -DestinationPath . -Force
   Remove-Item .\lancamento-oficial-arquivos.zip
   git status
   ```
   ✅ Aparecem como modificados **somente**: `index.html`, `apps-script/Codigo.gs`,
   `docs/CHECKOUT-E-EMAILS.md`, `docs/SIMULACAO-E-LANCAMENTO.md`, `public/images/03.jpg`,
   `src/data/eventConfig.ts`, `src/sections/Details.tsx`, `src/sections/Footer.tsx`,
   `src/sections/Schedule.tsx`, e como novo: `docs/LANCAMENTO-OFICIAL.md`.
   Não pode aparecer nenhuma pasta nova com o nome do zip.
3. Revise as mudanças na aba **Source Control** do VS Code (clique em cada arquivo para ver o antes e o depois).
4. Teste e envie:
   ```powershell
   npm run typecheck
   npm run lint
   npm run build
   git add .
   git commit -m "Remove duração, prévia de compartilhamento, imagem otimizada e guia de lançamento"
   git push
   ```
5. ✅ Vercel > **Deployments**: o deploy de Production "Current" mostra esse commit e está **Ready**.
   Abra `https://projeto-romper-green.vercel.app` e confira "Início às 14h" no topo.

---

## Parte 1 — Pendências de conteúdo (confirme antes de lançar)

- [ ] **E-mail de contato** no rodapé: `acoreagemderomper@gmail.com`. A grafia "acor**e**agem" está
      certa? Se o certo for `acoragemderomper`, corrija `organizerContact` em `src/data/eventConfig.ts`.
- [ ] **Como será o encontro**: os 5 momentos atuais (Acolhida, Reflexão Guiada, Escrita & Restauração,
      Mesa Posta, A Decisão) são os definitivos? Ficam em `schedule`, em `eventConfig.ts`.
- [ ] **Política de cancelamento**: "50% até 48h antes". Confirme com quem orienta vocês, porque compras
      online têm direito de arrependimento de 7 dias pelo CDC.
- [ ] **Parcelamento**: hoje vai até várias vezes, com juros pagos pela compradora. Se quiserem limitar
      (ex.: até 3x), é uma linha no código.
- [ ] **WhatsApp**: `5581985526701` está certo (botão flutuante, rodapé e página de agradecimento).

Se mudar algo do código: `git add . && git commit -m "..." && git push`, e espere o deploy.

---

## Parte 2 — Planilha oficial na conta do evento

### 2.1 A planilha atual já está na conta do evento?
Abra a planilha e veja no canto superior direito qual conta está logada, ou clique em **Compartilhar** e veja
quem é o **Proprietário**.

- **É a conta do evento:** use a mesma planilha e vá para o 2.3. Pode colar o código novo do
  `apps-script/Codigo.gs` (opcional, só muda "Horário" para "Início" no e-mail). Se colar, faça
  **Implantar > Gerenciar implantações > ✏️ Editar > Versão: Nova versão > Implantar**. A URL `/exec`
  **continua a mesma**.
- **É outra conta:** crie a planilha oficial (2.2).

### 2.2 Criar a planilha oficial (só se a atual for de outra conta)
Logado **só** no Gmail do evento (use uma janela anônima para não misturar contas):
1. **sheets.new**, com o nome **Inscrições — Romper**.
2. **Extensões > Apps Script**: cole **todo** o `apps-script/Codigo.gs` (a versão nova) e salve.
3. Preencha as **Propriedades do script** (tabela do 2.3).
4. Rode **`configurarEvento`** e autorize as permissões (Avançado > Acessar > Permitir).
5. **Implantar > Nova implantação > App da Web**, com **Executar como: Eu** e
   **Quem pode acessar: Qualquer pessoa**. Copie a **URL `/exec` nova**.
6. ✅ A URL `/exec` aberta numa janela anônima mostra "Planilha do evento: ok".

### 2.3 Gerar um SEGREDO novo (obrigatório)
O SEGREDO atual foi compartilhado em conversa, então gere outro:
1. No Apps Script, rode **`gerarSegredo`**.
2. Copie o valor do **Registro de execução** para usar na Parte 4. Ele já fica salvo nas propriedades.

### 2.4 Propriedades do script (valores oficiais)
Engrenagem > **Propriedades do script**:

| Propriedade | Valor oficial |
|---|---|
| `VAGAS_TOTAL` | **`30`** |
| `ORGANIZADORA_EMAIL` | e-mail que recebe o aviso de cada inscrição |
| `EVENTO_NOME` | `Coragem para Romper e Recomeçar` |
| `EVENTO_DATA_TEXTO` | `Domingo, 22 de novembro de 2026` |
| `EVENTO_HORARIO_TEXTO` | **`Início às 14h (horário de Brasília)`** |
| `EVENTO_INICIO_ISO` | `2026-11-22T14:00:00-03:00` |
| `EVENTO_ENDERECO` | endereço completo do salão |
| `LINK_GRUPO_WHATSAPP` | link oficial do grupo do evento |
| `WHATSAPP_CONTATO` | `5581985526701` |
| `NOME_REMETENTE` | `Coragem para Romper e Recomeçar` |
| `POLITICA_CANCELAMENTO` | texto final da política |

`EVENTO_DURACAO_MIN` agora é opcional e pode ser apagado. Ele só define o fim do lembrete na agenda do
Google e não aparece no e-mail. Sem ele, o lembrete marca 90 minutos.

### 2.5 Conferir o e-mail e limpar
1. Rode **`configurarEvento`**. ✅ O e-mail de exemplo chega com a data, "Início às 14h", o endereço e os
   botões. Clique no botão do grupo e no da agenda para conferir.
2. **Apague todas as linhas de teste**: da linha 2 em diante, botão direito > **Excluir linhas**. **Nunca a linha 1.**
3. Rode **`verResumo`**. ✅ `Pagas: 0 | Reservas ativas: 0 | Vagas: 30`.
4. **Compartilhar** a planilha com as organizadoras: como Leitora, ou Editora para quem fizer o check-in.

---

## Parte 3 — Mercado Pago: chave Pix e credenciais de produção

Na **conta real** que vai receber o dinheiro:

1. **Chave Pix**: app do Mercado Pago > **Pix > Minhas chaves > Cadastrar chave**. Sem a chave, o Pix não
   aparece no checkout.
2. **Credenciais de produção**: [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers) >
   **Suas integrações** > aplicação **Romper site** > **Credenciais de produção** > **Ativar**. Preencha
   ramo e site (`https://projeto-romper-green.vercel.app`) e aceite os termos.
3. Copie o **Access Token de produção** (começa com `APP_USR-` e é **diferente** do de teste).
   Cole direto na Vercel no passo seguinte e não mande para ninguém.

---

## Parte 4 — Vercel: variáveis de produção

Vercel > projeto **coragem-para-romper** > **Settings > Environment Variables** (Production). Edite:

| Variável | Valor |
|---|---|
| `MP_ACCESS_TOKEN` | **Access Token de PRODUÇÃO** (Parte 3) |
| `PLANILHA_SEGREDO` | **SEGREDO novo** (Parte 2.3) |
| `PLANILHA_URL` | só se criou planilha nova (2.2): a URL `/exec` nova |
| `PRECO_REAIS` | **`1.00`** (só para o teste) |
| `SITE_URL` | `https://projeto-romper-green.vercel.app` (já está) |
| `VENDAS_ABERTAS` | `true` (já está) |

**Deployments > ⋯ > Redeploy.**

✅ `https://projeto-romper-green.vercel.app/api/webhook-mercadopago` mostra `{"ok":true}`.

---

## Parte 5 — Teste com dinheiro real (R$ 1)

Agora é pagamento de verdade. **O aviso do Mercado Pago chega sozinho: não rode o comando do PowerShell
da simulação.**

Cuidados para o pagamento não ser recusado:
- **Não** esteja logado no Mercado Pago com a **conta que recebe**. Ninguém pode pagar a si mesmo. Use uma
  janela anônima e pague como visitante, ou use o celular de outra pessoa.
- O site continua mostrando "R$ 59,00", mas o Mercado Pago cobra R$ 1,00. Isso é esperado durante o teste.

### 5.1 Pix
1. Janela anônima > `https://projeto-romper-green.vercel.app` > **Garantir minha vaga**. Use o seu e-mail real.
2. No checkout, escolha **Pix** e pague **R$ 1,00** pelo app do seu banco.
3. Volte ao site. Se não voltar sozinho, toque em "Voltar ao site" no Mercado Pago.
4. ✅ Em até 2 minutos, **sem fazer nada**:
   - [ ] e-mail **"Inscrição confirmada"** no seu e-mail (olhe também Spam e Promoções)
   - [ ] e-mail **"Nova inscrição (1/30)"** para a organizadora
   - [ ] planilha: linha **`pago`**, forma **Pix**, valor **1**, com código e "E-mail enviado em"
   - [ ] em `/obrigado`, o botão do WhatsApp abre com **o seu nome e e-mail** na mensagem

### 5.2 Cartão (recomendado)
Repita com um **cartão real**, em **1x** e com outro e-mail seu (ex.: `seuemail+cartao@gmail.com`).
✅ Mesmas conferências, com a forma **Cartão de crédito** e a organizadora recebendo "(2/30)".

### 5.3 Se o e-mail não chegar em 5 minutos
- Vercel > **Logs** > procure `webhook`. Me mande o print ou peça para eu olhar os logs.
- Na planilha, a linha ficou `pago`? Se sim, o envio saiu: procure no Spam. Se ficou `reservado`, o aviso
  não chegou, e os logs mostram o motivo.

### 5.4 Reembolsar
Mercado Pago > **Atividade** > cada pagamento de R$ 1 > **Devolver dinheiro**.

---

## Parte 6 — Voltar ao preço oficial e limpar

1. Vercel: `PRECO_REAIS` = **`59.00`** > **Redeploy**.
   **Não pule este passo**: se pular, as vagas são vendidas a R$ 1.
2. Planilha: **apague as linhas dos testes de R$ 1**.
3. `verResumo` > ✅ `Pagas: 0`.
4. Abra o site > Garantir minha vaga > preencha > **Pagar**. ✅ O Mercado Pago mostra **R$ 59,00** e as
   opções **Pix** e **Cartão**. Feche **sem pagar** e apague a linha `reservado`, ou deixe vencer em 30 min.

---

## Parte 7 — Divulgação

### Antes de divulgar
- [ ] **Prévia do link**: mande `https://projeto-romper-green.vercel.app` para você mesmo no WhatsApp.
      ✅ Aparecem a foto, o título e a descrição. Se aparecer uma prévia antiga, envie com `?v=2` no final.
- [ ] Abra o site **pelo Instagram** (Direct ou link na bio) e faça o caminho até a tela do Mercado Pago.
- [ ] Documento **Como funciona o site do Romper** compartilhado com as organizadoras.
- [ ] Planilha compartilhada com as organizadoras.

### Durante as vendas
- Acompanhe a planilha e os e-mails "Nova inscrição" nas primeiras vendas.
- Um e-mail com ⚠️ no assunto é um alerta (acima do limite ou duplicidade): veja o documento das organizadoras.

### Quando esgotar (30 pagas)
O site já bloqueia sozinho. Para trocar também o botão por "lista de espera", mude `vendasAbertas: false`
em `src/data/eventConfig.ts` e publique.

### Se algo der errado
1. **Fechar as vendas na hora:** Vercel > `VENDAS_ABERTAS` = `false` > Redeploy.
2. **Plano B:** pagamentos aprovados aparecem em Mercado Pago > Atividade. Confirmem pelo WhatsApp e
   reenviem o e-mail depois com `reenviarEmail` no Apps Script.
