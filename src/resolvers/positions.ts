import {
  Ctx,
  Field,
  ObjectType,
  Query,
  Resolver,
  Subscription,
} from "type-graphql";
import { useGetPositions } from "../utils/useGetPositions";

@ObjectType()
class Header {
  @Field({ nullable: true })
  gtfsRealtimeVersion: string;
  @Field({ nullable: true })
  incrementality: string;
  @Field({ nullable: true })
  timestamp: string;
}

@ObjectType()
class VehicleTrip {
  @Field({ nullable: true })
  tripId: string;
  @Field({ nullable: true })
  startTime: string;
  @Field({ nullable: true })
  startDate: string;
  @Field({ nullable: true })
  routeId: string;
}

@ObjectType()
class Position {
  @Field({ nullable: true })
  latitude: number;
  @Field({ nullable: true })
  longitude: number;
  @Field({ nullable: true })
  bearing: number;
  @Field({ nullable: true })
  speed: number;
}

@ObjectType()
class Vehicle {
  @Field({ nullable: true })
  trip: VehicleTrip;
  @Field({ nullable: true })
  position: Position;
  @Field({ nullable: true })
  currentStopSequence: number;
  @Field({ nullable: true })
  currentStatus: string;
  @Field({ nullable: true })
  timestamp: string;
  @Field({ nullable: true })
  vehicle: { id: string };
  @Field({ nullable: true })
  occupancyStatus: string;
}

@ObjectType()
class Entity {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  vehicle: Vehicle;
}

@ObjectType()
class Feed {
  @Field(() => Header, { nullable: true })
  header: Header;
  @Field(() => [Entity], { nullable: true })
  entity: Entity[];
}

@Resolver()
export class PositionsResolver {
  @Query(() => Feed)
  async getpositions(@Ctx() ctx: any) {
    const cache = await ctx.redis.get("positions");
    if (cache) {
      const feed = JSON.parse(cache);
      return feed;
    } else {
      const feed = await useGetPositions();
      await ctx.redis.set("positions", JSON.stringify(feed));
      await ctx.redis.expire("positions", 11);
      return feed;
    }
  }

  @Subscription(() => Feed, {
    topics: "POSITIONS",
  })
  async positions(@Ctx() ctx: any): Promise<any> {
    const cache = await ctx.redis.get("positions");
    if (cache) {
      const feed = JSON.parse(cache);
      return feed;
    } else {
      const feed = await useGetPositions();
      await ctx.redis.set("positions", JSON.stringify(feed));
      await ctx.redis.expire("positions", 11);
      return feed;
    }
  }
}
