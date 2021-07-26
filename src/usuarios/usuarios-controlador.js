const Usuario = require("./usuarios-modelo");
const { InvalidArgumentError, InternalServerError } = require("../erros");
const tokenObject = require("./token");
const { EmailVerificacao } = require("./email");

function geraEndereco(token) {
  return `${process.env.BASE_URL}/usuario/verifica_email/${token}`;
}
module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha, cargo } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        senha,
        emailVerificado: true,
        cargo,
      });

      const createdUsuario = await usuario.adiciona();
      const token = await tokenObject.verificaEmail.cria(createdUsuario.id);

      const endereco = geraEndereco(token);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);
      emailVerificacao.enviaEmail().catch((error) => console.log(error));

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  login: async (req, res) => {
    const accessToken = await tokenObject.access.cria(req.user.id);
    const refreshToken = await tokenObject.refresh.cria(req.user.id);
    res.set({ Authorization: accessToken });
    res.json({ accessToken, refreshToken });
  },

  logout: async (req, res) => {
    try {
      const { token } = req;
      tokenObject.access.invalida(token);
      return res.status(204).send();
    } catch (error) {
      console.log("ERROR", error);
      return res.status(500).json({ message: error });
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  },
  // teste
  verifica_email: async (req, res) => {
    try {
      const { user } = req;
      const usuario = user;
      await usuario.verificaEmail(user);
      res.status(200).json({ message: "Verificado com sucesso!" });
    } catch (erro) {
      console.log(erro);
      res.status(500).json({ erro: erro });
    }
  },
};
