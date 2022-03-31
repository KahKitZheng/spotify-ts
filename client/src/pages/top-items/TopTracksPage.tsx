import React, { useEffect, useState } from "react";
import Track from "../../components/Track";
import * as Tab from "../../styles/components/tabs";
import * as T from "../../components/Track/Track.style";
import { useDispatch, useSelector } from "react-redux";
import * as topItemsSlice from "../../slices/topItemsSlice";
import { extractTrackId } from "../../utils";

const TopTracksPage = () => {
  const [filter, setFilter] = useState<topItemsSlice.TimeRange>("short_term");
  const dispatch = useDispatch();
  const topTracks = useSelector(topItemsSlice.selectTopTracks);

  useEffect(() => {
    if (topTracks[filter]?.limit !== 50) {
      dispatch(topItemsSlice.getTopTracks({ limit: 50, time_range: filter }));
    }

    if (topTracks[filter]?.items.length > 0) {
      const list = topTracks[filter].items;
      const ids = extractTrackId(list);
      const payload = { ids: ids, time_range: filter };
      dispatch(topItemsSlice.checkSavedTopTracks(payload));
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
        <T.TrackList>
          {topTracks[filter]?.items.map((track, index) => (
            <Track
              key={track.id}
              variant="user-top"
              item={track}
              index={index}
              timeRange={filter}
            />
          ))}
        </T.TrackList>
      </Tab.TabView>
    </Tab.PageWrapper>
  );
};

export default TopTracksPage;
