const nodemailer = require("nodemailer");

const CONFIG_EMAIL_PRODUCTION = {
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  secure: true,
};

class Email {
  async criaConfigEmail() {
    console.log(process.env.NODE_ENV === "production");
    if (process.env.NODE_ENV === "production") {
      return CONFIG_EMAIL_PRODUCTION;
    }

    const contaTeste = await nodemailer.createTestAccount();
    return {
      host: "smtp.ethereal.email",
      auth: contaTeste,
    };
  }

  async enviaEmail() {
    const conta = await this.criaConfigEmail();
    const transportador = await nodemailer.createTransport(conta);

    const info = await transportador.sendMail(this);

    console.log("info", info);

    if (process.env.NODE_ENV !== "production") {
      console.log("URL", nodemailer.getTestMessageUrl(info));
    }
  }
}

class EmailVerificacao extends Email {
  constructor(usuario, endereco) {
    super();
    this.from = '"Blog do Código <noreply@blogdocodigo.com.br>"';
    this.to = usuario.email;
    this.subject = "Blog do Código | Verificação de e-mail";
    this.text = `Olá! Verifique o seu e-mail aqui: ${endereco}`;
    this.html = `<h1>Olá!</h1> <p>Verifique o seu e-mail aqui> <a href="${endereco}">${endereco}</a></p>`;
  }
}

module.exports = { EmailVerificacao };
