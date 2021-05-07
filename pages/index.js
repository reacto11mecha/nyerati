import { memo, useEffect, useState } from "react";
import SocketContext from "../context/socket";
import { Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Head from "next/head";

const TouchBox = dynamic(() => import("../components/TouchBox"), {
  ssr: false,
});

const Home = () => (
  <Flex width="full" height="100vh" align="center" justifyContent="center">
    <style jsx global>{`
      * {
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `}</style>
    <Head>
      <title>PEN TABLET</title>
    </Head>
    <SocketContext.Consumer>
      {(socket) => <TouchBoxContainer socket={socket} />}
    </SocketContext.Consumer>
  </Flex>
);

function TouchBoxContainer({ socket }) {
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
  return <TouchBox socket={socket} connected={connected} />;
}

export default memo(Home);
