<img><img width="500" height="500" alt="01" src="https://github.com/user-attachments/assets/64259065-2533-49ae-8674-a8b5701ee573" />
# A Coragem para Romper e Recomeçar · site de inscrições

Site oficial do encontro presencial **A Coragem para Romper e Recomeçar**, uma experiência para 30 mulheres em 22/11/2026, às 14h.

O site não é só uma página de divulgação. É um **sistema de inscrição completo e automático**. A pessoa se inscreve, paga com Pix ou cartão, recebe a confirmação por e-mail e entra no grupo do WhatsApp. A organização acompanha tudo numa planilha Google, sem precisar fazer nada à mão.

🔗 **Site no ar:** https://acoragempararomper.vercel.app

---

## O que o sistema faz

**Para quem se inscreve**
- Apresenta o evento: proposta, programação, experiências, organizadoras, perguntas frequentes e política de compra.
- Abre uma janela de inscrição com nome, e-mail (digitado duas vezes) e WhatsApp.
- Leva ao pagamento seguro do **Mercado Pago (Checkout Pro)**. O pagamento pode ser feito com Pix ou com cartão de crédito em até 5x.
- Depois do pagamento, mostra a página `/obrigado`. O texto muda conforme o resultado: concluído, em análise ou não concluído.
- Envia um **e-mail de confirmação** com o código de inscrição, o endereço completo, o link do grupo do WhatsApp e um botão para adicionar à agenda.

**Para a organização**
- Toda inscrição vira uma linha na **planilha Google**: nome, e-mail, WhatsApp, status, código, ID do pagamento e data do e-mail.
- Um **controle de vagas** impede vender mais de 30. A vaga fica reservada por 30 minutos enquanto a pessoa paga e, se o pagamento não acontecer, é liberada.
- A organizadora recebe um **aviso por e-mail** a cada inscrição paga e um alerta se algo der errado. Um exemplo é um e-mail inválido.
- No editor do Apps Script há ferramentas para ver o resumo das vagas, reenviar um e-mail e enviar os e-mails pendentes.

**Segurança**
- A página `/obrigado` **não confia no que vem na URL**, porque qualquer pessoa pode abri-la. Ela pergunta ao servidor (`/api/status-inscricao`), que só responde "pago" depois que o webhook consultou o pagamento direto na API do Mercado Pago. Enquanto isso ela confere sozinha a cada poucos segundos, então vale para Pix, cartão e pagamento em análise. A resposta não traz nenhum dado pessoal.
- O webhook é **idempotente**: um aviso repetido não gera e-mail duplicado. Se falhar, ele responde com erro para o Mercado Pago tentar de novo.
- Token do Mercado Pago, segredo da planilha e preço ficam em **variáveis de ambiente** da Vercel, nunca no código.
- Toda chamada à planilha exige uma chave secreta (`SEGREDO`).

---

## Como funciona (fluxo de uma inscrição)

```
Navegador (React)          Vercel (/api)                Mercado Pago         Google (Apps Script)
─────────────────          ─────────────                ────────────         ────────────────────
1. Formulário  ──────────► 2. criar-checkout ──────────────────────────────► 3. reservar (30 min)
                              │
                              └──────────────────────► 4. cria a cobrança
   ◄──────────────── link do checkout ◄───────────────────┘
5. Paga com Pix/cartão ──────────────────────────────► pagamento
   │                                                        │ aviso (webhook)
   └─► /obrigado          6. webhook-mercadopago ◄──────────┘
                             confere o pagamento na API ──► 7. confirmar
                                                              marca "pago" + envia e-mails
```

---

## Tecnologias

| Camada | Ferramenta | Onde está |
|---|---|---|
| Interface | React 18 + TypeScript | `src/` |
| Estilo | Tailwind CSS 3 | `tailwind.config.js`, classes nos componentes |
| Build e servidor local | Vite | `vite.config.ts` |
| Hospedagem e funções do servidor | Vercel (serverless functions) | `api/`, `vercel.json` |
| Pagamento | Mercado Pago Checkout Pro + webhook | `api/criar-checkout.js`, `api/webhook-mercadopago.js` |
| Banco de dados e e-mails | Google Sheets + Apps Script (MailApp) | `apps-script/Codigo.gs` |
| Ícones | lucide-react | componentes em `src/` |

---

## Estrutura de pastas

```
api/
  criar-checkout.js        valida os dados, reserva a vaga e cria o pagamento
  webhook-mercadopago.js   recebe o aviso do Mercado Pago e confirma a inscrição
apps-script/
  Codigo.gs                código da planilha: vagas, status, e-mails, ferramentas
src/
  data/eventConfig.ts      ⭐ textos, data, preço, programação e FAQ (edite aqui)
  data/politica.ts         política de compra, cancelamento e reembolso
  sections/                cada parte da página (Hero, Programação, FAQ, Rodapé...)
  components/              botões, janela de inscrição, WhatsApp flutuante
  pages/                   página inicial, /obrigado e /politica
  lib/                     chamada ao checkout, contexto e utilidades
public/images/             fotos do evento e logo do rodapé
tests/simulacao.mjs        simulação completa do fluxo de pagamento
docs/                      guias passo a passo (configuração e lançamento)
```

A maior parte do conteúdo do site sai de **`src/data/eventConfig.ts`**. Para mudar um texto, a programação ou uma pergunta do FAQ, basta editar esse arquivo.

---

## Rodando no seu computador

Requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev              # abre o site em http://localhost:5173
npm run build            # gera a versão de produção em dist/
npm run typecheck        # confere os tipos do TypeScript
npm run lint             # confere o estilo do código
npm run test:simulacao   # simula o fluxo de pagamento (28 cenários)
```

As funções da pasta `api/` só rodam na Vercel. Localmente o site abre normalmente, mas o botão de pagamento mostra a mensagem de indisponível. Para testar o fluxo de pagamento sem a Vercel, use `npm run test:simulacao`.

---

## Configuração

**Variáveis de ambiente na Vercel** (Settings → Environment Variables, depois faça um Redeploy):

| Variável | Para que serve |
|---|---|
| `MP_ACCESS_TOKEN` | token do Mercado Pago (de teste ou de produção) |
| `SITE_URL` | endereço público do site, com `https://` |
| `PLANILHA_URL` | URL `/exec` da implantação do Apps Script |
| `PLANILHA_SEGREDO` | mesma chave da propriedade `SEGREDO` da planilha |
| `PRECO_REAIS` | valor da inscrição, por exemplo `59.00` |
| `VENDAS_ABERTAS` | `false` para pausar as vendas |

**Propriedades do Apps Script** (Configurações do projeto → Propriedades do script): `SEGREDO`, `VAGAS_TOTAL`, `ORGANIZADORA_EMAIL`, os dados do evento que vão no e-mail (`EVENTO_*`), `LINK_GRUPO_WHATSAPP`, `WHATSAPP_CONTATO`, `NOME_REMETENTE` e `POLITICA_CANCELAMENTO`.

> Nunca coloque tokens ou o `SEGREDO` no código nem no GitHub.

---

## Contato

- E-mail do evento: acoragemderomper@gmail.com
- WhatsApp: (81) 98552-6701

Desenvolvido por **[Luan Gabriel](https://portfolio-lg-sooty.vercel.app/)**.
