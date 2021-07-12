import { useConnection } from "../../../Context/connection";
import { onMount, onCleanup } from "solid-js";
import styles from "./Touch.module.css";
import { io } from "socket.io-client";

function Touch() {
  let touchArea;

  const [connection, { clearConnection }] = useConnection();
  const { port, connections } = connection();

  const { ip: initialIP } = connections.filter(
    (conn) => conn.type === "LAN"
  )[0];

  const socket = io(`http://${initialIP}${port > 0 ? `:${port}` : ""}`, {
    secure: false,
  });

  const handler = (evt) =>
    void socket.emit("touch", {
      x: evt.touches[0].clientX / touchArea.clientWidth,
      y: evt.touches[0].clientY / touchArea.clientHeight,
    });

  onMount(() => {
    touchArea.addEventListener("touchstart", handler);
    touchArea.addEventListener("touchmove", handler);
  });

  onCleanup(() => {
    touchArea.removeEventListener("touchstart", handler);
    touchArea.removeEventListener("touchmove", handler);
  });

  return (
    <div className={styles.mainContainer}>
      <div>
        <article class={`card ${styles.CardMax}`} ref={touchArea}>
          <header>
            <h3>Touch and drag here</h3>
          </header>
        </article>
      </div>
    </div>
  );
}

export default Touch;
