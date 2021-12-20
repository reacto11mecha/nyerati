const { exec } = require("child_process");

const shared = require("@nyerati/shared")(process);

const env = { ...process.env, NODE_ENV: "production" };
const command = "node server.js";
const udpCommand = "node udpOnly.js";

module.exports = (cwd) => {
  const handler = require("./handler")(cwd);

  return handler.then(({ childHandler }) => {
    const run = (option) => {
      const child = exec(option.udpOnly ? udpCommand : command, {
        env,
        cwd,
      });

      childHandler(child, option.udpOnly);
    };

    const record = (option) => {
      const child = exec(option.udpOnly ? udpCommand : command, {
        env: {
          ...env,
          RECORD: "record",
          recordText: shared.config.constant.recordText,
        },
        cwd,
      });

      childHandler(child, option.udpOnly);
    };

    return { run, record };
  });
};
