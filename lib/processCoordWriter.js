const { exec } = require("child_process");
const path = require("path");

const { isRecording } = require("../config/constant");

const processWriter = (process) => {
  const parseCoord = () => {
    if (isRecording)
      exec("node parsecoord", {
        cwd: path.join(__dirname, "..", "functions"),
      });
    process.exit(1);
  };

  process.on("SIGINT", parseCoord);
  process.on("disconnect", parseCoord);
};

module.exports = processWriter;
