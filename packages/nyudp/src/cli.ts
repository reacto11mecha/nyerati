#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Command } from "commander";
import _handler from "./lib/handler";

const packagePath = path.join(__dirname, "../package.json");
const packageData = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const handler = _handler(__dirname, packageData);

const program = new Command();
program.version(packageData.version).name(Object.keys(packageData.bin)[0]);

handler.then(({ run }) => {
  program
    .command("run")
    .alias("r")
    .option("--port <port>", "Change port to specific port")
    .description("UDP/datagram mode only")
    .action(run(packageData));

  const parsed = program.parse(process.argv);
  if (
    !(
      parsed.args &&
      parsed.args.length > 0 &&
      typeof (parsed.args[0] === "object")
    )
  ) {
    program.help();
  }
});
