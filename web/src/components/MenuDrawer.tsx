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
  Flex,
} from "@chakra-ui/core";
import LogoutButton from "./LogoutButton";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface MenuDrawerProps {
  defaultColor: string;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({ defaultColor, children }) => {
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
        finalFocusRef={btnRef as any}
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
              <LogoutButton onClose={onClose} defaultColor={defaultColor} />
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
