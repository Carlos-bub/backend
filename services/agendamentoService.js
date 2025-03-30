const { PrismaClient } = require('@prisma/client');
const emailService = require('./emailService');
const prisma = new PrismaClient();

const criar = async (dados) => {
  const { nome, email, telefone, servico, data, hora } = dados;

  if (!nome || !email || !telefone || !servico || !data || !hora)
    throw new Error('Campos obrigatórios ausentes');

  // Ajusta o fuso horário para Brasília
  const fusoHorarioBrasil = 'America/Sao_Paulo';
  const dataHora = new Date(hora);
  const dataAgendamento = new Date(data + 'T00:00:00-03:00');

  // 🔒 Verificar conflito
  const conflito = await prisma.agendamento.findFirst({
    where: {
      hora: {
        equals: dataHora
      },
      status: {
        notIn: ['cancelado']
      }
    },
  });

  if (conflito) {
    throw new Error('Já existe um agendamento para este horário');
  }

  // Salva o agendamento com o horário correto
  return await prisma.agendamento.create({
    data: {
      nome,
      email,
      telefone,
      servico,
      data: dataAgendamento,
      hora: dataHora,
      status: 'pendente'
    },
  });
};


const listarTodos = async () => {
  return await prisma.agendamento.findMany({
    orderBy: { data: 'asc' },
  });
};

const atualizarStatus = async (id, status) => {
  const agendamento = await prisma.agendamento.update({
    where: { id },
    data: { status },
  });

  try {
    // Envia email baseado no novo status
    if (status === 'confirmado') {
      await emailService.enviarEmailConfirmacao(
        agendamento.email,
        agendamento.nome,
        agendamento.data,
        agendamento.hora
      );
    } else if (status === 'cancelado') {
      await emailService.enviarEmailCancelamento(
        agendamento.email,
        agendamento.nome,
        agendamento.data,
        agendamento.hora
      );
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    // Não lançamos o erro para não impedir a atualização do status
  }

  return agendamento;
};

const deletar = async (id) => {
  return await prisma.agendamento.delete({ where: { id } });
};

const gerarHorarios = (inicio, fim, intervaloMinutos) => {
  const horarios = [];
  let atual = new Date(inicio);

  while (atual < fim) {
    horarios.push(new Date(atual));
    atual.setMinutes(atual.getMinutes() + intervaloMinutos);
  }

  return horarios;
};

const verificarDisponibilidade = async (dataStr) => {
  if (!dataStr) throw new Error('Data não informada');

  // Cria a data com o timezone correto
  const data = new Date(dataStr);
  
  // Base de horários da barbearia - usando UTC
  const abertura = new Date(data);
  abertura.setUTCHours(11, 0, 0, 0); // 8h BRT = 11h UTC

  const fechamento = new Date(data);
  fechamento.setUTCHours(21, 0, 0, 0); // 18h BRT = 21h UTC

  // Horários de 60 em 60 minutos
  const todosHorarios = gerarHorarios(abertura, fechamento, 60);

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      data: {
        gte: abertura,
        lt: fechamento,
      },
      hora: {
        gte: abertura,
        lt: fechamento,
      },
      status: {
        notIn: ['cancelado']
      }
    },
  });

  const horariosOcupados = agendamentos.map((a) => a.hora.toISOString());

  const horariosDisponiveis = todosHorarios.filter(
    (h) => !horariosOcupados.includes(h.toISOString())
  );

  return horariosDisponiveis;
};

module.exports = {
  criar,
  listarTodos,
  atualizarStatus,
  deletar,
  verificarDisponibilidade,
};
