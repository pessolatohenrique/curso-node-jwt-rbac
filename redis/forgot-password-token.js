const redis = require("redis");
const manipulaLista = require("./manipula-lista");
const forgotList = redis.createClient({ prefix: "forgotlist-password-token:" });
module.exports = manipulaLista(forgotList);
