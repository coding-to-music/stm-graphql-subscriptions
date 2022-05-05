# stm-graphql-subscriptions

# 🚀 Javascript full-stack 🚀

https://github.com/coding-to-music/stm-graphql-subscriptions

https://stm-graphql-subscriptions.vercel.app

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

# From the Frontend directory README.md

# Example app with [chakra-ui](https://github.com/chakra-ui/chakra-ui)

This example features how to use [chakra-ui](https://github.com/chakra-ui/chakra-ui) as the component library within a Next.js app.

We are connecting the Next.js `_app.js` with `chakra-ui`'s Theme and ColorMode containers so the pages can have app-wide dark/light mode. We are also creating some components which shows the usage of `chakra-ui`'s style props.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-chakra-ui with-chakra-ui-app
# or
yarn create next-app --example with-chakra-ui with-chakra-ui-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/import?filter=next.js&utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

# From the server.md

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

# STM GTFS Feed

```
FeedMessage {
  entity: [
    FeedEntity {
      id: '25204',
      isDeleted: false,
      vehicle: [VehiclePosition]
    },
    FeedEntity {
      id: '25212',
      isDeleted: false,
      vehicle: [VehiclePosition]
    },
    FeedEntity {
      id: '25245',
      isDeleted: false,
      vehicle: [VehiclePosition]
    },
    ...more items
  ],
header: FeedHeader {
    gtfsRealtimeVersion: '1.0',
    incrementality: 0,
    timestamp: Long { low: 1600923386, high: 0, unsigned: true }
  }
```

### Feed Entity

`feed.entity[0]`

```
FeedEntity {
  id: '25204',
  isDeleted: false,
  vehicle: VehiclePosition {
    trip: TripDescriptor {
      tripId: '221219656',
      startTime: '00:43:00',
      startDate: '20200924',
      routeId: '138'
    },
    position: Position {
      latitude: 45.4726676940918,
      longitude: -73.61949920654297
    },
    currentStopSequence: 24,
    currentStatus: 2,
    timestamp: Long { low: 1600923523, high: 0, unsigned: true },
    vehicle: VehicleDescriptor { id: '25204' }
  }
}
```

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

Output

```
createdb YOUR_DATABASE_NAME

Command 'createdb' not found, but can be installed with:

sudo apt install postgresql-client-common
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

# // Tutorial //

https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart

# How To Install PostgreSQL on Ubuntu 20.04 [Quickstart]

Published on April 23, 2020 · Updated on March 17, 2022

Interactive PostgreSQL Databases Ubuntu Ubuntu 20.04

Quickstart

By Mark Drake  
Manager, Developer Education

English

# How To Install PostgreSQL on Ubuntu 20.04 [Quickstart]

## Introduction

PostgreSQL, or Postgres, is a relational database management system that provides an implementation of the SQL querying language. It’s standards-compliant and has many advanced features like reliable transactions and concurrency without read locks.

This guide demonstrates how to quickly get Postgres up and running on an Ubuntu 20.04 server, from installing PostgreSQL to setting up a new user and database. If you’d prefer a more in-depth tutorial on installing and managing a PostgreSQL database, see How To Install and Use PostgreSQL on Ubuntu 20.04.

## Prerequisites

To follow along with this tutorial, you will need one Ubuntu 20.04 server that has been configured by following our Initial Server Setup for Ubuntu 20.04 guide. After completing this prerequisite tutorial, your server should have a non-root user with sudo permissions and a basic firewall.

You can also use an interactive terminal that is embedded on this page to experiment with installing and configuring PostgreSQL in this tutorial. Click the following Launch an Interactive Terminal! button to get started.

## Launch an Interactive Terminal!

## Step 1 — Installing PostgreSQL

To install PostgreSQL, first refresh your server’s local package index:

```java
sudo apt update
```

Then, install the Postgres package along with a -contrib package that adds some additional utilities and functionality:

```java
sudo apt install postgresql postgresql-contrib
```

Ensure that the service is started:

```java
sudo systemctl start postgresql.service
```

## Step 2 — Using PostgreSQL Roles and Databases

By default, Postgres uses a concept called “roles” to handle authentication and authorization. These are, in some ways, similar to regular Unix-style users and groups.

Upon installation, Postgres is set up to use ident authentication, meaning that it associates Postgres roles with a matching Unix/Linux system account. If a role exists within Postgres, a Unix/Linux username with the same name is able to sign in as that role.

The installation procedure created a user account called postgres that is associated with the default Postgres role. There are a few ways to utilize this account to access Postgres. One way is to switch over to the postgres account on your server by running the following command:

```java
sudo -i -u postgres
```

Then you can access the Postgres prompt by running:

```java
psql
```

This will log you into the PostgreSQL prompt, and from here you are free to interact with the database management system right away.

To exit out of the PostgreSQL prompt, run the following:

```java
\q
```

This will bring you back to the postgres Linux command prompt. To return to your regular system user, run the exit command:

```java
exit
```

Another way to connect to the Postgres prompt is to run the psql command as the postgres account directly with sudo:

```java
sudo -u postgres psql
```

This will log you directly into Postgres without the intermediary bash shell in between.

Again, you can exit the interactive Postgres session by running the following:

```java
\q
```

## Step 3 — Creating a New Role

If you are logged in as the postgres account, you can create a new role by running the following command:

```java
createuser --interactive
```

If, instead, you prefer to use sudo for each command without switching from your normal account, run:

```java
sudo -u postgres createuser --interactive
```

Either way, the script will prompt you with some choices and, based on your responses, execute the correct Postgres commands to create a user to your specifications.

Output

```java
Enter name of role to add: sammy
Shall the new role be a superuser? (y/n) y
```

## Step 4 — Creating a New Database

Another assumption that the Postgres authentication system makes by default is that for any role used to log in, that role will have a database with the same name which it can access.

This means that if the user you created in the last section is called sammy, that role will attempt to connect to a database which is also called “sammy” by default. You can create the appropriate database with the createdb command.

If you are logged in as the postgres account, you would type something like the following:

```java
createdb sammy
```

If, instead, you prefer to use sudo for each command without switching from your normal account, you would run:

```java
sudo -u postgres createdb sammy
```

## Step 5 — Opening a Postgres Prompt with the New Role

To log in with ident based authentication, you’ll need a Linux user with the same name as your Postgres role and database.

If you don’t have a matching Linux user available, you can create one with the adduser command. You will have to do this from your non-root account with sudo privileges (meaning, not logged in as the postgres user):

```java
sudo adduser sammy
```

Once this new account is available, you can either switch over and connect to the database by running the following:

```java
sudo -i -u sammy
psql
```

Or, you can do this inline:

```java
sudo -u sammy psql
```

This command will log you in automatically, assuming that all of the components have been properly configured.

If you want your user to connect to a different database, you can do so by specifying the database like the following:

```java
psql -d postgres
```

Once logged in, you can get check your current connection information by running:

```java
sammy=# \conninfo
```

```java
Output
You are connected to database "sammy" as user "sammy" via socket in "/var/run/postgresql" at port "5432".
```

## Conclusion

You are now set up with PostgreSQL on your Ubuntu 20.04 server. If you’d like to learn more about Postgres and how to use it, we encourage you to check out the following guides:

- A comparison of relational database management systems
- Practice running queries with SQL

Swayne
Posted on Mar 23, 2021 • Updated on Apr 13, 2021

# Deploying a PostgresQL, Redis, GraphQL backend and frontend the easiest way!

https://dev.to/lastnameswayne/deploying-a-postgresql-redis-graphql-backend-and-frontend-the-easiest-way-4gob

#

docker

#

graphql

#

redis

#

nextjs
Hey, Swayne here. I am currently in the process of trying out different backend-hosting options. I have used Heroku for a MERN-app, which was a decent experience but I like DigitalOcean better!

Back-end📦
Today I will be deploying a PSQL and Redis-server backend project. The hosting provider I will use is in a DigitalOcean droplet with Docker installed!

DockerHub illustration

In short: A digitalocean droplet is a virtual machine on a server, which will host your backend. You use dokku to setup your database and redis-server and then you can use Docker to push (upload) your code. After ssh'ing into your droplet you can docker pull the code and then build the app

Stack:

DigitalOcean🌊
Dokku💧
Docker🐳
DockerHub💙
Getting started!🔜
First you will want to create an account on DigitalOcena, you can use this link to get $100 worth of credits for 60 days. Not an affiliate link 😂

Setting up your droplet✏️
Choose the datacenter nearest to you, for me that is Frankfurt. I set up monitoring as well, but that is personal preference.

To generate an ssh key you will have to run:
ssh-keygen
After getting the key file in the default directory you can run
cat ~/.ssh/id_rsa.pub
And paste the contents in the window on DigitalOcean.

Now you just need to give your droplet a name and wait for it to be ready!

Setting up Dokku with PSQL and Redis🎮
Next, you have to copy the ipv4 and paste it into your browser search field

My droplet

On this page you can scroll down and check off "Use virtualhost naming for apps" and press finish setup.

Run this command in your terminal. This will let you be able to make commands in the digital ocean droplet's virtual machine.
ssh root@[your code here]
I will refer to this as "ssh into" your app.

Create a dokku app with this command:
dokku apps:create app
The last value is the name, so I have named mine "app". Install PSQL by this command:
sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git
The link links to documenation for the postgres for dokku plugin where you can find some commands. To create a database in dokku:
dokku postgres:create database
The last value is, once again, the name. To link the database named "database" to the app named "app". Note: the command takes the names:
dokku postgres:link database app
We are now done with the database for now.

Moving on to redis, we are going to need the documentation for the plugin.
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis
To create the redis-server on dokku:
dokku redis:create server
The last value is once again the name, so I have chosen "server".

Now we have to link the server to the app. Again, by the names:
dokku redis:link server app
Now we are done with PSQL and Redis and ready to deploy our app. Verify that it worked by:
docker container list
You should see a redis- and postgres instance running.

Docker🐳
Depending on your application, you are going to need a different Dockerfile in your database project folder. I will be deploying a Node.js app, so mine looks like this:
FROM node:14

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies

# A wildcard is used to ensure both package.json AND package-lock.json are copied

# where available (npm@5+)

COPY package.json ./
COPY yarn.lock ./
COPY . .

RUN yarn

COPY .env.production .env

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "dist/index.js" ]
USER node
A dockerfile is a set of instructions to run your app, and can therefore vary wildly between projects. I would recommend checking out the Docker docs, since it's a lengthy subject which I won't cover here.

When your Dockerfile is ready, you can run docker build:
docker build -t lastnameswayne/crudapp:1 .
The format is: docker build -t /: .

"lastnameswayne" is my username and "crudapp" is the app name which I want and it's version number one. Docker build will create an image which we will later push onto Docker Hub.

If you are on an M1 Macbook (or any other ARM chip) you have to run this build-command instead
docker buildx create --use
docker buildx build --platform linux/amd64 --push -t lastnameswayne/crudapp:1 .
Using these two commands we can build to the correct image, linux/amd64 instead of the default arm64. You might need to enable buildx in the docker settings under "experimental features".

Using DockerHub to transfer your code 🫂
Now it's time to visit Docker Hub and sign up/in. You might need to login from the command line aswell by running "docker login"

Now, we can push our Docker Image onto Docker Hub:
docker push lastnameswayne/crudapp:1
You can reuse the name from the docker build command.

We now need to use our server again, so ssh into your app again. We can pull the Docker image from Docker Hub by the command:
docker pull lastnameswayne/crudapp:1
We have now successfully pushed our code from our local computer into and pulled it into the ssh, using Docker as a sort of middleman. We are now almost done! Tag the image you just pulled down, so we can link it to the dokku app:
docker tag lastnameswayne/crudapp:1 dokku/app:latest
The last value you write as dokku/:

In the beginning I named by dokku app "app" and "latest" is the tagname that I have chosen. We can now deploy using the tagname and appname.
dokku deploy app latest
If this command worked, your backend is now deployed on the droplet. Let's move on to the front-end. I also like to setup letsencrypt and a domain, but that's very project-specific so I didn't include it. But please, let me know if you need help. It's not difficult, just hard to show in an article =)

Front-end⚛️
I will be using Vercel to deply my React and next.js app. Vercel are the creator of next.js, and has made it relatively easy to deploy a front-end project using their platform.

This is a lot easier. After making an account you can simply run
vercel login
vercel --prod
Logs you into Vercel and creates a production build of your project, then deploys it to a server. This is all you really need.

‼️Remember to set your environment variables‼️
Back-end:

Likely in your .env-file

Front-end:

In next.js you can set it in the settings on next.js and in your .env-file. Further instructions.
