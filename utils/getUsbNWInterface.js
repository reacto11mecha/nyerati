const os = require("os");
const keys = Object.keys(os.networkInterfaces());
const stringSimilarity = require("string-similarity");

module.exports = () => {
  const matches = stringSimilarity.findBestMatch("usb", keys);
  return matches.bestMatch.target;
};
