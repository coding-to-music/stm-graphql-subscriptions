import {
  __prod__,
  COOKIE_NAME,
  SECRET,
  DBUSERNAME,
  DBPASSWORD,
  DBNAME,
  REDIS_URL,
  DATABASE_URL,
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
import { PositionsResolver } from "./resolvers/positions";
import { useGetPositions } from "./utils/useGetPositions";

const PORT = process.env.PORT || 4000;

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url:
      DATABASE_URL ||
      `postgres://${DBUSERNAME}:${DBPASSWORD}@localhost:5432/${DBNAME}`,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot],
  });

  await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(REDIS_URL);
  await redis.flushall();

  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use((req: any, _, next: any) => {
    const token = req.headers.authorization;
    if (token) {
      req.headers.cookie = `${COOKIE_NAME}=${token}`;
    }
    next();
  });

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
    publisher: new Redis(REDIS_URL),
    subscriber: new Redis(REDIS_URL),
  });
  app.use((req: any, _, next: any) => {
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
      resolvers: [HelloResolver, PostResolver, UserResolver, PositionsResolver],
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
      async onConnect(_, webSocket: any) {
        console.log(
          "connected: ",
          webSocket.upgradeReq.headers["sec-websocket-key"]
        );
        await redis.incr("subscribers");
        const subscribers = await redis.get("subscribers");
        console.log("subscribers: ", subscribers);
      },
      async onDisconnect(webSocket: any) {
        console.log(
          "disconnected: ",
          webSocket.upgradeReq.headers["sec-websocket-key"]
        );
        const subscribers = await redis.get("subscribers");
        let numSubs = 0;
        if (subscribers && +subscribers > 0) {
          await redis.decr("subscribers");
          numSubs = parseInt(subscribers) - 1;
        }
        console.log("subscribers: ", numSubs);
      },
    },
  });
  apolloServer.applyMiddleware({ app, cors: false });
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`"server started on localhost:${PORT}`);
  });

  setInterval(async () => {
    const subscribers = await redis.get("subscribers");
    if (subscribers && +subscribers > 0) {
      const feed = await useGetPositions();
      await redis.set("positions", JSON.stringify(feed));
      await redis.expire("positions", 11);
      pubsub.publish("POSITIONS", null);
    }
  }, 11000);
};

main().catch((error) => {
  console.error(error);
});
