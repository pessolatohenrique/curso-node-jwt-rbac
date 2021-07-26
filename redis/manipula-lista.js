const { promisify } = require("util");

module.exports = (lista) => {
  const setAsync = promisify(lista.set).bind(lista);
  const existsAsync = promisify(lista.exists).bind(lista);
  const getAsync = promisify(lista.get).bind(lista);
  const delAsync = promisify(lista.del).bind(lista);

  return {
    async adiciona(chave, valor, expiracao) {
      await setAsync(chave, valor);
      lista.expireat(chave, expiracao);
    },
    async buscaValor(chave) {
      return getAsync(chave);
    },
    async contemChave(chave) {
      const resultado = existsAsync(chave);
      return resultado;
    },
    async deleta(chave) {
      await delAsync(chave);
    },
  };
};
