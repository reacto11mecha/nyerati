import { Switch, lazy } from "solid-js";
import { MatchRoute } from "@rturnq/solid-router";

import Navbar from "./Components/Navbar";
import NotFound from "./Components/NotFound";

const TouchArea = lazy(() => import("./Components/TouchArea"));

function App() {
  return (
    <>
      <Navbar />
      <Switch fallback={NotFound}>
        <MatchRoute end>
          <TouchArea />
        </MatchRoute>
      </Switch>
    </>
  );
}

export default App;
