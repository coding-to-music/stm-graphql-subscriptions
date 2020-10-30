export const WEBSOCKET =
  process.env.NEXT_PUBLIC_WEBSOCKET || `ws://localhost:4000/graphql`;

export const HTTP =
  process.env.NEXT_PUBLIC_HTTP || "http://localhost:4000/graphql";

export const COOKIE_NAME = "qid";

export const HOMEPAGE_URL = "https://anselbrandt.com";

export const HOMEPAGE_CODE = "https://github.com/anselbrandt/hacker-news-clone";

export const pages = [
  { path: "/gini", title: "Gini" },
  { path: "/charts", title: "Charts" },
  { path: "/map", title: "Map" },
  { path: "/posts", title: "Posts" },
];
