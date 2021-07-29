const bcrypt = require("bcrypt");
const usuariosDao = require("./usuarios-dao");
const { InvalidArgumentError } = require("../erros");
const validacoes = require("../validacoes-comuns");

const SALTOS_BCRYPT = 12;

/**
 * represents User model
 */
class Usuario {
  constructor(usuario) {
    this.id = usuario.id;
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.senha = usuario.senha;
    this.emailVerificado = usuario.emailVerificado;
    this.cargo = usuario.cargo;

    this.valida();
  }

  /**
   * @throws InvalidArgumentError
   */
  async adiciona() {
    if (await Usuario.buscaPorEmail(this.email)) {
      throw new InvalidArgumentError("O usuário já existe!");
    }

    this.senha = await bcrypt.hash(this.senha, SALTOS_BCRYPT);

    await usuariosDao.adiciona(this);
    const usuario = await Usuario.buscaPorEmail(this.email);
    return usuario;
  }

  async verificaEmail() {
    this.emailVerificado = true;
    await usuariosDao.modificaEmailVerificado(this);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.nome, "nome");
    validacoes.campoStringNaoNulo(this.email, "email");
    validacoes.campoStringNaoNulo(this.senha, "senha");

    const cargosDisponiveis = ["admin", "editor", "assinante"];

    if (!cargosDisponiveis.includes(this.cargo)) {
      throw new InvalidArgumentError("Cargo inválido");
    }
    // validacoes.campoTamanhoMinimo(this.senha, "senha", 8);
    // validacoes.campoTamanhoMaximo(this.senha, "senha", 64);
  }

  async deleta() {
    return usuariosDao.deleta(this);
  }

  static async buscaPorId(id) {
    const usuario = await usuariosDao.buscaPorId(id);
    if (!usuario) {
      return null;
    }

    return new Usuario(usuario);
  }

  static async buscaPorEmail(email) {
    const usuario = await usuariosDao.buscaPorEmail(email);
    if (!usuario) {
      return null;
    }

    return new Usuario(usuario);
  }

  static lista() {
    return usuariosDao.lista();
  }
}

module.exports = Usuario;
