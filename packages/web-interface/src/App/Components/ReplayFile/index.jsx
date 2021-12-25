import { createResource, createEffect } from "solid-js";
import { useParams } from "solid-app-router";

const { DEV: dev } = import.meta.env;

const fetchFile = async (filename) =>
  (
    await fetch(
      dev
        ? `http://${
            location.hostname
          }:${portDev}/api/getFile/${filename.replace("json", "")}.json`
        : `${location.origin}/api/getFile/${filename.replace("json", "")}.json`
    )
  ).json();

export default function ReplayFile() {
  const params = useParams();
  const [file] = createResource(() => params.filename, fetchFile);

  createEffect(() => {
    console.log(file());
  });

  return <p>Filename</p>;
}
