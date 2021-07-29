const postsDao = require("./posts-dao");
const validacoes = require("../validacoes-comuns");

/**
 * represents Post Model
 */
class Post {
  /**
   * initialize post model
   * @param {object} post
   */
  constructor(post) {
    this.id = post.id;
    this.titulo = post.titulo;
    this.conteudo = post.conteudo;
    this.autor = post.autor;
    this.valida();
  }

  /**
   * inserts post model
   */
  adiciona() {
    return postsDao.adiciona(this);
  }

  /**
   * validate post model, according rules
   */
  valida() {
    validacoes.campoStringNaoNulo(this.titulo, "título");
    validacoes.campoTamanhoMinimo(this.titulo, "título", 5);

    validacoes.campoStringNaoNulo(this.conteudo, "conteúdo");
    validacoes.campoTamanhoMaximo(this.conteudo, "conteúdo", 140);
  }

  /**
   * lists posts according user
   * @param {User} user
   * @return {Array} posts
   */
  static lista(user) {
    return postsDao.lista(user);
  }

  /**
   * deletes post model
   */
  async deleta() {
    return postsDao.deleta(this);
  }

  /**
   * searchs post model
   * @param {Integer} id
   * @return {object} post
   */
  static async buscaPorId(id) {
    const post = await postsDao.buscaPorId(id);
    if (!post) {
      return null;
    }

    return new Post(post);
  }
}

module.exports = Post;
