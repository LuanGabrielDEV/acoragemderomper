---
version: 1
slug: "src-pages-landingpage-tsx"
primary_target: "src/pages/LandingPage.tsx"
related_targets: ["src/sections","src/components"]
---

# Surface brief: landing page (src/pages/LandingPage.tsx)

Mode: Persuade. Visitor: mulher de 25–55 da região de Recife, vinda de um link de Instagram/WhatsApp, no celular, desconfiada de pagar por Pix a uma pessoa física. Ação: entender o encontro, confiar e garantir uma das 30 vagas (R$ 59).

Proof on hand: fotos reais das anfitriãs (02.jpeg) e da Lu Santos; 03.jpg só como imagem ilustrativa rotulada; logo Romper. Nada de depoimentos ou números.

Decisões confirmadas: direção inicial "caderno de escrita" foi construída e REJEITADA pela usuária ("menos elegante e muito estilizado; pode não agradar as organizadoras"); pedido: meio-termo elegante. O meio-termo editorial puro também foi rejeitado ("extremamente simples, tirou o diferencial da primeira versão"); decisão final da usuária: "meio a meio" — voltam da versão original a logo grande na abertura, fotos com moldura e selo, e movimento suave (revelar ao rolar, linha da programação, seção final escura com logo ao fundo); ficam a organização nova, as correções e as fontes novas. Trocar Playfair/Jakarta; Pix explicado (Luan = desenvolvedor do site e responsável pelos pagamentos); motivo do endereço = privacidade do grupo; bio da Lu = 1º parágrafo + "Ler mais"; 03.jpg com tratamento quente e corte fechado.

Open: cidade a mostrar (a organização disse "outra cidade da região" sem nomear) — campo `cidade` vazio em eventConfig até confirmar.

## Direction contract

THESIS: Um convite editorial e sereno, como um programa impresso de um encontro íntimo: a oferta inteira na abertura, a tarde contada em ordem e o ponto alto em "A Decisão". Recusa tanto o template de retiro gerado por IA (rótulos sobre títulos, cards com ícone, manchas, animações em tudo) quanto a fantasia temática (letra de mão, fita, texturas).

OWN-WORLD: Paleta da logo: marfim (#FBF8F3) e pêssego claro (#F5EAE0) alternando por seção, terracota (#9C4A2C) para ação, verde do ramo em detalhes, seção "A Decisão" em café escuro (#2B211C) com a logo clara a 6% ao fundo. Títulos em Libre Caslon Text 400 (itálico para legendas e a frase da decisão), texto em Figtree. Logo em quadro pêssego com moldura fina deslocada e selo flutuante; fotos com cantos de 1.25rem, moldura deslocada e selo terracota; filetes finos; botões em pílula.

STORY: Ela lê na abertura o que é, quando, onde, quanto e clica; desce por: para quem é, quem conduz, a tarde em ordem, "A Decisão" (pergunta em terracota, a frase "garantir minha vaga e estar lá no dia 22/11." que se revela, o botão, a garantia e a explicação do Pix); depois detalhes, dúvidas e rodapé.

FIRST VIEWPORT: Celular 390×844 sobre pêssego: quadro da logo (16:9) com moldura e o selo "Existe algo novo do outro lado.", título em Caslon (~37px), subtítulo, grade 2×2 de fatos entre filetes, botão terracota de largura total e a garantia, tudo acima da dobra. Desktop: texto à esquerda, quadro quadrado da logo à direita.

FORM: Identidade original refinada + organização editorial nova ("meio a meio", escolha da usuária após rejeitar o caderno e o editorial puro). seed:e64220a38897d249
Motion: blocos sobem suavemente ao entrar na tela (0.8s, ease-out, com segurança de 1.5s), a linha da programação se preenche com a rolagem, o selo do topo flutua 6px. Signature interaction: em "A Decisão", a frase em Caslon itálico se revela da esquerda para a direita (clip-path, 1.6s, ease-out) quando o bloco entra na tela; único movimento autoral da página.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
