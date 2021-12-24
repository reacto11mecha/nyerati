import {
  createContext,
  useContext,
  createEffect,
  createSignal,
} from "solid-js";

function darkModeStore() {
  const initState = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDarkMode, setDarkMode] = createSignal(initState);
  if (localStorage.theme) setDarkMode(JSON.parse(localStorage.theme));

  createEffect(() => {
    localStorage.theme = JSON.stringify(isDarkMode());
  });
  return { isDarkMode, setDarkMode };
}

const DarkModeContext = createContext();

export function ContextProvider(props) {
  const store = darkModeStore();

  return (
    <DarkModeContext.Provider value={store}>
      {props.children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
