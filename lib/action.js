const { exec } = require("child_process");

const env = { ...process.env, NODE_ENV: "production" };
const command = "node server.js";

module.exports = (cwd) => {
  const { childHandler } = require("./handler")(cwd);

  const run = () => {
    const child = exec(command, {
      env,
      cwd,
    });

    childHandler(child);
  };

  const record = () => {
    const child = exec(command, {
      env: { ...env, RECORD: "record" },
      cwd,
    });

    childHandler(child);
  };

  return { run, record };
};
