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
class Feed {
  @Field({ nullable: true })
  feed?: string;
}

@Resolver()
export class PositionsResolver {
  @Query(() => Feed)
  async getpositions(@Ctx() ctx: any) {
    const cache = await ctx.redis.get("positions");
    if (cache) {
      return cache;
    } else {
      const response = await useGetPositions();
      const feed = JSON.stringify(response.entity);
      await ctx.redis.set("positions", feed);
      await ctx.redis.expire("positions", 10);
      return { feed: feed };
    }
  }

  @Subscription(() => String, {
    topics: "POSITIONS",
  })
  async positions(@Ctx() ctx: any): Promise<any> {
    const cache = await ctx.redis.get("positions");
    return cache;
  }
}
