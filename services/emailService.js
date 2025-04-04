const nodemailer = require('nodemailer');

// Configurar o transporter do nodemailer
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Log da configuração (sem senha)
console.log('Configuração de Email:', {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER
});

// Formatar hora para o email
const formatarHora = (hora) => {
    // Converte para o fuso horário local (Brasil)
    const dataHora = new Date(hora);
    const fusoHorarioBrasil = 'America/Sao_Paulo';
    
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: fusoHorarioBrasil
    }).format(dataHora);
};

// Formatar data para o email
const formatarData = (data) => {
    // Converte para o fuso horário local (Brasil)
    const dataObj = new Date(data);
    const fusoHorarioBrasil = 'America/Sao_Paulo';
    
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: fusoHorarioBrasil
    }).format(dataObj);
};

// Enviar email de confirmação
const enviarEmailConfirmacao = async (email, nome, data, hora) => {
    console.log('Tentando enviar email de confirmação para:', {
        para: email,
        nome: nome,
        data: formatarData(data),
        hora: formatarHora(hora)
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Agendamento Confirmado - Barbearia Dias',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; text-align: center;">Agendamento Confirmado!</h2>
                <p>Olá, ${nome}!</p>
                <p>Seu agendamento na Barbearia Dias foi confirmado com sucesso.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Data:</strong> ${formatarData(data)}</p>
                    <p style="margin: 5px 0;"><strong>Horário:</strong> ${formatarHora(hora)}</p>
                </div>
                <p>Agradecemos a preferência!</p>
                <p>Em caso de dúvidas, entre em contato conosco.</p>
                <div style="text-align: center; margin-top: 20px; color: #666;">
                    <p>Barbearia Dias</p>
                    <p>Telefone: (XX) XXXX-XXXX</p>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de confirmação enviado com sucesso:', {
            messageId: info.messageId,
            para: email,
            resposta: info.response
        });
    } catch (error) {
        console.error('Erro detalhado ao enviar email de confirmação:', {
            erro: error.message,
            codigo: error.code,
            comando: error.command,
            para: email
        });
        throw error;
    }
};

// Enviar email de cancelamento
const enviarEmailCancelamento = async (email, nome, data, hora) => {
    console.log('Tentando enviar email de cancelamento para:', {
        para: email,
        nome: nome,
        data: formatarData(data),
        hora: formatarHora(hora)
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Agendamento Cancelado - Barbearia Dias',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; text-align: center;">Agendamento Cancelado</h2>
                <p>Olá, ${nome}!</p>
                <p>Seu agendamento na Barbearia Dias foi cancelado.</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>Data:</strong> ${formatarData(data)}</p>
                    <p style="margin: 5px 0;"><strong>Horário:</strong> ${formatarHora(hora)}</p>
                </div>
                <p>Se desejar reagendar, por favor, acesse nosso site.</p>
                <p>Em caso de dúvidas, entre em contato conosco.</p>
                <div style="text-align: center; margin-top: 20px; color: #666;">
                    <p>Barbearia Dias</p>
                    <p>Telefone: (XX) XXXX-XXXX</p>
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de cancelamento enviado com sucesso:', {
            messageId: info.messageId,
            para: email,
            resposta: info.response
        });
    } catch (error) {
        console.error('Erro detalhado ao enviar email de cancelamento:', {
            erro: error.message,
            codigo: error.code,
            comando: error.command,
            para: email
        });
        throw error;
    }
};

module.exports = {
    enviarEmailConfirmacao,
    enviarEmailCancelamento
};
