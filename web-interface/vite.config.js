import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { port as portDev } from "../config/constant";

const dev = process.env.NODE_ENV !== "production";

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
  define: {
    portDev: dev ? JSON.stringify(portDev) : "",
  },
});
