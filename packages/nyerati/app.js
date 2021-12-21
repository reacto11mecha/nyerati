const path = require("path");
const { processCoordWriter: processWriter } = require("./lib");

const fastify = require("fastify")();

fastify.register(require("fastify-autoload"), {
  dir: path.join(__dirname, "plugin"),
});

processWriter(process);

module.exports = fastify;
