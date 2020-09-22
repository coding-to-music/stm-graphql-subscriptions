"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.SubscriptionResolver = void 0;
const type_graphql_1 = require("type-graphql");
const useGetKanye_1 = require("../utils/useGetKanye");
let SubscriptionResolver = class SubscriptionResolver {
    time() {
        return __awaiter(this, void 0, void 0, function* () {
            const date = new Date();
            const time = date.toISOString();
            return time;
        });
    }
    kanye(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const tweet = yield useGetKanye_1.useGetKanye();
            return tweet;
        });
    }
    query() {
        return __awaiter(this, void 0, void 0, function* () {
            return "user query";
        });
    }
};
__decorate([
    type_graphql_1.Subscription(() => String, {
        topics: "TIME",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "time", null);
__decorate([
    type_graphql_1.Subscription(() => String, {
        topics: "KANYE",
    }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "kanye", null);
__decorate([
    type_graphql_1.Subscription(() => String, {
        topics: "QUERY",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubscriptionResolver.prototype, "query", null);
SubscriptionResolver = __decorate([
    type_graphql_1.Resolver()
], SubscriptionResolver);
exports.SubscriptionResolver = SubscriptionResolver;
//# sourceMappingURL=subscription.js.map