const fs = require("fs");
const chalk = require("chalk");
const { spawn } = require("child_process");

const {
  distRoot,
  nodeModulesWI,
  distWI,
  webInterface,
} = require("../config/constant");

const buildAndMove = () =>
  new Promise((resolve, reject) => {
    const build = spawn("npm", ["run", "build"], { cwd: webInterface });

    build.stdout.pipe(process.stdout);
    build.stderr.pipe(process.stderr);

    build.on("close", (code) => {
      if (code > 0) return reject("Error when building web interface");

      fs.renameSync(distWI, distRoot);
      return resolve();
    });
  });

const checkBuild = () =>
  new Promise(async (resolve, reject) => {
    if (!fs.existsSync(distRoot)) {
      if (!fs.existsSync(nodeModulesWI)) {
        return reject(
          "Install node modules first, just running install.sh or install.bat"
        );
      } else {
        try {
          await buildAndMove();

          console.log(
            `[${chalk.green("Success")}] Success building web interface`
          );

          resolve();
        } catch (e) {
          reject(e);
        }
      }
    } else {
      resolve();
    }
  });

module.exports = checkBuild;
