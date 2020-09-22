import React from "react";
import { Layout } from "../../components/Layout";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";
import { Flex, Heading, Box } from "@chakra-ui/core";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { withApollo } from "../../utils/withApollo";

interface PostProps {
  defaultColor: string;
}

const Post: React.FC<PostProps> = ({ defaultColor }) => {
  const { data, loading } = useGetPostFromUrl();

  if (loading) {
    return <Layout defaultColor={defaultColor}>loading...</Layout>;
  }

  if (!data?.post) {
    return (
      <Layout defaultColor={defaultColor}>
        <Flex justifyContent="center" mt={40}>
          that doesn't seem to be here.
        </Flex>
      </Layout>
    );
  }

  return (
    <Layout defaultColor={defaultColor} w="xl">
      <Flex>
        <Box>
          <Heading mb={4}>{data.post.title}</Heading>
        </Box>
        <Box ml="auto">
          <EditDeletePostButtons
            id={data.post.id}
            creatorId={data.post.creator.id}
          />
        </Box>
      </Flex>
      <Box>{data.post.text}</Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
