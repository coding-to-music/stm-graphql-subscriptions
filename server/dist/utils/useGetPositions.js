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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetPositions = void 0;
const fetch = require("node-fetch");
const GtfsRealtimeBindings = require("gtfs-realtime-bindings");
const constants_1 = require("../constants");
exports.useGetPositions = () => __awaiter(void 0, void 0, void 0, function* () {
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
    const feed = yield GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(buffer);
    return feed;
});
//# sourceMappingURL=useGetPositions.js.map