import React, { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import Track from "../../components/Track";
import * as P from "./playlist.style";
import * as T from "../../components/Track/Track.style";
import { MEDIA } from "../../styles/media";
import { MdClose } from "react-icons/md";
import { DebounceInput } from "react-debounce-input";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as searchResultSlice from "../../slices/searchResultSlice";

interface Props {
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  playlistSize: number;
}

const PlaylistSearchTracks = (props: Props) => {
  const [query, setQuery] = useState("");

  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(searchResultSlice.selectSearchResults);

  function handleOnChange(searchValue: string) {
    setQuery(searchValue);

    if (searchValue.length > 0) {
      const payload = { q: searchValue, limit: 10 };
      dispatch(searchResultSlice.getAllSearchResults(payload));
    }
  }

  return (
    <PlaylistSearchWrapper>
      <P.PlaylistDiscoveryHeaderWrapper>
        <div>
          <P.PlaylistDiscoveryName>
            Let&apos;s find something for your playlist
          </P.PlaylistDiscoveryName>
          <DebounceInput
            value={query}
            placeholder="Search for songs"
            element={P.SearchInput}
            debounceTimeout={600}
            onChange={(event) => handleOnChange(event.target.value)}
          />
        </div>
        <P.ToggleDiscovery
          $hide={props.isSearching && props.playlistSize === 0}
          onClick={() => props.setIsSearching(!props.isSearching)}
        >
          <MdClose />
        </P.ToggleDiscovery>
      </P.PlaylistDiscoveryHeaderWrapper>
      <P.TracklistWrapper>
        {query !== "" && (
          <T.TrackList>
            {searchResults.tracks?.items.map((track) => (
              <Track
                key={track.id}
                item={track}
                variant={"playlist-add-track"}
              />
            ))}
          </T.TrackList>
        )}
      </P.TracklistWrapper>
    </PlaylistSearchWrapper>
  );
};

const PlaylistSearchWrapper = styled(P.PlaylistDiscovery)`
  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  } ;
`;

export default PlaylistSearchTracks;
