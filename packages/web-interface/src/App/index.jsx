import { lazy } from "solid-js";
import { Routes, Route, Link } from "solid-app-router";

import Navbar from "./Components/Navbar";
import NotFound from "./Components/NotFound";
import { useDarkMode } from "./Context/DarkMode";

const TouchArea = lazy(() => import("./Components/TouchArea"));
const ReplayList = lazy(() => import("./Components/ReplayList"));

function App() {
  const { isDarkMode } = useDarkMode();

  return (
    <div data-theme={isDarkMode() ? "dark" : "light"}>
      <Navbar />
      <Routes>
        <Route path="/replay" element={<ReplayList />} />
        <Route path="/replay/:filename" element={() => <p>filename</p>} />
        <Route path="/" element={<TouchArea />} />
        <Route path="/*all" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
