import React, {useRef, useContext, useEffect, useCallback} from 'react';
import {RNCamera} from 'react-native-camera';

import {UdpContext} from '../context/udp';

export default function ScanBarcode() {
  const {socket} = useContext(UdpContext);
  const camera = useRef(null);

  const onBarcode = useCallback(({barcodes}) => {
    barcodes.forEach(barcode => console.warn(barcode.data));
  });

  useEffect(() => {
    function onMessage(msg, sender) {
      console.warn(msg);
      console.warn(sender);
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
