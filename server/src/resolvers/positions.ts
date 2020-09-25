import {
  Ctx,
  Resolver,
  Subscription,
  Query,
  ObjectType,
  Field,
} from "type-graphql";
import { useGetPositions } from "../utils/useGetPositions";

@ObjectType()
class Position {
  @Field()
  latitude: number;
  @Field()
  longitude: number;
}

@ObjectType()
class Vehicle {
  @Field()
  id: string;
  @Field()
  isDeleted: boolean;
  @Field()
  tripId: string;
  @Field()
  startTime: string;
  @Field()
  startDate: string;
  @Field()
  routeId: string;
  @Field(() => Position, { nullable: true })
  position?: Position;
  @Field({ nullable: true })
  currentStopSequence: number;
  @Field({ nullable: true })
  currentStatus: number;
  @Field()
  timestamp: number;
  @Field({ nullable: true })
  vehicleId: string;
}

@ObjectType()
class Feed {
  @Field(() => [Vehicle], { nullable: true })
  feed?: Vehicle[];
  @Field()
  timestamp: number;
}

@Resolver()
export class PositionsResolver {
  @Query(() => Feed)
  async getpositions(@Ctx() ctx: any) {
    // const cache = await ctx.redis.get("positions");
    // await ctx.redis.set("positions", JSON.stringify(response));
    // await ctx.redis.expire("positions", 10);
    const response = await useGetPositions();
    const timestamp = response.header.timetamp;
    const feed = response.entity.map((entity: any) => {
      const id = entity.id;
      const isDeleted = entity.isDeleted;
      const tripId = entity.vehicle.trip.tripId;
      const startTime = entity.vehicle.trip.startTime;
      const startDate = entity.vehicle.trip.startDate;
      const routeId = entity.vehicle.trip.routeId;
      const latitude = entity.vehicle.position.latitude;
      const longitude = entity.vehicle.position.longitude;
      const currentStopSequence = entity.vehicle.trip.currentStopSequence;
      const currentStatus = entity.vehicle.trip.currentStatus;
      const vehicleTimestamp = entity.vehicle.timestamp.low;
      const vehicleId = entity.vehicle.vehicle.id;
      return {
        id: id,
        isDeleted: isDeleted,
        tripId: tripId,
        startTime: startTime,
        startDate: startDate,
        routeId: routeId,
        position: {
          latitude: latitude,
          longitude: longitude,
        },
        currentStopSequence: currentStopSequence,
        currentStatus: currentStatus,
        timestamp: vehicleTimestamp,
        vehicleId: vehicleId,
      };
    });
    return {
      feed: feed,
      timestamp: timestamp,
    };
  }

  @Subscription(() => String, {
    topics: "POSITIONS",
  })
  async positions(@Ctx() ctx: any): Promise<any> {
    const cache = await ctx.redis.get("positions");
    const json = JSON.parse(cache);
    return { feed: json.feed, timestamp: json.timestamp };
  }
}
