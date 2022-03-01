import React, { useEffect, useState } from "react";
import Track from "../../components/track";
import * as Tab from "../../styles/components/tabs";
import * as T from "../../styles/components/track";
import { useDispatch, useSelector } from "react-redux";
import { getTopTracks, selectTopTracks } from "../../slices/topItemsSlice";

type PeriodFilter = "short_term" | "medium_term" | "long_term";

const TopTracksPage = () => {
  const [filter, setFilter] = useState<PeriodFilter>("short_term");
  const dispatch = useDispatch();
  const topTracks = useSelector(selectTopTracks);

  useEffect(() => {
    if (topTracks[filter]?.limit !== 50) {
      dispatch(getTopTracks({ limit: 50, time_range: filter }));
    }
  }, [dispatch, filter, topTracks]);

  return (
    <Tab.PageWrapper>
      <Tab.TabHeader>
        <Tab.Tab
          $isActive={filter === "short_term"}
          onClick={() => setFilter("short_term")}
        >
          Last Month
        </Tab.Tab>
        <Tab.Tab
          $isActive={filter === "medium_term"}
          onClick={() => setFilter("medium_term")}
        >
          Last 6 Months
        </Tab.Tab>
        <Tab.Tab
          $isActive={filter === "long_term"}
          onClick={() => setFilter("long_term")}
        >
          All Time
        </Tab.Tab>
      </Tab.TabHeader>
      <Tab.TabView>
        {topTracks[filter]?.items.map((track, index) => (
          <Track key={track.id} variant="user-top" item={track} index={index} />
        ))}
      </Tab.TabView>
    </Tab.PageWrapper>
  );
};

export default TopTracksPage;
