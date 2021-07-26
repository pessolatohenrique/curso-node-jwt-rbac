const ac = require("../usuarios/regras-acesso");

const self = (module.exports = {
  optionalPermission: (methodRole) => async (req, res, next) => {
    if (req.headers.authorization) {
      await self.canUser(methodRole);
    }

    return next();
  },
  canUser: (methodRole) => async (req, res, next) => {
    const entity = req.originalUrl.trim().split("/")[1];
    const user = await req.user;
    const permissionAny = ac.can(await user.cargo)[`${methodRole}Any`](entity);
    const permissionOwn = ac.can(await user.cargo)[`${methodRole}Own`](entity);

    if (!permissionAny.granted && !permissionOwn.granted) {
      res.status(403);
      res.end();
      return;
    }

    return next();
  },
});
