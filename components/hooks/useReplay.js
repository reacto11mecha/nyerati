import { useState, useEffect, useCallback } from "react";

const COORDINATE_INITIAL_STATE = {
  x: undefined,
  y: undefined,
};

let updaterTimeout;

export default function useReplay(coordinate) {
  const [playing, setPlaying] = useState(false);
  const [currentCoordinate, setCURRC] = useState(COORDINATE_INITIAL_STATE);

  const getEntry = useCallback((idx) => coordinate[idx]);
  const start = useCallback(() => setPlaying(true));
  const stop = useCallback(() => {
    setPlaying(false);
    clearTimeout(updaterTimeout);
  });
  const toggle = useCallback(() => {
    if (playing) {
      stop();
    } else {
      start();
    }
  }, [playing]);

  const processEntry = useCallback(
    (entry, index) => {
      index++;
      const nextEntry = getEntry(index);

      if (!nextEntry) {
        setTimeout(() => {
          setCURRC(COORDINATE_INITIAL_STATE);
          stop();
        }, 1500);
        return;
      }
      if (!playing) return;

      setCURRC({ x: entry.x, y: entry.y });
      updaterTimeout = setTimeout(processEntry, entry.diff, nextEntry, index);
    },
    [playing]
  );

  useEffect(() => {
    if (playing) {
      if (
        currentCoordinate.x === undefined &&
        currentCoordinate.y === undefined
      ) {
        const data = getEntry(0);
        processEntry(data, 0);
      } else {
        const index =
          coordinate.findIndex(
            (c) => c.x === currentCoordinate.x && c.y === currentCoordinate.y
          ) + 1;

        const data = getEntry(index);
        processEntry(data, index);
      }
    }
  }, [playing]);

  return { position: currentCoordinate, playing, start, stop, toggle };
}
