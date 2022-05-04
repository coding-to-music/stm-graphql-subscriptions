import React from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { InputField } from "../components/InputField";
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { useIsAuth } from "../utils/useIsAuth";
import { Layout } from "../components/Layout";
import { withApollo } from "../utils/withApollo";

interface CreatePostProps {
  defaultColor: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ defaultColor }) => {
  const router = useRouter();

  useIsAuth();

  const [createPost] = useCreatePostMutation();
  return (
    <Layout defaultColor={defaultColor} w="xl">
      <Box p={4}>
        <Formik
          initialValues={{ title: "", text: "" }}
          onSubmit={async (values) => {
            const { errors } = await createPost({
              variables: { input: values },
              update: (cache) => {
                cache.evict({ fieldName: "posts:{}" });
              },
            });
            if (!errors) {
              router.push("/posts");
            }
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
                  create post
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);
