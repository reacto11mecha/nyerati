import Player from "../components/Player";
import { Flex } from "@chakra-ui/react";
import axios from "axios";

export default function Replay({ coord }) {
  if (coord.error)
    return (
      <Flex width="full" height="100vh" align="center" justifyContent="center">
        <h1 style={{ fontSize: "2rem" }}>{coord.error}</h1>
      </Flex>
    );

  return <Player coord={coord} />;
}

export async function getServerSideProps() {
  const coord = await axios
    .get("http://localhost:3000/api/coord")
    .then((res) => res.data);

  return { props: { coord } };
}
