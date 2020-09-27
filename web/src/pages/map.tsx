import React, { useEffect, useState } from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { StaticMap } from "react-map-gl";
import { DeckGL, ScatterplotLayer } from "deck.gl";
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
  const { data, loading, error } = usePositionsSubscription({});
  const {
    data: qdata,
    loading: qloading,
    error: qerror,
  } = useGetPositionsQuery({});

  useEffect(() => {
    if (qdata) {
      const positions = qdata.getpositions.feed.map((vehicle: any) => {
        return {
          id: vehicle.id,
          route: vehicle.routeId,
          position: [vehicle.position.longitude, vehicle.position.latitude],
        };
      });
      setVehicles(positions);
    }
  }, [qdata]);

  useEffect(() => {
    if (data) {
      console.log(
        `vehicles: ${data.positions.count}, timestamp: ${data.positions.timestamp}`
      );
      const positions = data.positions.feed.map((vehicle: any) => {
        return {
          id: vehicle.id,
          route: vehicle.routeId,
          position: [vehicle.position.longitude, vehicle.position.latitude],
        };
      });
      setVehicles(positions);
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
