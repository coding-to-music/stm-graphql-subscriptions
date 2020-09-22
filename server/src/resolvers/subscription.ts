import { Ctx, Resolver, Subscription } from "type-graphql";
import { useGetKanye } from "../utils/useGetKanye";

@Resolver()
export class SubscriptionResolver {
  @Subscription(() => String, {
    topics: "TIME",
  })
  async time(): Promise<any> {
    const date = new Date();
    const time = date.toISOString();
    return time;
  }

  @Subscription(() => String, {
    topics: "KANYE",
  })
  async kanye(@Ctx() ctx: any): Promise<any> {
    const tweet = await useGetKanye();
    return tweet;
  }

  @Subscription(() => String, {
    topics: "QUERY",
  })
  async query(): Promise<any> {
    return "user query";
  }
}
