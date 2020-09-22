import { Flex, Heading } from "@chakra-ui/core";

interface HeroProps {
  title: string;
  defaultColor: string;
}

export const Hero: React.FC<HeroProps> = ({ title, defaultColor }) => (
  <Flex justifyContent="center" alignItems="center" height="100vh">
    <Heading fontSize="10vw">{title}</Heading>
  </Flex>
);

Hero.defaultProps = {
  title: "look ma, no hands.",
};
