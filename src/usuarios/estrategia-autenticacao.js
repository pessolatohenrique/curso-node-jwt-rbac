const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStategy = require("passport-http-bearer").Strategy;
const Usuario = require("./usuarios-modelo");
const { AuthError } = require("../erros");
const tokenObject = require("./token");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "senha",
      session: false,
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuario.buscaPorEmail(email);

        if (!usuario) {
          throw new AuthError("Usuário não encontrado");
        }

        const verificaSenha = await bcrypt.compare(password, usuario.senha);

        if (!verificaSenha) {
          throw new AuthError("Usuário ou senha inválidos");
        }

        done(null, usuario);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new BearerStategy(async (token, done) => {
    try {
      const id = await tokenObject.access.verifica(token);
      const usuario = Usuario.buscaPorId(id);
      done(null, usuario, { token: token });
    } catch (error) {
      done(error);
    }
  })
);
