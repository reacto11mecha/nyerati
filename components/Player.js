import {
  Flex,
  VStack,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import useReplay from "./hooks/useReplay";
import { useRef, useEffect } from "react";

export default function Player({ coord }) {
  const canvasRef = useRef();
  const { colorMode } = useColorMode();
  const { position, playing, toggle, stop } = useReplay(coord, canvasRef);

  const buttonColor = {
    play: useColorModeValue("green.300", "green.600"),
    pause: useColorModeValue("yellow.300", "yellow.700"),
  };
  const backgroundFlexColor = useColorModeValue("gray.100", "gray.800");
  const canvasColor = useColorModeValue("#F7FAFC", "#171923");
  const stopButton = useColorModeValue("red.400", "red.800");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    console.log(canvasColor);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasColor;
  }, [colorMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = position.x * canvas.width;
    const y = position.y * canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#38B2AC";
    ctx.fill();
    ctx.closePath();
  }, [position]);

  return (
    <Flex
      width="full"
      height="100vh"
      align="center"
      justifyContent="center"
      backgroundColor={backgroundFlexColor}
    >
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{
          border: `3.5px solid ${canvasColor}`,
          backgroundColor: canvasColor,
          borderRadius: "5px",
        }}
      />
      <VStack marginLeft="20px" direction={"row"} align="left">
        <Button
          onClick={toggle}
          backgroundColor={playing ? buttonColor.pause : buttonColor.play}
        >
          {playing ? "Pause" : "Play"}
        </Button>
        <Button backgroundColor={stopButton} disabled={!playing} onClick={stop}>
          Stop
        </Button>
      </VStack>
    </Flex>
  );
}
