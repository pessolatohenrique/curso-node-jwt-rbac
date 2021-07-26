const passport = require("passport");
const Usuario = require("./usuarios-modelo");
const tokenObject = require("./token");

const self = (module.exports = {
  local: (req, res, next) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error) {
        return next(error);
      }
      req.user = user;
      return next();
    })(req, res, next);
  },
  optionalAuth: (req, res, next) => {
    if (req.headers.authorization) {
      return self.bearer(req, res, next);
    }

    return next();
  },
  bearer: (req, res, next) => {
    passport.authenticate("bearer", { session: false }, (error, user, info) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res.status(400);
      }

      req.token = info.token;
      req.user = user;
      return next();
    })(req, res, next);
  },
  refresh: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const id = await tokenObject.refresh.verifica(refreshToken);
      console.log("ID", id);
      await tokenObject.refresh.invalida(refreshToken);
      req.user = await Usuario.buscaPorId(id);
      return next();
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  },
  verificaEmail: async (req, res, next) => {
    try {
      const { token } = req.params;
      const id = await tokenObject.verificaEmail.verifica(token);
      const usuario = await Usuario.buscaPorId(id);
      req.user = usuario;
      return next();
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
});
