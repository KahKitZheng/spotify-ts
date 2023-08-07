import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Track from "@/components/Track";
import * as P from "./playlist.style";
import * as T from "@/components/Track/Track.style";
import { MEDIA } from "@/styles/media";
import { MdClose } from "react-icons/md";
import { DebounceInput } from "react-debounce-input";
import { useViewportWidth } from "@/hooks/useViewportWidth";
import { overflowNoScrollbar } from "@/styles/utils";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as searchResultSlice from "@/slices/searchResultSlice";

interface Props {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchTrackModal = (props: Props) => {
  const { modal, setModal } = props;

  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector(searchResultSlice.selectSearchResults);
  const isDesktop = useViewportWidth(+MEDIA.tablet.slice(0, -2));

  const closeModal = useCallback(() => {
    setQuery("");
    setModal(false);
  }, [setModal]);

  useEffect(() => {
    isDesktop && closeModal();
  }, [closeModal, isDesktop]);

  function handleOnChange(searchValue: string) {
    setQuery(searchValue);

    if (searchValue.length > 0) {
      dispatch(
        searchResultSlice.getAllSearchResults({ q: searchValue, limit: 10 })
      );
    }
  }

  return (
    <Modal isOpen={modal} style={SearchModal} onRequestClose={closeModal}>
      <SearchHeader>
        <P.PlaylistDiscoveryName>Add songs</P.PlaylistDiscoveryName>
        <CloseModal onClick={closeModal}>
          <MdClose />
        </CloseModal>
      </SearchHeader>
      <DebounceInput
        value={query}
        placeholder="Search for songs"
        element={SearchInput}
        debounceTimeout={600}
        onChange={(event) => handleOnChange(event.target.value)}
      />
      {query !== "" && (
        <TrackList>
          {searchResults.tracks?.items.map((track) => (
            <Track key={track.id} item={track} variant={"playlist-add-track"} />
          ))}
        </TrackList>
      )}
    </Modal>
  );
};

const SearchModal = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    inset: "5vh auto auto 5vw",
    backgroundColor: "#18191d",
    border: "0",
    height: "90vh",
    width: "90vw",
    display: "flex",
    flexDirection: "column" as const,
  },
};

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchInput = styled(P.SearchInput)`
  max-width: 100%;
`;

const CloseModal = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.font.text};
  border: 0;
  padding: 0;
  cursor: pointer;
`;

const TrackList = styled(T.TrackList)`
  ${overflowNoScrollbar};
`;

export default SearchTrackModal;
