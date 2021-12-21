const fp = require("fastify-plugin");
const path = require("path");

const web = require("@nyerati/web-interface");

module.exports = fp((fastify, opts, done) => {
  fastify.register(require("fastify-compress"));

  fastify.register(require("fastify-static"), {
    root: web,
  });

  fastify.get("*", (req, reply) =>
    reply.sendFile(path.join(web, "index.html"))
  );

  done();
});
