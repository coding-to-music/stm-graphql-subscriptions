import React from "react";
import { withApollo } from "../utils/withApollo";
import { Layout } from "../components/Layout";

interface MapProps {
  defaultColor: string;
}

const Map: React.FC<MapProps> = ({ defaultColor }) => {
  return <Layout defaultColor={defaultColor}>Map</Layout>;
};

export default withApollo({ ssr: true })(Map);
