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

// Formatar data para o email
const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Formatar hora para o email
const formatarHora = (hora) => {
    return new Date(hora).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Enviar email de confirmação
const enviarEmailConfirmacao = async (email, nome, data, hora) => {
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
        await transporter.sendMail(mailOptions);
        console.log('Email de confirmação enviado para:', email);
    } catch (error) {
        console.error('Erro ao enviar email de confirmação:', error);
        throw error;
    }
};

// Enviar email de cancelamento
const enviarEmailCancelamento = async (email, nome, data, hora) => {
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
        await transporter.sendMail(mailOptions);
        console.log('Email de cancelamento enviado para:', email);
    } catch (error) {
        console.error('Erro ao enviar email de cancelamento:', error);
        throw error;
    }
};

module.exports = {
    enviarEmailConfirmacao,
    enviarEmailCancelamento
};
