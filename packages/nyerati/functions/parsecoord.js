const fs = require("fs");

const {
  config: {
    constant: { recordFolder, recordText, recordJson },
  },
} = require("@nyerati/shared")(process);

if (fs.existsSync(recordFolder) && fs.existsSync(recordText)) {
  const data = fs
    .readFileSync(recordText, "utf8")
    .split(/\r\n|\r|\n/gm)
    .filter((d) => d !== "")
    .map(JSON.parse);

  const jsonPath = recordJson();

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  fs.unlinkSync(recordText);
}
