import React from "react";
import { Button, Heading, Box } from "@chakra-ui/core";
import NextLink from "next/link";

interface HomeButtonProps {
  defaultColor: string;
}

export const HomeButton: React.FC<HomeButtonProps> = ({ defaultColor }) => {
  return (
    <Box>
      <NextLink href="/">
        <Button variant="outline" variantColor={defaultColor}>
          <Heading size="xl">ab</Heading>
        </Button>
      </NextLink>
    </Box>
  );
};
