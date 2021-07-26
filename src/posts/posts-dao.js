const db = require("../../database");

module.exports = {
  adiciona: (post) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO posts (
          titulo, 
          conteudo,
          autor
        ) VALUES (?, ?, ?)
      `,
        [post.titulo, post.conteudo, post.autor],
        (erro) => {
          if (erro) {
            return reject("Erro ao adicionar o post!");
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
          FROM posts
          WHERE id = ?
        `,
        [id],
        (erro, post) => {
          if (erro) {
            return reject("Não foi possível encontrar o post!");
          }

          return resolve(post);
        }
      );
    });
  },

  deleta: (post) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          DELETE FROM posts
          WHERE id = ?
        `,
        [post.id],
        (erro) => {
          if (erro) {
            return reject("Erro ao deletar o post");
          }
          return resolve();
        }
      );
    });
  },

  lista: (user) => {
    return new Promise((resolve, reject) => {
      const queryUser = user
        ? "SELECT * FROM posts"
        : "SELECT titulo, conteudo FROM posts";

      db.all(queryUser, (erro, resultados) => {
        if (erro) {
          return reject("Erro ao listar os posts!");
        }

        return resolve(resultados);
      });
    });
  },
};
