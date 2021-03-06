import { useCallback, useRef } from "react";

export const useInfiniteScroll = (
  status: string,
  hasMore: boolean,
  callBack: () => void
) => {
  const observer = useRef<IntersectionObserver | null>();

  const lastTrackRef = useCallback(
    (node) => {
      if (status === "loading") return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callBack();
        }
      });

      if (node) observer.current.observe(node);
    },
    [callBack, hasMore, status]
  );

  return lastTrackRef;
};
