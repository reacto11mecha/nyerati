import { createResource, createSignal, createEffect } from "solid-js";
import { useParams } from "solid-app-router";

const { DEV: dev } = import.meta.env;
const fetchFile = async (filename) =>
  (
    await fetch(
      dev
        ? `http://${
            location.hostname
          }:${portDev}/api/getFile/${filename.replace("json", "")}.json` // eslint-disable-line
        : `${location.origin}/api/getFile/${filename.replace("json", "")}.json`
    )
  ).json();

const isObject = (obj) =>
  Object.prototype.toString.call(obj) === "[object Object]";
const isArrayOfObject = (data) =>
  Array.isArray(data) && data.map(isObject).every((e) => e === true);

let updaterTimeout;
const COORDINATE_INITIAL_STATE = {
  x: undefined,
  y: undefined,
};

let currentCoordinate = COORDINATE_INITIAL_STATE;

export default function useReplay() {
  const params = useParams();
  const [file] = createResource(() => params.filename, fetchFile);

  const [state, setState] = createSignal("LOADING");

  /*
   * null => Stopped
   * false => Paused
   * true => Playing
   */
  const [playing, setPlaying] = createSignal(null);
  const [position, setPosition] = createSignal(currentCoordinate);

  const getEntry = (idx) => file()[idx];

  const play = () => setPlaying(true);
  const pause = () => setPlaying(false);
  const stop = () => {
    setPlaying(null);

    clearTimeout(updaterTimeout);
    setPosition(COORDINATE_INITIAL_STATE);
    currentCoordinate = COORDINATE_INITIAL_STATE;
  };

  const toggle = () => {
    if (playing()) {
      pause();
    } else {
      play();
    }
  };

  const processEntry = (entry, index) => {
    index++;
    const nextEntry = getEntry(index);

    if (!nextEntry) {
      setTimeout(() => {
        stop();
      }, 1500);
      return;
    }
    if (!playing()) return;

    const newPos = { x: entry.x, y: entry.y };

    currentCoordinate = newPos;
    setPosition(newPos);

    updaterTimeout = setTimeout(
      () => processEntry(nextEntry, index),
      entry.diff
    );
  };

  createEffect(() => {
    if (playing()) {
      if (
        currentCoordinate.x === undefined &&
        currentCoordinate.y === undefined
      ) {
        const data = getEntry(0);
        processEntry(data, 0);
      } else {
        const index =
          file().findIndex(
            (c) => c.x === currentCoordinate.x && c.y === currentCoordinate.y
          ) + 1;

        const data = getEntry(index);
        processEntry(data, index);
      }
    }
  });

  createEffect(() => {
    switch (true) {
      case !file(): {
        setState("LOADING");
        break;
      }

      case isObject(file()): {
        setState("ERROR");
        break;
      }

      case isArrayOfObject(file()): {
        setState("LOADED");
        break;
      }

      default: {
        setState("N/A");
        break;
      }
    }
  });

  return {
    file,
    state,
    stop,
    toggle,
    playing,
    position,
  };
}
