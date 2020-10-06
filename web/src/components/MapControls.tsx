import React, { useState } from "react";
import {
  Box,
  useColorMode,
  Radio,
  RadioGroup,
  IconButton,
  Flex,
  Text,
  Collapse,
  Checkbox,
  Input,
} from "@chakra-ui/core";

interface MapControlsProps {
  defaultColor: string;
  mapMode: string;
  handleSetMapMode: any;
  handleFlyTo: any;
  handleOrient: any;
  visibleLayers: any;
  handleSetVisibleLayers: any;
  filter: string;
  handleSetFilter: any;
  filteredResults: any;
}

const MapControls: React.FC<MapControlsProps> = ({
  defaultColor,
  mapMode,
  handleSetMapMode,
  handleFlyTo,
  handleOrient,
  visibleLayers,
  handleSetVisibleLayers,
  handleSetFilter,
  filteredResults,
}) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const txtBgColor = { light: "white", dark: "rgba(255,255,255,0.06)" };
  const txtBordColor = { light: "gray.200", dark: "rgba(255,255,255,0.04)" };
  const color = { light: "black", dark: "white" };
  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

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
      borderWidth="2px"
      rounded="lg"
    >
      <Box p={1}>Map Style</Box>
      <Box p={1}>
        <RadioGroup onChange={handleSetMapMode} value={mapMode}>
          <Radio display={["flex", "none", "none", "none"]} value="monochrome">
            Mono
          </Radio>
          <Radio display={["none", "flex", "flex", "flex"]} value="monochrome">
            Monochrome
          </Radio>
          <Radio value="streets">Streets</Radio>
          <Radio value="satellite">Satellite</Radio>
        </RadioGroup>
      </Box>
      <Flex p={1}>
        <Box p={1}>
          <IconButton
            aria-label="reset zoom"
            icon="search"
            onClick={() => handleFlyTo()}
            variantColor={defaultColor}
          />
        </Box>
        <Box p={1}>
          <IconButton
            aria-label="orientation"
            icon="repeat"
            onClick={() => handleOrient()}
            variantColor={defaultColor}
          />
        </Box>
      </Flex>
      <Flex>
        <Box p={1}>
          <Text>Reset</Text>
        </Box>
        <Box p={1}>
          <Text>Rotate</Text>
        </Box>
      </Flex>
      <Flex justifyContent="flex-end" alignItems="center">
        <Box>{!show ? "More" : "Hide"}</Box>
        <IconButton
          aria-label={!show ? "more" : "hide"}
          icon={!show ? "triangle-down" : "triangle-up"}
          variant="link"
          variantColor={defaultColor}
          onClick={handleToggle}
        />
      </Flex>
      <Collapse mt={1} isOpen={show}>
        <Box>Layers</Box>
        <Flex direction="column">
          <Checkbox
            value="vehicles"
            variantColor={defaultColor}
            isChecked={visibleLayers.vehicles}
            onChange={handleSetVisibleLayers}
          >
            Vehicles
          </Checkbox>
          <Checkbox
            value="paths"
            variantColor={defaultColor}
            isChecked={visibleLayers.paths}
            onChange={handleSetVisibleLayers}
          >
            Paths
          </Checkbox>
          <Checkbox
            value="routes"
            variantColor={defaultColor}
            isChecked={visibleLayers.routes}
            onChange={handleSetVisibleLayers}
          >
            Routes
          </Checkbox>
        </Flex>
        <Box>
          <Box mt={2}>Filter Routes</Box>
          <Box m={2}>
            <Input
              onChange={handleSetFilter}
              placeholder="24, 55, 80"
              size="md"
            />
          </Box>
        </Box>
        {filteredResults && filteredResults.length >= 1 ? (
          <Box>
            <Box mt={2}>Results</Box>
            <Box
              m={2}
              p={1}
              backgroundColor={txtBgColor[colorMode]}
              border="1px solid"
              borderColor={txtBordColor[colorMode]}
              borderRadius="0.5rem"
            >
              {filteredResults
                ? filteredResults.map((value) => (
                    <Box key={value.properties.shape_id}>
                      <Text>
                        {value.properties.headsign}{" "}
                        {value.properties.route_name}
                      </Text>
                    </Box>
                  ))
                : null}
            </Box>
          </Box>
        ) : null}
      </Collapse>
    </Box>
  );
};

export default MapControls;
