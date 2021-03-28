import { useRef, useContext, useEffect, useState } from "react";
import { Flex, Box, VStack, useColorModeValue } from "@chakra-ui/react";
import SocketContext from "../context/socket";

export default function Replay() {
  const io = useContext(SocketContext);
  const box = useRef();
  const canvas = useRef();
  const [canvasSize, setCNS] = useState({
    width: 100,
    height: 100,
  });

  const CardColor = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    io.disconnect();
    const curr = box.current;

    const update = () =>
      void setCNS((prevStates) => ({
        ...prevStates,
        width: curr.offsetWidth,
        height: curr.offsetHeight,
      }));

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <Flex width="full" height="100vh" align="center" justifyContent="center">
      <Box
        ref={box}
        p={8}
        top="50%"
        width="75%"
        height="95%"
        boxShadow="lg"
        borderWidth={1}
        borderRadius={8}
        backgroundColor={CardColor}
      >
        <VStack direction={"row"} align="stretch" spacing="60vh">
          {box.current && (
            <canvas
              width={canvasSize.width}
              height={canvasSize.height}
              ref={canvas}
            ></canvas>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}
