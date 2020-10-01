const fetch = require("node-fetch");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");
import { APIKEY } from "../constants";
import { promises as fs } from "fs";
import { feedParser } from "./feedParser";
import Redis from "ioredis";

const date = new Date();
const currentTime = date.getTime() / 1000;

const redis = new Redis();

const mockData = async () => {
  const file = await fs.readFile("./feed.json", "utf-8");
  const data = JSON.parse(file);
  data.timestamp = currentTime;
  const feed = data.feed.map((vehicle: any) => {
    const id = vehicle.id;
    const tripId = vehicle.tripId;
    const routeId = vehicle.routeId;
    const latitude =
      vehicle.position.latitude +
      (Math.random() > 0.5 ? Math.random() / 1000 : -Math.random() / 1000);
    const longitude =
      vehicle.position.longitude +
      (Math.random() > 0.5 ? Math.random() / 1000 : -Math.random() / 1000);
    const vehicleTimestamp = currentTime;
    const vehicleId = vehicle.id;
    return {
      id: id,
      tripId: tripId,
      routeId: routeId,
      position: {
        latitude: latitude,
        longitude: longitude,
      },
      timestamp: vehicleTimestamp,
      vehicleId: vehicleId,
    };
  });
  data.feed = feed;
  return data;
};

const liveData = async () => {
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
  const bufferHeader = buffer.toString().slice(0, 23);
  if (bufferHeader === "API plan limit exceeded") {
    console.log(bufferHeader);
    const prevFeed: any = await redis.get("prevFeed");
    return JSON.parse(prevFeed);
  }
  const raw = await GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
    buffer
  );
  const feed = feedParser(raw);
  await redis.set("prevFeed", JSON.stringify(feed));
  return feed;
};

export const useGetPositions = async () => await liveData();
