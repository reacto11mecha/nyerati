const {
  config: {
    constant: { mainDir, recordFolder },
  },
} = require("@nyerati/shared")(process);
const fs = require("fs");
const path = require("path");

if (!fs.existsSync(mainDir)) fs.mkdirSync(mainDir);
if (!fs.existsSync(recordFolder)) fs.mkdirSync(recordFolder);

module.exports = (fastify, opts, done) => {
  fastify.get("/lists", (req, reply) => {
    const files = fs
      .readdirSync(recordFolder)
      .filter((file) => file.endsWith(".json"))
      .map((nameFile) => ({ nameFile }));

    reply.send(files);
  });

  fastify.get(
    "/getFile/:file",
    {
      schema: {
        params: {
          file: { type: "string" },
        },
      },
      preHandler: (req, reply, done) => {
        const file = req.params.file;

        if (!file)
          reply.code(400).send({
            message: "Required file parameter",
          });

        if (file === "")
          reply.code(400).send({ message: "File parameter cannot be empty!" });

        if (!file.endsWith(".json"))
          reply.code(400).send({
            message: "Invalid file format! File format must be a json file",
          });

        const toFilePath = path.join(recordFolder, file);

        if (!fs.existsSync(toFilePath)) {
          reply.code(404).send({ message: "File not found" });
        }

        done();
      },
    },
    (req, reply) => {
      const toFilePath = path.join(recordFolder, req.params.file);
      const content = fs.readFileSync(toFilePath, "utf8");

      const data = content.map((dat, idx) => ({
        ...dat,
        diff: idx == 0 ? 0 : dat.d - content[idx - 1].d,
      }));

      reply.send(data);
    }
  );

  done();
};
