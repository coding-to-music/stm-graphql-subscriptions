import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Flex } from "@chakra-ui/core";
import { InputField } from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";

interface LoginProps {
  defaultColor: string;
}

const Login: React.FC<LoginProps> = ({ defaultColor }) => {
  const router = useRouter();
  const [login] = useLoginMutation();
  return (
    <Layout defaultColor={defaultColor} w="sm">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: values,
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.back();
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="usernameOrEmail"
                placeholder="username or email"
                label="Username or Email"
                autoComplete="on"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
                autoComplete="on"
              />
            </Box>
            <Flex mt={4}>
              <Button
                mr={2}
                type="submit"
                variantColor={defaultColor}
                isLoading={isSubmitting}
              >
                login
              </Button>
              <NextLink href="/forgot-password">
                <Button variant="outline" variantColor={defaultColor} ml="2">
                  Forgot password?
                </Button>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(Login);
