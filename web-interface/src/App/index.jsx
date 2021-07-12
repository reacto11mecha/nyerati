import { Switch, lazy } from "solid-js";
import { MatchRoute } from "@rturnq/solid-router";

import Navbar from "./Components/Navbar";
import NotFound from "./Components/NotFound";

import ConnectionProvider from "./Context/connection";

const TouchArea = lazy(() => import("./Components/TouchArea"));

function App() {
  return (
    <>
      <Navbar />
      <Switch fallback={NotFound}>
        <MatchRoute end>
          <ConnectionProvider>
            <TouchArea />
          </ConnectionProvider>
        </MatchRoute>
      </Switch>
    </>
  );
}

export default App;
