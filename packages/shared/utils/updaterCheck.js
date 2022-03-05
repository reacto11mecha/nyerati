const checkForUpdate = require("update-check");

module.exports = async (pkg) => {
  const chalk = await import("chalk").then((p) => p.default);

  setTimeout(
    () =>
      checkForUpdate(pkg)
        .then((update) => {
          if (update) {
            console.log(
              `[${chalk.hex("#4C7DBE")("UPDATE")}] The latest version of \`${
                pkg.name
              }\` is ${update.latest}. Please update!`
            );
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {}),
    2500 // Prevent race condition consoleListen
  );
};
