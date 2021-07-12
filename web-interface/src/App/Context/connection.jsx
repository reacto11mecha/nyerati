import { createSignal, createContext, useContext } from "solid-js";

const ConnectionContext = createContext();

export default function Provider(props) {
  const [connection, setConnection] = createSignal({ hasRemote: false });

  const store = [
    connection,
    {
      updateConnection: (data) =>
        void setConnection({ hasRemote: true, ...data }),
      clearConnection: () =>
        void setConnection({
          hasRemote: false,
        }),
    },
  ];

  return (
    <ConnectionContext.Provider value={store}>
      {props.children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}
