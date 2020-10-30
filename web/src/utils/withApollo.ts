import { createWithApollo } from "./createWithApollo";
import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";
import { NextPageContext } from "next";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { WEBSOCKET, HTTP } from "../../constants";

const wsLink: any = process.browser
  ? new WebSocketLink({
      // if you instantiate in the server, the error will be thrown
      uri: WEBSOCKET,
      options: {
        reconnect: true,
      },
    })
  : null;

const httplink = new HttpLink({
  uri: HTTP,
  credentials: "include",
});

const link = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httplink
    )
  : httplink;

const authLink = setContext((_: any, { headers }: any) => {
  const cookie =
    typeof document !== "undefined" && document.cookie
      ? document.cookie
          .split("; ")
          .find((row: any) => row.startsWith("qid"))!
          .split("=")[1]
      : undefined;
  return {
    headers: {
      ...headers,
      authorization: cookie ? cookie : "",
    },
  };
});

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    // uri: "http://localhost:4000/graphql",
    link: authLink.concat(link),
    credentials: "include" as const,
    headers: {
      cookie:
        (typeof window === "undefined"
          ? ctx?.req?.headers.cookie
          : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
