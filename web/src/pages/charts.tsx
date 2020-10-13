import React, { useRef, useState, useEffect } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { Box, useColorMode } from "@chakra-ui/core";
// import colors from "@chakra-ui/core/dist/theme/colors";
// import {
//   hexToRgb as rgb,
// } from "../utils/mapUtils";
// import { RGBAColor } from "@deck.gl/core/utils/color";
import { select } from 'd3'

interface ChartsProps {
  defaultColor: string;
}

const Charts: React.FC<ChartsProps> = ({ defaultColor }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  // const color = { light: "black", dark: "white" };
  // const txtBgColor = { light: "white", dark: "rgba(255,255,255,0.06)" };
  const bordColor = { light: "gray.200", dark: "rgba(255,255,255,0.04)" };

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  useEffect(() => {
    if (svgRef.current) {
      const svg = select(svgRef.current!);
      const svgWidth = width * .9;
      const svgHeight = height * .8;
      svg.attr('width', `${svgWidth}px`).attr('height', `${svgHeight}px`).style("overflow", "visible");
    }
  })

  return (
    <Layout defaultColor={defaultColor}>
      <Box>Charts</Box>
      <Box
        backgroundColor={bgColor[colorMode]}
        border="1px solid"
        borderColor={bordColor[colorMode]}
      >
        <svg ref={svgRef}></svg>
      </Box>

    </Layout>
  )
}

export default withApollo({ ssr: true })(Charts);
