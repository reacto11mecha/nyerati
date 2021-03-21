import { memo, useEffect, useState, useContext } from "react";
import SocketContext from "../context/socket";
import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Head from "next/head";

const TouchBox = dynamic(() => import("../components/TouchBox"), {
  ssr: false,
});

function Home() {
  const socket = useContext(SocketContext);
  const [connected, setCON] = useState(null);

  useEffect(() => {
    const connection = () => setCON(socket.connected);

    socket.on("connect", connection);
    socket.on("disconnect", connection);

    return () => {
      socket.off("connect", connection);
      socket.off("disconnect", connection);
    };
  }, []);

  return (
    <Flex width="full" height="100vh" align="center" justifyContent="center">
      <Head>
        <title>PEN TABLET</title>
      </Head>
      <TouchBox connected={connected} />
    </Flex>
  );
}

export default memo(Home);
