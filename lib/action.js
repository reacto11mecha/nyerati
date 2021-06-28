const { exec } = require("child_process");

const env = { ...process.env, NODE_ENV: "production" };
const command = "node server.js";
const udpCommand = "node udpOnly.js";

module.exports = (cwd) => {
  const { childHandler, build } = require("./handler")(cwd);

  const run = (option) => {
    const child = exec(option.udpOnly ? udpCommand : command, {
      env,
      cwd,
    });

    childHandler(child);
  };

  const record = (option) => {
    const child = exec(option.udpOnly ? udpCommand : command, {
      env: { ...env, RECORD: "record" },
      cwd,
    });

    childHandler(child);
  };

  return { run, record, build };
};
