import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SearchTabs from "./SearchTabs";
import SearchResults from "./SearchResults";
import BrowseCategories from "./BrowseCategories";
import * as Tabs from "../../styles/components/tabs";
import { DebounceInput } from "react-debounce-input";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as categoriesSlice from "../../slices/categoriesSlice";
import * as searchResultSlice from "../../slices/searchResultSlice";
import * as currentUserSlice from "../../slices/currentUserSlice";

const tabs = ["artists", "albums", "tracks", "playlists"];
export type resultsTabs = "artists" | "albums" | "tracks" | "playlists";

const SearchPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0] as resultsTabs);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useAppDispatch();
  const userCountry = useAppSelector(currentUserSlice.selectCurrentUserCountry);
  const searchResults = useAppSelector(searchResultSlice.selectSearchResults);
  const categoriesStatus = useAppSelector(categoriesSlice.selectCategoriesStatus);

  useEffect(() => {
    if (categoriesStatus === "idle" && userCountry !== undefined) {
      dispatch(categoriesSlice.getCategories({ limit: 50, country: userCountry }));
    }
  }, [categoriesStatus, dispatch, userCountry]);

  function handleOnChange(searchValue: string) {
    setQuery(searchValue);
    dispatch(searchResultSlice.getAllSearchResults({ q: searchValue, limit: 30 }));
  }

  return (
    <Tabs.PageWrapper>
      <SearchHeader>
        <SearchTitle $isSearching={isSearching || query !== ""}>Search</SearchTitle>
        <DebounceInput
          value={query}
          placeholder="Artists, tracks or podcasts"
          element={SearchInput}
          debounceTimeout={600}
          onBlur={() => setIsSearching(false)}
          onFocus={() => setIsSearching(true)}
          onChange={(event) => handleOnChange(event.target.value)}
          $isSearching={isSearching || query !== ""}
        />
        {query !== "" && (
          <SearchTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </SearchHeader>

      {isSearching || query !== "" ? (
        <SearchResults query={query} searchResults={searchResults} currentTab={activeTab} />
      ) : (
        <BrowseCategories />
      )}
    </Tabs.PageWrapper>
  );
};

const SearchHeader = styled.div`
  position: relative;
`;

const SearchTitle = styled.h1<{ $isSearching: boolean }>`
  visibility: ${({ $isSearching }) => $isSearching && "hidden"};
  transform: ${({ $isSearching }) => $isSearching && `translateY(-100%)`};
  opacity: ${({ $isSearching }) => $isSearching && 0};
  transition: visibility 0.6s ease-in-out, opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const SearchInput = styled.input<{ $isSearching: boolean }>`
  position: ${({ $isSearching }) => $isSearching && "sticky"};
  top: 16px;
  z-index: 10;
  width: 100%;
  margin-top: 4px;
  padding: 8px 14px;
  border-radius: 4px;
  border: 0;
  font-weight: 600;
  transform: ${({ $isSearching }) => $isSearching && `translateY(-100%)`};
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

export default SearchPage;
