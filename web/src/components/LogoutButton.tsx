import React from "react";
import { Button } from "@chakra-ui/core";
import { useLogoutMutation } from "../generated/graphql";
import { useApolloClient } from "@apollo/client";
import { COOKIE_NAME } from "../../constants";

interface LogoutButtonProps {
  defaultColor: string;
  onClose: any;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  defaultColor,
  onClose,
}) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  return (
    <>
      <Button
        variantColor={defaultColor}
        onClick={async () => {
          await logout();
          await apolloClient.resetStore();
          document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
          await onClose;
        }}
        isLoading={logoutFetching}
      >
        Logout
      </Button>
    </>
  );
};

export default LogoutButton;
