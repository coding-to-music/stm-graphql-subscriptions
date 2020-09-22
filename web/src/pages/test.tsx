import React from "react";
import { Flex } from "@chakra-ui/core";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";

interface testProps {
  defaultColor: string;
}

const test: React.FC<testProps> = ({ defaultColor }) => {
  return (
    <Layout defaultColor={defaultColor}>
      <Flex alignItems="center">test</Flex>
    </Layout>
  );
};

export default withApollo({ ssr: true })(test);
