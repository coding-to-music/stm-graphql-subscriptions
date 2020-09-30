import React, { useEffect, useState, useRef } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { StaticMap } from "react-map-gl";
import { DeckGL, ScatterplotLayer, PathLayer } from "deck.gl";
import { usePositionsSubscription } from "../generated/graphql";
import { useGetPositionsQuery } from "../generated/graphql";
import { easeBackOut } from "d3";

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
        const timestamp = entry.timestamp;
        const position = entry.position;
        if (id in trips) {
          const prevPositions = trips[id].path;
          const prevTimestamps = trips[id].timestamp;
          if (
            JSON.stringify(position) !==
            JSON.stringify(prevPositions[prevPositions.length - 1])
          ) {
            if (prevPositions.length > 1) {
              prevPositions.shift();
              prevTimestamps.shift();
            }
            prevTimestamps.push(timestamp);
            prevPositions.push(position);
            trips[id].updated = true;
          } else {
            trips[id].updated = false;
          }
        } else {
          trips[id] = {
            id: id,
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
  }, [data]);

  const layers = [
    new ScatterplotLayer({
      id: "scatterplot-layer",
      data: vehicles,
      radiusScale: 2,
      radiusMinPixels: 1,
      radiusMaxPixels: 5,
      getRadius: 25,
      getFillColor: (d: any) =>
        keyed.current[d.id].updated === true ? [255, 99, 71] : [0, 173, 230],
      pickable: true,
      onClick: ({ object }: any) => console.log(`Route ${object.route}`),
      onHover: ({ object }: any) => {
        if (object && object.route) {
          console.log(`Route ${object.route}`);
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
      getPath: (d: any) => d.path,
      getColor: [0, 173, 230],
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
          mapStyle={"mapbox://styles/mappingmtl/ck87roalx0h3n1jp72b1hgun4"}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          width={"100vw"}
          height={"100vh"}
        />
      </DeckGL>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Map);
