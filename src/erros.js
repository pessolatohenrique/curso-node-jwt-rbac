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

class UserNotFoundError extends Error {
  constructor() {
    super("User not found in the database");
    this.name = "UserNotFoundError";
  }
}

module.exports = {
  InvalidArgumentError,
  InternalServerError,
  NotFoundError,
  AuthError,
  UserNotFoundError,
};
