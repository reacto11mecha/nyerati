const constant = require("./constant");

module.exports = function (process) {
  return { constant: constant(process) };
};
