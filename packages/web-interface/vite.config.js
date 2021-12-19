import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import shared from "@nyerati/shared";

const sharedValue = shared(process);

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
  define: {
    portDev: sharedValue.config.constant.dev
      ? JSON.stringify(sharedValue.config.constant.port)
      : JSON.stringify(""),
  },
});
