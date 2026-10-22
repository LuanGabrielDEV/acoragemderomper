const whatsappNumber = '5581985526701';

const cancelPolicy =
  'Reembolso de 50% até 48h antes do evento. Após esse prazo, não há reembolso, mas a vaga pode ser transferida para outra pessoa.';

const wa = (texto?: string) =>
  `https://wa.me/${whatsappNumber}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

export const eventConfig = {
  eventName: 'Coragem para Romper e Recomeçar',
  tagline: 'Uma experiência de despertar e decisão',
  subtitle:
    'Uma experiência exclusiva para mulheres que decidiram não deixar o medo escolher o próximo capítulo.',

  // ⬇️ Dados exibidos no site. A data, o horário e o endereço que vão no
  //    E-MAIL de confirmação ficam nas Propriedades do Apps Script.
  date: '22/11/2026',
  time: 'Início às 14h (horário de Brasília)',
  spots: '30 mulheres',
  price: 'R$ 59,00',

  // Mude para false quando as vagas acabarem: os botões viram "lista de espera".
  // (O limite real de 30 é controlado pela planilha; isto só muda o visual.)
  vendasAbertas: true,

  // WhatsApp
  whatsappNumber,
  whatsappLink: wa('Olá! Tenho uma dúvida sobre o evento Coragem para Romper e Recomeçar.'),
  // Monta um link do WhatsApp com qualquer mensagem (usado na página /obrigado)
  whatsappMensagem: (texto: string) => wa(texto),
  whatsappThankYou: wa(
    'Olá! Acabei de me inscrever no evento Coragem para Romper e Recomeçar. Meu nome é ',
  ),

  organizerName: 'Organizadoras: Wirlla Dantas e Soraia Ferreira',
  organizerContact: 'acoreagemderomper@gmail.com',
  cancelPolicy,

  location:
    'Salão de eventos — o endereço completo chega no seu e-mail logo após a confirmação do pagamento',

  schedule: [
    { time: 'Abertura', title: 'Acolhida', desc: 'Chegada, silêncio e presença. Um espaço para deixar o mundo lá fora.' },
    { time: 'Momento 1', title: 'Reflexão Guiada', desc: 'Um convite a olhar para os ciclos que se repetem e nomear o que precisa ser rompido.' },
    { time: 'Momento 2', title: 'Escrita & Restauração', desc: 'Rituais de escrita terapêutica para reconectar-se à sua identidade mais verdadeira.' },
    { time: 'Momento 3', title: 'Mesa Posta', desc: 'Um tempo de cuidado e presença ao redor da mesa — chá, palavras e acolhimento.' },
    { time: 'Encerramento', title: 'A Decisão', desc: 'Cada mulher define, com coragem, o seu próximo passo concreto. E segue.' },
  ],

  experiences: [
    {
      icon: 'Sparkles',
      title: 'Reflexão Profunda',
      desc: 'Um espaço seguro para olhar para dentro, sem julgamentos, com escuta atenta e presença.',
    },
    {
      icon: 'PenLine',
      title: 'Escrita que Liberta',
      desc: 'Rituais de escrita terapêutica que ajudam a nomear sentimentos e reescrever narrativas.',
    },
    {
      icon: 'UtensilsCrossed',
      title: 'Mesa Posta',
      desc: 'O cuidado de uma mesa preparada com intenção — onde cada detalhe diz "você é bem-vinda".',
    },
    {
      icon: 'HeartHandshake',
      title: 'Conexão entre Mulheres',
      desc: 'O encontro real, presencial, com histórias que se reconhecem e se fortalecem umas nas outras.',
    },
    {
      icon: 'Flower2',
      title: 'Momento Relaxante',
      desc: 'Uma experiência única para você desacelerar e se reencontrar consigo.',
    },
  ],

  faqs: [
    {
      q: 'Como recebo o endereço completo?',
      a: 'Assim que o pagamento é aprovado, você recebe um e-mail com a confirmação da inscrição, o endereço completo, o seu código de inscrição e o link do grupo do evento no WhatsApp.',
    },
    {
      q: 'Posso pagar com Pix ou cartão?',
      a: 'Sim! O pagamento é feito no ambiente seguro do Mercado Pago, onde você escolhe entre Pix (aprovação na hora) ou cartão. Depois de abrir o pagamento, você tem 30 minutos para concluí-lo.',
    },
    {
      q: 'Paguei, mas não recebi o e-mail. O que faço?',
      a: 'O e-mail costuma chegar em poucos minutos. Confira a caixa de spam e a aba Promoções. Se não encontrar, fale com a gente no WhatsApp e envie o comprovante: conferimos e reenviamos a confirmação.',
    },
    {
      q: 'Qual é a política de cancelamento?',
      a: cancelPolicy,
    },
    {
      q: 'Preciso levar algo?',
      a: 'Apenas disposição para ser acolhida. Todo o material de escrita e os cuidados da mesa estão inclusos. Sinta-se livre para trazer sua caneta preferida, se quiser.',
    },
    {
      q: 'Posso levar uma amiga?',
      a: 'Com certeza! Cada vaga é individual, então sua amiga precisa garantir a própria inscrição, com o nome e o e-mail dela. Que maravilha presentear essa experiência para alguém.',
    },
  ],
};
