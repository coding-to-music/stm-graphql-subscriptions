"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetPositions = void 0;
const fetch = require("node-fetch");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");
const constants_1 = require("../constants");
const fs_1 = require("fs");
const feedParser_1 = require("./feedParser");
const ioredis_1 = __importDefault(require("ioredis"));
const mockData = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const currentTime = date.getTime() / 1000;
    const file = yield fs_1.promises.readFile("./feed.json", "utf-8");
    const data = JSON.parse(file);
    data.timestamp = currentTime;
    const feed = data.feed.map((vehicle) => {
        const id = vehicle.id;
        const tripId = vehicle.tripId;
        const routeId = vehicle.routeId;
        const latitude = vehicle.position.latitude +
            (Math.random() > 0.5 ? Math.random() / 1000 : -Math.random() / 1000);
        const longitude = vehicle.position.longitude +
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
});
const redis = new ioredis_1.default();
const liveData = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("https://api.stm.info/pub/od/gtfs-rt/ic/v1/vehiclePositions", {
        method: "POST",
        mode: "no-cors",
        headers: {
            apikey: constants_1.APIKEY,
            Accept: "*/*",
            "Cache-Control": "no-cache",
            Host: "api.stm.info",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            "Content-Length": "0",
        },
    });
    const buffer = yield response.buffer();
    const bufferHeader = buffer.toString().slice(0, 23);
    if (bufferHeader === "API plan limit exceeded") {
        console.log(bufferHeader);
        const prevFeed = yield redis.get("prevFeed");
        return JSON.parse(prevFeed);
    }
    const raw = yield GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);
    const feed = feedParser_1.feedParser(raw);
    yield redis.set("prevFeed", JSON.stringify(feed));
    return feed;
});
exports.useGetPositions = () => __awaiter(void 0, void 0, void 0, function* () { return yield mockData(); });
//# sourceMappingURL=useGetPositions.js.map