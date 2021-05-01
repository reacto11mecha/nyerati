import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const COORDINATE_INITIAL_STATE = {
  x: undefined,
  y: undefined,
};

let updaterTimeout;
const ffmpeg = createFFmpeg({
  log: true,
});

export default function useReplay(coordinate, canvasRef) {
  const mediaRecorder = useRef();
  const mediaChunks = useRef([]);
  const [playing, setPlaying] = useState(false);
  const [currentCoordinate, setCURRC] = useState(COORDINATE_INITIAL_STATE);

  const getEntry = useCallback((idx) => coordinate[idx]);
  const play = useCallback(() => {
    setPlaying(true);

    switch (mediaRecorder.current.state) {
      case "inactive":
        mediaRecorder.current.start();
        break;
      case "paused":
        mediaRecorder.current.resume();
        break;
      default:
        break;
    }
  });
  const pause = useCallback(() => {
    setPlaying(false);
    clearTimeout(updaterTimeout);
    mediaRecorder.current.pause();
  });
  const stop = useCallback(() => {
    setPlaying(false);
    clearTimeout(updaterTimeout);
    setCURRC(COORDINATE_INITIAL_STATE);
    mediaRecorder.current.stop();
  });
  const toggle = useCallback(() => {
    if (playing) {
      pause();
    } else {
      play();
    }
  }, [playing]);

  const processEntry = useCallback(
    (entry, index) => {
      index++;
      const nextEntry = getEntry(index);

      if (!nextEntry) {
        setTimeout(() => {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const videoStream = canvas.captureStream(30);
    mediaRecorder.current = new MediaRecorder(videoStream);

    mediaRecorder.current.ondataavailable = (e) =>
      void mediaChunks.current.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(mediaChunks.current, { type: "video/webm" });
      mediaChunks.current = [];
      const WEBMvideoURL = URL.createObjectURL(blob);

      if (!(await ffmpeg.isLoaded())) await ffmpeg.load();
      ffmpeg.FS("writeFile", "reply.webm", await fetchFile(WEBMvideoURL));
      await ffmpeg.run(
        "-fflags",
        "+genpts",
        "-i",
        "reply.webm",
        "-r",
        "24",
        "reply.mp4"
      );
      const data = ffmpeg.FS("readFile", "reply.mp4");
      const videoUrl = URL.createObjectURL(
        new Blob([data.buffer], { type: "video/mp4" })
      );

      const link = document.createElement("a");
      link.href = videoUrl;
      link.download = "replay.mp4";

      document.body.appendChild(link);

      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      document.body.removeChild(link);
      URL.revokeObjectURL(WEBMvideoURL);
      URL.revokeObjectURL(videoUrl);
    };

    return () => {
      mediaChunks.current = [];
      mediaRecorder.current = undefined;
    };
  }, []);

  return useMemo(
    () => ({
      position: currentCoordinate,
      playing,
      play,
      pause,
      stop,
      toggle,
    }),
    [currentCoordinate, playing]
  );
}
