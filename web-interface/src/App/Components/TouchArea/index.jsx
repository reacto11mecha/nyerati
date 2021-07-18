import { onMount, onCleanup } from "solid-js";
import styles from "./TouchArea.module.css";
import { io } from "socket.io-client";

const { DEV: dev } = import.meta.env;
const path = dev ? `http://localhost:${portDev}` : "";

function TouchArea() {
  let touchArea;
  let socket;

  const handler = (evt) =>
    void socket.emit("touch", {
      x: evt.touches[0].clientX / touchArea.clientWidth,
      y: evt.touches[0].clientY / touchArea.clientHeight,
    });

  onMount(() => {
    socket = io(path);

    touchArea.addEventListener("touchstart", handler);
    touchArea.addEventListener("touchmove", handler);
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
