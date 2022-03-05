import { render } from "solid-js/web";
import { Router } from "solid-app-router";

import "picnic/picnic.min.css";
import "./index.css";

import App from "./App";

import { ContextProvider } from "@/Context/DarkMode";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = document.getElementById("root")!;

render(
  () => (
    <Router>
      <ContextProvider>
        <App />
      </ContextProvider>
    </Router>
  ),
  root
);
