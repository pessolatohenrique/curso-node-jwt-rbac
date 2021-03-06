const db = require("../../database");
const { InternalServerError } = require("../erros");

module.exports = {
  adiciona: (usuario) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          INSERT INTO usuarios (
            nome,
            email,
            senha,
            emailVerificado,
            cargo
          ) VALUES (?, ?, ?, ?, ?)
        `,
        [
          usuario.nome,
          usuario.email,
          usuario.senha,
          usuario.emailVerificado,
          usuario.cargo,
        ],
        (erro) => {
          console.log(erro);
          if (erro) {
            reject(new InternalServerError("Erro ao adicionar o usuário!"));
          }

          return resolve();
        }
      );
    });
  },

  buscaPorId: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM usuarios
          WHERE id = ?
        `,
        [id],
        (erro, usuario) => {
          if (erro) {
            return reject("Não foi possível encontrar o usuário!");
          }

          return resolve(usuario);
        }
      );
    });
  },

  buscaPorEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM usuarios
          WHERE email = ?
        `,
        [email],
        (erro, usuario) => {
          if (erro) {
            return reject("Não foi possível encontrar o usuário!");
          }

          return resolve(usuario);
        }
      );
    });
  },

  lista: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `
          SELECT * FROM usuarios
        `,
        (erro, usuarios) => {
          if (erro) {
            return reject("Erro ao listar usuários");
          }
          return resolve(usuarios);
        }
      );
    });
  },

  deleta: (usuario) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          DELETE FROM usuarios
          WHERE id = ?
        `,
        [usuario.id],
        (erro) => {
          if (erro) {
            return reject("Erro ao deletar o usuário");
          }
          return resolve();
        }
      );
    });
  },

  modificaEmailVerificado: (usuario) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          UPDATE usuarios
          SET emailVerificado = ?
          WHERE id = ?
        `,
        [usuario.emailVerificado, usuario.id],
        (erro) => {
          if (erro) {
            return reject("Erro ao modificar o e-mail verificado");
          }
          return resolve();
        }
      );
    });
  },

  modificaSenha: (usuario) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          UPDATE usuarios
          SET senha = ?
          WHERE id = ?
        `,
        [usuario.senha, usuario.id],
        (erro) => {
          if (erro) {
            return reject("Erro ao modificar a senha");
          }
          return resolve();
        }
      );
    });
  },
};
