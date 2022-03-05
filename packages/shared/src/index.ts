import config, { ConfigInterface } from "./config";

import mouseMove, { mouseMoverType } from "./lib/mouseMover";
import consoleListen, { consoleListenType } from "./lib/consoleListen";
import updaterCheck, { packageInterface } from "./utils/updaterCheck";

export interface sharedInterface {
  config: ConfigInterface;
  lib: { moveMouse: mouseMoverType };
  consoleListen: consoleListenType;
  updaterCheck: (pkg: packageInterface) => void;
}

export default function shared(process: NodeJS.Process): sharedInterface {
  const configObj = config(process);
  const moveMouse = mouseMove({ config: configObj }, process);
  const listen = consoleListen({ config: configObj });

  return {
    config: configObj,
    lib: { moveMouse },
    consoleListen: listen,
    updaterCheck,
  };
}
