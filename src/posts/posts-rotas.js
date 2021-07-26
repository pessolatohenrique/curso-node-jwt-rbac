const postsControlador = require("./posts-controlador");
const {
  middlewareAutenticacao,
  middlewareAutorizacao,
} = require("../usuarios");
const passport = require("passport");

module.exports = (app) => {
  app
    .route("/post")
    .get(
      [
        middlewareAutenticacao.optionalAuth,
        middlewareAutorizacao.optionalPermission("read"),
      ],
      postsControlador.lista
    )
    .post(
      [middlewareAutenticacao.bearer, middlewareAutorizacao.canUser("create")],
      postsControlador.adiciona
    );

  app
    .route("/post/:id")
    .delete(
      [
        middlewareAutenticacao.bearer,
        middlewareAutenticacao.local,
        middlewareAutorizacao.canUser("delete"),
      ],
      postsControlador.deleta
    );
};
