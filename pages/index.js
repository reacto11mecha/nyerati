import { useRef, useEffect, useState, useContext } from "react";
import SocketContext from "../context/socket";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

let startTime = 0;

export default function Home() {
  const { toggleColorMode } = useColorMode();
  const [connected, setCON] = useState(null);
  const [latency, setLAT] = useState(null);
  const socket = useContext(SocketContext);
  const ref = useRef();

  const CardColor = useColorModeValue("gray.50", "gray.900");
  const bgConnected = {
    na: useColorModeValue("gray.200", "gray.600"),
    connected: useColorModeValue("green.300", "green.600"),
    disconnected: useColorModeValue("red.400", "red.800"),
  };

  useEffect(() => {
    let interval;
    const curr = ref.current;

    const pongFunc = () => setLAT(Date.now() - startTime);

    const handleTouch = (evt) => {
      socket.emit("touch", {
        x: evt.touches[0].clientX / screen.width,
        y: evt.touches[0].clientY / screen.height,
      });
    };
    const connection = () => setCON(socket.connected);

    interval = setInterval(() => {
      startTime = Date.now();
      socket.emit("check:ping");
    }, 2000);

    socket.on("check:pong", pongFunc);
    socket.on("connect", connection);
    socket.on("disconnect", connection);

    curr.addEventListener("touchstart", handleTouch, false);
    curr.addEventListener("touchmove", handleTouch, false);

    return () => {
      curr.removeEventListener("touchstart", handleTouch);
      curr.removeEventListener("touchmove", handleTouch);
      socket.off("check:pong", pongFunc);
      socket.off("connect", connection);
      socket.off("disconnect", connection);
      clearInterval(interval);
    };
  }, []);

  return (
    <Flex width="full" height="100vh" align="center" justifyContent="center">
      <Box
        p={8}
        ref={ref}
        top="50%"
        width="95%"
        height="95%"
        boxShadow="lg"
        borderWidth={1}
        borderRadius={8}
        backgroundColor={CardColor}
      >
        <VStack direction={"row"} align="stretch" spacing="60vh">
          <HStack>
            <Button onClick={toggleColorMode}>Toggle Dark Mode</Button>
            <Button
              onClick={() => ref.current && ref.current.requestFullscreen()}
            >
              Fullscreen
            </Button>
          </HStack>
          <HStack>
            <Box
              borderWidth={1}
              borderRadius={8}
              width={connected ? "6.5rem" : "7.8rem"}
              height="3rem"
              backgroundColor={
                connected === null
                  ? bgConnected.na
                  : connected
                  ? bgConnected.connected
                  : bgConnected.disconnected
              }
            >
              <Flex height="100%" justifyContent="center" align="center">
                <Text>
                  {connected === null
                    ? "N/A"
                    : connected
                    ? "CONNECTED"
                    : "DISCONNECTED"}
                </Text>
              </Flex>
            </Box>
            <Text>
              Ping: {latency === null ? "N/A" : JSON.stringify(latency)}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  );
}
