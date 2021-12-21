const path = require("path");
const { processCoordWriter: processWriter } = require("./lib");

const fastify = require("fastify")();

fastify.register(require("fastify-autoload"), {
  dir: path.join(__dirname, "plugin"),
});

const api = require("./route/api");

fastify.register(api, { prefix: "/api" });

processWriter(process);

module.exports = fastify;
