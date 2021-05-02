#!/usr/bin/env node
const program = require("commander");
const package = require("./package.json");
const { exec } = require("child_process");
const { join } = require("path");
const chalk = require("chalk");

const consoleListen = require("./functions/consoleListen");
const listen = () => consoleListen(parseInt(process.env.PORT, 10) || 3000);

program.version(package.version).name(package.name);

const server = join(__dirname, "server.js");

program
  .command("run")
  .alias("r")
  .action(() => {
    const child = exec(`cd ${__dirname} && node ${server}`, {
      env: { ...process.env, NODE_ENV: "production" },
    });

    childHandler(child);
  });

program
  .command("record")
  .alias("rec")
  .action(() => {
    const child = exec(`cd ${__dirname} && node ${server}`, {
      env: { ...process.env, NODE_ENV: "production", RECORD: "record" },
    });

    childHandler(child);
  });

function childHandler(child) {
  child.stderr.pipe(process.stderr);

  child.stdout.on("data", (text) => {
    if (text.includes("next-pentab")) listen();
    if (text.includes("[Socket]")) {
      const event = text.split("[Socket]")[1].trim();

      console.log(`[${chalk.hex("#FDD798")("Socket")}] ${event}`);
    }
  });
}

program.parse(process.argv);
