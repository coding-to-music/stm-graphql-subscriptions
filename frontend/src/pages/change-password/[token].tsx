import React, { useState } from "react";
import { Formik, Form } from "formik";
import { toErrorMap } from "../../utils/toErrorMap";
import { InputField } from "../../components/InputField";
import { Box, Button, Link } from "@chakra-ui/core";
import { useRouter } from "next/router";
import {
  useChangePasswordMutation,
  MeQuery,
  MeDocument,
} from "../../generated/graphql";
import NextLink from "next/link";
import { withApollo } from "../../utils/withApollo";
import { Layout } from "../../components/Layout";

interface ChangePasswordProps {
  defaultColor: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ defaultColor }) => {
  const router = useRouter();
  const [changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <Layout defaultColor={defaultColor} w="sm">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            variables: {
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.changePassword.user,
                },
              });
            },
          });
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
            </Box>
            {tokenError ? (
              <Box>
                <Box color="red">{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>Request Password Reset</Link>
                </NextLink>
              </Box>
            ) : null}
            <Box mt={4}>
              <Button
                type="submit"
                variantColor={defaultColor}
                isLoading={isSubmitting}
              >
                Change Password
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
