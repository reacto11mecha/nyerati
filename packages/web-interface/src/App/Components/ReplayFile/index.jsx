import { createSignal, createEffect, Switch, Match } from "solid-js";

import styles from "./ReplayFile.module.css";
import useReplay from "../../Hook/useReplay";
import useColorModeValue from "../../Hook/useColorModeValue";

export default function ReplayFile() {
  const stopButton = useColorModeValue("#F56565", "#822727");
  const buttonColor = {
    play: useColorModeValue("#68D391", "#2F855A"),
    pause: useColorModeValue("#F6E05E", "#975A16"),
  };
  const [controlBtnColor, setControlBtnColor] = createSignal(
    buttonColor.play()
  );

  const { file, state, playing, position, stop, toggle } = useReplay();

  let canvas;

  createEffect(() => {
    const pos = position();

    if (canvas) {
      const ctx = canvas.getContext("2d");

      const x = pos.x * canvas.width;
      const y = pos.y * canvas.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#38B2AC";
      ctx.fill();
      ctx.closePath();
    }
  });

  createEffect(() => {
    if (playing()) {
      setControlBtnColor(buttonColor.pause());
    } else {
      setControlBtnColor(buttonColor.play());
    }
  });

  return (
    <div className={styles.mainContainer}>
      <div>
        <article className={`card ${styles.CardMax}`}>
          <Switch fallback={"N/A"}>
            <Match when={state() === "LOADING"}>
              <p className={styles.centered}>Loading...</p>
            </Match>
            <Match when={state() === "ERROR"}>
              <h3 className={styles.centered}>{file().message}</h3>
            </Match>
            <Match when={state() === "LOADED"}>
              <div className={styles.topSpace}>
                <canvas ref={canvas}></canvas>
              </div>
              <div className={styles.bottomSpace}>
                <button
                  style={`background-color: ${controlBtnColor()}`}
                  onClick={toggle}
                >
                  {playing() ? "Pause" : "Play"}
                </button>
                <button
                  className={styles.marLeft}
                  style={`background-color: ${stopButton()}`}
                  disabled={!playing()}
                  onClick={stop}
                >
                  Stop
                </button>
                <div
                  className={`button ${styles.marLeft} ${styles.statusInfo}`}
                >
                  Status:{" "}
                  <Switch fallback={"N/A"}>
                    <Match when={playing() === null}>Stopped</Match>
                    <Match when={playing()}>Playing</Match>
                    <Match when={!playing()}>Paused</Match>
                  </Switch>
                </div>
              </div>
            </Match>
          </Switch>
        </article>
      </div>
    </div>
  );
}
