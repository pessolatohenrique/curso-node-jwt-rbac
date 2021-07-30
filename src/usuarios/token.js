const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment");
const allowListRefreshToken = require("../../redis/allowlist-refresh-token");
const blocklistAccessToken = require("../../redis/manipula-blocklist");
const forgotListPassword = require("../../redis/forgot-password-token");
const { InvalidArgumentError } = require("../erros");

function criaToken(id, [timeQtd, timeUnit]) {
  const payload = { id };

  return jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: timeQtd + timeUnit,
  });
}

async function criaTokenOpaco(id, [timeQtd, timeUnit], allowList) {
  const tokenOpaco = crypto.randomBytes(24).toString("hex");
  const dataExpiracao = moment().add(timeQtd, timeUnit).unix();
  await allowList.adiciona(tokenOpaco, id, dataExpiracao);
  return tokenOpaco;
}

async function verificaTokenBlocklist(token, list) {
  if (!list) {
    return;
  }
  const contemToken = await list.contemToken(token);

  if (contemToken) {
    throw new jwt.JsonWebTokenError("Token expirado por logout");
  }
}

async function verificaTokenOpaco(refreshToken, list) {
  if (!refreshToken) {
    throw new InvalidArgumentError("O Refresh Token não foi enviado");
  }

  const id = await list.buscaValor(refreshToken);
  if (!id) {
    throw new InvalidArgumentError("O Refresh Token não foi encontrado");
  }
  return id;
}

function invalidaTokenOpaco(refreshToken, lista) {
  return lista.deleta(refreshToken);
}

module.exports = {
  access: {
    expiracao: [15, "d"],
    blocklist: blocklistAccessToken,
    cria(id) {
      return criaToken(id, this.expiracao);
    },
    async verifica(token) {
      await verificaTokenBlocklist(token, this.blocklist);
      const payload = jwt.verify(token, process.env.JWT_KEY);
      return payload.id;
    },
    invalida(token) {
      return this.blocklist.adiciona(token);
    },
  },
  refresh: {
    lista: allowListRefreshToken,
    expiracao: [5, "d"],
    async cria(id) {
      const refreshToken = await criaTokenOpaco(id, this.expiracao, this.lista);
      return refreshToken;
    },
    async verifica(token) {
      const refreshToken = await verificaTokenOpaco(token, this.lista);
      return refreshToken;
    },
    async invalida(token) {
      return invalidaTokenOpaco(token, this.lista);
    },
  },
  verificaEmail: {
    expiracao: [1, "h"],
    async cria(id) {
      return criaToken(id, this.expiracao);
    },
    async verifica(token) {
      await verificaTokenBlocklist(token, this.blocklist);
      const payload = jwt.verify(token, process.env.JWT_KEY);
      return payload.id;
    },
  },
  esqueciSenha: {
    lista: forgotListPassword,
    expiracao: [1, "h"],
    async cria(id) {
      const forgotToken = await criaTokenOpaco(id, this.expiracao, this.lista);
      return forgotToken;
    },
    async verifica(token) {
      const forgotToken = await verificaTokenOpaco(token, this.lista);
      return forgotToken;
    },
    async invalida(token) {
      return invalidaTokenOpaco(token, this.lista);
    },
  },
};
