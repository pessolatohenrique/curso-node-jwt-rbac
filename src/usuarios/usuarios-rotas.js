const usuariosControlador = require("./usuarios-controlador");
const middlewaresAutenticacao = require("./middlewers-autenticacao");
const middlewaresAutorizacao = require("./middlewers-autorizacao");
const passport = require("passport");

module.exports = (app) => {
  app.route("/usuario/esqueci_senha").post(usuariosControlador.esqueci_senha);

  app
    .route("/usuario/redefinir_senha")
    .post(usuariosControlador.redefinir_senha);

  app
    .route("/usuario/atualiza_token")
    .post(middlewaresAutenticacao.refresh, usuariosControlador.login);

  app
    .route("/usuario/login")
    .post(middlewaresAutenticacao.local, usuariosControlador.login);

  app
    .route("/usuario/logout")
    .post(
      [middlewaresAutenticacao.refresh, middlewaresAutenticacao.bearer],
      usuariosControlador.logout
    );

  app
    .route("/usuario")
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
    .route("/usuario/verifica_email/:token")
    .get(
      [middlewaresAutenticacao.verificaEmail],
      usuariosControlador.verifica_email
    );

  app
    .route("/usuario/:id")
    .delete(
      [
        middlewaresAutenticacao.bearer,
        middlewaresAutorizacao.canUser("delete"),
      ],
      usuariosControlador.deleta
    );
};
