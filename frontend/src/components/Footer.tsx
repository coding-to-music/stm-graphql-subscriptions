import { Flex } from "@chakra-ui/core";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = (props) => (
  <Flex as="footer" py="8rem" {...props} />
);
