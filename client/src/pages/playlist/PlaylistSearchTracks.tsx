import React, { Dispatch, SetStateAction, useState } from "react";
import Track from "../../components/track";
import * as P from "./playlist.style";
import * as T from "../../styles/components/track";
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
      dispatch(searchResultSlice.getAllSearchResults({ q: searchValue, limit: 10 }));
    }
  }

  return (
    <P.PlaylistDiscovery>
      <P.PlaylistDiscoveryHeaderWrapper>
        <P.PlaylistDiscoveryHeader>
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
        </P.PlaylistDiscoveryHeader>
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
              <Track key={track.id} item={track} variant={"playlist-add"} />
            ))}
          </T.TrackList>
        )}
      </P.TracklistWrapper>
    </P.PlaylistDiscovery>
  );
};

export default PlaylistSearchTracks;
