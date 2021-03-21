import { memo } from "react";
import { Text } from "@chakra-ui/react";

const Ping = ({ latency }) => (
  <Text>Ping: {latency === null ? "N/A" : JSON.stringify(latency)}</Text>
);

export default memo(
  Ping,
  (prevProps, nextProps) => prevProps.latency === nextProps.latency
);
