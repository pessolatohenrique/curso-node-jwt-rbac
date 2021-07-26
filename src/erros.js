class InvalidArgumentError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "InvalidArgumentError";
  }
}

class InternalServerError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "InternalServerError";
  }
}

class NotFoundError extends Error {
  constructor() {
    super("Entity not found!");
    this.name = "NotFoundError";
  }
}

class AuthError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "AuthError";
  }
}

module.exports = {
  InvalidArgumentError,
  InternalServerError,
  NotFoundError,
  AuthError,
};
