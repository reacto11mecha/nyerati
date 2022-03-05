import {
  createContext,
  useContext,
  createEffect,
  createSignal,
  Accessor,
} from "solid-js";

export interface darkModeInterface {
  isDarkMode: Accessor<boolean>;
  setDarkMode: <U extends boolean>(
    v: (U extends () => void ? never : U) | ((prev: boolean) => U)
  ) => U;
}

function darkModeStore() {
  const initState: boolean = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const [isDarkMode, setDarkMode] = createSignal<boolean>(initState);
  if (localStorage.theme) setDarkMode(JSON.parse(localStorage.theme as string));

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

export const useDarkMode = () =>
  useContext(DarkModeContext) as darkModeInterface;
