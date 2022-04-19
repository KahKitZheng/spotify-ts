import { Action } from "@reduxjs/toolkit";
import { Dispatch, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

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
