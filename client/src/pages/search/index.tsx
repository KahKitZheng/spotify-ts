import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import BrowseCategories from "./BrowseCategories";
import SearchResults from "./SearchResults";
import { Tab, Tabs, TabList } from "react-tabs";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getCategories } from "../../slices/categoriesSlice";
import {
  startSearch,
  getAllSearchResults,
  selectAllSearchResults,
} from "../../slices/searchResultSlice";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const tabContainer = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(selectAllSearchResults);

  const categoriesStatus = useSelector(
    (state: RootState) => state.categories.status
  );
  const searchResultStatus = useSelector(
    (state: RootState) => state.searchResults.status
  );

  // Fetch all categories on render
  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(getCategories({ limit: 50 }));
    }
  }, [categoriesStatus, dispatch]);

  // Fetch user's search query after a delay
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchResultStatus === "idle" && query !== "") {
        dispatch(getAllSearchResults({ q: query, limit: 10 }));
      }
    }, 600);

    return () => clearTimeout(timeOutId);
  }, [query, searchResultStatus, dispatch, searchResults]);

  function handleOnChange(e: React.FormEvent<HTMLInputElement>) {
    setQuery(e.currentTarget.value);
    dispatch(startSearch());
  }

  function resetScroll() {
    if (tabContainer.current !== null) {
      tabContainer.current.scrollTop = 0;
    }
  }

  return (
    <PageWrapper>
      <SearchHeader>
        <SearchTitle $isSearching={isSearching || query !== ""}>
          Search
        </SearchTitle>
        <SearchInput
          type="text"
          value={query}
          placeholder="Artists, tracks or podcasts"
          onBlur={() => setIsSearching(false)}
          onFocus={() => setIsSearching(true)}
          onChange={(e) => handleOnChange(e)}
          $isSearching={isSearching || query !== ""}
        />
        {query !== "" && (
          <TabFilterList
            $isSearching={searchResultStatus === "succeeded" || query !== ""}
          >
            <FilterTab onClick={resetScroll}>Artist</FilterTab>
            <FilterTab onClick={resetScroll}>Album</FilterTab>
            <FilterTab onClick={resetScroll}>Track</FilterTab>
            <FilterTab onClick={resetScroll}>Playlist</FilterTab>
          </TabFilterList>
        )}
      </SearchHeader>
      <Container ref={tabContainer} $isSearching={isSearching || query !== ""}>
        {isSearching || query !== "" ? (
          /**
           * Difficult to split TabPanels into a separate component, a temporary
           * workaround to render the component is to use it as a function.
           *
           * src: https://github.com/reactjs/react-tabs/issues/253
           */
          SearchResults({ query, searchResults })
        ) : (
          <BrowseCategories />
        )}
      </Container>
    </PageWrapper>
  );
};

const PageWrapper = styled(Tabs)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SearchHeader = styled.div`
  position: relative;
`;

const SearchTitle = styled.h1<{ $isSearching: boolean }>`
  visibility: ${({ $isSearching }) => $isSearching && "hidden"};
  transform: ${({ $isSearching }) => $isSearching && `translateY(-100%)`};
  opacity: ${({ $isSearching }) => $isSearching && 0};
  transition: visibility 0.6s ease-in-out,
    opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
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

const TabFilterList = styled(TabList)<{ $isSearching: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 32px;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  visibility: ${({ $isSearching }) => ($isSearching ? `visible` : `hidden`)};
  transform: ${({ $isSearching }) => $isSearching && `translateY(32px)`};
  opacity: ${({ $isSearching }) => $isSearching && 1};
  transition: visibility 0.2s ease-in-out,
    opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const FilterTab = styled(Tab)`
  flex: 1;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white};
  border-radius: 6px;
  padding: 2px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.white};
  text-align: center;

  &:not(:first-of-type) {
    margin-left: 8px;
  }

  &.react-tabs__tab--selected {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.black};
    border-color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.white};
    color: white;
    border-color: #12ce66;
    background-color: #128454;
  }
`;

const Container = styled.div<{ $isSearching: boolean }>`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: -16px;
  padding-bottom: 16px;
  overflow: ${({ $isSearching }) => $isSearching && "auto"};
  flex: 1;
`;

export default SearchPage;
