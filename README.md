# projeto-romper

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-tpcicvg4)

## Checkout e e-mails automáticos

O pagamento usa o Mercado Pago (funções em `api/`) e as inscrições ficam numa planilha Google
com Apps Script (`apps-script/Codigo.gs`), que também envia os e-mails de confirmação.
Passo a passo completo: [docs/CHECKOUT-E-EMAILS.md](docs/CHECKOUT-E-EMAILS.md).
Simulação e lançamento em produção: [docs/SIMULACAO-E-LANCAMENTO.md](docs/SIMULACAO-E-LANCAMENTO.md).

As funções de `api/` só rodam na Vercel. Na pré-visualização do Bolt o botão de pagamento mostra uma mensagem de indisponível.
