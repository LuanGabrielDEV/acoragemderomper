# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mulheres adultas (aprox. 25 a 55 anos) da região de Recife/PE que vivem uma fase de transição: relacionamento, carreira, luto, fé, ou uma decisão que vêm adiando. A maioria chega pelo Instagram e pelo WhatsApp das organizadoras e abre o site no celular. Ela vai ao site para entender o que é o encontro, sentir que é seguro e acolhedor, e garantir uma das 30 vagas pagando com Pix ou cartão.

Público secundário: a organização (Wirlla Dantas e Soraia Ferreira). Ela acompanha as inscrições numa planilha Google e não usa nenhuma tela do site para isso.

## Product Purpose

Site de inscrição do encontro presencial **A Coragem para Romper e Recomeçar**. São 30 vagas, em 22/11/2026, às 14h, por R$ 59,00. O site apresenta a proposta e leva a pessoa do primeiro clique até a vaga paga e confirmada, sem trabalho manual da organização: formulário, checkout Mercado Pago (Pix ou cartão em até 5x), página `/obrigado` conferida no servidor, e-mail de confirmação com endereço e grupo do WhatsApp.

Sucesso significa lotar as 30 vagas com pagamentos confirmados, sem erro de cobrança e sem participante sem resposta.

## Positioning

Não é palestra nem curso. É um encontro pequeno (30 mulheres), presencial e conduzido por duas mulheres, com reflexão guiada, escrita terapêutica e um momento final em que cada participante define um próximo passo concreto. A promessa é decidir, não só se inspirar.

## Operating Context

- A participante descobre o evento em redes sociais e no WhatsApp, abre o site no celular, se inscreve e paga no ambiente do Mercado Pago.
- Ela tira dúvidas pelo WhatsApp oficial ((81) 98552-6701) e pelo e-mail acoragemderomper@gmail.com.
- O endereço completo é revelado só no e-mail de confirmação, nunca no site.
- O recebedor do Pix aparece como Luan Gabriel Dantas de Lima Cavalcanti. O site avisa disso antes do pagamento para evitar desconfiança.
- O dia do encontro tem esta sequência: Acolhida, Reflexão Guiada, Escrita & Restauração e A Decisão.

## Capabilities and Constraints

- React 18 + TypeScript + Tailwind 3 + Vite, hospedado na Vercel com funções serverless em `api/`. A planilha e os e-mails rodam em Google Sheets + Apps Script.
- O conteúdo editável fica em `src/data/eventConfig.ts`, e a política de compra em `src/data/politica.ts` (texto da organização, com base no CDC).
- O limite real de vagas é controlado pela planilha. A vaga fica reservada por 30 minutos durante o pagamento. A flag `vendasAbertas` só muda o visual dos botões para "lista de espera".
- A página `/obrigado` nunca confia na URL. O status vem de `/api/status-inscricao`.
- Este é o site da **primeira edição de uma série**. A marca Romper vai continuar, e o site deve poder ser reaproveitado em próximas edições trocando data, preço, programação e pessoas.

## Brand Commitments

- Nome: **A Coragem para Romper e Recomeçar**, sempre com o artigo. A marca curta é "Romper", com logo em `public/images/logo-romper.png` e `.webp`.
- Idioma: português do Brasil. O tom é acolhedor, direto e feminino, trata a leitora por "você" e não promete milagres.
- A dimensão de fé está presente: Soraia Ferreira se apresenta como "Terapeuta Cristã do Emocional Feminino". O site não é exclusivo para cristãs.
- Organizadoras: Wirlla Dantas (Mentora de Recomeços e Desenvolvimento Pessoal) e Soraia Ferreira. Palestrante convidada: Lu Santos.

## Evidence on Hand

- Fotos: `public/images/01.jpeg`, `02.jpeg` (organizadoras), `03.jpg`, `lu-santos.jpg`, `lu-santos-2.jpg`, mais as imagens de compartilhamento `romper-compartilhar.jpg` e `romper-quadrada.jpg`.
- Bios e cargos das organizadoras e da palestrante, como aparecem em `src/sections/Organizers.tsx`.
- **Não existem** depoimentos, números de edições anteriores, contagem de participantes, logos de parceiros nem menções na imprensa. Não inventar nada disso. Prova social só entra quando a organização fornecer material real.

## Product Principles

1. **Confiança antes da conversão.** A pessoa paga a um recebedor pessoa física por um evento com endereço ainda oculto. Cada tela precisa reduzir a dúvida com transparência sobre pagamento, política, contato humano e o que acontece depois.
2. **O celular é o caminho principal.** O fluxo inteiro, da descoberta ao pagamento e à confirmação, tem de funcionar bem no celular, vindo de um link de WhatsApp ou Instagram.
3. **Íntimo, não massivo.** Trinta vagas e duas condutoras: a experiência comunica escuta e pequena escala, nunca evento de palco.
4. **Verdade sobre o estado.** Vagas, pagamento e status da inscrição só aparecem como confirmados quando o servidor confirmou.
5. **Feito para a próxima edição.** Conteúdo e estrutura ficam reaproveitáveis. Nada fica preso à data de 2026.

## Accessibility & Inclusion

Público amplo, de faixa etária variada, usando o celular, às vezes com conexão fraca. Texto legível, contraste adequado, alvos de toque confortáveis e um fluxo de pagamento que se explique sem exigir familiaridade técnica. Nenhum padrão formal (como WCAG AA) foi definido pela organização. WCAG 2.2 AA serve como piso de referência.
