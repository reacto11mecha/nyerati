const fp = require("fastify-plugin");
const path = require("path");

const web = require("@nyerati/web-interface");
const connectivity = require("./connectivity");

module.exports = fp((fastify, opts, done) => {
  fastify.register(require("fastify-cors"), {
    origin: connectivity.mainConfig.cors.map((cors) => cors.replace(/\/$/, "")),
    methods: connectivity.mainConfig.methods,
  });

  fastify.register(require("fastify-compress"));

  fastify.register(require("fastify-static"), {
    root: web,
  });

  // It'll send index.html inside @nyerati/web-interface dist folder
  fastify.setNotFoundHandler((req, reply) => reply.sendFile("index.html"));
  fastify.get("*", (req, reply) =>
    reply.sendFile(path.join(web, "index.html"))
  );

  done();
});
