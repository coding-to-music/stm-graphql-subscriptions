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
