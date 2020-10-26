import React, { useEffect } from "react";
import { Flex, Box } from "@chakra-ui/core";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";

interface testProps {
  defaultColor: string;
}

const test: React.FC<testProps> = ({ defaultColor }) => {
  useEffect(() => {
    if (document) {
      const d = new Date();
      d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 365 * 10)
      const expires = d.toUTCString();
      document.cookie = `name=asdfghkl; expires=${expires};`
    }
  })
  return (
    <Layout defaultColor={defaultColor}>
      <Flex alignItems="center" flexDir="column">
        Test
      </Flex>
    </Layout>
  );
};

export default withApollo({ ssr: true })(test);
