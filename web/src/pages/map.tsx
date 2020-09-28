import React, { useEffect, useState } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { StaticMap } from "react-map-gl";
import { DeckGL, ScatterplotLayer, LineLayer } from "deck.gl";
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

interface MapProps {
  defaultColor: string;
}

const Map: React.FC<MapProps> = ({ defaultColor }) => {
  const [vehicles, setVehicles] = useState();
  const [paths, setPaths] = useState();
  const [time, setTime] = useState();
  const [tripsData, setTripsData] = useState();
  const { data, loading, error } = usePositionsSubscription({});
  const {
    data: qdata,
    loading: qloading,
    error: qerror,
  } = useGetPositionsQuery({});

  useEffect(() => {
    if (qdata) {
      const currentTime = new Date(
        qdata.getpositions.timestamp * 1000
      ).toLocaleTimeString();
      console.log(
        `vehicles: ${qdata.getpositions.count}, timestamp: ${currentTime}`
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
      const trips = positions.reduce((accumulator, current) => {
        const vehicle = {
          id: current.id,
          timestamp: [current.timestamp],
          path: [current.position],
        };
        return Object.assign(accumulator, { [current.id]: vehicle });
      }, {});
      setPaths(trips);
    }
  }, [qdata]);

  useEffect(() => {
    if (data) {
      const currentTime = new Date(
        data.positions.timestamp * 1000
      ).toLocaleTimeString();

      console.log(
        `vehicles: ${data.positions.count}, timestamp: ${currentTime}`
      );
      setTime(data.positions.timestamp);
      const positions = data.positions.feed.map((vehicle: any) => {
        return {
          id: vehicle.id,
          timestamp: vehicle.timestamp,
          route: vehicle.routeId,
          position: [vehicle.position.longitude, vehicle.position.latitude],
        };
      });
      setVehicles(positions);
      const trips = paths;
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
      setPaths(trips);
      const tripsArray = Object.values(trips);
      setTripsData(tripsArray);
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
    new LineLayer({
      id: "line-layer",
      tripsData,
      getWidth: 10,
      getSourcePosition: (d) => d.path[0],
      getTargetPosition: (d) => d.path[d.path.length - 1],
      getColor: [0, 173, 230],
      opacity: 0.8,
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
