import { createSignal, onMount, Switch, Match, For } from "solid-js";
import { Link } from "solid-app-router";
import styles from "./ReplayList.module.css";

import useColorModeValue from "@/Hook/useColorModeValue";

interface validResponse {
  nameFile: string;
}

const serverPath = import.meta.env.DEV
  ? "http://localhost:3000"
  : location.origin;

export default function ReplayList() {
  const [files, setFiles] = createSignal<null | validResponse[]>(null);

  const outerBorder = useColorModeValue("#aaa", "black");
  const bottomBorder = useColorModeValue("#aaa", "firebrick");

  onMount(() => {
    fetch(`${serverPath}/api/lists`)
      .then((res) => res.json())
      .then((data) => setFiles(data));
  });

  return (
    <div className={styles.mainContainer}>
      <div>
        <article
          class={`card ${styles.cardList}`}
          style={`border-color: ${outerBorder()}`}
        >
          <header style={`border-color: ${bottomBorder()}`}>
            <h3 className={styles.fileListHeading}>File List</h3>
          </header>
          <footer>
            <Switch fallback={"Unexpected Error"}>
              <Match when={files() === null}>Loading.....</Match>
              <Match
                when={Array.isArray(files()) && (files() as []).length < 1}
              >
                No recorded data found so far
              </Match>
              <Match
                when={Array.isArray(files()) && (files() as []).length > 0}
              >
                <ol>
                  <For each={files()} fallback={<div>Processing data...</div>}>
                    {(item) => {
                      const replaceNameFile = item.nameFile.replace(
                        ".json",
                        ""
                      );

                      return (
                        <li>
                          <Link href={`/replay/${replaceNameFile}`}>
                            {replaceNameFile}
                          </Link>
                        </li>
                      );
                    }}
                  </For>
                </ol>
              </Match>
            </Switch>
          </footer>
        </article>
      </div>
    </div>
  );
}
