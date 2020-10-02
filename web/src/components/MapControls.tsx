import React from "react";
import { Box, useColorMode, Button } from "@chakra-ui/core";

interface MapControlsProps {
  defaultColor: string;
}

const MapControls: React.FC<MapControlsProps> = ({ defaultColor }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };
  return (
    <Box
      style={{
        position: "absolute",
        zIndex: 10,
        top: 60,
        right: 5,
      }}
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      p={1}
    >
      <Box>Map Controls</Box>
      <Box>
        <Button variantColor={defaultColor}>Press</Button>
      </Box>
    </Box>
  );
};

export default MapControls;
