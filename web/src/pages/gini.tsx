import React, { useRef, useState, useEffect } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { Box, Flex, Text, Input, Link, Icon, PseudoBox, useColorMode } from "@chakra-ui/core";
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
    extent,
    pointer,
    bisectCenter,
    least,
    format,
    // curveCardinal
} from "d3";
import { useGetViewport } from "../utils/useGetViewport";

interface Country {
    country: string,
    indexed: [],
    series: {},
}

interface Data {
    y: string
    dates: [];
    countries: [Country];
    max: number;
    min: number;
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
    const scrollbar = { light: 'scrollbarLight', dark: 'scrollbarDark' }

    const linkColor = { light: 'purple.500', dark: 'purple.200' }

    const { width: viewportWidth, height: viewportHeight } = useGetViewport();
    const width = viewportWidth * 0.7;
    const height = viewportHeight * 0.7;
    const [rawData, setRawData] = useState<string | undefined>();
    const [data, setData] = useState<Data | undefined>();
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoverInfo, setHoverInfo] = useState<HoverInfo | undefined>()

    const [filter, setFilter] = useState<Array<string> | undefined>();
    const [range, setRange] = useState({ min: undefined, max: undefined })
    const [listHover, setListHover] = useState<string | undefined>()

    const handleSetFilter = (event: any) => {
        const value = event.target.value;
        const selectedCountries = value.replace(/,\s/g, ",").split(",").map((country: any) => country.toLowerCase());
        if (value === "") {
            setFilter(undefined);
        } else {
            setFilter(selectedCountries);
        }
    };

    const handleSetRange = (event: any) => {
        const { name, value } = event.target;
        setRange((prevState) => ({ ...prevState, [name]: value }));
    }

    useEffect(() => {
        fetch("./giniIndex.csv")
            .then((response) => response.text())
            .then((data) => setRawData(data));
    });

    useEffect(() => {
        if (rawData) {
            const parsed = csvParse(rawData!);
            const dates = parsed.columns.slice(1).map((d: any) => +d);
            const formatted = parsed
                .map((entry: any) => {
                    const indexed = Object.values(entry).slice(0, dates.length - 1);
                    const strings = Object.entries(entry)
                        .map((info) => ({
                            [info[0]]: info[1],
                        }))
                        .filter((obj) => !Object.values(obj).includes(""));
                    const country = strings.filter((obj) => "country" in obj)[0].country;
                    const series = strings
                        .filter((obj) => !("country" in obj))
                        .map((obj: object) => {
                            return {
                                year: +Object.keys(obj)[0],
                                value: +Object.values(obj)[0],
                            };
                        });
                    return {
                        country: country,
                        indexed: indexed,
                        series: series,
                    };
                })
                .filter((entry: any) => entry.series.length > 0);
            const values = formatted
                .map((entry: any) => entry.series.map((year: any) => year.value))
                .reduce((acc: any, cur: any) => acc.concat(cur), []);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const rangeFiltered = formatted.filter((entry: any) => range.min
                ? entry.series[entry.series.length - 1].value >= range.min!
                : true)
                .filter((entry: any) => range.max
                    ? entry.series[entry.series.length - 1].value <= range.max!
                    : true)
            const nameFiltered = filter
                ? rangeFiltered.filter((entry: any) => filter.includes(entry.country.toLowerCase()))
                : rangeFiltered
            const dataObject = {
                y: "Gini index",
                countries: nameFiltered,
                dates: dates,
                max: max,
                min: min,
            };
            // // console.log(dataObject.series[0].values);
            setData(dataObject);
        }
    }, [rawData, filter, range]);

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
                .domain([0, data.max])
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

            // xm: date, ym: giniIndex, i: year index, s: data object
            const moved = (event: any) => {
                event.preventDefault();
                const cursorPosition = pointer(event, this);
                const xm = x.invert(cursorPosition[0]);
                const ym = y.invert(cursorPosition[1]);
                const i = bisectCenter(data.dates, xm);
                const s = least((data.countries), (d: any) => Math.abs(+d.indexed[i] - ym));

                if (s !== undefined && s.indexed[i] > 0) {
                    svg
                        .selectAll(".line")
                        .attr("stroke", (d: any) => (d === s ? highlightColor[colorMode] : muteColor[colorMode]))
                        .filter((d: any) => d === s)
                        .raise();
                    dot.attr(
                        "transform",
                        `translate(${x(data.dates[i])},${y(+s.indexed[i])})`
                    ).attr("fill", highlightColor[colorMode]);
                    dot.select("text").style('fill', color[colorMode])
                    // .text(s.country);
                    setHoverInfo({
                        text: s.country,
                        x: x(data.dates[i]) + margin.left + margin.right,
                        y: y(s.indexed[i]) + margin.top + margin.bottom
                    })
                }
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
                .x((d: any) => x(d.year))
                .y((d: any) => y(d.value))
            // .curve(curveCardinal);

            const getColor = (d: any) => {
                if (listHover) {
                    return d.country === listHover ? highlightColor[colorMode] : muteColor[colorMode]
                }
                return chartColor[colorMode]
            }

            const getBlendMode = () => {
                if (listHover) {
                    return null
                }
                return colorMode === 'dark' ? "screen" : "multiply"
            }

            svg
                .selectAll(".line")
                .data(data.countries)
                .join("path")
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", (d: any) => getColor(d))
                .attr("stroke-width", 1.5)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .style("mix-blend-mode", getBlendMode())
                .attr("d", (d: any) => getLine(d.series));
        }
    }, [width, height, data, svgRef, colorMode, listHover]);

    return (
        <Layout defaultColor={defaultColor}>
            <Flex>
                <Box>
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
                </Box>
                <Box ml={2}>
                    <Box mb={2}>
                        <Text
                            color={linkColor[colorMode]}
                        >Filters</Text>
                    </Box>
                    <Box
                        backgroundColor={bgColor[colorMode]}
                        border="1px solid"
                        borderColor={bordColor[colorMode]}
                        h="70vh"
                    >
                        <Box h="100%">
                            <Box m={2}>Filter Countries</Box>
                            <Box m={2}>
                                <Input

                                    onChange={handleSetFilter}
                                    placeholder="Canada, United States,"
                                    size="md"
                                />
                            </Box>
                            <Box m={2}>Range</Box>

                            <Flex justifyContent="center" alignItems="center">
                                <Box mr={2}>
                                    <Input
                                        type="number"
                                        name="min"
                                        value={range.min}
                                        onChange={handleSetRange}
                                        size="sm"
                                        w={12}
                                    />
                                </Box>
                                <Box>to</Box>
                                <Box ml={2}>
                                    <Input
                                        type="number"
                                        name="max"
                                        value={range.max}
                                        onChange={handleSetRange}
                                        size="sm"
                                        w={12}
                                    />
                                </Box>
                            </Flex>
                            <Flex justifyContent="center">
                                <Box m={2}>Min</Box>
                                <Box m={2}>Max</Box>
                            </Flex>
                            <Box m={2} height="75%" overflowY="scroll" className={scrollbar[colorMode]}>
                                {data ? data.countries.map((entry: any, index: any) => (
                                    <Box key={index}><PseudoBox as="button"
                                        _hover={{ bg: `${highlightColor[colorMode]}`, color: 'white' }}
                                        onMouseEnter={() => setListHover(entry.country)}
                                        onMouseLeave={() => setListHover(undefined)}
                                    >
                                        {entry.country}
                                    </PseudoBox></Box>
                                )) : null}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Flex>

        </Layout >
    )
}

export default withApollo({ ssr: true })(Charts);
