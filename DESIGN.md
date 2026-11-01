---
name: A Coragem para Romper e Recomeçar
description: Site de inscrição de um encontro presencial e íntimo para 30 mulheres, em forma de programa impresso.
colors:
  terracota: "#9C4A2C"
  terracota-dark: "#7E3A22"
  olive: "#5E6E52"
  olive-dark: "#46543D"
  cream: "#FBF8F3"
  sand: "#F5EAE0"
  nude: "#EBD8C9"
  linha: "#E3D6CA"
  dourado: "#8A5D27"
  coffee: "#2B211C"
  coffee-soft: "#54473F"
typography:
  display:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "clamp(2.3rem, 6vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.12
  caption:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.5
  small:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  field: "0.5rem"
  seal: "0.75rem"
  photo: "1.25rem"
  arch: "999px 999px 1.25rem 1.25rem"
  pill: "9999px"
spacing:
  gutter-mobile: "1.25rem"
  gutter: "2rem"
  section-mobile: "4rem"
  section: "6rem"
  container: "64rem"
components:
  button-primary:
    backgroundColor: "{colors.terracota}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.75rem"
    height: "3.5rem"
  button-primary-hover:
    backgroundColor: "{colors.terracota-dark}"
  button-papel:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.terracota-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.75rem"
    height: "3.5rem"
  button-papel-hover:
    backgroundColor: "{colors.sand}"
  button-secondary:
    textColor: "{colors.coffee}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.75rem"
    height: "3.5rem"
  button-secondary-hover:
    backgroundColor: "{colors.coffee}"
    textColor: "{colors.cream}"
  button-olive:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.cream}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.75rem"
    height: "3.5rem"
  button-olive-hover:
    backgroundColor: "{colors.olive-dark}"
  seal:
    backgroundColor: "{colors.terracota}"
    textColor: "{colors.cream}"
    rounded: "{rounded.seal}"
    padding: "0.5rem 1rem"
  included-box:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.coffee}"
    rounded: "{rounded.photo}"
    padding: "2rem"
  input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.coffee}"
    rounded: "{rounded.field}"
    padding: "0.75rem 1rem"
  footer:
    backgroundColor: "{colors.olive-dark}"
    textColor: "{colors.cream}"
---

# Design System: A Coragem para Romper e Recomeçar

## Overview

**Creative North Star: "O Programa Impresso do Encontro"**

O site se lê como o programa impresso de um encontro pequeno: papel marfim e pêssego que se alternam como folhas, títulos em Caslon de livro, a tarde contada em ordem e filetes finos no lugar de caixas. A paleta vem inteira da logo do Romper (marfim, pêssego, terracota e o verde do ramo), e a forma recorrente é a porta da logo, que vira o arco da abertura. O tom é sereno, editorial e acolhedor, com densidade baixa e muito ar entre os blocos.

Há um único momento escuro, "A Decisão", em café, com a logo clara a 6% ao fundo. Ele funciona como a página central do programa: a pergunta em Caslon claro e a linha "Meu próximo passo" que se escreve sozinha. O resto da página é claro, e o rodapé fecha no verde do ramo.

O sistema recusa o template de retiro gerado por IA (rótulos sobre títulos, grades de cards com ícone, manchas flutuantes, animação em tudo) e também a fantasia temática (letra de mão, fitas, texturas).

**Key Characteristics:**
- Fundos de seção alternando marfim e pêssego, com um único bloco em café e o rodapé em verde-oliva escuro.
- Caslon 400 para títulos e itálico para a voz íntima; Figtree para leitura e ação.
- Arco de porta e molduras finas deslocadas como assinatura de forma.
- Filetes finos organizam o conteúdo; quase nenhum card.
- Movimento discreto, com um só gesto autoral (a linha que se escreve).

## Colors

Uma paleta quente e terrosa tirada da logo: dois papéis claros, um barro para agir, um verde de ramo para fechar e um café para ler.

### Primary
- **Terracota de Barro** (#9C4A2C): a cor da ação. Botão principal, o "Romper" em itálico no título, os marcadores numerados da programação e a linha que se preenche, o selo da foto, as molduras finas (a 30-32% de opacidade), os títulos da lista "Para quem é", links e ícones da FAQ, foco e seleção de texto.
- **Terracota Queimada** (#7E3A22): hover do botão principal, texto do botão papel, a frase dentro do arco e mensagens de erro.

### Secondary
- **Verde do Ramo** (#5E6E52): os vistos da caixa "O que está incluso" e o botão de lista de espera quando as vagas esgotam.
- **Verde do Ramo Escuro** (#46543D): fundo do rodapé, da faixa de aviso de pagamento e do botão flutuante do WhatsApp; também a cor dos cargos das organizadoras e da palestrante.
- **Dourado da Porta** (#8A5D27): símbolos dos cards das organizadoras e da palestrante e o subtítulo "Palestrante convidada" em Caslon itálico. Pedido da organização: os subtítulos de destaque usam verde e dourado.

### Neutral
- **Marfim** (#FBF8F3): fundo principal e uma das duas folhas que alternam; texto sobre fundos escuros.
- **Pêssego Claro** (#F5EAE0): a outra folha (abertura, "Quem conduz", "Detalhes") e a caixa "O que está incluso".
- **Nude** (#EBD8C9): itálicos sobre fundo escuro (a frase da decisão, os títulos das colunas do rodapé) e o fundo dos avisos dentro do diálogo (a 60%).
- **Filete** (#E3D6CA): divisórias de um pixel entre itens de lista e fichas.
- **Café** (#2B211C): texto principal e o fundo de "A Decisão".
- **Café Suave** (#54473F): texto de apoio, subtítulos e legendas pequenas.

### Named Rules
**The Folhas Alternadas Rule.** As seções alternam pêssego e marfim, começando pela abertura em pêssego. O café aparece uma vez só ("A Decisão") e o verde escuro fecha a página. Não se inventa um terceiro papel claro.

**The Barro Só no Claro Rule.** Texto em terracota só sobre marfim, pêssego ou branco. Sobre café ou verde escuro ele não passa no contraste (cerca de 2,3:1 no café); ali o texto é marfim ou nude, e o botão vira a variante papel.

## Typography

**Display Font:** Libre Caslon Text (com Georgia, serif)
**Body Font:** Figtree (com system-ui, sans-serif)

**Character:** Uma serifada de livro, só no peso 400, faz a voz de convite; o itálico dela é a voz íntima, de legenda e de frase escrita à mão sem ser caligrafia. A Figtree, limpa e humana, carrega a leitura e os botões.

### Hierarchy
- **Display** (Caslon 400, 2.3rem no celular a 3.75rem, 1.05): só o título da abertura. "A Decisão" usa a mesma escala (2.25rem a 3.75rem, 1.08) em marfim.
- **Headline** (Caslon 400, 2rem a 3rem, 1.12, -0.01em): o título de cada seção, alinhado à esquerda, com balanceamento de linhas.
- **Title** (Caslon 400, 1.5rem a 1.875rem): etapas da programação, itens de "Para quem é", nomes das organizadoras, título da caixa de inclusos. Os valores dos fatos da abertura usam Caslon a 1.125-1.25rem.
- **Caption** (Caslon itálico 400, 1.125rem a 1.875rem, 1.375): o "Romper" do título, a frase "garantir minha vaga..." em "A Decisão", "Palestrante convidada", a frase do arco e os títulos das colunas do rodapé.
- **Body** (Figtree 400, 17px no celular e 18px a partir de 640px, 1.7): texto corrido, com medida de 60 a 65 caracteres.
- **Label** (Figtree 700, 1rem a 1.125rem): botões, rótulos de campo, links de ação e as perguntas da FAQ.
- **Small** (Figtree 400/500, 0.875rem): rótulos dos fatos ("Data", "Horário"), garantia, "Meu próximo passo".

### Named Rules
**The Caslon Sem Negrito Rule.** Títulos são sempre Caslon 400. A hierarquia vem do tamanho e do itálico, nunca de peso. O negrito é da Figtree.

**The Itálico É Voz Rule.** O itálico do Caslon marca a fala íntima (legendas, a frase da decisão, cabeçalhos do rodapé). Não vira ênfase genérica no meio do texto corrido.

## Layout

Coluna única editorial dentro de um contêiner de 64rem, com margens laterais de 1.25rem no celular e 2rem a partir de 640px. Cada seção tem respiro vertical de 4rem no celular e 6rem a partir de 640px; "A Decisão" vai a 7rem. Títulos e textos ficam alinhados à esquerda e limitados a 42-48rem de largura, mesmo quando o contêiner é maior.

A abertura cabe inteira na primeira tela do celular (390×844): arco da logo em cima, título, subtítulo, uma grade 2×2 de fatos entre filetes, botão de largura total e a garantia. Em telas de pouca altura (até 760px) o arco encolhe e a frase do arco some. A partir de 1024px a abertura vira duas colunas, texto à esquerda e arco à direita; "Quem conduz" e "Detalhes" também abrem em duas colunas (foto e texto). Botões ocupam a largura toda no celular e se ajustam ao conteúdo a partir de 640px.

## Elevation & Depth

O sistema é plano. A profundidade vem da alternância de papéis, das molduras finas deslocadas atrás das fotos e do arco, e do bloco escuro de "A Decisão". Sombra existe só no que flutua de verdade.

### Shadow Vocabulary
- **Diálogo** (`box-shadow: 0 18px 50px -12px rgba(43, 33, 28, 0.35)`): a janela de inscrição, sobre um véu café a 65%.
- **Flutuante** (`box-shadow: 0 8px 40px -8px rgba(43, 33, 28, 0.12)`): o botão redondo do WhatsApp.

### Named Rules
**The Só o Que Flutua Rule.** Sombra apenas em elementos fora do fluxo (diálogo, botão flutuante). Seções, fotos, caixas e botões no fluxo não têm sombra.

## Shapes

A forma-mãe é a porta da logo. Na abertura, a logo fica dentro de um arco de porta (topo totalmente arredondado, base com cantos de 1.25rem), preenchido por um degradê pêssego vertical, com um batente: um contorno terracota de 1px a 32% de opacidade, afastado 0.6rem (0.9rem a partir de 640px), que repete o arco.

Fotos têm cantos de 1.25rem e uma moldura fina terracota a 30%, deslocada 0.5rem (1rem a partir de 640px). A foto das organizadoras leva o selo terracota "Duas mulheres, uma travessia", com cantos de 0.75rem, apoiado sobre a borda inferior. Fotos ilustrativas recebem um leve tom de barro (sépia suave e uma camada terracota a 12% em multiply).

Botões são pílulas. Campos de formulário têm cantos de 0.5rem. Marcadores da programação são círculos terracota com o número em Caslon.

**The Filete Antes da Caixa Rule.** O conteúdo se separa por filetes de 1px (filete ou terracota a 20-25%), não por cards. A única caixa tingida é a de "O que está incluso", em pêssego com cantos de 1.25rem.

## Components

### Buttons
Pílulas confiantes e calmas, sempre com seta à direita que anda 4px no hover.
- **Shape:** pílula completa (9999px), altura mínima de 3.5rem.
- **Primary:** terracota com texto marfim, Figtree 700, padding de 0.875rem por 1.75rem (2rem a partir de 640px).
- **Hover / Focus:** o fundo escurece para terracota queimada em 200ms ease-out; foco com contorno terracota de 2px afastado 2px.
- **Papel:** marfim com texto terracota queimada, para fundos escuros ("A Decisão" e rodapé); hover em pêssego.
- **Secondary:** contorno café a 30%, transparente; no hover se enche de café com texto marfim. Usado em "Detalhes".
- **Olive:** verde do ramo com texto marfim; hover no verde escuro. Reservado para a lista de espera quando as vagas esgotam.

### Cards / Containers
- **Corner Style:** 1.25rem.
- **Background:** pêssego na caixa "O que está incluso"; marfim nos cards das organizadoras (sobre a seção pêssego).
- **Cards das organizadoras:** um por pessoa (Soraia primeiro, depois Wirlla), com um quadradinho nude a 70% (2.75rem, cantos 0.75rem) com o símbolo de brilho em dourado, o nome em Caslon e o cargo em Figtree 500 verde escuro. A palestrante convidada tem o nome primeiro e, logo abaixo, o quadradinho com um microfone ao lado do subtítulo dourado "Palestrante convidada".
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Internal Padding:** 1.5rem no celular, 2rem a partir de 640px.

### Inputs / Fields
- **Style:** fundo branco, contorno café a 25%, cantos de 0.5rem, padding de 0.75rem por 1rem, rótulo em Figtree 700 acima.
- **Focus:** contorno terracota com anel terracota de 2px a 25%.
- **Error:** contorno e anel terracota cheios, mensagem em terracota queimada 700 logo abaixo.

### Navigation
Não há menu no topo. A navegação fica no rodapé (coluna "Na página"), com links marfim sublinhados a 30% que se acendem no hover.

- **Faixa de contagem:** faixa terracota fina acima da abertura com a contagem regressiva ao vivo até o início do encontro (dias, horas e minutos; os segundos só em telas a partir de 640px, em algarismos tabulares) e "30 vagas". A linha quebra se faltar espaço. Some quando o encontro começa.
- **Barra de inscrição:** depois da abertura, uma barra marfim fixa com filete e sombra suave acompanha a rolagem: embaixo no celular ("Faltam N dias" na mesma conta da faixa de contagem, e "É amanhã" ou "É hoje" pelo calendário de Brasília; data e cidade; botão do WhatsApp e botão compacto "Garantir vaga") e em cima no desktop (nome do evento em Caslon, quanto falta, data, cidade e botão). Entra deslizando (300ms), some no rodapé e, escondida, não recebe foco nem projeta sombra.
- **WhatsApp flutuante:** só no desktop (no celular ele fica na barra), redondo, 3.5rem, verde escuro; aparece depois da abertura e some no rodapé.

### Faixa dos momentos
Logo abaixo da abertura, uma faixa terracota corre devagar (38s por volta, linear) com os momentos da tarde, a data, a cidade e "30 vagas" em Caslon itálico marfim, separados por pontos nude. Tem um botão redondo de pausar/continuar à direita (acessível por toque e teclado), pausa no hover e fora da tela e fica parada com prefers-reduced-motion.

### Programação
Uma linha vertical terracota a 20% liga círculos numerados; por cima, uma segunda linha terracota cheia se preenche de cima para baixo conforme a rolagem. O momento que está na metade da tela fica em destaque: círculo cheio, levemente maior, com um halo terracota a 14%, e título em terracota. Os momentos ainda não alcançados têm círculo marfim com contorno terracota.

### A Decisão
Fundo café, logo clara a 6% deslocada para a direita, pergunta em Caslon marfim, o rótulo "Meu próximo passo" em Figtree 500 marfim a 75% e, abaixo, a frase em Caslon itálico nude sobre um filete marfim a 30%, como uma linha preenchida. A frase se revela da esquerda para a direita (clip-path, 1.6s, cubic-bezier(0.16, 1, 0.3, 1)) quando o bloco entra na tela, e nunca some se já estiver visível.

### Movimento
**Abertura:** o arco se abre de baixo para cima como uma porta (clip-path, 1.1s), o batente aparece em seguida e a logo se assenta no lugar; ao lado, título, subtítulo, dados e botão já começam visíveis e só sobem 18px até o lugar, em sequência curta (0 a 0.18s). Nada da abertura começa invisível. **Fotos:** se revelam do centro para as bordas (clip-path com os cantos de 1.25rem, 1.2s) enquanto a imagem se assenta de 112% para 100%. Blocos sobem 18px e aparecem (0.8s, cubic-bezier(0.16, 1, 0.3, 1)) ao entrar na tela, com segurança de 1.5s para nada ficar escondido. Botões encolhem levemente ao toque (98%). Sob prefers-reduced-motion todo movimento para: a abertura e as fotos já aparecem prontas, a faixa fica parada, os blocos já aparecem, a linha da programação aparece cheia, a frase aparece inteira e a rolagem suave é desligada.

## Do's and Don'ts

### Do:
- **Do** alternar as seções entre marfim (#FBF8F3) e pêssego (#F5EAE0), reservando o café (#2B211C) para um único bloco de ápice.
- **Do** usar Caslon 400 para todo título e o itálico dele para legendas e frases íntimas.
- **Do** separar conteúdo com filetes de 1px antes de pensar numa caixa.
- **Do** dar a fotos cantos de 1.25rem e a moldura fina terracota deslocada.
- **Do** manter botões em pílula com altura mínima de 3.5rem e um só botão terracota por bloco.
- **Do** trocar para o botão papel e texto marfim ou nude sobre fundos escuros.
- **Do** garantir que todo movimento pare sob prefers-reduced-motion e que nenhum conteúdo dependa da animação para aparecer.

### Don't:
- **Don't** colocar rótulos, kickers ou eyebrows acima dos títulos.
- **Don't** montar grades de cards com ícone em quadradinho.
- **Don't** usar manchas flutuantes, granulado de pontos ou animação de título palavra por palavra.
- **Don't** pôr texto terracota sobre café ou verde escuro; terracota como texto só em fundos claros.
- **Don't** usar Caslon em negrito nem fontes de sistema para títulos.
- **Don't** dar sombra a seções, fotos, caixas ou botões no fluxo.
- **Don't** usar letra de mão, fitas ou texturas de papel para fazer o clima "artesanal".
