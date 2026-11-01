---
target: src/pages/LandingPage.tsx
total_score: 25
max_score: 36
na_heuristics: 7
p0_count: 1
p1_count: 2
target_identity: "file:/home/user/acoragemderomper/src/pages/LandingPage.tsx"
target_fingerprint: "sha256:0f7091bb79fe093d0ec22d7dd7efb1dac60285fc4fba69e3f30cd67368295f6d"
target_path: /home/user/acoragemderomper/src/pages/LandingPage.tsx
timestamp: 2026-11-01T18-41-32Z
slug: src-pages-landingpage-tsx
---
Method: dual-agent (A: revisão de design · B: detector CLI + navegador)

## Nota de saúde do design
| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do status | 3 | Erros do formulário longe do campo |
| 2 | Linguagem do mundo real | 3 | FAQ "Pagamento seguro — ..." é título; "Momento 1/2" vazio |
| 3 | Controle e liberdade | 3 | Colar bloqueado em "Confirme o e-mail" (CheckoutDialog.tsx:183) |
| 4 | Consistência | 3 | Detalhes sem eyebrow |
| 5 | Prevenção de erros | 3 | ok |
| 6 | Reconhecer vs lembrar | 3 | Preço só no botão |
| 7 | Flexibilidade | n/a | página de conversão de caminho único |
| 8 | Estética e minimalismo | 2 | Manchas, pontilhado, marca d'água 2x, 3 selos flutuantes, parallax, ping, ~15 cards iguais |
| 9 | Recuperação de erros | 2 | Caixa única de erro, sem aria-invalid, sem foco |
| 10 | Ajuda | 3 | Recebedor do Pix escondido no FAQ |
| Total | | 25/36 | Aceitável (69%) |

## Veredito de especificidade
Modelo do segmento (retiro feminino 2024–26). Específico: logo da porta, foto real das anfitriãs, arco Acolhida→Decisão, transparência do Pix, frase final. Detector: CLI 0; navegador 37 (390) / 36 (1440): low-contrast 26, kicker-above-heading 5, bounce-easing 4 (index.css:129), icon-tile-stack 2, buried-raster 1 (FinalCTA.tsx:16), straggler 8; cream-palette e overused-font = falsos positivos (identidade).

## Problemas prioritários
- [P0] Contraste: creme/terracota 3,1:1 no CTA; terracota/areia 2,8:1 nos rótulos; coffee-soft/60 2,97:1 no rodapé. Fix: CTA ~#A35C3B, token terracota-texto ~#9A5434, sem opacidade no marrom. /impeccable colorize → audit
- [P1] Hero mobile esconde a oferta: logo ocupa a 1ª tela, CTA em ~915px (dobra 844). Fix: título+data/Recife/preço+CTA primeiro, logo pequena, foto 02.jpeg. /impeccable layout
- [P1] Sistema visual de template (lista de manias abaixo). Fix: motivo da porta, títulos à esquerda, ritmo variado, um momento forte em "A Decisão". /impeccable distill → bolder
- [P2] Confiança no Pix não humanizada; cidade ausente; reembolso escondido; motivo do endereço oculto não explicado. /impeccable clarify (relação de Luan com a organização: perguntar ao cliente)
- [P2] Recuperação de erros no formulário: erro por campo, aria-invalid, foco, liberar colar. /impeccable harden

## Manias de IA
Eyebrows (SectionHeading.tsx:18 + Hero.tsx:20, FinalCTA.tsx:23...); Sparkles (Identification.tsx:8, Organizers.tsx:40,47); grades de cards com ícone (Identificação, Experiência, Organizadoras, Detalhes); manchas flutuantes (Ornamentos.tsx, index.css:91-116); .bg-grain; PalavrasAnimadas no Hero; pop/overshoot (index.css:62,129), scale no hover (cta.ts, WhatsAppFloat.tsx); ~25 Reveal + parallax + zoom + ping; selos flutuantes sobre fotos; moldura deslocada (Hero.tsx:71, Organizers.tsx:13); tudo centralizado; logo d'água 2x (Experience.tsx:12, FinalCTA.tsx:16); "Descobrir" (Hero.tsx:91); copy genérica; foto de banco 03.jpg (Details.tsx:32).

## Personas
Jordan: sem cidade, sem horário de término, dia contado 3x. Riley: sem foco no erro, colar bloqueado, botões oliva 2,9:1 com vendas fechadas. Casey: CTA abaixo da dobra, FAB com ping na zona do polegar, 12 pesos de fonte, logo 213 KB eager, "Pagar" exige rolar. Recifense 45 anos: sem cidade, Luan sem contexto, reembolso escondido, sem @ das organizadoras, foto de banco.

## Observações menores
Bio da Lu Santos ~110 palavras fora do tom; meta do Hero quebra mal no desktop; data/hora 3x; duration-400 inexistente; animate-ping fora do reduced-motion; imagens 3–5x maiores no mobile.

## Perguntas
1. Onde a página rompe? 2. E se a página fosse a tarde em ordem com o CTA em "A Decisão"? 3. Uma carta assinada pelas anfitriãs geraria mais confiança?
