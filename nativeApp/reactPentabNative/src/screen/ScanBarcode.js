import React, {useRef, useCallback} from 'react';
import {RNCamera} from 'react-native-camera';

export default function ScanBarcode() {
  const camera = useRef(null);

  const onBarcode = useCallback(({barcodes}) => {
    barcodes.forEach(barcode => console.warn(barcode.data));
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
