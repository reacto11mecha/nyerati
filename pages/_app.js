import { ChakraProvider, CSSReset, theme } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  const themeColor = useColorModeValue("#323234", "#f0efeb");

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <meta name="theme-color" content={themeColor} />
      </Head>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
