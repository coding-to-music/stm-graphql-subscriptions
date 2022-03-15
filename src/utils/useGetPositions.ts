const fetch = require("node-fetch");
import Redis from "ioredis";
import pkg from "protobufjs";
import { REDIS_URL, STMKEY } from "../constants";
import gtfs from "./gtfs.json";
import { GTFS } from "./types";
const { Root } = pkg;

// import { promises as fs } from "fs";

// mockData below is incorrect and based on v1 schema
//
// const mockData = async () => {
//   const date = new Date();
//   const currentTime = date.getTime() / 1000;
//   const file = await fs.readFile("./feed.json", "utf-8");
//   const data = JSON.parse(file);
//   data.timestamp = currentTime;
//   const feed = data.feed.map((vehicle: any) => {
//     const id = vehicle.id;
//     const tripId = vehicle.tripId;
//     const routeId = vehicle.routeId;
//     const latitude =
//       vehicle.position.latitude +
//       (Math.random() > 0.5 ? Math.random() / 1000 : -Math.random() / 1000);
//     const longitude =
//       vehicle.position.longitude +
//       (Math.random() > 0.5 ? Math.random() / 1000 : -Math.random() / 1000);
//     const vehicleTimestamp = currentTime;
//     const vehicleId = vehicle.id;
//     return {
//       id: id,
//       tripId: tripId,
//       routeId: routeId,
//       position: {
//         latitude: latitude,
//         longitude: longitude,
//       },
//       timestamp: vehicleTimestamp,
//       vehicleId: vehicleId,
//     };
//   });
//   data.feed = feed;
//   const time = date.toLocaleTimeString();
//   console.log(`mock data: ${data.count} vehicles, ${time}`);
//   return data;
// };

const redis = new Redis(REDIS_URL);

const liveData = async () => {
  const currentTime = new Date().toLocaleTimeString();
  const schema = await Root.fromJSON(gtfs);
  const FeedMessage = schema.lookupType("transit_realtime.FeedMessage");
  const response = await fetch(
    "https://api.stm.info/pub/od/gtfs-rt/ic/v2/vehiclePositions",
    {
      method: "GET",
      headers: {
        apikey: STMKEY as string,
      },
    }
  );

  if (response.ok) {
    const arrayBuffer = await response.arrayBuffer();
    const array = new Uint8Array(arrayBuffer);
    const decoded = FeedMessage.decode(array) as any;
    const feed = decoded as GTFS;

    await redis.set("prevFeed", JSON.stringify(feed));
    const timestamp = new Date(
      parseInt(feed.header.timestamp) * 1000
    ).toLocaleTimeString();
    console.log(
      `${currentTime} live data: ${feed.entity.length} vehicles, ${timestamp}`
    );
    return feed;
  } else {
    const text = response.statusText;
    console.log(text);
    const json: any = await redis.get("prevFeed");
    const prevFeed = JSON.parse(json);
    const timestamp = new Date(
      parseInt(prevFeed.header.timestamp) * 1000
    ).toLocaleTimeString();
    console.log(
      `${currentTime} cached data: ${prevFeed.entity.length} vehicles, ${timestamp}`
    );
    return prevFeed;
  }
};

export const useGetPositions = async () => await liveData();
