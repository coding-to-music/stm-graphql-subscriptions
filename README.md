# stm-graphql-subscriptions

# 🚀 Javascript full-stack 🚀

https://github.com/coding-to-music/stm-graphql-subscriptions

https://stm-graphql-subscriptions.vercel.app

https://stm-graphql-subscriptions.herokuapp.com

by ansel brandt https://github.com/anselbrandt

https://ansel.vercel.app/map

https://github.com/anselbrandt/stm-graphql-subscriptions

## Environment Values

```java
export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const WEBSOCKET =
  process.env.NEXT_PUBLIC_WEBSOCKET || `ws://localhost:4000/graphql`;

export const HTTP =
  process.env.NEXT_PUBLIC_HTTP || "http://localhost:4000/graphql";

exports.CLIENT_ORIGIN = exports.DATABASE_URL = exports.REDIS_URL = exports.STMKEY = exports.DBPASSWORD = exports.DBUSERNAME = exports.DBNAME = exports.FORGET_PASSWORD_PREFIX = exports.SECRET = exports.COOKIE_NAME = exports.__prod__ = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.__prod__ = process.env.NODE_ENV === "production";
exports.COOKIE_NAME = "qid";
exports.SECRET = process.env.SECRET;
exports.FORGET_PASSWORD_PREFIX = "forget-password:";
exports.DBNAME = process.env.DB_NAME;
exports.DBUSERNAME = process.env.DB_USER;
exports.DBPASSWORD = process.env.DB_PASS;
exports.STMKEY = process.env.STMKEY;
exports.REDIS_URL = process.env.REDIS_URL || `127.0.0.1:6379`;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://mini.local:3000";
```

# Realtime GTFS Transit Data for Montreal

This app plots realtime [GTFS](https://developers.google.com/transit/gtfs-realtime) data from the [Montreal STM](https://developpeurs.stm.info) on a map, along with additional layers of data coming from [Montreal Open Data](https://donnees.montreal.ca).

The Express server fetches and caches data from the STM API every 11 seconds, then pushes the data to the client over a GraphQL subscription using WebSockets.

The frontend is built with React on Next.js and runs Uber's performant WebGL based mapping library, [Deck.gl](https://deck.gl).

## Built with

- [React](https://reactjs.org)
- [Next.js](https://nextjs.org)
- [Express](https://expressjs.com)
- [GraphQL](https://graphql.org)
- [Apollo](https://www.apollographql.com)
- [TypeGraphQL](https://typegraphql.com)
- [PostgreSQL](https://www.postgresql.org)
- [TypeORM](https://typeorm.io/)
- [Redis](https://redis.io)
- [Chakra UI](https://chakra-ui.com)
- [TypeScript](https://www.typescriptlang.org)

## GitHub

```java
git init
git add .
git remote remove origin
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:coding-to-music/stm-graphql-subscriptions.git
git push -u origin main
```

## Heroku

```java
heroku create stm-graphql-subscriptions

```

## Heroku MongoDB Environment Variables

```java
heroku config:set

heroku config:set MONGODB_URI="your value"
```

## Push to Heroku

```java
git push heroku

# or

npm run deploy
```
