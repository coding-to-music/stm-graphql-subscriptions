import { Ctx, Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  async hello(@Ctx() ctx: any) {
    await ctx.req.pubsub.publish("QUERY");
    return "hello";
  }
}
