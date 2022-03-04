import {
  onMount,
  onCleanup,
  createSignal,
  createEffect,
  Switch,
  Match,
} from "solid-js";
import styles from "./TouchArea.module.css";
import { io, Socket } from "socket.io-client";
import screenfull from "screenfull";

import useColorModeValue from "@/Hook/useColorModeValue";

const { DEV: dev } = import.meta.env;

export default function TouchArea() {
  const bg = {
    na: useColorModeValue("#A0AEC0", "#4A5568"),
    connected: useColorModeValue("#38A169", "#276749"),
    disconnected: useColorModeValue("#E53E3E", "#822727"),
  };

  const [connection, setConnection] = createSignal<null | boolean>(null);
  const [bgStatus, setBgStatus] = createSignal(bg.na());

  let touchArea;
  let socket: Socket;

  const connectionSetter = () => setConnection(socket.connected);
  const toggleFullScreen = (e) => {
    (e.target as HTMLElement).blur();
    screenfull.toggle(touchArea, { navigationUI: "hide" });
  };
  const handler = (evt) =>
    void socket.emit("touch", {
      x: evt.touches[0].clientX / touchArea.clientWidth,
      y: evt.touches[0].clientY / touchArea.clientHeight,
    });

  onMount(() => {
    socket = dev ? io(`http://${location.hostname}:${portDev}`) : io();

    socket.on("connect", connectionSetter);
    socket.on("disconnect", connectionSetter);

    touchArea.addEventListener("touchstart", handler);
    touchArea.addEventListener("touchmove", handler);
  });

  createEffect(() => {
    if (connection() === null) {
      setBgStatus(bg.na());
    } else {
      if (connection()) {
        setBgStatus(bg.connected());
      } else {
        setBgStatus(bg.disconnected());
      }
    }
  });

  onCleanup(() => {
    socket.off("connect", connectionSetter);
    socket.off("disconnect", connectionSetter);

    socket.disconnect();

    touchArea.removeEventListener("touchstart", handler);
    touchArea.removeEventListener("touchmove", handler);
  });

  return (
    <div className={styles.mainContainer}>
      <div>
        <div
          class={`card ${styles.CardMax} ${styles.selectNone}`}
          ref={touchArea}
        >
          <div className={styles.topSpace}>
            <h3 className={styles.touchAndDrag}>Touch and drag here</h3>
          </div>
          <div className={styles.bottomSpace}>
            <button onClick={toggleFullScreen}>Toggle Fullscreen</button>
            <div
              onClick={(e) => (e.target as HTMLElement).blur()}
              style={`background-color: ${bgStatus()}`}
              className={`button ${styles.statusInfo}`}
            >
              Status:{" "}
              <Switch fallback={"N/A"}>
                <Match when={connection()}>CONNECTED</Match>
                <Match when={connection() === false}>DISCONNECTED</Match>
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
