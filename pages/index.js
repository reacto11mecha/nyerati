import { useRef, useEffect, useState, useContext } from "react";
import SocketContext from "../context/socket";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

let startTime = 0;

export default function Home() {
  const { toggleColorMode } = useColorMode();
  const socket = useContext(SocketContext);
  const [latency, setLAT] = useState();
  const ref = useRef();

  const CardColor = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    let interval;
    const curr = ref.current;

    const pongFunc = () => setLAT(Date.now() - startTime);

    const handleTouchStart = (evt) => {
      const x = evt.touches[0].clientX;
      const y = evt.touches[0].clientY;

      const position = {
        x,
        y,
      };

      socket.emit("touchstart", position);
    };
    const handleTouchMove = (evt) => {
      const x = evt.touches[0].clientX;
      const y = evt.touches[0].clientY;

      const position = {
        x,
        y,
      };

      socket.emit("touchmove", position);
    };

    interval = setInterval(() => {
      startTime = Date.now();
      socket.emit("check:ping");
    }, 2000);

    socket.on("check:pong", pongFunc);

    curr.addEventListener("touchstart", handleTouchStart, false);
    curr.addEventListener("touchmove", handleTouchMove, false);

    return () => {
      curr.removeEventListener("touchstart", handleTouchStart);
      curr.removeEventListener("touchmove", handleTouchMove);
      socket.off('check:pong', pongFunc)
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
        <VStack direction={"row"} align="stretch" spacing="65vh">
          <HStack>
            <Button onClick={toggleColorMode}>Toggle Dark Mode</Button>
            <Button
              onClick={() => ref.current && ref.current.requestFullscreen()}
            >
              Fullscreen
            </Button>
          </HStack>
          <HStack>
            <p>Ping: {JSON.stringify(latency)}</p>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  );
}
