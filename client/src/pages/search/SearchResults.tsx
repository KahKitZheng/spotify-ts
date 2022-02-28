import React from "react";
import styled from "styled-components";
import Card from "../../components/card";
import { TabPanel } from "react-tabs";
import { SearchResponse } from "../../types/SpotifyResponses";
import { CollectionGrid } from "../../components/collection";

type Props = {
  query: string;
  searchResults: SearchResponse;
};

const SearchResults = (props: Props) => {
  const { query, searchResults } = props;

  return query === "" ? (
    <NoResult>
      <MessageLarge>Play what you love</MessageLarge>
      <small>Search for artists, albums, tracks or playlists.</small>
    </NoResult>
  ) : (
    <>
      <TabPanel>
        <CollectionGrid>
          {searchResults.artists?.items.map((artist) => (
            <Card key={artist.id} variant="artist" item={artist} />
          ))}
        </CollectionGrid>
      </TabPanel>
      <TabPanel>
        <CollectionGrid>
          {searchResults.albums?.items.map((album) => (
            <Card key={album.id} variant="album" item={album} />
          ))}
        </CollectionGrid>
      </TabPanel>
      <TabPanel>
        <CollectionGrid>
          {searchResults.tracks?.items.map((track) => (
            <Card key={track.id} variant="track" item={track} />
          ))}
        </CollectionGrid>
      </TabPanel>
      <TabPanel>
        <CollectionGrid>
          {searchResults.playlists?.items.map((playlist) => (
            <Card key={playlist.id} variant="playlist" item={playlist} />
          ))}
        </CollectionGrid>
      </TabPanel>
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 8px));
  grid-gap: 16px;
`;

export default SearchResults;
