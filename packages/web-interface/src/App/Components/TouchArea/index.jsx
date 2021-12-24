import { onMount, onCleanup } from "solid-js";
import styles from "./TouchArea.module.css";
import { io } from "socket.io-client";

const { DEV: dev } = import.meta.env;

function TouchArea() {
  let touchArea;
  let socket;

  const handler = (evt) =>
    void socket.emit("touch", {
      x: evt.touches[0].clientX / touchArea.clientWidth,
      y: evt.touches[0].clientY / touchArea.clientHeight,
    });

  onMount(() => {
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      });
      window.addEventListener("testPassive", null, opts);
      window.removeEventListener("testPassive", null, opts);
    } catch (e) {}

    socket = dev ? io(`http://${location.hostname}:${portDev}`) : io();

    touchArea.addEventListener(
      "touchstart",
      handler,
      supportsPassive ? { passive: true } : false
    );
    touchArea.addEventListener(
      "touchmove",
      handler,
      supportsPassive ? { passive: true } : false
    );
  });

  onCleanup(() => {
    socket.disconnect();

    touchArea.removeEventListener("touchstart", handler);
    touchArea.removeEventListener("touchmove", handler);

    socket = null;
  });

  return (
    <div className={styles.mainContainer}>
      <div>
        <article class={`card ${styles.CardMax}`} ref={touchArea}>
          <header>
            <h3 className={styles.selectNone}>Touch and drag here</h3>
          </header>
        </article>
      </div>
    </div>
  );
}

export default TouchArea;
