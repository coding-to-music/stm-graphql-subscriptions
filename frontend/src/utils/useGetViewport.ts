import { useEffect, useState } from "react";

export const useGetViewport = () => {
  const isSSR = typeof window === "undefined";
  const [width, setWidth] = useState(isSSR ? 1200 : window.innerWidth);
  const [height, setHeight] = useState(isSSR ? 800 : window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });
  return { width, height };
};
