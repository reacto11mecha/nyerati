import { render } from "solid-js/web";
import { Router } from "solid-app-router";

import "picnic/picnic.min.css";
import "./index.css";

import App from "./App";

import { ContextProvider } from "./App/Context/DarkMode";

render(
  () => (
    <Router>
      <ContextProvider>
        <App />
      </ContextProvider>
    </Router>
  ),
  document.getElementById("root")
);
