#!/usr/bin/env node
const program = require("commander");
const package = require("./package.json");
const { spawn } = require("child_process");
const { join } = require("path");

program.version(package.version).name(package.name);

const server = join(__dirname, "server.js");

program
  .command("run")
  .alias("r")
  .action(() => {
    const child = spawn("node", [server], {
      env: { ...process.env, NODE_ENV: "production" },
    });

    child.stderr.pipe(process.stderr);
    child.stdout.pipe(process.stdout);
  });

program
  .command("record")
  .alias("rec")
  .action(() => {
    const child = spawn("node", [server], {
      env: { ...process.env, NODE_ENV: "production", RECORD: "record" },
    });

    child.stderr.pipe(process.stderr);
    child.stdout.pipe(process.stdout);
  });

program.parse(process.argv);
