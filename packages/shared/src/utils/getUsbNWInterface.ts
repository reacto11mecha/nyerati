import os from "os";
import stringSimilarity from "string-similarity";

const keys = Object.keys(os.networkInterfaces());

export default function getUsbNWInterface() {
  const matches = stringSimilarity.findBestMatch("usb", keys);
  return matches.bestMatch.target;
}
