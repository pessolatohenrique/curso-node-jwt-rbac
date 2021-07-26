const AccessControl = require("accesscontrol");

const ac = new AccessControl();

ac.grant("assinante").readAny("post", ["id", "titulo"]);

ac.grant("editor")
  .extend(["assinante"])
  .createOwn("post")
  .deleteOwn("post")
  .deleteOwn("user");

ac.grant("admin")
  .extend(["assinante"])
  .createAny("post")
  .deleteAny("post")
  .deleteAny("user");

module.exports = ac;
