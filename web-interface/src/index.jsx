import { render } from "solid-js/web";
import { Router, pathIntegration } from "@rturnq/solid-router";

import "picnic/picnic.min.css";
import App from "./App";

const Root = () => (
  <Router integration={pathIntegration()}>
    <App />
  </Router>
);

render(Root, document.getElementById("root"));
