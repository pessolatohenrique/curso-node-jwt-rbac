require("dotenv").config();
const app = require("./app");
const port = 3000;
const { InvalidArgumentError } = require("./src/erros");
require("./redis/blocklist");
require("./redis/allowlist-refresh-token");
require("./redis/forgot-password-token");

const routes = require("./rotas");
routes(app);

/**
 * middleware para tratamento de erros
 */
app.use((error, req, res, next) => {
  const message = error.message;

  const errors_status = {
    InvalidArgumentError: 400,
    NotFoundError: 404,
    UserNotFoundError: 401,
    AuthError: 401,
    JsonWebTokenError: 401,
    TokenExpiredError: 401,
  };

  const error_constructor = error.constructor.name;

  const status = errors_status[error_constructor]
    ? errors_status[error_constructor]
    : 500;

  const body = {
    message: message ? message : "Internal Error",
  };

  res.status(status).json(body);
});

app.listen(port, () => console.log(`App listening on port ${port}`));
