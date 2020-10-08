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
  Icon,
} from "@chakra-ui/core";

interface MapControlsProps {
  defaultColor: string;
  mapMode: string;
  handleSetMapMode: any;
  handleFlyTo: any;
  handleOrient: any;
  visibleLayers: any;
  handleSetVisibleLayers: any;
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
      <Collapse isOpen={show}>
        <Box>Map Style</Box>
        <Box>
          <RadioGroup
            onChange={handleSetMapMode}
            value={mapMode}
            variantColor={defaultColor}
          >
            <Radio
              display={["flex", "none", "none", "none"]}
              value="monochrome"
            >
              Mono
            </Radio>
            <Radio
              display={["none", "flex", "flex", "flex"]}
              value="monochrome"
            >
              Monochrome
            </Radio>
            <Radio value="streets">Streets</Radio>
            <Radio value="satellite">Satellite</Radio>
          </RadioGroup>
        </Box>
        <Box mt={2}>Transit</Box>
        <Flex direction="column" mt={1}>
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
            value="stops"
            variantColor={defaultColor}
            isChecked={visibleLayers.stops}
            onChange={handleSetVisibleLayers}
          >
            Stops
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
              size="sm"
            />
          </Box>
        </Box>
        {filteredResults && filteredResults.length >= 1 ? (
          <Box>
            <Box mt={2}>Results:</Box>
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
        <Box mt={2}>Bike Paths</Box>
        <Flex direction="column" mt={1}>
          <Checkbox
            value="bikePaths"
            variantColor={defaultColor}
            isChecked={visibleLayers.bikePaths}
            onChange={handleSetVisibleLayers}
          >
            <Flex>
              <Box>Separated</Box>
              <Box ml={2}>
                <Icon
                  name="minus"
                  size="24px"
                  color={colorMode === "dark" ? "red.400" : "red.600"}
                />
              </Box>
            </Flex>
          </Checkbox>
          <Checkbox
            value="bikePaths"
            variantColor={defaultColor}
            isChecked={visibleLayers.bikePaths}
            onChange={handleSetVisibleLayers}
          >
            <Flex>
              <Box>Shared</Box>
              <Box ml={8}>
                <Icon
                  name="minus"
                  size="24px"
                  color={colorMode === "dark" ? "gray.400" : "gray.600"}
                />
              </Box>
            </Flex>
          </Checkbox>
          <Checkbox
            value="bikePaths"
            variantColor={defaultColor}
            isChecked={visibleLayers.bikePaths}
            onChange={handleSetVisibleLayers}
          >
            <Flex>
              <Box>Multi-use</Box>
              <Box ml={4}>
                <Icon
                  name="minus"
                  size="24px"
                  color={colorMode === "dark" ? "green.400" : "green.600"}
                />
              </Box>
            </Flex>
          </Checkbox>
        </Flex>
      </Collapse>
    </Box>
  );
};

export default MapControls;
