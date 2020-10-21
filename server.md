# Server

### Installation

Install dev dependencies:

`@types/connect-redis @types/cors @types/express @types/express-session @types/ioredis @types/node @types/redis nodemon typescript`

Install application dependencies:

`apollo-server-express connect-redis cors dotenv express express-session graphql ioredis pg type-graphql typeorm`

Add typescript config file:

```
npx tsconfig.json
```

Add/replace the following scripts:

```
"watch": "tsc -w",
"dev": "nodemon dist/index.js",
"start": "node dist/index.js",
```

### Database Setup (PostgreSQL)

```
createdb YOUR_DATABASE_NAME
```

Configure `.env` file from `sample.env` file

```
DB_USER=your_postgresql_username
DB_PASS=your_postgresql_password
DB_NAME=your_postgresql_db_name
SECRET=your_cookie_secret
```

### Development

To compile and watch for file changes, run:

`npm run-script watch` or `yarn watch`

In a seperate terminal, to start your app, run:

`npm run-script dev` or `yarn dev`

### GraphQL

GraphQL Playground will be available at:

`http://localhost:4000/graphql`
