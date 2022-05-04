import { useColorMode, Switch, Flex, Icon } from "@chakra-ui/core";

interface DarkModeSwitchProps {
  defaultColor: string;
}

export const DarkModeSwitch: React.FC<DarkModeSwitchProps> = ({
  defaultColor,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const handleToggleDarkMode = () => {
    toggleColorMode();
    document.cookie = `isDarkMode=${colorMode === "light"}`;
  };
  return (
    <Flex>
      <Icon
        mr={2}
        mt={1}
        name="moon"
        size="14px"
        opacity={colorMode !== "dark" ? 0.3 : 1}
      />
      <Switch
        size="md"
        isChecked={colorMode === "light"}
        onChange={() => handleToggleDarkMode()}
        color={colorMode === "light" ? defaultColor : "grey"}
      />
      <Icon
        ml={2}
        mt={1}
        name="sun"
        size="14px"
        opacity={colorMode !== "dark" ? 0.3 : 1}
      />
    </Flex>
  );
};
