module.exports = {
  rotas: require("./usuarios-rotas"),
  controlador: require("./usuarios-controlador"),
  modelo: require("./usuarios-modelo"),
  estrategiasAutenticacao: require("./estrategia-autenticacao"),
  middlewareAutenticacao: require("./middlewers-autenticacao"),
  middlewareAutorizacao: require("./middlewers-autorizacao"),
};
