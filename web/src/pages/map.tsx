import React, { useEffect, useState, useRef } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { StaticMap, FlyToInterpolator } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import {ScatterplotLayer, PathLayer, GeoJsonLayer } from '@deck.gl/layers'
import { usePositionsSubscription } from "../generated/graphql";
import { useGetPositionsQuery } from "../generated/graphql";
import { Box, useColorMode } from "@chakra-ui/core";
import colors from "@chakra-ui/core/dist/theme/colors";
import MapControls from "../components/MapControls";
import routes from "../data/routes.json";
import stops from "../data/stops.json";
import { features as bikePaths } from "../data/bikePaths.json";
import {
  MAPBOX_ACCESS_TOKEN,
  initialViewState,
  positionGenerator,
  getMetroColors,
  hexToRgb as rgb,
} from "../utils/mapUtils";
import { RGBAColor } from "@deck.gl/core/utils/color";

interface MapProps {
  defaultColor: string;
}

interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
  transitionInterpolator?: any;
}

interface HoverInfo {
  color: [];
  coordinate: [];
  devicePixel: [];
  index: number;
  layer: any;
  lngLat: [];
  object?: any;
  picked: boolean;
  pixel: [];
  pixelRatio: number;
  x: number;
  y: number;
}

interface Path {
  id: string;
  route: string;
  timestamp: number[];
  path: number[][];
  updated: boolean;
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

  const [viewState, setViewState] = useState<ViewState>(initialViewState);
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
    setViewState((prev:any) => {
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
    shared: false,
    separated: false,
    multiUse: false,
  });
  const handleSetVisibleLayers = (event: any) => {
    const value = event.target.value;
    setVisibleLayers((prev:any) => ({ ...prev, [value]: !prev[value] }));
  };

  const [filter, setFilter] = useState<Array<string> | undefined>();
  const handleSetFilter = (event:any) => {
    const value = event.target.value;
    const routeValues = value.replace(/\s/g, "").split(",");
    if (value === "") {
      setFilter([]);
    } else {
      setFilter(routeValues);
      setVisibleLayers((prev) => ({ ...prev, routes: true }));
    }
  };
  const [filteredResults, setFilteredResults] = useState<Array<object> | undefined>();

  const [selected, setSelected] = useState();
  const [hoverInfo, setHoverInfo] = useState<HoverInfo>();
  const [vehicles, setVehicles] = useState<Array<object> | undefined>();
  const [filteredVehicles, setFilteredVehicles] = useState<Array<object> | undefined>();
  const keyed: any = useRef({});
  const [paths, setPaths] = useState<Array<Path> | undefined>();
  const [filteredPaths, setFilteredPaths] = useState<Array<object> | undefined>();
  const [filteredStops, setFilteredStops] = useState<Array<object> | undefined>();

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
      const selectedStops = stops.filter((stop:any) => {
        const routes = stop.properties.route_id;
        if (routes) {
          const routesArray = routes.split(",");
          return routesArray.some((route:any) => filter.includes(route));
        }
      });
      const selectedVehicles = vehicles?.filter((vehicle:any) => {
        const route = vehicle.route;
        return filter.includes(route);
      });
      const selectedPaths = paths?.filter((path) => {
        const route = path.route!;
        return filter.includes(route);
      });
      setFilteredResults(results);
      setVisibleLayers((prev) => ({ ...prev, stops: true }));
      setFilteredStops(selectedStops);
      setFilteredVehicles(selectedVehicles);
      setFilteredPaths(selectedPaths);
    } else {
      setFilteredResults([]);
    }
  }, [stops, routes, filter]);

  const separated = visibleLayers.separated ? [3, 4, 5, 6] : [];
  const shared = visibleLayers.shared ? [1, 2, 8, 9] : [];
  const multiUse = visibleLayers.multiUse ? [7] : [];
  const selectedPaths = [...separated, ...shared, ...multiUse];

  const getBikeColors =(d:any):RGBAColor=> {
    if (separated.includes(d.properties.TYPE_VOIE)) {
      return colorMode === "dark"
        ? rgb(colors.purple[200])
        : rgb(colors.purple[500]);
    } else if (d.properties.TYPE_VOIE === 7) {
      return colorMode === "dark"
        ? rgb(colors.green[200])
        : rgb(colors.green[500]);
    } else {
      return colorMode === "dark"
        ? rgb(colors.red[200])
        : rgb(colors.red[500]);
    }
  }

  const layers = [
    new GeoJsonLayer({
      id: "bike-layer",
      data: bikePaths.filter((path: any) =>
        selectedPaths.includes(path.properties.TYPE_VOIE)
      ),
      visible: true,
      pickable: true,
      autoHighlight: true,
      lineWidthScale: 2,
      lineWidthMinPixels: 2,
      lineWidthMaxPixels: 2,
      getLineColor: (d:any) => getBikeColors(d),
      getLineWidth: 1,
      onHover: (info: any) => {
        setHoverInfo(info);
      },
    }),
    new GeoJsonLayer({
      id: "routes-layer",
      data: (filter && filter?.length>0) ? filteredResults : routes,
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
    new ScatterplotLayer({
      id: "stops-layer",
      data: (filter && filter?.length>0) ? filteredStops : stops,
      visible: visibleLayers.stops,
      radiusScale: 2,
      radiusMinPixels: 2,
      radiusMaxPixels: 4,
      getRadius: 15,
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
          setSelected(undefined);
        }
      },
      autoHighlight: true,
    }),
    new PathLayer({
      id: "path-layer",
      data: (filter && filter?.length>0) ? filteredPaths : paths,
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
      id: "vehicles-layer",
      data:  (filter && filter?.length>0) ? filteredVehicles : vehicles,
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
          setSelected(undefined);
        }
      },
      autoHighlight: true,
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
