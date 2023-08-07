import React from "react";
import styled from "styled-components";
import Card from "@/components/Card";
import * as Tab from "../../styles/components/tabs";
import { SearchResponse } from "../../types/SpotifyResponses";
import { CollectionGrid } from "@/components/Collection";

type Props = {
  query: string;
  searchResults: SearchResponse;
  currentTab: string;
};

const SearchResults = (props: Props) => {
  const { query, searchResults, currentTab } = props;

  return query === "" ? (
    <NoResult>
      <MessageLarge>Play what you love</MessageLarge>
      <small>Search for artists, albums, tracks or playlists.</small>
    </NoResult>
  ) : (
    <>
      {currentTab === "artists" && (
        <Tab.TabView>
          <CollectionGrid>
            {searchResults.artists?.items.map((artist) => (
              <Card key={artist.id} variant="artist" item={artist} />
            ))}
          </CollectionGrid>
        </Tab.TabView>
      )}
      {currentTab === "albums" && (
        <Tab.TabView>
          <CollectionGrid>
            {searchResults.albums?.items.map((album) => (
              <Card key={album.id} variant="album" item={album} />
            ))}
          </CollectionGrid>
        </Tab.TabView>
      )}
      {currentTab === "tracks" && (
        <Tab.TabView>
          <CollectionGrid>
            {searchResults.tracks?.items.map((track) => (
              <Card key={track.id} variant="track" item={track} />
            ))}
          </CollectionGrid>
        </Tab.TabView>
      )}
      {currentTab === "playlists" && (
        <Tab.TabView>
          <CollectionGrid>
            {searchResults.playlists?.items.map((playlist) => (
              <Card key={playlist.id} variant="playlist" item={playlist} />
            ))}
          </CollectionGrid>
        </Tab.TabView>
      )}
    </>
  );
};

// Styling for no displaying no search query or results
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

export default SearchResults;
