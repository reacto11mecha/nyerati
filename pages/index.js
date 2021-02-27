import { Flex, Button, useColorMode } from "@chakra-ui/react";

export default function Home() {
  const { toggleColorMode } = useColorMode();

  return (
    <Flex width="full" height="100vh" align="center" justifyContent="center">
      <Button onClick={toggleColorMode} right="0" top="0">
        Toggle Mode
      </Button>
    </Flex>
  );
}
