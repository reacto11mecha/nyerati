#!/usr/bin/env node
const program = require("commander");
const package = require("./package.json");

program.version(package.version).name(package.name);

program
  .command("run")
  .alias("r")
  .action(() => {
    console.log("runned");
  });

program
  .command("record")
  .alias("rec")
  .action(() => {
    console.log("runned");
  });

program.parse(process.argv);
