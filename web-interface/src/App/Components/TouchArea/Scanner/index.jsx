import { useConnection } from "../../../Context/connection";
import styles from "./Scanner.module.css";
import { Show, createSignal, Suspense } from "solid-js";

import Scanning from "./Scanning";

const NotScanning = ({ update }) => (
  <div className={styles.mainContainer}>
    <div>
      <button onClick={update}>Scan Barcode</button>
    </div>
  </div>
);

function Scanner() {
  const [connection, { updateConnection }] = useConnection();
  const [scanMode, setScanMode] = createSignal(false);

  const update = () => setScanMode((prev) => !prev);

  return (
    <Show when={scanMode()} fallback={<NotScanning update={update} />}>
      <Scanning />
    </Show>
  );
}

export default Scanner;
