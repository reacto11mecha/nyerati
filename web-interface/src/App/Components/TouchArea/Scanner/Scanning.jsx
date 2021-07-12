import { onMount, onCleanup } from "solid-js";
import styles from "./Scanner.module.css";
import { useConnection } from "../../../Context/connection";

import workerURL from "qr-scanner/qr-scanner-worker.min.js?url";

import QrScanner from "qr-scanner";
QrScanner.WORKER_PATH = workerURL;

function Scanning() {
  const [, { updateConnection }] = useConnection();

  let videoElem;
  let qrScanner;

  onMount(() => {
    qrScanner = new QrScanner(videoElem, (result) => {
      try {
        const data = JSON.parse(result);
        updateConnection(data);
      } catch (e) {
        console.error("Not a valid datatype");
      }
    });

    qrScanner.start();
  });

  onCleanup(() => {
    if (qrScanner instanceof QrScanner) {
      qrScanner.destroy();
      qrScanner = null;
    }
  });

  return (
    <div className={styles.mainContainer}>
      <div>
        <article class="card">
          <header>
            <h3>Scan Barcode</h3>
          </header>
          <video ref={videoElem} />
        </article>
      </div>
    </div>
  );
}

export default Scanning;
