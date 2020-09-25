import React from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";
import { StaticMap } from "react-map-gl";
import { DeckGL } from "deck.gl";

const initialViewState = {
  longitude: -73.645,
  latitude: 45.56,
  zoom: 11,
  pitch: 0,
  bearing: -58,
};

interface MapProps {
  defaultColor: string;
  MAPBOX_ACCESS_TOKEN: string;
}

const Map: React.FC<MapProps> = ({ defaultColor, MAPBOX_ACCESS_TOKEN }) => {
  return (
    <Layout defaultColor={defaultColor}>
      <DeckGL initialViewState={initialViewState} controller={true}>
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
