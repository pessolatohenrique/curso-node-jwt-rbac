const blockList = require("./blocklist");
const manipulaLista = require("./manipula-lista");
const manipulaBlockLista = manipulaLista(blockList);
const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");

function geraTokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}
module.exports = {
  adiciona: async (token) => {
    const expiredAt = jwt.decode(token).exp;
    const tokenHashed = geraTokenHash(token);
    await manipulaBlockLista.adiciona(tokenHashed, "", expiredAt);
  },
  contemToken: async (token) => {
    const tokenHashed = geraTokenHash(token);
    return manipulaBlockLista.contemChave(tokenHashed);
  },
};
