const Post = require("./posts-modelo");
const { NotFoundError } = require("../erros");

module.exports = {
  adiciona: async (req, res, next) => {
    try {
      const user = await req.user;
      req.body.autor = user.id;
      const post = new Post(req.body);
      await post.adiciona();

      res.status(201).send(post);
    } catch (error) {
      return next(error);
    }
  },

  lista: async (req, res, next) => {
    try {
      const user = await req.user;
      const posts = await Post.lista(user);
      res.send(posts);
    } catch (error) {
      return next(error);
    }
  },

  deleta: async (req, res, next) => {
    const post = await Post.buscaPorId(req.params.id);

    if (!post) {
      return next(new NotFoundError());
    }

    try {
      await post.deleta();
      res.status(200).send();
    } catch (error) {
      return next(error);
    }
  },
};
