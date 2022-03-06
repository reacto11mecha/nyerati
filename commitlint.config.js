const { getPackages } = require("@commitlint/config-lerna-scopes").utils;

const additionalScope = ["deps"];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": (ctx) =>
      getPackages(ctx).then((packages) => [
        2,
        "always",
        [...additionalScope, ...packages],
      ]),
  },
};
