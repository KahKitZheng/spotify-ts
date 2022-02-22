import React from "react";
import styled from "styled-components";
import Card from "../../components/card";
import { TabPanel } from "react-tabs";
import { SearchResponse } from "../../types/SpotifyResponses";

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
        <CardGrid>
          {searchResults.artists &&
            searchResults.artists.items.map((artist) => (
              <Card
                key={artist.id}
                imgSource={artist.images[0]?.url}
                title={artist.name}
                undertitle={artist.type}
              />
            ))}
        </CardGrid>
      </TabPanel>
      <TabPanel>
        <CardGrid>
          {searchResults.albums &&
            searchResults.albums.items.map((album) => (
              <Card
                key={album.id}
                imgSource={album.images[0]?.url}
                title={album.name}
                undertitle={`By ${album.artists[0].name}`}
              />
            ))}
        </CardGrid>
      </TabPanel>
      <TabPanel>
        <CardGrid>
          {searchResults.tracks &&
            searchResults.tracks.items.map((track) => (
              <Card
                key={track.id}
                imgSource={track.album.images[0]?.url}
                title={track.name}
                undertitle={`By ${track.artists[0].name}`}
              />
            ))}
        </CardGrid>
      </TabPanel>
      <TabPanel>
        <CardGrid>
          {searchResults.playlists &&
            searchResults.playlists.items.map((playlist) => (
              <Card
                key={playlist.id}
                imgSource={playlist.images[0]?.url}
                title={playlist.name}
                undertitle={`By ${playlist.owner.display_name}`}
              />
            ))}
        </CardGrid>
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
