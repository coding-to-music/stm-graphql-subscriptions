const fetch = require("node-fetch");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");
import { APIKEY } from "../constants";

export const useGetPositions = async () => {
  const response = await fetch(
    "https://api.stm.info/pub/od/gtfs-rt/ic/v1/vehiclePositions",
    {
      method: "POST",
      mode: "no-cors",
      headers: {
        apikey: APIKEY,
        Accept: "*/*",
        "Cache-Control": "no-cache",
        Host: "api.stm.info",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Content-Length": "0",
      },
    }
  );
  const buffer = await response.buffer();
  const feed = await GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
    buffer
  );
  return feed;
};
