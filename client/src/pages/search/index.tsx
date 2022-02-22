import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BrowseCategories from "./BrowseCategories";
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

  return (
    <PageWrapper>
      <SearchHeader>
        <SearchTitle isSearching={isSearching || query !== ""}>
          Search
        </SearchTitle>
        <SearchBar
          type="text"
          value={query}
          placeholder="Artists, tracks or podcasts"
          onBlur={() => setIsSearching(false)}
          onFocus={() => setIsSearching(true)}
          onChange={(e) => handleOnChange(e)}
          isSearching={isSearching || query !== ""}
        />
        <ButtonGroup
          isSearching={searchResultStatus === "succeeded" || query !== ""}
        >
          <Button>Artist</Button>
          <Button>Album</Button>
          <Button>Track</Button>
          <Button>Playlist</Button>
        </ButtonGroup>
      </SearchHeader>
      <Container>
        {isSearching || query !== "" ? (
          query === "" ? (
            <NoResult>
              <MessageLarge>Play what you love</MessageLarge>
              <small>Search for artists, albums, tracks or playlists.</small>
            </NoResult>
          ) : (
            <div>
              {searchResults.artists &&
                searchResults.artists.items.map((artist) => (
                  <div key={artist.id}>
                    <img
                      src={artist.images[0]?.url}
                      height={32}
                      width={32}
                      alt=""
                    />
                    <p>{artist.name}</p>
                  </div>
                ))}
            </div>
          )
        ) : (
          <BrowseCategories />
        )}
      </Container>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SearchHeader = styled.div`
  position: relative;
`;

const SearchTitle = styled.h1<{ isSearching: boolean }>`
  visibility: ${({ isSearching }) => isSearching && "hidden"};
  transform: ${({ isSearching }) => isSearching && `translateY(-100%)`};
  opacity: ${({ isSearching }) => isSearching && 0};
  transition: visibility 0.6s ease-in-out,
    opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const SearchBar = styled.input<{ isSearching: boolean }>`
  position: relative;
  z-index: 10;
  width: 100%;
  margin-top: 4px;
  padding: 8px 14px;
  border-radius: 4px;
  border: 0;
  font-weight: 600;
  transform: ${({ isSearching }) => isSearching && `translateY(-100%)`};
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const ButtonGroup = styled.div<{ isSearching: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 32px;
  width: 100%;
  visibility: ${({ isSearching }) => (isSearching ? `visible` : `hidden`)};
  transform: ${({ isSearching }) => isSearching && `translateY(32px)`};
  opacity: ${({ isSearching }) => isSearching && 1};
  transition: visibility 0.2s ease-in-out,
    opacity 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
`;

const Button = styled.button`
  flex: 1;
  background-color: transparent;
  border: 1px solid currentColor;
  border-radius: 24px;
  padding: 2px 12px;
  font-size: 14px;
  color: currentColor;

  :not(:first-of-type) {
    margin-left: 8px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  flex: 1;
`;

const NoResult = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-top: -32px;
`;

const MessageLarge = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  margin-bottom: 4px;
`;

export default SearchPage;
