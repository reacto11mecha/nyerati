import React, {
  useRef,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {RNCamera} from 'react-native-camera';

import {UdpContext} from '../context/udp';

export default function ScanBarcode() {
  const {init, socket} = useContext(UdpContext);
  const [remote, setRemote] = useState('0.0.0.0');
  const camera = useRef(null);

  const onBarcode = useCallback(({barcodes}) => {
    barcodes.forEach(barcode => {
      try {
        const data = JSON.parse(barcode.data);
        const keys = Object.keys(data);

        if (!keys.includes('errorCode')) {
          if (keys.includes('connections') && keys.includes('port')) {
            const {ip} = data.connections[0]; // initial connection

            init(data.port, ip);
            setRemote(ip);
          }
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  useEffect(() => {
    function onMessage(msg, sender) {
      if (sender.address === remote) {
        // navigate to other screen
      }
    }

    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
    };
  });

  return (
    <RNCamera
      ref={camera}
      captureAudio={false}
      onGoogleVisionBarcodesDetected={onBarcode}
      style={{
        flex: 1,
        width: '100%',
      }}
    />
  );
}
