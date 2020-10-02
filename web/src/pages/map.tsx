import React, { useEffect, useState, useRef } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { StaticMap } from "react-map-gl";
import { DeckGL, ScatterplotLayer, PathLayer } from "deck.gl";
import { usePositionsSubscription } from "../generated/graphql";
import { useGetPositionsQuery } from "../generated/graphql";
import { easeBackOut } from "d3";
import { Box, useColorMode } from "@chakra-ui/core";
import MapControls from "../components/MapControls";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const initialViewState = {
  longitude: -73.645,
  latitude: 45.56,
  zoom: 11,
  pitch: 0,
  bearing: -57.5,
};

const testPath = [
  {
    path: [
      [-73.964792, 45.413806],
      [-73.587076, 45.503546],
      [-73.48159, 45.701829],
    ],
    name: "Montreal",
  },
];

const positionGenerator = (arr: any) =>
  arr.map((vehicle: any) => {
    return {
      id: vehicle.id,
      timestamp: vehicle.timestamp,
      route: vehicle.routeId,
      position: [vehicle.position.longitude, vehicle.position.latitude],
    };
  });

interface MapProps {
  defaultColor: string;
}

const Map: React.FC<MapProps> = ({ defaultColor }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const color = { light: "black", dark: "white" };

  const [mapMode, setMapMode] = useState("monochrome");
  const handleSetMapMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMapMode(value);
  };

  const [selected, setSelected] = useState();
  const [hoverInfo, setHoverInfo] = useState();
  const [vehicles, setVehicles] = useState();
  const keyed: any = useRef({});
  const [paths, setPaths] = useState();
  const {
    data,
    // loading, error
  } = usePositionsSubscription({});
  const {
    data: qdata,
    // loading: qloading, error: qerror,
  } = useGetPositionsQuery({});

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
  }, [data, selected]);

  const layers = [
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data: vehicles,
      radiusScale: 2,
      radiusMinPixels: 1,
      radiusMaxPixels: 5,
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
    new PathLayer({
      id: "path-layer",
      data: paths,
      pickable: true,
      widthScale: 5,
      widthMinPixels: 1,
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
  ];
  return (
    <Layout defaultColor={defaultColor}>
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={layers}
      >
        <StaticMap
          mapStyle={
            colorMode === "dark"
              ? "mapbox://styles/mapbox/dark-v10"
              : "mapbox://styles/mapbox/light-v10"
          }
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
            <Box>{`Route ${hoverInfo?.object.route}`}</Box>
          </Box>
        ) : null}
      </DeckGL>
      <MapControls
        defaultColor={defaultColor}
        mapMode={mapMode}
        handleSetMapMode={handleSetMapMode}
      />
    </Layout>
  );
};

export default withApollo({ ssr: true })(Map);
