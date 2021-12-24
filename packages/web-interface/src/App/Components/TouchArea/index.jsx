import {
  onMount,
  onCleanup,
  createSignal,
  createEffect,
  Switch,
  Match,
} from "solid-js";
import styles from "./TouchArea.module.css";
import { io } from "socket.io-client";
import screenfull from "screenfull";

import useColorModeValue from "../../Hook/useColorModeValue";

const { DEV: dev } = import.meta.env;

export default function TouchArea() {
  const bg = {
    na: useColorModeValue("#A0AEC0", "#4A5568"),
    connected: useColorModeValue("#38A169", "#276749"),
    disconnected: useColorModeValue("#E53E3E", "#822727"),
  };

  const [connection, setConnection] = createSignal(null);
  const [bgStatus, setBgStatus] = createSignal(bg.na());

  let touchArea;
  let socket;

  const connectionSetter = () => setConnection(socket.connected);
  const toggleFullScreen = (e) => {
    e.target.blur();
    screenfull.toggle(touchArea, { navigationUI: "hide" });
  };
  const handler = (evt) =>
    void socket.emit("touch", {
      x: evt.touches[0].clientX / touchArea.clientWidth,
      y: evt.touches[0].clientY / touchArea.clientHeight,
    });

  onMount(() => {
    let supportsPassive = false;
    try {
      let opts = Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      });
      window.addEventListener("testPassive", null, opts);
      window.removeEventListener("testPassive", null, opts);
    } catch (e) {}

    socket = dev ? io(`http://${location.hostname}:${portDev}`) : io();

    socket.on("connect", connectionSetter);
    socket.on("disconnect", connectionSetter);

    const opt = supportsPassive ? { passive: true } : false;
    touchArea.addEventListener("touchstart", handler, opt);
    touchArea.addEventListener("touchmove", handler, opt);
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

    socket = null;
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
            <button
              onClick={(e) => e.target.blur()}
              style={`background-color: ${bgStatus()}`}
              className={styles.statusInfo}
            >
              Status:{" "}
              <Switch fallback={"N/A"}>
                <Match when={connection()}>CONNECTED</Match>
                <Match when={connection() === false}>DISCONNECTED</Match>
              </Switch>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
