import { Button } from "@chakra-ui/core";
import NextLink from "next/link";

import { Container } from "./Container";

interface CTAProps {
  defaultColor: string;
}

export const CTA: React.FC<CTAProps> = ({ defaultColor }) => {
  return (
    <Container
      flexDirection="row"
      position="fixed"
      bottom="0"
      width="100%"
      maxWidth="48rem"
      py={2}
    >
      <NextLink href="https://anselbrandt.com">
        <Button
          width="100%"
          variant="outline"
          variantColor={defaultColor}
          flexGrow={1}
          mx={2}
        >
          contact
        </Button>
      </NextLink>

      <NextLink href="https://github.com/anselbrandt/hacker-news-clone">
        <Button
          width="100%"
          variant="solid"
          variantColor={defaultColor}
          flexGrow={3}
          mx={2}
        >
          view code
        </Button>
      </NextLink>
    </Container>
  );
};
