import React, { useRef, useState, useEffect } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { Box, Link, Icon, useColorMode } from "@chakra-ui/core";
import colors from "@chakra-ui/core/dist/theme/colors";
// import {
//   hexToRgb as rgb,
// } from "../utils/mapUtils";
// import { RGBAColor } from "@deck.gl/core/utils/color";
import {
    select,
    line,
    axisBottom,
    axisLeft,
    scaleLinear,
    csvParse,
    max,
    extent,
    pointer,
    bisectCenter,
    least,
    format,
} from "d3";
import { useGetViewport } from "../utils/useGetViewport";

interface Data {
    dates: [];
    series: [];
    y: string
}

interface HoverInfo {
    text: string;
    x: number;
    y: number;
}

interface ChartsProps {
    defaultColor: string;
}

const Charts: React.FC<ChartsProps> = ({ defaultColor }) => {
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.50", dark: "gray.900" };
    const color = { light: "black", dark: "white" };
    // const txtBgColor = { light: "white", dark: "rgba(255,255,255,0.06)" };
    const bordColor = { light: "gray.200", dark: "rgba(255,255,255,0.04)" };
    const chartColor = { light: colors.purple[200], dark: colors.purple[600] };
    const highlightColor = { light: colors.purple[600], dark: colors.purple[300] }
    const muteColor = { light: colors.purple[100], dark: colors.purple[900] }

    const linkColor = { light: 'purple.500', dark: 'purple.200' }

    const { width: viewportWidth, height: viewportHeight } = useGetViewport();
    const width = viewportWidth * 0.8;
    const height = viewportHeight * 0.8;
    const [rawData, setRawData] = useState<string | undefined>();
    const [data, setData] = useState<Data | undefined>();
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | undefined>()

    useEffect(() => {
        fetch("./giniIndex.csv")
            .then((response) => response.text())
            .then((data) => setRawData(data));
    });

    useEffect(() => {
        if (rawData) {
            const parsed = csvParse(rawData!);
            const columns = parsed.columns.slice(1);
            const formatted = parsed.map((entry: any) => {
                return {
                    name: entry.country!,
                    values: columns.map((k: any) => +entry[k]!),
                };
            });
            console.log(formatted)
            const dates = columns.map((d: any) => +d);
            const dataObject = {
                y: "Gini index",
                series: formatted,
                dates: dates,
            };
            // // console.log(dataObject.series[0].values);
            setData(dataObject);
        }
    }, [rawData]);

    useEffect(() => {
        const margin = { top: 20, right: 20, bottom: 30, left: 30 };
        const svg = select(svgRef.current);
        svg.selectAll("g").remove();
        svg.attr("width", `${width}px`).attr("height", `${height}px`);
        if (data) {
            const x = scaleLinear()
                .domain(extent(data.dates))
                .range([margin.left, width - margin.right]);

            const y = scaleLinear()
                .domain([0, max(data.series, (d: any) => max(d.values))])
                .nice()
                .range([height - margin.bottom, margin.top]);

            const xAxis = (g: any) =>
                g.attr("transform", `translate(0,${height - margin.bottom})`).call(
                    axisBottom(x)
                        .ticks(width / 80)
                        .tickFormat(format("d"))
                        .tickSizeOuter(0)
                );

            const yAxis = (g: any) =>
                g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(axisLeft(y))
                    .call((g: any) => g.select(".domain").remove())
                    .call((g: any) =>
                        g
                            .select(".tick:last-of-type text")
                            .clone()
                            .attr("x", 3)
                            .attr("text-anchor", "start")
                            .attr("font-weight", "bold")
                            .text(data.y)
                    );

            const dot = svg.append("g").attr("display", "none");

            dot.append("circle").attr("r", 3);

            dot
                .append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .attr("y", -8);

            const entered = () => {
                svg
                    .selectAll(".line")
                    .style("mix-blend-mode", null)
                    .attr("stroke", muteColor[colorMode]);
                dot.attr("display", 'visible');
            };

            const left = () => {
                svg
                    .selectAll(".line")
                    .style("mix-blend-mode", colorMode === 'dark' ? "screen" : "multiply")
                    .attr("stroke", chartColor[colorMode]);
                dot.attr("display", "none");
                setHoverInfo(undefined)
            };

            // xm: date, ym: giniIndex, i: index, s: data object
            const moved = (event: any) => {
                event.preventDefault();
                const cursorPosition = pointer(event, this);
                const xm = x.invert(cursorPosition[0]);
                const ym = y.invert(cursorPosition[1]);
                const i = bisectCenter(data.dates, xm);
                const s = least(data.series, (d: any) => Math.abs(d.values[i] - ym));

                svg
                    .selectAll(".line")
                    .attr("stroke", (d: any) => (d === s ? highlightColor[colorMode] : muteColor[colorMode]))
                    .filter((d: any) => d === s)
                    .raise();
                dot.attr(
                    "transform",
                    `translate(${x(data.dates[i])},${y(s.values[i])})`
                ).attr("fill", highlightColor[colorMode]);
                dot.select("text").style('fill', color[colorMode])
                // .text(s.name);
                setHoverInfo({
                    text: s.name,
                    x: x(data.dates[i]) + margin.left + margin.right,
                    y: y(s.values[i]) + margin.top + margin.bottom
                })
            };

            const rect = (g: any) =>
                g
                    .append("rect")
                    .attr("fill", "transparent")
                    .attr("width", width)
                    .attr("height", height)
                    .on("mousemove", moved)
                    .on("mouseenter", entered)
                    .on("mouseleave", left);

            svg.append("g").call(xAxis);
            svg.append("g").call(yAxis);
            svg.append("g").call(rect);

            const getLine = line()
                .x((_: any, i: any) => x(data.dates[i]))
                .defined((d: any) => d !== 0)
                .y((d: any) => y(d))

            svg
                .selectAll(".line")
                .data(data.series)
                .join("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", chartColor[colorMode])
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .style("mix-blend-mode", colorMode === 'dark' ? "screen" : "multiply")
                .attr("d", (d: any) => getLine(d.values));

        }
    }, [width, height, data, svgRef, colorMode]);

    return (
        <Layout defaultColor={defaultColor}>
            <Box mb={2} >
                <Link color={linkColor[colorMode]} href="https://data.worldbank.org/indicator/SI.POV.GINI" isExternal>
                    World Bank Estimate<Icon name="external-link" mx="2px" />
                </Link>
            </Box>
            <Box
                backgroundColor={bgColor[colorMode]}
                border="1px solid"
                borderColor={bordColor[colorMode]}
            >
                <svg ref={svgRef} overflow="visible">
                    <g className="xAxis" />
                    <g className="yAxis" />
                </svg>
                {hoverInfo ? (
                    <Box pos="absolute" left={hoverInfo!.x} top={hoverInfo!.y}>{hoverInfo!.text}</Box>
                ) : null}
            </Box>

        </Layout >
    )
}

export default withApollo({ ssr: true })(Charts);
