import fs from "fs";
import path from "path";
import { fork } from "child_process";

import { message } from "../functions/mover";
import { ConfigInterface } from "../config";

export type mouseMoverType = () => (data: message) => void;

export default function mouseMover(
  { config }: { config: ConfigInterface },
  process: NodeJS.Process
): mouseMoverType {
  return () => {
    const mover = fork("mover", {
      cwd: path.join(__dirname, "../functions"),
    });

    if (!config.constant.isRecording)
      return (data: message) => mover.send(data);

    const recordText = config.constant.recordText;
    const writer = fork("writer", {
      cwd: path.join(__dirname, "../functions"),
      env: { ...process.env, recordText },
    });

    if (!fs.existsSync(config.constant.mainDir))
      fs.mkdirSync(config.constant.mainDir);

    if (!fs.existsSync(recordText)) {
      if (!fs.existsSync(config.constant.recordFolder))
        fs.mkdirSync(config.constant.recordFolder);
      fs.writeFileSync(recordText, "");
    }

    return (data: message) => {
      mover.send(data);
      writer.send({ ...data, d: Date.now() });
    };
  };
}
