import { useRef, useEffect, useState, useCallback, useMemo, memo } from "react";
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
import Ping from "./Ping";

let startTime = 0;

function TouchBox({ socket, connected }) {
  const { toggleColorMode } = useColorMode();
  const [latency, setLAT] = useState(null);
  const ref = useRef();

  const toggleFullscreen = useCallback(() => {
    const isFullscreen =
      document.webkitIsFullScreen || document.mozFullScreen || false;
    const cancelFSN =
      document.cancelFullScreen ||
      document.webkitCancelFullScreen ||
      document.mozCancelFullScreen;
    const cancelFS = cancelFSN ? cancelFSN.bind(document) : null;

    if (ref.current) {
      if (isFullscreen) {
        cancelFS();
      } else {
        ref.current.requestFullscreen();
      }
    }
  }, [ref]);

  const CardColor = useColorModeValue("gray.50", "gray.900");
  const bgConnected = {
    na: useColorModeValue("gray.200", "gray.600"),
    connected: useColorModeValue("green.300", "green.600"),
    disconnected: useColorModeValue("red.400", "red.800"),
  };

  const ping = useCallback(() => {
    startTime = Date.now();
    socket.emit("check:ping");
  }, [startTime, socket]);

  useEffect(() => {
    let interval;
    const curr = ref.current;

    ping();
    const pongFunc = () => setLAT(Date.now() - startTime);

    const handleTouch = (evt) => {
      socket.emit("touch", {
        x: evt.touches[0].clientX / screen.width,
        y: evt.touches[0].clientY / screen.height,
      });
    };

    interval = setInterval(() => {
      ping();
    }, 2000);

    socket.on("check:pong", pongFunc);

    curr.addEventListener("touchstart", handleTouch, false);
    curr.addEventListener("touchmove", handleTouch, false);

    return () => {
      curr.removeEventListener("touchstart", handleTouch);
      curr.removeEventListener("touchmove", handleTouch);
      socket.off("check:pong", pongFunc);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!connected) setLAT(null);
  }, [connected]);

  return (
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
          <Button onClick={useMemo(() => toggleColorMode)}>
            Toggle Dark Mode
          </Button>
          <Button onClick={toggleFullscreen}>Fullscreen</Button>
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
          <Ping latency={latency} />
        </HStack>
      </VStack>
    </Box>
  );
}

export default memo(
  TouchBox,
  (prevProps, nextProps) => prevProps.connected === nextProps.connected
);
