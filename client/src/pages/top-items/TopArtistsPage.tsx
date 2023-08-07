import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import * as Tab from "@/styles/components/tabs";
import { useDispatch, useSelector } from "react-redux";
import { getTopArtists, selectTopArtists } from "@/slices/topItemsSlice";
import { CollectionGrid } from "@/components/Collection";

type Period = "short_term" | "medium_term" | "long_term";

const TopArtistsPage = () => {
  const [filter, setFilter] = useState<Period>("short_term");

  const dispatch = useDispatch();
  const topArtists = useSelector(selectTopArtists);

  useEffect(() => {
    if (topArtists[filter]?.limit !== 50) {
      dispatch(getTopArtists({ limit: 50, time_range: filter }));
    }
  }, [dispatch, filter, topArtists]);

  return (
    <Tab.PageWrapper>
      <Tab.TabHeader>
        <div>
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
        </div>
      </Tab.TabHeader>
      <Tab.TabView>
        <CollectionGrid>
          {topArtists[filter]?.items.map((artist) => (
            <Card key={artist.id} variant="artist" item={artist} />
          ))}
        </CollectionGrid>
      </Tab.TabView>
    </Tab.PageWrapper>
  );
};

export default TopArtistsPage;
