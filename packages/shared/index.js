const config = require("./config");

const mouseMove = require("./lib/mouseMover");
const consoleListen = require("./lib/consoleListen");

module.exports = function (process) {
  const configObj = config(process);
  const moveMouse = mouseMove({ config: configObj }, process);
  const listen = consoleListen({ config: configObj });

  return { config: configObj, lib: { moveMouse }, consoleListen: listen };
};
