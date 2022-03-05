import constant, { constantInterface } from "./constant";

export interface ConfigInterface {
  constant: constantInterface;
}

export default function ConfigIndex(process: NodeJS.Process): ConfigInterface {
  return { constant: constant(process) };
}
