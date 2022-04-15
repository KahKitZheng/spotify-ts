import { useCallback, useEffect, useState } from "react";

export const useWindowSize = () => {
  const main = document.querySelector("main");
  const mainPadding = 32;

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const updateWindowSize = useCallback(() => {
    if (main === null) return;

    setWindowWidth(main.clientWidth - mainPadding + 10);
    setWindowHeight(main.clientHeight - mainPadding - 48 + 16);
  }, [main]);

  // Set initial values for width and height
  useEffect(() => {
    updateWindowSize();
  }, [updateWindowSize]);

  // Set values for width and height on window resize
  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, [updateWindowSize]);

  return [windowWidth, windowHeight];
};
