import React, {createContext, useMemo, useEffect, useCallback} from 'react';
import dgram from 'react-native-udp';

export const UdpContext = createContext({udp: true});

export default function UDPProvider({children}) {
  const socket = useMemo(() => dgram.createSocket('udp4'));

  const init = useCallback(
    (remotePort, remoteHost, cb = false) =>
      socket.send(
        'init',
        undefined,
        undefined,
        remotePort,
        remoteHost,
        cb ? cb : undefined,
      ),
    [socket],
  );

  const memoizedProviderValue = useMemo(
    () => ({
      socket,
      init,
    }),
    [socket],
  );

  useEffect(() => {
    socket.bind(1234);
  }, []);

  return (
    <UdpContext.Provider value={memoizedProviderValue}>
      {children}
    </UdpContext.Provider>
  );
}
