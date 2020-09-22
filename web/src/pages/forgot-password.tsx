import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { InputField } from "../components/InputField";
import { useForgotPasswordMutation } from "../generated/graphql";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";

interface ForgotPasswordProps {
  defaultColor: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ defaultColor }) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <Layout defaultColor={defaultColor} w="lg">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ variables: values });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box justifyContent="center" mt={20}>
              <Box maxW={600} px={4}>
                If an account with that email exists, you will receive an email.
                <Box mt={20}>
                  <NextLink href="/">
                    <Button variant="outline" variantColor={defaultColor}>
                      Home
                    </Button>
                  </NextLink>
                </Box>
              </Box>
            </Box>
          ) : (
            <Form>
              <Box mt={4}>
                <InputField name="email" placeholder="email" label="Email" />
              </Box>
              <Box mt={4}>
                <Button
                  type="submit"
                  variantColor={defaultColor}
                  isLoading={isSubmitting}
                >
                  forgot password
                </Button>
              </Box>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
