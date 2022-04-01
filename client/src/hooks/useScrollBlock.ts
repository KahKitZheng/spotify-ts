import { useAppDispatch, useAppSelector } from "../app/hooks";
import * as playlistSlice from "../slices/playlistSlice";

/**
 * Usage: const [blockScroll, allowScroll] = useScrollBlock();
 */
export const useScrollBlock = (): [() => void, () => void] => {
  const dispatch = useAppDispatch();
  const scrollPos = useAppSelector(playlistSlice.selectPlaylistScrollPos);
  const main = document.querySelector("main");

  const blockScroll = (): void => {
    if (main === null) return;

    const scrollTop = main.scrollTop;
    dispatch(playlistSlice.setScrollPos(Math.trunc(scrollTop)));

    // Dont add scrollbars if there is no overflow
    if (window.innerHeight < main.clientHeight) {
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
