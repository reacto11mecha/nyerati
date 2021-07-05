import React, {
  useRef,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {RNCamera} from 'react-native-camera';

import {UdpContext} from '../context/udp';

export default function ScanBarcode({navigation}) {
  const {init, socket} = useContext(UdpContext);
  const [remote, setRemote] = useState('0.0.0.0');
  const [nextData, setData] = useState(null);
  const camera = useRef(null);

  const onBarcode = useCallback(({barcodes}) => {
    barcodes.forEach(barcode => {
      try {
        const data = JSON.parse(barcode.data);
        const keys = Object.keys(data);

        if (!keys.includes('errorCode')) {
          if (keys.includes('connections') && keys.includes('port')) {
            const {ip} = data.connections[0]; // initial connection

            new Promise(resolve => {
              setData(data);
              setRemote(ip);

              setTimeout(resolve, 100); // Delay 100ms
            }).then(() => void init(data.port, ip));
          }
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  useEffect(() => {
    function onMessage(msg, sender) {
      if (sender.address === remote && msg.toString() === 'verified') {
        navigation.navigate('TouchArea', {
          params: nextData,
        });
      }
    }

    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
    };
  }, []);

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
