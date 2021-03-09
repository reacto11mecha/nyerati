const fs = require("fs");
const path = require("path");

const recordFolder = path.join(__dirname, "record");
const recordText = path.join(recordFolder, "coord.txt");
const recordJSON = path.join(recordFolder, "convert.json");

const parseCoordTxt = () =>
  fs
    .readFileSync(recordText, "utf8")
    .split(/\r\n|\r|\n/gm)
    .filter((d) => d !== "")
    .map(JSON.parse);

if (fs.existsSync(recordFolder)) {
  fs.open(recordText, "r", (err) => {
    if (!err) {
      const data = parseCoordTxt();
      fs.open(recordJSON, "r", (err) => {
        if (!err) {
          const jsonDAT = require(recordJSON);

          data.forEach((d) => jsonDAT.push(d));
          fs.writeFileSync(recordJSON, JSON.stringify(jsonDAT, null, 2));
        } else {
          fs.writeFileSync(recordJSON, JSON.stringify(data, null, 2));
        }
        fs.unlinkSync(recordText);
      });
    }
  });
}
