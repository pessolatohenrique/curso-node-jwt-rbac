const Post = require("./posts-modelo");
const { InvalidArgumentError, InternalServerError } = require("../erros");

module.exports = {
  adiciona: async (req, res) => {
    try {
      const user = await req.user;
      req.body.autor = user.id;
      const post = new Post(req.body);
      await post.adiciona();

      res.status(201).send(post);
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

  lista: async (req, res) => {
    try {
      const user = await req.user;
      const posts = await Post.lista(user);
      res.send(posts);
    } catch (erro) {
      return res.status(500).json({ erro: erro });
    }
  },

  deleta: async (req, res) => {
    const post = await Post.buscaPorId(req.params.id);

    try {
      await post.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  },
};
