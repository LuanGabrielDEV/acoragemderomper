const whatsappNumber = '5581985526701';

// Resumo da política (a versão completa fica em /politica, arquivo src/data/politica.ts)
const cancelPolicy =
  'Você pode desistir em até 7 dias após a compra, com reembolso integral (direito de arrependimento, art. 49 do CDC). Depois desse prazo, os pedidos são analisados conforme a lei, sem multas automáticas. Se o evento for cancelado ou adiado, o reembolso é integral. Se não puder ir, a transferência do ingresso para outra pessoa é gratuita.';

const wa = (texto?: string) =>
  `https://wa.me/${whatsappNumber}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

export const eventConfig = {
  eventName: 'A Coragem para Romper e Recomeçar',
  tagline: 'Um encontro para decidir o próximo passo',
  subtitle:
    'Um encontro para mulheres que querem parar de adiar uma decisão e dar o primeiro passo, com acolhimento e companhia.',

  // Dados exibidos no site. A data, o horário e o endereço que vão no
  //    E-MAIL de confirmação ficam nas Propriedades do Apps Script.
  date: '22/11/2026',
  time: 'Início às 14h (horário de Brasília)',
  spots: '30 mulheres',
  price: 'R$ 59,00',
  // Cidade exibida na abertura e nos detalhes (ex.: 'Recife (PE)'). Vazio = mostra só
  // "Encontro presencial". O endereço completo continua indo só por e-mail.
  cidade: 'Paulista - PE',
  // Resumo da garantia, mostrado perto dos botões de inscrição.
  garantia: '7 dias para desistir com reembolso integral. Transferência da vaga gratuita.',
  recebedor: 'Luan Gabriel Dantas de Lima Cavalcanti',

  // Mude para false quando as vagas acabarem: os botões viram "lista de espera".
  // (O limite real de 30 é controlado pela planilha; isto só muda o visual.)
  vendasAbertas: true,

  // WhatsApp
  whatsappNumber,
  whatsappLink: wa('Olá! Tenho uma dúvida sobre o evento A Coragem para Romper e Recomeçar.'),
  // Monta um link do WhatsApp com qualquer mensagem (usado na página /obrigado)
  whatsappMensagem: (texto: string) => wa(texto),
  whatsappThankYou: wa(
    'Olá! Acabei de me inscrever no evento A Coragem para Romper e Recomeçar. Meu nome é ',
  ),

  organizerName: 'Organizadoras: Wirlla Dantas e Soraia Ferreira',
  organizerContact: 'acoragemderomper@gmail.com',
  cancelPolicy,
  politicaUrl: '/politica',

  location:
    'Salão de eventos. Para preservar a privacidade do grupo, o endereço completo vai só para quem se inscreveu: ele chega no seu e-mail logo após a confirmação do pagamento.',

  schedule: [
    { time: 'Abertura', title: 'Acolhida', desc: 'Chegada, silêncio e presença. Um espaço para deixar o mundo lá fora.' },
    { time: 'Momento 1', title: 'Reflexão Guiada', desc: 'Um convite a olhar para os ciclos que se repetem e nomear o que precisa ser rompido.' },
    { time: 'Momento 2', title: 'Escrita & Restauração', desc: 'Rituais de escrita terapêutica para reconectar-se à sua identidade mais verdadeira.' },
    { time: 'Encerramento', title: 'A Decisão', desc: 'Cada mulher define, com coragem, o seu próximo passo concreto. E segue.' },
  ],

  faqs: [
    {
      q: 'Como recebo o endereço completo?',
      a: 'Assim que o pagamento é aprovado, você recebe um e-mail com a confirmação da inscrição, o endereço completo, o seu código de inscrição e o link do grupo do evento no WhatsApp.',
    },
    {
      q: 'Posso pagar com Pix ou cartão?',
      a: 'Sim! O pagamento é feito no ambiente seguro do Mercado Pago, onde você escolhe entre Pix (aprovação na hora) ou cartão de crédito, à vista ou em até 5x. Depois de abrir o pagamento, você tem 30 minutos para concluí-lo. Se o cartão for recusado, use o Pix ou espere alguns minutos antes de tentar de novo: tentativas seguidas com os mesmos dados costumam ser bloqueadas pela segurança do Mercado Pago.',
    },
    {
      q: 'Por que o Pix aparece no nome de Luan Gabriel?',
      a: 'Luan Gabriel Dantas de Lima Cavalcanti é o desenvolvedor deste site e quem cuida dos pagamentos do evento A Coragem para Romper e Recomeçar. Por isso o nome dele aparece na confirmação do Pix ou do cartão.\n\nAntes de confirmar o Pix, confira os dados do recebedor. Em caso de dúvida, fale com a gente pelo WhatsApp oficial antes de pagar.',
      link: { href: wa('Olá! Quero confirmar os dados do pagamento do evento antes de pagar.'), texto: 'Falar no WhatsApp oficial' },
    },
    {
      q: 'Paguei, mas não recebi o e-mail. O que faço?',
      a: 'O e-mail costuma chegar em poucos minutos. Confira a caixa de spam e a aba Promoções. Se não encontrar, fale com a gente no WhatsApp e envie o comprovante: conferimos e reenviamos a confirmação.',
    },
    {
      q: 'Qual é a política de cancelamento e reembolso?',
      a: cancelPolicy,
      link: { href: '/politica', texto: 'Ler a política completa' },
    },
    {
      q: 'Preciso levar algo?',
      a: 'Apenas disposição para ser acolhida. Todo o material de escrita e os cuidados do encontro estão inclusos. Sinta-se livre para trazer sua caneta preferida, se quiser.',
    },
    {
      q: 'Posso levar uma amiga?',
      a: 'Com certeza! Cada vaga é individual, então sua amiga precisa garantir a própria inscrição, com o nome e o e-mail dela. Que maravilha presentear essa experiência para alguém.',
    },
  ],
};
