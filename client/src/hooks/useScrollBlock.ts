import { useState } from "react";

/**
 * Usage: const [blockScroll, allowScroll] = useScrollBlock();
 */
export const useScrollBlock = (): [() => void, () => void] => {
  const main = document.querySelector("main");
  const [scrollPos, setScrollPos] = useState(0);

  const blockScroll = (): void => {
    if (main === null) return;

    // Dont add scrollbars if there is no overflow
    if (window.innerHeight < main.clientHeight) {
      const scrollTop = main.scrollTop;

      setScrollPos(Math.trunc(scrollTop));

      // When the modal is shown, we want a fixed element
      main.style.position = "fixed";
      main.style.overflowY = "scroll";
      main.style.top = `-${scrollTop}px`;
      main.style.width = "calc(100% - 260px)";
      main.style.transform = "translateX(calc(260px))";
    }
  };

  const allowScroll = (): void => {
    if (main === null) return;

    main.style.position = "";
    main.style.overflowY = "";
    main.style.top = "";
    main.style.width = "";
    main.style.transform = "";

    main.scrollTo(0, scrollPos);
  };

  return [blockScroll, allowScroll];
};
