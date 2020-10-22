import React from "react";
import { Flex, Box } from "@chakra-ui/core";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";

interface testProps {
  defaultColor: string;
}

const test: React.FC<testProps> = ({ defaultColor }) => {
  return (
    <Layout defaultColor={defaultColor}>
      <Flex alignItems="center" flexDir="column">
        Test
      </Flex>
    </Layout>
  );
};

export default withApollo({ ssr: true })(test);
