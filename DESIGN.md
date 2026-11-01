---
name: A Coragem para Romper e Recomeçar
description: Site de inscrição de um encontro presencial e íntimo para 30 mulheres.
colors:
  terracota: "#C87D55"
  terracota-dark: "#B06A48"
  olive: "#8A9A86"
  olive-dark: "#74857A"
  nude: "#E8D5C8"
  cream: "#FDFBF7"
  sand: "#F4EFEA"
  coffee: "#3D2C24"
  coffee-soft: "#5A4439"
  field-white: "#FFFFFF"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "4.5rem"
    fontWeight: 400
    lineHeight: 1.15
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.25
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  md: "0.75rem"
  lg: "1.25rem"
  xl: "1.75rem"
  full: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "32px"
  section-mobile: "80px"
  section-desktop: "128px"
components:
  button-primary:
    backgroundColor: "{colors.terracota}"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.terracota-dark}"
    textColor: "{colors.cream}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.coffee}"
    rounded: "{rounded.full}"
    padding: "16px 32px"
  button-secondary-hover:
    backgroundColor: "{colors.coffee}"
    textColor: "{colors.cream}"
  card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.coffee}"
    rounded: "{rounded.lg}"
    padding: "28px"
  card-on-cream:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.coffee}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.field-white}"
    textColor: "{colors.coffee}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  dialog:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.coffee}"
    rounded: "{rounded.xl}"
    padding: "36px 32px"
---

# Design System: A Coragem para Romper e Recomeçar

## Overview

**Creative North Star: "A Porta Entreaberta"**

O sistema nasce da logo do Romper: um R dentro de um círculo, com uma porta aberta e um ramo de folhas. Tudo deve parecer um limiar visto com calma. A luz quente atravessa a porta, o chão é de terra (terracota) e o lado de lá tem folhas (oliva). A página é um corredor tranquilo que leva até a porta, e a porta é a inscrição.

A atmosfera é de papel de carta e fim de tarde. Os fundos alternam entre creme (`cream`) e areia (`sand`), sem preto e sem branco puro nas superfícies. O texto é marrom-café, nunca cinza. A tipografia combina uma serifada de alto contraste (Playfair Display) nos títulos, que dá voz de convite, com uma sans geométrica e calorosa (Plus Jakarta Sans) para ler e agir. A densidade é baixa: seções altas, muito respiro e poucas coisas por tela.

Os componentes são táteis e calorosos. Têm cantos generosos, botões em pílula e microinterações suaves. A profundidade vem de tons, não de sombras: uma superfície se separa da outra pela troca creme/areia/nude. A sombra fica reservada ao que flutua de verdade (o diálogo de inscrição e o botão principal).

**Key Characteristics:**
- Fundo sempre quente (creme ou areia), texto sempre café.
- Terracota é a cor da ação e da ênfase; oliva é a cor do cuidado e do apoio.
- Títulos em serifada de peso normal (400), nunca em negrito.
- Cantos arredondados em toda parte; botões em pílula.
- Profundidade tonal; sombra só no que flutua.

## Colors

Uma paleta de terra e folha sobre papel quente, com um acento principal (terracota) e um secundário de apoio (oliva).

### Primary
- **Terracota de Barro** (`terracota`): cor da ação. Botão principal, ícones de informação do evento (data, hora, local), rótulos pequenos acima dos títulos e links de texto.
- **Barro Queimado** (`terracota-dark`): estado de hover e pressão do botão principal.

### Secondary
- **Folha de Oliveira** (`olive`): fundos de ícone em baixa opacidade (15%), ornamentos e a variante de botão oliva. Comunica cuidado e acolhimento.
- **Oliveira Funda** (`olive-dark`): ícones sobre fundo oliva claro e o subtítulo de cargo da palestrante.

### Neutral
- **Papel de Carta** (`cream`): superfície base do corpo, dos cards sobre areia e do diálogo de inscrição.
- **Areia Morna** (`sand`): superfície alternada das seções (Hero, Experiência, rodapé) e dos cards sobre creme.
- **Nude Rosado** (`nude`): avisos e mensagens de erro em baixa opacidade (50–60%) e fundo dos ícones das organizadoras.
- **Café Torrado** (`coffee`): todo título e texto principal. Em 60% de opacidade, é o fundo escurecido atrás do diálogo.
- **Café com Leite** (`coffee-soft`): texto de apoio, parágrafos secundários e metadados.
- **Branco de Campo** (`field-white`): exclusivo dos campos de formulário, para que o campo se destaque do diálogo creme.

### Named Rules
**The Warm Floor Rule.** Nenhuma superfície usa branco puro ou cinza neutro. O único branco é o interior dos campos de formulário.

**The Action Color Rule.** Terracota preenchida significa "ação". Fora do botão principal, terracota só aparece como texto pequeno, ícone ou contorno, nunca como bloco de cor de decoração.

**The Contrast Floor Rule.** Terracota sobre creme fica em torno de 3:1. Use-a só em texto grande (≥24px) ou em rótulos acompanhados de outro sinal. Parágrafos e links corridos usam café, ou terracota-dark com sublinhado.

## Typography

**Display Font:** Playfair Display (com Georgia, serif)
**Body Font:** Plus Jakarta Sans (com system-ui, sans-serif)

**Character:** A Playfair dá aos títulos o tom de um convite escrito à mão em papel bom. A Jakarta é clara, redonda e próxima, a voz de quem explica o que vai acontecer.

### Hierarchy
- **Display** (400, 1.875rem no celular até 4.5rem no desktop, 1.15): só o nome do evento no Hero.
- **Headline** (400, 1.5rem no celular até 3rem no desktop, 1.25): títulos de seção, com `text-wrap: balance`.
- **Title** (400, 1.125rem a 1.5rem, 1.2): títulos de card, nomes das organizadoras e perguntas do FAQ.
- **Body** (400, 16px no celular e 17px a partir de 640px, 1.65): parágrafos, com no máximo cerca de 65ch (`max-w-lg`/`max-w-2xl`).
- **Label** (600, 0.75rem no celular e 0.875rem a partir de 640px, 0.16–0.2em, MAIÚSCULAS): rótulos curtos acima dos títulos, em terracota.

### Named Rules
**The Quiet Serif Rule.** A Playfair nunca passa de peso 400 nos títulos. O itálico (400 ou 500) é reservado a frases de voz, como "Existe algo novo do outro lado."

**The 16px Field Rule.** Campos de formulário têm no mínimo 16px de texto no celular, para o iOS não dar zoom.

## Layout

Coluna única no celular e grade de duas colunas assimétricas no desktop (Hero `1.02fr / 0.98fr`, Organizadoras `0.92fr / 1.08fr`). O contêiner vai de `max-w-3xl` (FAQ, rodapé) a `max-w-7xl` (Hero), conforme a seção pede leitura ou composição. As margens laterais são de 20px no celular e 32px a partir de 640px.

O ritmo vertical é amplo: 80px entre seções no celular e 128px a partir de 640px. As seções alternam o fundo entre creme e areia para marcar a passagem sem linhas divisórias. No celular, a imagem vem antes do texto no Hero (`order-1`). O botão de WhatsApp flutuante exige 112px de respiro no fim do rodapé.

## Elevation & Depth

O sistema é **tonal por padrão**. Superfícies se separam pela troca de fundo: card creme sobre seção areia, card areia sobre seção creme, aviso nude sobre diálogo creme. A sombra é uma exceção reservada ao que realmente flutua sobre a página.

### Shadow Vocabulary
- **Brisa** (`box-shadow: 0 2px 20px -4px rgba(61, 44, 36, 0.08)`): selos pequenos que se sobrepõem a uma imagem, como a frase sobre a foto do Hero.
- **Flutuação** (`box-shadow: 0 8px 40px -8px rgba(61, 44, 36, 0.12)`): o diálogo de inscrição e o botão principal.

### Named Rules
**The Tonal Lift Rule.** Card não recebe sombra para se destacar; troca de tom. Sombra só aparece em quem flutua: o diálogo, o botão principal e selos sobre imagem.

## Shapes

As formas são arredondadas e acolhedoras, sem ângulo vivo. Os campos de formulário e avisos têm cantos de 0.75rem, os cards de 1.25rem, e o diálogo e os blocos de imagem de 1.75rem. Botões e controles circulares (fechar, ícone do FAQ, WhatsApp) são pílulas ou círculos completos. Fotos em destaque recebem uma moldura fina em terracota a 20% de opacidade, deslocada alguns pixels para fora da imagem, como um passe-partout.

## Components

### Buttons
Táteis e calorosos: pílula cheia, texto semibold, seta que avança no hover.
- **Shape:** pílula completa (9999px).
- **Primary:** fundo terracota com texto creme, 14–16px vertical e 24–32px horizontal, seta de 20px à direita. No celular ocupa toda a largura.
- **Hover / Focus:** o fundo escurece para terracota-dark e a seta anda 4px para a direita. O foco visível é um contorno de 2px em terracota com 2px de afastamento.
- **Secondary:** fundo transparente com borda café a 25%. No hover, inverte para fundo café e texto creme.
- **Olive:** mesma forma em oliva, para ações de apoio.

### Cards / Containers
- **Corner Style:** 1.25rem.
- **Background:** creme sobre seção areia, ou areia sobre seção creme (ver Elevation & Depth).
- **Shadow Strategy:** nenhuma em repouso (The Tonal Lift Rule).
- **Internal Padding:** 20px no celular e 24–28px a partir de 640px.
- **Ícone:** quadrado arredondado de 48–56px em oliva a 15% de opacidade, com traço de 1.5px.

### Inputs / Fields
- **Style:** fundo branco, borda café a 15%, cantos de 0.75rem e padding de 12px 16px. O rótulo fica acima, em semibold 14px café.
- **Focus:** a borda vira terracota e ganha um anel de 2px em terracota a 25%.
- **Error:** mensagem em bloco nude a 50%, com texto café e anúncio por `aria-live`.

### Dialog (Inscrição)
Diálogo nativo (`<dialog>`) centrado, com no máximo 32rem de largura, fundo creme e cantos de 1.75rem. O fundo atrás escurece com café a 60% e um desfoque leve. O botão de fechar é circular, de 44px, no canto. Dentro, o aviso do recebedor do Pix fica em bloco areia com borda terracota a 30%.

### FAQ (Acordeão)
Itens empilhados com cantos de 1.25rem e borda fina. A pergunta é em serifada e o ícone de abrir/fechar fica num círculo de 32px. A resposta abre por transição de altura (`grid-rows`).

## Do's and Don'ts

### Do:
- **Do** alternar creme e areia entre seções para marcar a passagem, sem linhas divisórias.
- **Do** manter os títulos em Playfair Display 400 e reservar o itálico a frases de voz.
- **Do** separar cards por tom (creme sobre areia, areia sobre creme), sem sombra.
- **Do** usar terracota preenchida só no botão de ação.
- **Do** manter alvos de toque de no mínimo 44px e campos com 16px de texto no celular.
- **Do** respeitar `prefers-reduced-motion`: tudo visível e parado.

### Don't:
- **Don't** usar branco puro, cinza neutro ou preto em superfícies e textos.
- **Don't** colocar sombra em card em repouso nem aumentar a sombra no hover de card.
- **Don't** usar terracota (#C87D55) como cor de parágrafo ou de link corrido sobre creme; o contraste fica em torno de 3:1.
- **Don't** colocar títulos em negrito.
