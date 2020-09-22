import React from "react";
import { Link, Flex, useColorMode, Box } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { HomeButton } from "./HomeButton";
import LogoutModal from "./LogoutModal";
import MenuDrawer from "./MenuDrawer";

interface NavbarProps {
  defaultColor: string;
}

export const Navbar: React.FC<NavbarProps> = ({ defaultColor }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "white", dark: "#171923" };
  const { data } = useMeQuery({
    skip: isServer(),
  });
  let body = null;
  if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={8}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={8}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <>
        <Box mr={8}>
          <LogoutModal defaultColor={defaultColor} label={data.me.username} />
        </Box>
      </>
    );
  }
  return (
    <Flex
      direction="row"
      alignItems="center"
      position="sticky"
      top={0}
      zIndex={1}
      bg={bgColor[colorMode]}
      width="100vw"
    >
      <Box m={2}>
        <HomeButton defaultColor={defaultColor} />
      </Box>
      <Flex
        justifyContent="flex-end"
        alignItems="center"
        ml="auto"
        mr={2}
        display={["none", "flex", "flex", "flex"]}
      >
        <NextLink href="/map">
          <Link mr={8}>Map</Link>
        </NextLink>
        <NextLink href="/posts">
          <Link mr={8}>Posts</Link>
        </NextLink>
        {body}
        <DarkModeSwitch defaultColor={defaultColor} />
      </Flex>
      <Flex
        justifyContent="flex-end"
        alignItems="center"
        ml="auto"
        mr={2}
        display={["flex", "none", "none", "none"]}
      >
        <MenuDrawer defaultColor={defaultColor}>
          <Box mt={6}>
            <NextLink href="/">
              <Link>Home</Link>
            </NextLink>
          </Box>
          <Box mt={6}>
            <NextLink href="/map">
              <Link>Map</Link>
            </NextLink>
          </Box>
          <Box mt={6}>
            <NextLink href="/posts">
              <Link>Posts</Link>
            </NextLink>
          </Box>
          {!data?.me ? (
            <Box mt={6}>
              <NextLink href="/register">
                <Link>Register</Link>
              </NextLink>
            </Box>
          ) : null}
          <Box mt={10}>
            <DarkModeSwitch defaultColor={defaultColor} />
          </Box>
        </MenuDrawer>
      </Flex>
    </Flex>
  );
};

export default Navbar;
