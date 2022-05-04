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
const fetch = require("node-fetch");
const ioredis_1 = __importDefault(require("ioredis"));
const protobufjs_1 = __importDefault(require("protobufjs"));
const constants_1 = require("../constants");
const gtfs_json_1 = __importDefault(require("./gtfs.json"));
const { Root } = protobufjs_1.default;
const redis = new ioredis_1.default(constants_1.REDIS_URL);
const liveData = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date().toLocaleTimeString();
    const schema = yield Root.fromJSON(gtfs_json_1.default);
    const FeedMessage = schema.lookupType("transit_realtime.FeedMessage");
    const response = yield fetch("https://api.stm.info/pub/od/gtfs-rt/ic/v2/vehiclePositions", {
        method: "GET",
        headers: {
            apikey: constants_1.STMKEY,
        },
    });
    if (response.ok) {
        const arrayBuffer = yield response.arrayBuffer();
        const array = new Uint8Array(arrayBuffer);
        const decoded = FeedMessage.decode(array);
        const feed = decoded;
        yield redis.set("prevFeed", JSON.stringify(feed));
        const timestamp = new Date(parseInt(feed.header.timestamp) * 1000).toLocaleTimeString();
        console.log(`${currentTime} live data: ${feed.entity.length} vehicles, ${timestamp}`);
        return feed;
    }
    else {
        const text = response.statusText;
        console.log(text);
        const json = yield redis.get("prevFeed");
        const prevFeed = JSON.parse(json);
        const timestamp = new Date(parseInt(prevFeed.header.timestamp) * 1000).toLocaleTimeString();
        console.log(`${currentTime} cached data: ${prevFeed.entity.length} vehicles, ${timestamp}`);
        return prevFeed;
    }
});
exports.useGetPositions = () => __awaiter(void 0, void 0, void 0, function* () { return yield liveData(); });
//# sourceMappingURL=useGetPositions.js.map