import React from "react";
import { Layout } from "../../../components/Layout";
import { Formik, Form } from "formik";
import { Box, Button, Flex } from "@chakra-ui/core";
import { InputField } from "../../../components/InputField";
import {
  useUpdatePostMutation,
  usePostQuery,
} from "../../../generated/graphql";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useRouter } from "next/router";
import { withApollo } from "../../../utils/withApollo";

interface EditPostProps {
  defaultColor: string;
}

const EditPost: React.FC<EditPostProps> = ({ defaultColor }) => {
  const router = useRouter();

  const intId = useGetIntId();
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  const [updatePost] = useUpdatePostMutation();

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
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ variables: { id: intId, ...values } });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField name="title" placeholder="title" label="title" />
            </Box>
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Box mt={4}>
              <Button
                type="submit"
                variantColor={defaultColor}
                isLoading={isSubmitting}
              >
                update post
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
