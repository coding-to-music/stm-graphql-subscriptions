import React from "react";
import Navbar from "./Navbar";
import { Flex, Box } from "@chakra-ui/core";

interface LayoutProps {
  defaultColor: string;
  w?:
    | string
    | number
    | (string | number | null)[]
    | {
        [key: string]: React.ReactText;
      }
    | undefined;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  defaultColor,
  w,
}) => {
  return (
    <>
      <Navbar defaultColor={defaultColor} />
      <Flex justifyContent="center">
        <Box w={w ? w : "800"} p={2}>
          {children}
        </Box>
      </Flex>
    </>
  );
};
