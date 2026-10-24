# Simulação e lançamento — passo a passo

Roteiro em 4 partes, para fazer **na ordem**:

| Parte | O que é | Dinheiro real? |
|---|---|---|
| **A. Preparação** | Código publicado, planilha e conta de teste do Mercado Pago | Não |
| **B. Simulação** | Compras fictícias com cartão de teste, conferindo e-mails, planilha e limite de vagas | Não |
| **C. Limpeza** | Apagar os testes e colocar os dados reais do evento | Não |
| **D. Produção** | Token oficial, uma compra real de R$ 1 reembolsada, e lançamento | Sim, R$ 1 (devolvido) |

**Ideia central:** a simulação usa o **mesmo endereço do site** (`https://acoragempararomper.vercel.app`
ou o que a Vercel te deu) com as **variáveis de teste**. Para lançar, você só **troca o token** e
**publica de novo**. Não é preciso mexer no código entre a simulação e a produção.

> Por que não testar no link de prévia da branch? A Vercel protege os links de prévia com login
> (Deployment Protection). O Mercado Pago não consegue passar por esse login, então o retorno e o
> aviso de pagamento falhariam. O domínio de produção (`*.vercel.app` principal) é público.

### Resumo das variáveis

| Variável (Vercel) | Na simulação (B) | Na produção (D) |
|---|---|---|
| `MP_ACCESS_TOKEN` | **token de TESTE** | **token de PRODUÇÃO** |
| `SITE_URL` | endereço do site | igual |
| `PLANILHA_URL` | URL `/exec` do Apps Script | igual |
| `PLANILHA_SEGREDO` | o SEGREDO | igual |
| `PRECO_REAIS` | `59.00` | `1.00` no teste real, depois `59.00` |
| `VENDAS_ABERTAS` | `true` | `true` |

| Propriedade (Apps Script) | Na simulação | Na produção |
|---|---|---|
| `VAGAS_TOTAL` | `2` (para testar o limite) | `30` |
| Demais (data, endereço, grupo...) | já os valores reais | igual |

**Regras de ouro**
- Mudou uma variável na **Vercel**? Precisa de **Redeploy**.
- Mudou uma propriedade no **Apps Script**? Vale **na hora**.
- Token, segredo e senhas **nunca** vão para o código, o GitHub ou o chat.

---

## Parte A — Preparação

### A1. Código na `main` e site no ar
1. No GitHub, faça o **merge** do Pull Request `checkout-mercadopago` para `main`. Se ainda não fez,
   antes atualize a linha do `init_point` (veja o quadro abaixo).
2. Na Vercel, abra o projeto e espere o deploy da `main` ficar **Ready**.
3. Anote o **endereço de produção**: na Vercel, projeto > **Domains** (ex.: `acoragempararomper.vercel.app`).
   Esse é o seu `SITE_URL`, com `https://` e sem barra no final.
4. Confira: abra `https://SEU-SITE/api/webhook-mercadopago`. Deve aparecer `{"ok":true}`.

> **Ajuste no código (credenciais de teste antigas).** Em `api/criar-checkout.js`, troque a linha
> ```js
> return res.status(200).json({ url: corpo.init_point });
> ```
> por:
> ```js
> // Credenciais antigas de teste (começam com TEST-) usam o link de sandbox
> const url = config.mpToken.startsWith('TEST-') && corpo.sandbox_init_point ? corpo.sandbox_init_point : corpo.init_point;
> return res.status(200).json({ url });
> ```
> Depois: `git add . && git commit -m "Suporte a credenciais de teste" && git push`.

### A2. Planilha e Apps Script
Siga a **Fase 1** de [`CHECKOUT-E-EMAILS.md`](CHECKOUT-E-EMAILS.md), logado no **Gmail do evento**, com
estes valores:

- `VAGAS_TOTAL` = **`2`** (provisório, para testar o limite)
- `ORGANIZADORA_EMAIL` = o e-mail do evento, ou o de uma organizadora
- `EVENTO_DATA_TEXTO` = `Domingo, 22 de novembro de 2026`
- `EVENTO_INICIO_ISO` = `2026-11-22T14:00:00-03:00`
- os demais (endereço, link do grupo, WhatsApp...) **já com os dados reais**, para você conferir o
  e-mail de verdade

Ao final da A2 você precisa ter:
- [ ] o **SEGREDO** (resultado do `gerarSegredo`)
- [ ] a **URL `/exec`** (Implantar > App da Web, com "Qualquer pessoa")
- [ ] o e-mail de teste do `configurarEvento` recebido e conferido

### A3. Mercado Pago: aplicação e contas de teste
Faça logado na **conta real** do Mercado Pago, a que vai receber o dinheiro.

1. Acesse [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers) > **Suas integrações**
   > **Criar aplicação**. Nome: `Romper site`. Produto: **Checkout Pro**.
2. Dentro da aplicação, abra **Contas de teste**. O Mercado Pago já cria uma conta **vendedor** de teste
   automaticamente.
3. Clique em **+ Criar conta de teste** e crie uma conta **Comprador**, país **Brasil**, com algum saldo
   fictício.
4. Anote o **usuário** e a **senha** do comprador de teste. Se não aparecer a senha, use o menu da
   linha > **Gerar nova senha**.
5. Abra **Credenciais de teste** e copie o **Access Token** de teste. Ele pode começar com `APP_USR-`
   ou `TEST-`, e o código aceita os dois.

> As contas de teste são fictícias: nada do que acontecer nelas envolve dinheiro real.

---

## Parte B — Simulação (sem dinheiro real)

### B1. Variáveis de teste na Vercel
Vercel > projeto > **Settings > Environment Variables**. Cadastre em **Production**:

| Nome | Valor |
|---|---|
| `MP_ACCESS_TOKEN` | Access Token de **TESTE** (A3, passo 5) |
| `SITE_URL` | `https://SEU-SITE` (A1, passo 3) |
| `PLANILHA_URL` | URL `/exec` (A2) |
| `PLANILHA_SEGREDO` | SEGREDO (A2) |
| `PRECO_REAIS` | `59.00` |
| `VENDAS_ABERTAS` | `true` |

Depois: **Deployments** > menu **⋯** do último deploy > **Redeploy**. Espere ficar **Ready**.

### B2. Teste 1: reserva (sem pagar)
1. Abra o site e clique em **Garantir minha vaga**.
2. Preencha com o **seu** nome, um e-mail **seu** e o WhatsApp. Clique em **Pagar R$ 59,00**.
3. ✅ Abre a página do Mercado Pago com **"Coragem para Romper e Recomeçar" — R$ 59,00**.
4. ✅ Na planilha, aparece uma linha com status **`reservado`**.
5. Feche a aba sem pagar.

Se der "Não conseguimos abrir o pagamento", vá em **Vercel > Logs** e procure `criar-checkout:`. A
seção de problemas no final deste guia explica cada mensagem.

### B3. Teste 2: compra aprovada
O Mercado Pago só aceita pagamento de teste vindo de um **comprador de teste**. Por isso:

1. Abra uma **janela anônima** (Ctrl+Shift+N).
2. Nela, entre em [mercadopago.com.br](https://www.mercadopago.com.br) com o **usuário e a senha do
   comprador de teste** (A3, passo 4). Se pedir um código de 6 dígitos, ele aparece em
   **Suas integrações > aplicação > Contas de teste** (na sua janela normal).
3. Ainda na janela anônima, abra o site e inscreva-se com o **seu e-mail real**, que é onde o
   e-mail de confirmação vai chegar.
4. No checkout, pague com **cartão de crédito de teste**:

   | Campo | Valor |
   |---|---|
   | Número | `5480 8328 0103 3311` (Mastercard) |
   | Validade | `11/30` |
   | CVV | `123` |
   | Nome no cartão | **`APRO`** (é o nome que faz o pagamento ser aprovado) |
   | CPF | `12345678909` |

   Pix não funciona no modo de teste. Use o cartão.
5. ✅ Você volta para `/obrigado`. **Copie da barra de endereço o número depois de `payment_id=`**,
   por exemplo `.../obrigado?...&payment_id=1234567890&...`.

### B4. Disparar o aviso de pagamento manualmente
**Pagamentos de teste não disparam o aviso automático (webhook) do Mercado Pago.** Na produção ele
chega sozinho. Na simulação, você mesmo chama o aviso.

No terminal do VS Code (PowerShell), troque os dois valores e rode:

```powershell
$site = "https://SEU-SITE"
$id   = "COLE_AQUI_O_PAYMENT_ID"
Invoke-RestMethod -Method Post -Uri "$site/api/webhook-mercadopago" -ContentType "application/json" -Body (@{ type = "payment"; data = @{ id = $id } } | ConvertTo-Json)
```

✅ Resposta: `ok : True`

Em até 1 minuto, confira:
- [ ] **E-mail de confirmação** no seu e-mail: data 22/11, horário, **endereço**, código `ROMPER-XXXXXX`,
  botão do grupo e botão da agenda. Olhe também o spam e a aba Promoções
- [ ] Clique em **Entrar no grupo do evento** e em **Adicionar à agenda**. Os dois devem funcionar
- [ ] **E-mail da organizadora**: "Nova inscrição (1/2): seu nome"
- [ ] **Planilha:** a linha virou **`pago`**, com ID do pagamento, valor, "Cartão de crédito", "Pago em",
  código e "E-mail enviado em"

**Rode o mesmo comando de novo.** ✅ Responde `ok : True` e **não** chega outro e-mail. Isso prova
que avisos repetidos não duplicam a confirmação.

> Isso não é uma brecha de segurança. Qualquer pessoa pode chamar esse endereço, mas o servidor
> pergunta ao Mercado Pago se o pagamento foi aprovado. Um número inventado ou não aprovado não
> confirma nada.

### B5. Teste 3: pagamento pendente
1. Na janela anônima (comprador de teste), inscreva-se com **outro e-mail seu**, ou o mesmo com
   `+teste`, por exemplo `seuemail+teste@gmail.com`.
2. Pague com o mesmo cartão, mas com o nome **`CONT`**.
3. ✅ A página mostra **"Seu pagamento está em análise"**.
4. Rode o comando da B4 com esse `payment_id`.
5. ✅ A planilha continua **`reservado`** e nenhum e-mail é enviado.

### B6. Teste 4: pagamento recusado
1. Repita com o nome **`OTHE`** no cartão.
2. ✅ O Mercado Pago recusa e oferece tentar de novo. Se voltar ao site, aparece
   **"O pagamento não foi concluído"**, com o botão **Tentar novamente**.
3. ✅ Nenhum e-mail é enviado.

### B7. Teste 5: limite de vagas (`VAGAS_TOTAL = 2`)
Você já tem 1 inscrição paga (B3).

1. Faça mais uma compra **aprovada** (`APRO`) com um terceiro e-mail, por exemplo `seuemail+dois@gmail.com`,
   e dispare o aviso (B4). ✅ A organizadora recebe "Nova inscrição (2/2)".
2. Tente se inscrever com um quarto e-mail.
3. ✅ A janela mostra **"As vagas se esgotaram"** e o checkout não abre.

**Teste do "reservado" (opcional):** coloque `VAGAS_TOTAL = 3`. Abra o checkout com um e-mail novo e
não pague (isso cria uma reserva). Tente com outro e-mail novo. ✅ Aparece a mensagem de que as
últimas vagas estão reservadas por quem está pagando.

### B8. Teste 6: celular e Instagram
1. Mande o link do site para você mesmo no Instagram (Direct) e abra **pelo app do Instagram**.
2. Abra a janela de inscrição e confira se os campos, o teclado e o botão funcionam.
3. Não é preciso pagar de novo. Basta chegar à tela do Mercado Pago.

### B9. Logs da Vercel
Vercel > projeto > **Logs** (últimos 30 minutos). ✅ Não deve haver linhas vermelhas com
`criar-checkout:` ou `webhook:`, exceto as que você provocou de propósito.

### ✅ A simulação passou se…
- [ ] B2: reserva aparece na planilha
- [ ] B3/B4: aprovado → e-mail da cliente, e-mail da organizadora e planilha "pago"
- [ ] B4: aviso repetido não duplica o e-mail
- [ ] B5: pendente não confirma
- [ ] B6: recusado não confirma
- [ ] B7: limite bloqueia a inscrição extra
- [ ] B8: funciona no Instagram

Se algo falhou, **não siga para a Parte C**. Mande o print do erro ou do log.

---

## Parte C — Limpeza (antes da produção)

1. **Planilha:** limpe **todas as linhas de teste**: clique no número da linha 2, segure **Shift**, clique no
   número da última linha com dados e aperte **Delete** (limpar conteúdo). **Não mexa na linha 1**, o cabeçalho.
2. **Apps Script > Propriedades do script:** `VAGAS_TOTAL` = **`30`**.
3. Confira uma última vez as propriedades: data, horário, `EVENTO_INICIO_ISO`, **endereço**,
   **link do grupo**, WhatsApp e política de cancelamento.
4. Rode **`configurarEvento`** de novo e confira o e-mail de exemplo, que é o que as inscritas vão receber.
5. Rode **`verResumo`**. ✅ Deve mostrar `Pagas: 0 | Reservas ativas: 0 | Vagas: 30`.
6. **No site** (`src/data/eventConfig.ts`), confira:
   - [ ] `whatsappNumber` com o **número real**, não o `5581900000000`
   - [ ] `organizerContact` com o e-mail certo
   - [ ] data `22/11/2026` e horário de início
   - [ ] "Como será o encontro" (`schedule`) com os momentos definitivos

   Se mudou algo: `git add . && git commit -m "Dados finais" && git push` e espere o deploy.

---

## Parte D — Produção (dinheiro real)

### D1. Ativar as credenciais de produção
1. Mercado Pago Developers > **Suas integrações** > sua aplicação > **Credenciais de produção**.
2. Se pedir, preencha os dados do negócio. Em **site**, informe o endereço do site e aceite os termos.
3. Copie o **Access Token de produção**. Ele começa com `APP_USR-` e é **diferente** do de teste.
4. Confira que você está na **conta real** que deve receber o dinheiro, com identidade verificada.

### D2. Trocar para o token oficial
Vercel > **Settings > Environment Variables** (Production):

| Nome | Novo valor |
|---|---|
| `MP_ACCESS_TOKEN` | **token de PRODUÇÃO** (D1) |
| `PRECO_REAIS` | **`1.00`** (só para o teste real a seguir) |

**Redeploy.**

### D3. Compra real de R$ 1
Agora o pagamento é **de verdade** e o aviso chega **sozinho**. **Não rode o comando da B4.**

1. Numa janela **normal**, sem a conta de teste, abra o site e inscreva-se com o seu e-mail.
2. Pague **R$ 1,00 com Pix** no app do seu banco.
3. Confira, em até 2 minutos e **sem fazer nada**:
   - [ ] voltou para `/obrigado`
   - [ ] chegou o **e-mail de confirmação**
   - [ ] a organizadora recebeu **"Nova inscrição (1/30)"**
   - [ ] a planilha está **`pago`**, com forma **"Pix"**
4. **Reembolse:** app ou site do Mercado Pago > **Atividade** > o pagamento de R$ 1 > **Devolver dinheiro**.
5. Se quiser, repita com **cartão real** (R$ 1) e reembolse também.

Se o e-mail **não** chegar em 5 minutos: Vercel > **Logs** > procure `webhook`. A tabela de
problemas está no final.

### D4. Voltar ao preço oficial
1. Vercel: `PRECO_REAIS` = **`59.00`** > **Redeploy**.
   **Não pule este passo.** Se pular, as vagas são vendidas a R$ 1.
2. Planilha: **apague a linha** da compra de R$ 1.
3. `verResumo` > ✅ `Pagas: 0`.
4. Abra o site, clique em **Garantir minha vaga**, preencha e vá até o Mercado Pago. ✅ O valor tem que
   ser **R$ 59,00**. Feche sem pagar e apague essa linha `reservado` da planilha, ou deixe expirar em
   30 minutos.

### D5. Lançar
- [ ] Divulgue o link
- [ ] Nas **primeiras vendas**, acompanhe a planilha e os e-mails da organizadora
- [ ] Compartilhe a planilha com as organizadoras (**Compartilhar**, como Leitor ou Editor)

### Se algo der errado depois do lançamento
1. **Fechar as vendas na hora:** Vercel > `VENDAS_ABERTAS` = `false` > **Redeploy**. A janela passa
   a responder "esgotado".
2. **Plano B manual:** pagamentos aprovados aparecem em **Mercado Pago > Atividade**. A organizadora
   pode confirmar pelo WhatsApp, e o e-mail pode ser reenviado depois pela função `reenviarEmail`.
3. Mande o print do log ou do erro.

---

## Problemas comuns na simulação e no lançamento

| Sintoma | Causa provável | Solução |
|---|---|---|
| Janela: "Não conseguimos abrir o pagamento" | Variável faltando, ou falta o Redeploy | Confira as 6 variáveis em **Production** e faça Redeploy. Veja **Logs** |
| Log: `variáveis de ambiente incompletas` | Variável vazia ou `SITE_URL` sem `https://` | Corrija e faça Redeploy |
| Log: `planilha recusou - nao_autorizado` | SEGREDO diferente entre a Vercel e o Apps Script | Copie de novo, sem espaços |
| Log: `resposta inesperada da planilha` | URL errada ou implantação sem "Qualquer pessoa" | Use a URL que termina em `/exec` e confira o acesso |
| Log: `Mercado Pago respondeu 401` | Token errado, incompleto ou expirado | Copie o token de novo (o de teste na simulação, o de produção depois) |
| Checkout: "Uma das partes é de teste" | Comprador real pagando a vendedor de teste, ou o contrário | Simulação: janela anônima logada como **comprador de teste**. Produção: token de produção e sem conta de teste |
| Checkout: "Você não pode pagar a si mesmo" | Logado como vendedor na hora de pagar | Janela anônima com o comprador de teste (simulação) ou outra conta (produção) |
| B4 responde `ok`, mas a planilha não muda | `payment_id` errado ou pagamento não aprovado | Confira o número na URL do `/obrigado`. Só `APRO` aprova |
| Produção: pagou e nada aconteceu | O aviso não chegou ou falhou | **Logs** > `webhook`. O Mercado Pago tenta de novo por vários dias. Para ver o motivo na hora, rode o comando da B4 com o `payment_id` real, que é seguro |
| E-mail não chega, mas a planilha diz "pago" | E-mail digitado errado, spam ou cota do Gmail | `verResumo` mostra a cota. Corrija o e-mail na planilha e use `reenviarEmail` |
| Mudei o Apps Script e nada mudou | A implantação ainda usa a versão antiga | Implantar > Gerenciar implantações > Editar > **Nova versão** |
