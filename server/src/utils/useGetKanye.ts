const fetch = require("node-fetch");

export const useGetKanye = async () => {
  const response = await fetch("https://api.kanye.rest", {
    method: "GET",
    mode: "no-cors",
    headers: {
      Accept: "*/*",
      "Cache-Control": "no-cache",
      Host: "api.kanye.rest",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Content-Length": "0",
    },
  });
  const json = await response.json();
  return json.quote;
};
