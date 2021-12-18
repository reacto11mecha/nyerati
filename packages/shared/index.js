const config = require("./config");

module.exports = function (process) {
  return { config: config(process) };
};
