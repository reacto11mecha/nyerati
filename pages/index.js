import { useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { Flex, Box, HStack, Button, useColorMode } from "@chakra-ui/react";

const socket = io();

export default function Home() {
  const { toggleColorMode } = useColorMode();
  const ref = useRef();

  useEffect(() => {
    const curr = ref.current;

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

    curr.addEventListener("touchstart", handleTouchStart, false);
    curr.addEventListener("touchmove", handleTouchMove, false);

    return () => {
      curr.removeEventListener("touchstart", handleTouchStart);
      curr.removeEventListener("touchmove", handleTouchMove);
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
        backgroundColor="#fff"
      >
        <HStack>
          <Button onClick={toggleColorMode}>Toggle Dark Mode</Button>
          <Button
            onClick={() => ref.current && ref.current.requestFullscreen()}
          >
            Fullscreen
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
}
