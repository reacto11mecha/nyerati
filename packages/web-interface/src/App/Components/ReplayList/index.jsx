import { createSignal, onMount } from "solid-js";

const serverPath = import.meta.env.DEV
  ? "http://localhost:3000"
  : location.origin;

export default function ReplayList() {
  onMount(() => {
    fetch(`${serverPath}/api/lists`)
      .then((res) => res.json())
      .then(console.log);
  });

  return <p>Replay List</p>;
}
