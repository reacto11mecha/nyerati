import { Show, createSignal, createMemo } from "solid-js";
import { useConnection } from "../../Context/connection";

import Scanner from "./Scanner";
import Touch from "./Touch";

function TouchArea() {
  const [connection] = useConnection();

  return (
    <Show when={connection().hasRemote} fallback={<Scanner />}>
      <Touch />
    </Show>
  );
}

export default TouchArea;
