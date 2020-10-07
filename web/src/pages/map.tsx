import React, { useEffect, useState, useRef } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { StaticMap, FlyToInterpolator } from "react-map-gl";
import { DeckGL, ScatterplotLayer, PathLayer, GeoJsonLayer } from "deck.gl";
import { usePositionsSubscription } from "../generated/graphql";
import { useGetPositionsQuery } from "../generated/graphql";
import { easeBackOut } from "d3";
import { Box, useColorMode } from "@chakra-ui/core";
import MapControls from "../components/MapControls";
import routes from "../data/routes.json";
import stops from "../data/stops.json";
import { features as bikePaths } from "../data/bikePaths.json";
import {
  MAPBOX_ACCESS_TOKEN,
  initialViewState,
  positionGenerator,
  getMetroColors,
} from "../utils/mapUtils";

interface MapProps {
  defaultColor: string;
}

const Map: React.FC<MapProps> = ({ defaultColor }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };

  const monochrome =
    colorMode === "dark"
      ? "mapbox://styles/mapbox/dark-v10"
      : "mapbox://styles/mapbox/light-v10";
  const [mapStyle, setMapStyle] = useState(monochrome);
  const [mapMode, setMapMode] = useState("monochrome");
  const handleSetMapMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMapMode(value);
    switch (value) {
      case "monochrome":
        setMapStyle(monochrome);
        break;
      case "streets":
        setMapStyle("mapbox://styles/mapbox/streets-v11");
        break;
      case "satellite":
        setMapStyle("mapbox://styles/mapbox/satellite-streets-v11");
        break;
      default:
        setMapStyle(monochrome);
    }
  };

  const [viewState, setViewState] = useState(initialViewState);
  const handleChangeViewState = ({ viewState }: any) => setViewState(viewState);
  const handleFlyTo = () => {
    setViewState({
      ...viewState,
      ...initialViewState,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };
  const handleOrient = () => {
    setViewState((prev) => {
      return {
        ...prev,
        bearing: prev.bearing !== 0 ? 0 : -57.5,
        transitionDuration: 500,
      };
    });
  };

  const {
    data,
    // loading, error
  } = usePositionsSubscription({});
  const {
    data: qdata,
    // loading: qloading, error: qerror,
  } = useGetPositionsQuery({});

  const [visibleLayers, setVisibleLayers] = useState({
    routes: false,
    stops: false,
    paths: true,
    vehicles: true,
    bikePaths: false,
  });
  const handleSetVisibleLayers = (event: any) => {
    const value = event.target.value;
    setVisibleLayers((prev) => ({ ...prev, [value]: !prev[value] }));
  };

  const [filter, setFilter] = useState();
  const handleSetFilter = (event) => {
    const value = event.target.value;
    const routeValues = value.replace(/\s/g, "").split(",");
    if (value === "") {
      setFilter(null);
    } else {
      setFilter(routeValues);
      setVisibleLayers((prev) => ({ ...prev, routes: true }));
    }
  };
  const [filteredResults, setFilteredResults] = useState();

  const [selected, setSelected] = useState();
  const [hoverInfo, setHoverInfo] = useState();
  const [vehicles, setVehicles] = useState();
  const keyed: any = useRef({});
  const [paths, setPaths] = useState();

  useEffect(() => {
    if (mapMode === "monochrome") {
      setMapStyle(monochrome);
    }
  }, [colorMode]);

  useEffect(() => {
    if (qdata && !vehicles) {
      const positions: any = positionGenerator(qdata.getpositions.feed);
      setVehicles(positions);
      const indexed = positions.reduce((accumulator: any, current: any) => {
        const vehicle = {
          id: current.id,
          route: current.route,
          timestamp: [current.timestamp],
          path: [current.position],
          updated: false,
        };
        return Object.assign(accumulator, { [current.id]: vehicle });
      }, {});
      keyed.current = indexed;
    }
  }, [qdata]);

  useEffect(() => {
    if (data && data.positions.timestamp) {
      const trips: any = keyed.current;
      const positions: any = positionGenerator(data.positions.feed);
      setVehicles(positions);
      positions.forEach((entry: any) => {
        const id = entry.id;
        const route = entry.route;
        const timestamp = entry.timestamp;
        const position = entry.position;
        if (id in trips) {
          const trip = trips[id];
          const prevPositions = trip.path;
          const lastPosition = prevPositions[prevPositions.length - 1];
          const prevTimestamps = trip.timestamp;
          if (JSON.stringify(position) !== JSON.stringify(lastPosition)) {
            prevTimestamps.push(timestamp);
            prevPositions.push(position);
            trip.updated = true;
          } else {
            trip.updated = false;
          }
        } else {
          trips[id] = {
            id: id,
            route: route,
            timestamp: [timestamp],
            path: [position],
            updated: true,
          };
        }
      });
      keyed.current = trips;
      const tripValues: any = Object.values(trips);
      setPaths(tripValues);
    }
  }, [data, selected, visibleLayers]);

  useEffect(() => {
    if (filter) {
      const results = routes.filter((value) =>
        filter?.includes(value.properties.route_id.toString())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults(null);
    }
  }, [routes, filter]);

  const selectedPaths = [3, 4, 7];

  const layers = [
    new GeoJsonLayer({
      id: "bike-layer",
      data: bikePaths.filter((path: any) =>
        selectedPaths.includes(path.properties.TYPE_VOIE)
      ),
      visible: visibleLayers.bikePaths,
      pickable: true,
      autoHighlight: true,
      lineWidthScale: 2,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 2,
      getLineColor: [255, 99, 71],
      getLineWidth: 1,
      onHover: (info: any) => {
        setHoverInfo(info);
      },
    }),
    new GeoJsonLayer({
      id: "routes-layer",
      data: filter ? filteredResults : routes,
      visible: visibleLayers.routes,
      pickable: true,
      autoHighlight: true,
      lineWidthScale: 20,
      lineWidthMinPixels: 2,
      getLineColor: (d: any) => getMetroColors(d.properties.route_name, filter),
      getLineWidth: 1,
      onHover: (info: any) => {
        setHoverInfo(info);
      },
    }),
    new GeoJsonLayer({
      id: "stops-layer",
      data: stops,
      visible: visibleLayers.stops,
      radiusScale: 2,
      radiusMinPixels: 4,
      radiusMaxPixels: 8,
      getRadius: 25,
      getPosition: (d: any) => d.geometry.coordinates,
      getFillColor: [255, 99, 71],
      pickable: true,
      onClick: ({ object }: any) => {
        console.log(object);
      },
      onHover: (info: any) => {
        setHoverInfo(info);
        if (info.object) {
          setSelected(info.object.route);
        } else {
          setSelected(null);
        }
      },
      autoHighlight: true,
      transitions: {
        getRadius: {
          duration: 1000,
          easing: easeBackOut,
        },
      },
    }),
    new PathLayer({
      id: "path-layer",
      data: paths,
      visible: visibleLayers.paths,
      pickable: true,
      autoHighlight: true,
      widthScale: 2,
      widthMinPixels: 4,
      widthMaxPixels: 8,
      getPath: (d: any) => {
        if (d.route === selected) {
          return d.path;
        } else {
          return d.path.slice(-3);
        }
      },
      getColor: (d: any) => {
        if (d.route === selected) {
          return [255, 99, 71];
        } else {
          return [0, 173, 230];
        }
      },
      getWidth: 1,
    }),
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data: vehicles,
      visible: visibleLayers.vehicles,
      radiusScale: 2,
      radiusMinPixels: 4,
      radiusMaxPixels: 8,
      getRadius: 25,
      getPosition: (d: any) => d.position,
      getFillColor: (d: any) => {
        if (d.route === selected) {
          return [255, 99, 71];
        } else {
          return keyed.current[d.id].updated === true
            ? [255, 99, 71]
            : [0, 173, 230];
        }
      },
      pickable: true,
      onClick: ({ object }: any) => {
        console.log(`Route ${object.route}`);
      },
      onHover: (info: any) => {
        setHoverInfo(info);
        if (info.object) {
          setSelected(info.object.route);
        } else {
          setSelected(null);
        }
      },
      autoHighlight: true,
      transitions: {
        getRadius: {
          duration: 1000,
          easing: easeBackOut,
        },
      },
    }),
  ];
  return (
    <Layout defaultColor={defaultColor}>
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleChangeViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap
          mapStyle={mapStyle}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width={"100vw"}
          height={"100vh"}
        />
        {hoverInfo?.object ? (
          <Box
            style={{
              position: "absolute",
              zIndex: 1,
              pointerEvents: "none",
              left: hoverInfo?.x,
              top: hoverInfo?.y,
            }}
            bg={bgColor[colorMode]}
            color={color[colorMode]}
            p={1}
          >
            <Box>{`Route ${
              hoverInfo?.object.route || hoverInfo?.object.properties.headsign
            }`}</Box>
            <Box>{hoverInfo?.object.properties?.route_name}</Box>
          </Box>
        ) : null}
      </DeckGL>
      <MapControls
        defaultColor={defaultColor}
        mapMode={mapMode}
        handleSetMapMode={handleSetMapMode}
        handleFlyTo={handleFlyTo}
        handleOrient={handleOrient}
        visibleLayers={visibleLayers}
        handleSetVisibleLayers={handleSetVisibleLayers}
        handleSetFilter={handleSetFilter}
        filteredResults={filteredResults}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Map);
