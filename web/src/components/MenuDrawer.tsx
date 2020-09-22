import React from "react";
import {
  Avatar,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Box,
  Flex,
} from "@chakra-ui/core";
import { useLogoutMutation } from "../generated/graphql";
import { useApolloClient } from "@apollo/client";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface MenuDrawerProps {
  defaultColor: string;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ defaultColor, children }) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data } = useMeQuery({
    skip: isServer(),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <>
      <Button ref={btnRef} variantColor={defaultColor} onClick={onOpen}>
        Menu
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.me ? (
              <Flex alignItems="center">
                <Avatar name={data.me.username} mr={3} />
                {data.me.username}
              </Flex>
            ) : (
              "Menu"
            )}
          </DrawerHeader>

          <DrawerBody>{children}</DrawerBody>

          <DrawerFooter mb={20}>
            {data?.me ? (
              <Button
                mr={3}
                variantColor={defaultColor}
                onClick={async () => {
                  await logout();
                  await apolloClient.resetStore();
                  await onClose();
                }}
                isLoading={logoutFetching}
              >
                Logout
              </Button>
            ) : (
              <NextLink href="/login">
                <Button mr={3} variant="outline" variantColor={defaultColor}>
                  Login
                </Button>
              </NextLink>
            )}
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MenuDrawer;
