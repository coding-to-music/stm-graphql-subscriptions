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

interface MapProps {
  defaultColor: string;
}

const Map: React.FC<MapProps> = ({ defaultColor }) => {
  const [vehicles, setVehicles] = useState();
  const keyed = useRef({});
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
      const currentTime = new Date(
        qdata.getpositions.timestamp * 1000
      ).toLocaleTimeString();
      console.log(
        `initial query: ${qdata.getpositions.count} vehicles, ${currentTime}`
      );
      const positions = qdata.getpositions.feed.map((vehicle: any) => {
        return {
          id: vehicle.id,
          timestamp: vehicle.timestamp,
          route: vehicle.routeId,
          position: [vehicle.position.longitude, vehicle.position.latitude],
        };
      });
      setVehicles(positions);
      const indexed = positions.reduce((accumulator, current) => {
        const vehicle = {
          id: current.id,
          timestamp: [current.timestamp],
          path: [current.position],
        };
        return Object.assign(accumulator, { [current.id]: vehicle });
      }, {});
      keyed.current = indexed;
    }
  }, [qdata]);

  useEffect(() => {
    if (data && data.positions.timestamp) {
      const currentTime = new Date(
        data.positions.timestamp * 1000
      ).toLocaleTimeString();
      console.log(`${data.positions.count} vehicles, ${currentTime}`);
      const positions = data.positions.feed.map((vehicle: any) => {
        return {
          id: vehicle.id,
          timestamp: vehicle.timestamp,
          route: vehicle.routeId,
          position: [vehicle.position.longitude, vehicle.position.latitude],
        };
      });
      setVehicles(positions);
      const trips = keyed.current;
      positions.forEach((entry) => {
        if (entry.id in trips) {
          trips[entry.id].timestamp.push(entry.timestamp);
          trips[entry.id].path.push(entry.position);
        } else {
          trips[entry.id] = {
            id: entry.id,
            timestamp: [entry.timestamp],
            path: [entry.position],
          };
        }
      });
      keyed.current = trips;
      const tripValues = Object.values(trips);
      setPaths(tripValues);
      console.log(tripValues[0]);
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
      getFillColor: [255, 99, 71],
      pickable: true,
      onClick: ({ object }: any) => console.log(object.route),
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
      getPath: (d) => d.path,
      getColor: [0, 173, 230],
      getWidth: (d) => 1,
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
