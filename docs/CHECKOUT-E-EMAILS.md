# Checkout Mercado Pago + e-mails automáticos — guia passo a passo

Este guia leva o site do **Coragem para Romper e Recomeçar** do "botão sem link" até
"a cliente paga e recebe a confirmação por e-mail sozinha". Siga na ordem. Cada fase
termina com uma **conferência**: só avance quando ela der certo.

---

## Como funciona

```
Cliente clica em "Garantir minha vaga"
   ↓  janela pede Nome, E-mail e WhatsApp
/api/criar-checkout  (Vercel)
   • Planilha: reserva a vaga por 30 min (ou responde "esgotado")
   • Mercado Pago: cria o pagamento de R$ 59 (link vale 30 min)
   ↓
Cliente paga no Mercado Pago (Pix ou cartão)  →  volta para /obrigado
   ↓  (nos bastidores, em segundos)
Mercado Pago avisa  →  /api/webhook-mercadopago
   • pergunta ao Mercado Pago se o pagamento foi APROVADO (não confia no aviso)
   • Planilha (Apps Script): marca "pago", gera o código ROMPER-XXXXXX e envia:
       → e-mail para a cliente: data, horário, ENDEREÇO, código, link do GRUPO, agenda
       → e-mail para a organizadora: "Nova inscrição (N/30)"
```

| Peça | Onde fica | Para quê |
|---|---|---|
| Site (React/Vite) | Vercel | Mostra a página e a janela de inscrição |
| `api/criar-checkout.js` | Vercel | Reserva a vaga e cria o pagamento |
| `api/webhook-mercadopago.js` | Vercel | Recebe o aviso de pagamento aprovado |
| `apps-script/Codigo.gs` | Planilha Google | Registro das inscrições, limite de vagas e envio dos e-mails |

**Por que planilha + Gmail?** O site usa o domínio `.vercel.app`, e serviços de e-mail como o
Resend exigem um domínio próprio, com acesso ao DNS. O Apps Script envia pelo Gmail da conta dona
da planilha, sem domínio e de graça. A planilha vira a lista oficial de inscritas.

**Limites que você precisa conhecer**
- O Gmail comum envia para até **100 destinatários por dia** pelo Apps Script. Cada inscrição gasta
  2 (cliente + organizadora), então dá para até 50 inscrições num mesmo dia. Para 30 vagas, sobra.
- A **pré-visualização do Bolt não roda a pasta `/api`**. Lá o botão mostra "não conseguimos abrir
  o pagamento". O checkout só funciona **publicado na Vercel**.
- **Pagamentos com credenciais de TESTE do Mercado Pago não disparam o aviso (webhook).** O teste
  completo é uma compra real de valor baixo, reembolsada depois (Fase 5).

---

## Fase 0 — O que ter em mãos

- [ ] O **Gmail do evento** (`acoragemderomper@gmail.com`), com verificação em duas etapas ativada
- [ ] **Endereço completo** do local
- [ ] **Link do grupo do WhatsApp** do evento (Grupo > Convidar via link)
- [ ] **WhatsApp de contato** das organizadoras (só dígitos, com 55 e DDD)
- [ ] E-mail da organizadora que vai receber o aviso de cada inscrição
- [ ] Conta no **Mercado Pago** verificada
- [ ] Projeto na **Vercel** ligado ao repositório do GitHub

---

## Fase 1 — Planilha e Apps Script (≈ 30 min)

Faça tudo **logado no Gmail do evento**.

### 1.1 Criar a planilha
1. Abra [sheets.new](https://sheets.new) e dê o nome **Inscrições — Romper**.
2. Menu **Extensões > Apps Script**. Abre um editor em outra aba.
3. Apague o conteúdo de `Código.gs` e cole **todo** o arquivo `apps-script/Codigo.gs` deste repositório.
4. Clique no ícone de disquete (**Salvar**).

### 1.2 Gerar o segredo
1. No topo do editor, escolha a função **`gerarSegredo`** e clique em **▶ Executar**.
2. Na primeira vez o Google pede permissão: **Revisar permissões**, escolha a conta do evento.
   Como o script é seu, aparece o aviso "O Google não verificou este app". Clique em
   **Avançado > Acessar (não seguro)** e depois em **Permitir**.
3. No **Registro de execução** aparece `SEGREDO criado... : 3f9a...`. **Copie esse valor** e guarde-o
   para a Fase 4. Ele já foi salvo nas propriedades do script.

### 1.3 Preencher as propriedades do evento
Clique na **engrenagem (Configurações do projeto)**. Em **Propriedades do script**, use
**Adicionar propriedade do script** para cada linha:

| Propriedade | Exemplo | Observação |
|---|---|---|
| `SEGREDO` | *(já criado no passo 1.2)* | não altere |
| `VAGAS_TOTAL` | `30` | limite de inscrições |
| `ORGANIZADORA_EMAIL` | `acoragemderomper@gmail.com` | recebe o aviso de cada venda (pode ser o próprio e-mail do evento) |
| `EVENTO_NOME` | `Coragem para Romper e Recomeçar` | |
| `EVENTO_DATA_TEXTO` | `Domingo, 22 de novembro de 2026` | como aparece no e-mail |
| `EVENTO_HORARIO_TEXTO` | `Início às 14h (horário de Brasília)` | |
| `EVENTO_INICIO_ISO` | `2026-11-22T14:00:00-03:00` | para o botão "Adicionar à agenda" |
| `EVENTO_ENDERECO` | `Rua ..., nº ..., bairro, cidade` | **só vai no e-mail** |
| `LINK_GRUPO_WHATSAPP` | `https://chat.whatsapp.com/...` | |
| `WHATSAPP_CONTATO` | `5581999999999` | só dígitos |
| `NOME_REMETENTE` | `Coragem para Romper e Recomeçar` | nome que aparece como remetente |
| `POLITICA_CANCELAMENTO` | resumo da política + `Política completa: https://projeto-romper-green.vercel.app/politica` | aparece no e-mail |

Clique em **Salvar propriedades do script**.

> Mudanças nas propriedades valem **na hora**, sem publicar de novo. É por aqui que você corrige a
> data, o endereço ou o número de vagas.

### 1.4 Conferir e enviar um e-mail de teste
1. Escolha a função **`configurarEvento`** e clique em **▶ Executar**. Se pedir permissão de novo
   (para enviar e-mail), autorize.
2. Volte à planilha: deve existir a aba **Inscrições** com o cabeçalho.
3. A caixa de `ORGANIZADORA_EMAIL` recebe um e-mail de exemplo, com o código `ROMPER-TESTE`.
   **Confira o visual, a data, o endereço e os botões.**
4. Se der erro "Preencha estas Propriedades...", complete as que faltam e rode de novo.

### 1.5 Publicar como "App da Web"
1. Botão azul **Implantar > Nova implantação**.
2. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web**.
3. Preencha:
   - Descrição: `v1`
   - **Executar como: Eu** (a conta do evento)
   - **Quem pode acessar: Qualquer pessoa**
4. **Implantar** e copie a **URL do app da Web** (termina em `/exec`). Ela vai para a Fase 4.

"Qualquer pessoa" é necessário porque quem chama a planilha é o servidor da Vercel. A proteção é
o SEGREDO: sem ele o script responde `nao_autorizado` e não grava nada.

**Conferência:** abra a URL `/exec` no navegador. Deve aparecer **"Planilha do evento: ok"**.

> **Se um dia você alterar o código do Apps Script**, faça **Implantar > Gerenciar implantações >
> ✏️ Editar > Versão: Nova versão > Implantar**. Sem isso a URL continua rodando o código antigo.

---

## Fase 2 — Mercado Pago (≈ 15 min)

1. Entre em [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers) com a conta
   que vai **receber** o dinheiro.
2. **Suas integrações > Criar aplicação**. Dê um nome (ex.: `Romper site`) e escolha
   **Pagamentos on-line > Checkout Pro**.
3. Abra a aplicação e vá em **Credenciais de produção**. Pode ser preciso preencher dados do
   negócio e ativar as credenciais.
4. Copie o **Access Token** de produção (começa com `APP_USR-`).

O Access Token é a "senha" da conta para receber pagamentos. Ele **nunca** vai no código, no Bolt,
no GitHub nem em conversa. O único lugar dele é a variável `MP_ACCESS_TOKEN` na Vercel.

**Webhook:** não é preciso configurar nada no painel. O site informa o endereço do aviso
(`/api/webhook-mercadopago`) em cada pagamento criado.

---

## Fase 3 — Aplicar o código no repositório

As mudanças estão na branch `checkout-mercadopago`, entregue em dois formatos.

**Opção A, com Git (recomendada).** Com o arquivo `checkout-mercadopago.patch` na pasta do projeto:
```bash
git checkout main
git pull
git checkout -b checkout-mercadopago
git am checkout-mercadopago.patch
npm install
npm run build
git push -u origin checkout-mercadopago
```
Depois abra um Pull Request no GitHub e faça o merge na `main`. A Vercel também cria um link de
prévia para a branch.

**Opção B, copiando arquivos.** Extraia o `.zip` por cima da pasta do projeto, mantendo a estrutura
de pastas, e faça `git add . && git commit -m "Checkout Mercado Pago" && git push`.

**O que mudou:**

| Arquivo | Mudança |
|---|---|
| `api/criar-checkout.js` | **novo**: reserva a vaga e cria o pagamento |
| `api/webhook-mercadopago.js` | **novo**: confirma pagamentos aprovados |
| `apps-script/Codigo.gs` | **novo**: código da planilha (colado no Google, não roda na Vercel) |
| `src/components/CheckoutDialog.tsx` | **novo**: janela com nome, e-mail e WhatsApp |
| `src/components/CheckoutButton.tsx` | **novo**: botão "Garantir minha vaga" que abre a janela |
| `src/lib/checkout.ts`, `cta.ts`, `checkoutContext.ts` | **novos**: funções de apoio |
| `src/sections/Hero.tsx`, `Details.tsx`, `FinalCTA.tsx` | botões passam a abrir a janela |
| `src/pages/ThankYouPage.tsx` | textos para aprovado, pendente e falhou, mais `noindex` |
| `src/data/eventConfig.ts` | 30 vagas, links do WhatsApp gerados de um número só, FAQ atualizado |
| `vercel.json` | o rewrite não captura mais `/api`, e as funções têm até 30 s |
| `index.html` | fecha o `<head>` e remove o CSS inexistente |

---

## Fase 4 — Variáveis na Vercel e publicação (≈ 10 min)

Na Vercel: **projeto > Settings > Environment Variables**. Cadastre em **Production** (e em
Preview, se quiser testar pela branch):

| Nome | Valor |
|---|---|
| `MP_ACCESS_TOKEN` | Access Token do Mercado Pago (Fase 2) |
| `SITE_URL` | endereço do site, com `https://` e **sem barra no final** (ex.: `https://projeto-romper.vercel.app`) |
| `PLANILHA_URL` | URL `/exec` do Apps Script (Fase 1.5) |
| `PLANILHA_SEGREDO` | o SEGREDO (Fase 1.2) |
| `PRECO_REAIS` | `59.00` |
| `VENDAS_ABERTAS` | `true` |

Depois: **Deployments > ⋯ no último deploy > Redeploy**. A Vercel só lê variáveis novas num deploy
novo.

**Conferências:**
- Abra `https://SEU-SITE/api/webhook-mercadopago` no navegador. Deve aparecer `{"ok":true}`. Se der
  404, a pasta `api/` não foi publicada (veja "Problemas comuns").
- No site, clique em **Garantir minha vaga**, preencha com os seus dados e clique em **Pagar**. Você
  deve cair na página do Mercado Pago com **R$ 59,00**. **Não pague ainda.** Na planilha, deve
  aparecer uma linha `reservado` com o seu nome.

---

## Fase 5 — Teste real, de ponta a ponta (≈ 20 min)

Como o modo teste do Mercado Pago não dispara o webhook, faça uma compra real de valor baixo:

1. Na Vercel, mude `PRECO_REAIS` para `1.00` e faça **Redeploy**.
2. No site, inscreva-se com um e-mail seu e **pague com Pix**.
3. Confira, em até 1 a 2 minutos:
   - [ ] Você voltou para `/obrigado`
   - [ ] Chegou o **e-mail de confirmação**, com endereço, código, grupo e agenda. Olhe também o spam
   - [ ] A organizadora recebeu **"Nova inscrição (1/30)"**
   - [ ] Na planilha, a linha está como **pago**, com código, valor, forma e "E-mail enviado em"
4. **Reembolse** o pagamento: Mercado Pago > Atividade > o pagamento > Devolver.
5. **Volte `PRECO_REAIS` para `59.00` e faça Redeploy.** Se esquecer este passo, as vagas são vendidas a R$ 1.
6. Na planilha, **apague a linha de teste**, para ela não contar como vaga ocupada.

**Teste do limite (opcional, sem pagar):** nas Propriedades do script, coloque `VAGAS_TOTAL = 1`.
Abra o checkout com um e-mail (cria 1 reserva) e tente abrir com outro e-mail: a janela deve dizer
que as vagas estão reservadas. Volte para `30` e apague as linhas de teste.

**Teste no celular:** repita a inscrição abrindo o link **pelo Instagram** (navegador interno) e pelo
navegador do celular.

---

## Dia a dia das organizadoras

- **Lista de inscritas:** a planilha. Filtre a coluna **Status = pago**. Compartilhe a planilha com as
  organizadoras pelo botão **Compartilhar** (como Leitor, ou Editor para quem faz o check-in).
- **Check-in na portaria:** procure o nome ou o código e marque a coluna **Check-in**.
- **Status das linhas:**
  - `reservado`: abriu o pagamento e ainda não pagou (segura a vaga por 30 min)
  - `expirado`: não pagou a tempo, e a vaga voltou
  - `pago`: confirmada, com e-mail enviado
- **Reenviar o e-mail de alguém:** no Apps Script, abra a função `reenviarEmail`, troque
  `ROMPER-XXXXXX` pelo código da pessoa e execute.
- **Ver o resumo:** execute `verResumo`. Mostra pagas, reservas ativas e e-mails restantes no dia.
- **Encerrar as vendas antes do limite:** na Vercel, `VENDAS_ABERTAS = false` e Redeploy. Para mudar
  também o botão do site para "lista de espera", troque `vendasAbertas: false` em
  `src/data/eventConfig.ts` e publique.
- **Alertas que podem chegar por e-mail:**
  - **"⚠️ Nova inscrição (31/30)"**: um Pix gerado no último segundo foi pago depois de a vaga
    expirar. Decidam entre encaixar a pessoa ou reembolsar.
  - **"⚠️ Pagamento em duplicidade"**: alguém pagou duas vezes a mesma inscrição. Reembolse o
    pagamento extra pelo Mercado Pago.

---

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Janela diz "Não conseguimos abrir o pagamento" | Variável faltando ou errada na Vercel | Confira as 6 variáveis e faça Redeploy. Veja o erro em **Vercel > Logs** (`criar-checkout: ...`) |
| `/api/...` dá 404 | A pasta `api/` não foi enviada ao GitHub | Confira se `api/criar-checkout.js` está no repositório e na branch publicada |
| Log: `planilha recusou - nao_autorizado` | `PLANILHA_SEGREDO` diferente do `SEGREDO` | Copie de novo (sem espaços) e faça Redeploy |
| Log: `resposta inesperada da planilha` | URL errada ou implantação sem acesso para "Qualquer pessoa" | Refaça a Fase 1.5 e use a URL que termina em `/exec` |
| Pagou e a planilha não mudou | O webhook não chegou ou falhou | Vercel > Logs > procure `webhook`. O Mercado Pago tenta de novo por vários dias, mas confira o pagamento e use `reenviarEmail` se for preciso |
| Planilha "pago", mas sem e-mail | Cota do Gmail ou e-mail digitado errado | `verResumo` mostra a cota. Corrija o e-mail na planilha e use `reenviarEmail` |
| E-mail caiu no spam | Primeiro envio de uma conta nova | Peça às primeiras inscritas para marcar "não é spam". Envie um teste antes de divulgar |
| Mudei o código do Apps Script e nada mudou | Implantação antiga | Gerenciar implantações > Editar > **Nova versão** |

---

## Segurança e cuidados

- **Segredos só na Vercel:** `MP_ACCESS_TOKEN` e `PLANILHA_SEGREDO`. Se algum vazar, gere outro
  (credenciais no Mercado Pago, ou `gerarSegredo` no Apps Script), atualize na Vercel e faça Redeploy.
- **O endereço e o link do grupo** ficam só nas Propriedades do Apps Script e saem apenas no e-mail
  enviado depois do pagamento aprovado. Eles não aparecem no código nem no site.
- **A página `/obrigado` não confirma pagamento**, porque qualquer pessoa pode abri-la. Quem confirma é o
  servidor, consultando o Mercado Pago.
- **O preço é definido no servidor** (`PRECO_REAIS`). O navegador não envia valor.
- **Limite de vagas:** quem abre o checkout segura uma vaga por 30 minutos. Na reta final, alguém
  pode ver "vagas reservadas, tente daqui a pouco" e conseguir minutos depois. Isso é esperado.
- **Dados pessoais (LGPD):** nome, e-mail e WhatsApp ficam na planilha. Compartilhe só com quem
  organiza, use só para o evento e defina quando apagar depois.
- **Reembolsos, nota fiscal e política de cancelamento:** confirme com um contador ou advogado. O
  direito de arrependimento de 7 dias (CDC) vale para compras online.

---

## Pendências antes de divulgar

- [ ] `src/data/eventConfig.ts`: trocar `whatsappNumber` (hoje `5581900000000`, de exemplo) pelo número real
- [ ] Conferir a data (22/11/2026), o horário de início no `eventConfig.ts` **e** nas Propriedades do script
- [ ] Estruturar os momentos de "Como será o encontro" (`schedule` em `eventConfig.ts`)
- [ ] Teste real da Fase 5 feito, reembolsado, com preço de volta a `59.00` e linha de teste apagada
