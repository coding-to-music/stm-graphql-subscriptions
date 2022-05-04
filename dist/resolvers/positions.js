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
const type_graphql_1 = require("type-graphql");
const useGetPositions_1 = require("../utils/useGetPositions");
let Header = class Header {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Header.prototype, "gtfsRealtimeVersion", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Header.prototype, "incrementality", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Header.prototype, "timestamp", void 0);
Header = __decorate([
    type_graphql_1.ObjectType()
], Header);
let VehicleTrip = class VehicleTrip {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "tripId", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "startTime", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "startDate", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], VehicleTrip.prototype, "routeId", void 0);
VehicleTrip = __decorate([
    type_graphql_1.ObjectType()
], VehicleTrip);
let Position = class Position {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Position.prototype, "latitude", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Position.prototype, "longitude", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Position.prototype, "bearing", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Position.prototype, "speed", void 0);
Position = __decorate([
    type_graphql_1.ObjectType()
], Position);
let Vehicle = class Vehicle {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", VehicleTrip)
], Vehicle.prototype, "trip", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Position)
], Vehicle.prototype, "position", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Number)
], Vehicle.prototype, "currentStopSequence", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "currentStatus", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "timestamp", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "vehicle", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "occupancyStatus", void 0);
Vehicle = __decorate([
    type_graphql_1.ObjectType()
], Vehicle);
let Entity = class Entity {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], Entity.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", Vehicle)
], Entity.prototype, "vehicle", void 0);
Entity = __decorate([
    type_graphql_1.ObjectType()
], Entity);
let Feed = class Feed {
};
__decorate([
    type_graphql_1.Field(() => Header, { nullable: true }),
    __metadata("design:type", Header)
], Feed.prototype, "header", void 0);
__decorate([
    type_graphql_1.Field(() => [Entity], { nullable: true }),
    __metadata("design:type", Array)
], Feed.prototype, "entity", void 0);
Feed = __decorate([
    type_graphql_1.ObjectType()
], Feed);
let PositionsResolver = class PositionsResolver {
    getpositions(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = yield ctx.redis.get("positions");
            if (cache) {
                const feed = JSON.parse(cache);
                return feed;
            }
            else {
                const feed = yield useGetPositions_1.useGetPositions();
                yield ctx.redis.set("positions", JSON.stringify(feed));
                yield ctx.redis.expire("positions", 11);
                return feed;
            }
        });
    }
    positions(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const cache = yield ctx.redis.get("positions");
            if (cache) {
                const feed = JSON.parse(cache);
                return feed;
            }
            else {
                const feed = yield useGetPositions_1.useGetPositions();
                yield ctx.redis.set("positions", JSON.stringify(feed));
                yield ctx.redis.expire("positions", 11);
                return feed;
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => Feed),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PositionsResolver.prototype, "getpositions", null);
__decorate([
    type_graphql_1.Subscription(() => Feed, {
        topics: "POSITIONS",
    }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PositionsResolver.prototype, "positions", null);
PositionsResolver = __decorate([
    type_graphql_1.Resolver()
], PositionsResolver);
exports.PositionsResolver = PositionsResolver;
//# sourceMappingURL=positions.js.map