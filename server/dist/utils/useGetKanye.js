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
exports.useGetKanye = void 0;
const fetch = require("node-fetch");
exports.useGetKanye = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("https://api.kanye.rest", {
        method: "GET",
        mode: "no-cors",
        headers: {
            Accept: "*/*",
            "Cache-Control": "no-cache",
            Host: "api.kanye.rest",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            "Content-Length": "0",
        },
    });
    const json = yield response.json();
    return json.quote;
});
//# sourceMappingURL=useGetKanye.js.map