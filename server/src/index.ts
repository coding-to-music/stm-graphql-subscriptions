import {
  __prod__,
  COOKIE_NAME,
  SECRET,
  DBUSERNAME,
  DBPASSWORD,
  DBNAME,
} from "./constants";
import path from "path";
import http from "http";
import express from "express";
import session from "express-session";
import cors from "cors";
import { createConnection } from "typeorm";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Updoot } from "./entities/Updoot";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createUserLoader } from "./utils/createUserLoader";
import { createUpdootLoader } from "./utils/createUpdootLoader";
import { SubscriptionResolver } from "./resolvers/subscription";
import { useGetPositions } from "./utils/useGetPositions";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: DBNAME,
    username: DBUSERNAME,
    password: DBPASSWORD,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });

  await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  await redis.flushall();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: SECRET,
      resave: false,
    })
  );
  const pubsub = new RedisPubSub({
    publisher: new Redis(),
    subscriber: new Redis(),
  });
  app.use((req: any, res: any, next: any) => {
    req.pubsub = pubsub;
    next();
  });
  app.get("/", (_, res) => {
    res.send("hello");
  });

  await redis.set("subscribers", 0);
  await redis.set("positions", "random text");
  await redis.expire("positions", 10);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver,
        UserResolver,
        SubscriptionResolver,
      ],
      pubSub: pubsub,
      validate: false,
    }),
    context: ({ req, res }) => {
      return {
        req,
        res,
        redis,
        pubsub,
        userLoader: createUserLoader(),
        updootLoader: createUpdootLoader(),
      };
    },
    subscriptions: {
      async onConnect(connectionParams, webSocket: any) {
        console.log(
          "connected: ",
          webSocket.upgradeReq.headers["sec-websocket-key"]
        );
        redis.incr("subscribers");
        const subscribers = await redis.get("subscribers");
        console.log("subscribers: ", subscribers);
      },
      async onDisconnect(webSocket: any) {
        console.log(
          "disconnected: ",
          webSocket.upgradeReq.headers["sec-websocket-key"]
        );
        redis.decr("subscribers");
        const subscribers = await redis.get("subscribers");
        console.log("subscribers: ", subscribers);
      },
    },
  });
  apolloServer.applyMiddleware({ app, cors: false });
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  httpServer.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
  setInterval(async () => {
    const response = await useGetPositions();
    const feed = JSON.stringify(response);
    await redis.set("positions", feed);
    pubsub.publish("POSITIONS", null);
  }, 10000);
  const positions = await redis.get("positions");
  console.log(positions !== "null" ? positions : "empty");
};

main().catch((error) => {
  console.error(error);
});
