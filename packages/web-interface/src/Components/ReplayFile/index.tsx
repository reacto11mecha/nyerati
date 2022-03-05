import { createSignal, createEffect, Switch, Match, onCleanup } from "solid-js";
import Konva from "konva";

import styles from "./ReplayFile.module.css";

import useReplay, { invalidDownload } from "@/Hook/useReplay";
import useColorModeValue from "@/Hook/useColorModeValue";

import { Stage } from "konva/lib/Stage";
import { Group } from "konva/lib/Group";
import { Shape, ShapeConfig } from "konva/lib/Shape";

export default function ReplayFile() {
  const stopButton = useColorModeValue("#F56565", "#822727");
  const buttonColor = {
    play: useColorModeValue("#68D391", "#2F855A"),
    pause: useColorModeValue("#F6E05E", "#975A16"),
  };
  const [controlBtnColor, setControlBtnColor] = createSignal(
    buttonColor.play()
  );

  const strokeCircle = useColorModeValue("black", "#171923");
  const fillCircle = useColorModeValue("#4FD1C5", "#38B2AC");

  const {
    file,
    state,
    playing,
    position,
    duration,
    isPositionExist,
    stop,
    toggle,
  } = useReplay();

  let container: HTMLDivElement;
  let stage: Stage;
  let circle: Group | Shape<ShapeConfig>;

  const updateStage = () => {
    if (stage) {
      stage.width(container.clientWidth);
      stage.height(container.clientHeight);

      if (!playing() && !isPositionExist()) {
        circle.x(container.clientWidth / 2);
        circle.y(container.clientHeight / 2);
      }
    }
  };

  createEffect(() => {
    const pos = position();

    if (pos.x !== undefined && pos.y !== undefined && container && circle) {
      stage.width(container.clientWidth);
      stage.height(container.clientHeight);

      circle.x(pos.x * stage.width());
      circle.y(pos.y * stage.height());
    }
  });

  createEffect(() => {
    if (playing()) {
      setControlBtnColor(buttonColor.pause());
    } else {
      setControlBtnColor(buttonColor.play());
    }
  });

  createEffect(() => {
    if (!isPositionExist() && container && circle) {
      stage.width(container.clientWidth);
      stage.height(container.clientHeight);

      circle.x(container.clientWidth / 2);
      circle.y(container.clientHeight / 2);
    }
  });

  createEffect(() => {
    // One time event, so it's ok to put it on createEffect
    if (state() === "LOADED") {
      stage = new Konva.Stage({
        container,
        width: container.clientWidth,
        height: container.clientHeight,
      });

      const layer = new Konva.Layer();

      circle = new Konva.Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 20,
        fill: fillCircle(),
        stroke: strokeCircle(),
        strokeWidth: 1.5,
      });

      layer.add(circle);
      stage.add(layer);

      window.addEventListener("resize", updateStage);
    }
  });

  onCleanup(() => {
    stop();

    if (container) {
      window.removeEventListener("resize", updateStage);
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
              <h3 className={styles.centered}>
                {(file() as invalidDownload).message}
              </h3>
            </Match>
            <Match when={state() === "LOADED"}>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <div ref={container} className={styles.topSpace}></div>
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
                  disabled={!isPositionExist()}
                  onClick={stop}
                >
                  Stop
                </button>
                <div
                  className={`button warning ${styles.marLeft} ${styles.statusInfo}`}
                >
                  Duration: {duration()}
                </div>
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
