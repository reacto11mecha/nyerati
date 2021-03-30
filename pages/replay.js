import useReplay from "../components/hooks/useReplay";
import { useRef, useEffect } from "react";
import { Flex, Button } from "@chakra-ui/react";
import axios from "axios";

export default function Replay({ coord }) {
  const canvasRef = useRef();
  const { position, playing, toggle } = useReplay(coord);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const x = position.x * canvas.width;
    const y = position.y * canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#171923";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#38B2AC";
    ctx.fill();
    ctx.closePath();
  }, [position]);

  return (
    <Flex width="full" height="100vh" align="center" justifyContent="center">
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{
          border: "3.5px solid #171923",
          backgroundColor: "#171923",
          borderRadius: "5px",
        }}
      />
      <Button onClick={toggle} marginLeft="20px">
        {playing ? "Stop" : "Play"}
      </Button>
    </Flex>
  );
}

export async function getServerSideProps() {
  const coord = await axios
    .get("http://localhost:3000/api/coord")
    .then((res) => res.data);

  return { props: { coord } };
}
