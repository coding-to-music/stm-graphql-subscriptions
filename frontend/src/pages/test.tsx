import React, { useEffect } from "react";
import { Flex, Box, Spinner, useColorMode } from "@chakra-ui/core";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";

interface testProps {
  defaultColor: string;
}

const test: React.FC<testProps> = ({ defaultColor }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "white", dark: "gray.800" };
  useEffect(() => {
    if (document) {
      const d = new Date();
      d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
      const expires = d.toUTCString();
      document.cookie = `name=asdfghkl; expires=${expires};`;
    }
  });
  return (
    <Layout defaultColor={defaultColor}>
      <Flex alignItems="center" flexDir="column">
        <Box>
          <Spinner
            thickness="4px"
            speed="1s"
            emptyColor={bgColor[colorMode]}
            color="red.500"
            size="xl"
          />
        </Box>
        <Box></Box>
      </Flex>
    </Layout>
  );
};

export default withApollo({ ssr: true })(test);
