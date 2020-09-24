import { Ctx, Resolver, Subscription, Query } from "type-graphql";
import { useGetPositions } from "../utils/useGetPositions";

@Resolver()
export class SubscriptionResolver {
  @Query(() => String)
  async getpositions(@Ctx() ctx: any) {
    const cache = await ctx.redis.get("positions");
    if (cache) {
      return cache;
    } else {
      const response = await useGetPositions();
      const feed = JSON.stringify(response);
      await ctx.redis.set("positions", feed);
      await ctx.redis.expire("positions", 10);
      return feed;
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
