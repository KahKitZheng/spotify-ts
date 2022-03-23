import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Track from "../../components/track";
import ActionBar from "../../components/actionbar";
import * as H from "../../styles/components/headers";
import * as T from "../../styles/components/track";
import { useDebounce } from "../../hooks";
import { useParams } from "react-router-dom";
import { MEDIA } from "../../styles/media";
import { MdClose } from "react-icons/md";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectCurrentUserId } from "../../slices/currentUserSlice";
import {
  extractTrackId,
  formatAddedAt,
  formatDuration,
  stringToHSL,
  random,
} from "../../utils";
import {
  checkSavedPlaylist,
  checkSavedPlaylistTracks,
  countPlaylistDuration,
  editCurrentPlaylistDetails,
  getPlaylistInfo,
  getPlaylistTracksWithOffset,
  removeSavedPlaylist,
  savePlaylist,
  selectPlaylistStatus,
  setPlaylistStatus,
} from "../../slices/playlistSlice";
import {
  selectPlaylist,
  selectPlaylistDuration,
} from "../../slices/playlistSlice";
import { editPlaylistDetails } from "../../slices/currentUserPlaylistsSlice";
import {
  getAllSearchResults,
  selectAllSearchResults,
} from "../../slices/searchResultSlice";
import {
  recommendPlaylistTracks,
  selectRecommendedPlaylistTracks,
} from "../../slices/recommendationSlice";

Modal.setAppElement("#root");

const PlaylistPage = () => {
  // Component state
  const { id } = useParams();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [fetchOffset, setFetchOffset] = useState(0);
  const [gradient, setGradient] = useState(`hsl(0, 0%, 40%)`);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const debouncedValue = useDebounce<string>(query, 600);

  // Store state
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectCurrentUserId);
  const playlist = useAppSelector(selectPlaylist);
  const playlistStatus = useAppSelector(selectPlaylistStatus);
  const playlistDuration = useAppSelector(selectPlaylistDuration);
  const searchResults = useAppSelector(selectAllSearchResults);
  const recommendedTracks = useAppSelector(selectRecommendedPlaylistTracks);

  /** Fetch playlist info */
  const fetchPlaylistInfo = useCallback(() => {
    if (playlist.id !== id && playlistStatus === "succeeded") {
      dispatch(setPlaylistStatus("idle"));
    }

    if (id !== undefined && playlistStatus === "idle") {
      dispatch(getPlaylistInfo({ playlist_id: id }));
    }
  }, [dispatch, id, playlist.id, playlistStatus]);

  /** Check whether the current user has liked the playlist */
  const fetchPlaylistIsSaved = useCallback(() => {
    if (playlistStatus === "succeeded") {
      dispatch(checkSavedPlaylist({ playlist_id: playlist.id, userId }));
    }
  }, [dispatch, playlist.id, playlistStatus, userId]);

  /** Fetch remaining playlist tracks if there is any */
  const fetchAllPlaylistTracks = useCallback(() => {
    const playlistItems = playlist.tracks?.items;
    const hasMoreTracks = playlist.tracks?.next;

    if (fetchOffset >= playlistItems?.length && hasMoreTracks !== null) {
      dispatch(getPlaylistTracksWithOffset(hasMoreTracks));
    }
  }, [dispatch, fetchOffset, playlist.tracks?.items, playlist.tracks?.next]);

  /** Check if current user has liked one of the playlist tracks */
  const fetchSavedTracks = useCallback(() => {
    const list = playlist.tracks?.items;
    const incrementBy = 50;
    const startIndex = fetchOffset;
    const endIndex = fetchOffset + incrementBy;

    if (startIndex < list?.length) {
      const ids = extractTrackId(list?.slice(startIndex, endIndex));
      dispatch(checkSavedPlaylistTracks({ startIndex, ids }));
      setFetchOffset(endIndex);
    }
  }, [dispatch, fetchOffset, playlist.tracks?.items]);

  /** Fetch tracks based on the search input */
  const fetchQueryTracks = useCallback(() => {
    if (query !== "" && debouncedValue) {
      dispatch(getAllSearchResults({ q: query, limit: 30 }));
    }
  }, [dispatch, query, debouncedValue]);

  const fetchRecommendedTracks = useCallback(() => {
    const playlistItems = playlist.tracks?.items;
    const seed = [];

    if (playlistItems?.length === 1) {
      seed.push(playlistItems[0].track.id);
    } else if (playlistItems?.length > 1) {
      for (let index = 0; index < 5; index++) {
        const randomSeed = random(1, playlistItems?.length);
        seed.push(playlistItems[randomSeed].track.id);
      }
    }

    if (playlistItems?.length !== 0) {
      dispatch(recommendPlaylistTracks({ seed, limit: 20 }));
    }
  }, [dispatch, playlist.tracks?.items]);

  /** Calculate the playlist duration after all tracks has been fetched */
  const setPlaylistdDuration = useCallback(() => {
    if (playlist.tracks?.next === null) {
      dispatch(countPlaylistDuration());
    }
  }, [dispatch, playlist.tracks?.next]);

  /** Set the background gradient */
  const setPlaylistBackground = useCallback(() => {
    playlist.tracks?.items.length > 0
      ? setGradient(stringToHSL(playlist.name))
      : setGradient(`hsl(0, 0%, 40%)`);
  }, [playlist.name, playlist.tracks?.items.length]);

  useEffect(() => {
    fetchPlaylistInfo();
    fetchPlaylistIsSaved();
  }, [fetchPlaylistInfo, fetchPlaylistIsSaved]);

  useEffect(() => {
    fetchAllPlaylistTracks();
    setPlaylistBackground();
    setPlaylistdDuration();
  }, [fetchAllPlaylistTracks, setPlaylistBackground, setPlaylistdDuration]);

  useEffect(() => {
    playlist.id !== id ? setFetchOffset(0) : fetchSavedTracks();
  }, [fetchSavedTracks, id, playlist.id]);

  useEffect(() => {
    fetchRecommendedTracks();
    fetchQueryTracks();
  }, [fetchQueryTracks, fetchRecommendedTracks]);

  function handleSaveTrack(isSaved?: boolean) {
    isSaved
      ? dispatch(removeSavedPlaylist(playlist.id))
      : dispatch(savePlaylist(playlist.id));
  }

  function handleShowModal() {
    setPlaylistName(playlist.name);
    setPlaylistDescription(playlist.description || "");

    playlist.owner.id === userId ? setModal(true) : setModal(false);
  }

  function handleEditPlaylist() {
    const id = playlist.id;
    const name = playlistName;
    const description = playlistDescription;

    dispatch(editPlaylistDetails({ id, name, description }));
    dispatch(editCurrentPlaylistDetails({ id, name, description }));
    setModal(false);
  }

  return id === playlist.id ? (
    <div>
      <H.HeaderWrapper $bgGradient={gradient}>
        {playlist.images[0] === undefined ? (
          <H.ThumbnailPlaceholder
            $isOwner={playlist.owner.id === userId}
            onClick={() => handleShowModal()}
          >
            {playlist.name.slice(0, 1)}
          </H.ThumbnailPlaceholder>
        ) : (
          <H.Thumbnail
            src={playlist.images && playlist.images[0].url}
            onClick={() => handleShowModal()}
            $isOwner={playlist.owner.id === userId}
            alt=""
          />
        )}
        <div>
          <H.HeaderExtraInfo>
            By <PlaylistOwner>{playlist.owner?.display_name}</PlaylistOwner>
          </H.HeaderExtraInfo>
          <H.HeaderName
            $isOwner={playlist.owner.id === userId}
            onClick={() => handleShowModal()}
          >
            {playlist.name?.split("/").join("/ ")}
          </H.HeaderName>
          {playlist.description && (
            <PlaylistDescription
              dangerouslySetInnerHTML={{ __html: playlist.description }}
            />
          )}
          <H.HeaderStats>
            {playlist.followers?.total.toLocaleString()} likes
            <span className="bull">&bull;</span>
            {playlist.tracks?.total} songs,{" "}
            {formatDuration(playlistDuration, "playlist")}
          </H.HeaderStats>
        </div>
      </H.HeaderWrapper>
      <ActionBar
        isSaved={playlist.is_saved}
        handleClick={() => handleSaveTrack(playlist.is_saved)}
      />
      {playlist.tracks.items?.length > 0 && (
        <T.TrackList>
          {playlist.tracks?.items.map((item, index) => (
            <Track
              key={item.track.id}
              variant="playlist"
              index={index}
              item={item.track}
              addedAt={
                item.added_at !== null ? formatAddedAt(item.added_at) : ""
              }
            />
          ))}
        </T.TrackList>
      )}

      {playlist.owner.id === userId ? (
        <PlaylistSection>
          <PlaylistSectionName>
            Let&apos;s find something for your playlist
          </PlaylistSectionName>
          <SearchInput
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs"
          />
          {query !== "" && (
            <T.TrackList>
              {searchResults.tracks?.items.map((track) => (
                <Track key={track.id} item={track} variant={"playlist-add"} />
              ))}
            </T.TrackList>
          )}
        </PlaylistSection>
      ) : null}

      {playlist.owner.id === userId ? (
        <PlaylistSection>
          <PlaylistHeader>
            <div>
              <PlaylistSectionName>Recommended</PlaylistSectionName>
              <small>Based on what&apos;s in this playlist</small>
            </div>
            <RefreshRecommendation>refresh</RefreshRecommendation>
          </PlaylistHeader>
          <T.TrackList>
            {recommendedTracks.tracks?.map((track) => (
              <Track key={track.id} item={track} variant={"playlist-add"} />
            ))}
          </T.TrackList>
        </PlaylistSection>
      ) : null}

      {/* Edit playlist modal */}
      <Modal
        isOpen={modal}
        style={EditModal}
        onRequestClose={() => setModal(false)}
      >
        <Form action="" method="dialog">
          <FormHeader>
            <h1>Edit details</h1>
            <CloseModal onClick={() => setModal(false)}>
              <MdClose />
            </CloseModal>
          </FormHeader>
          <FormBody>
            <FormThumbnail>
              {playlist.images[0] === undefined ? (
                <EditThumbnail>{playlist.name.slice(0, 1)}</EditThumbnail>
              ) : (
                <img src={playlist.images[0].url} alt="" />
              )}
            </FormThumbnail>
            <FormInputGroup>
              <EditTitle
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
              <EditDescription
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Add an optional description"
              />
            </FormInputGroup>
          </FormBody>
          <FormFooter>
            <SaveButton onClick={() => handleEditPlaylist()}>Save</SaveButton>
          </FormFooter>
        </Form>
      </Modal>
    </div>
  ) : null;
};

const PlaylistOwner = styled.span`
  color: ${({ theme }) => theme.font.title};
  font-weight: 600;
`;

const PlaylistDescription = styled.p`
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
  color: #cecece;
`;

const PlaylistSection = styled.section`
  position: relative;
  margin-top: 16px;
`;

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PlaylistSectionName = styled.h2`
  font-size: 20px;
  line-height: 1.2;

  @media (min-width: ${MEDIA.tablet}) {
    font-size: revert;
  }
`;

const RefreshRecommendation = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 0;
  margin-right: 16px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s ease-in;

  &:hover {
    transform: scale(1.1);
  }
`;

const SearchInput = styled.input`
  margin-top: 12px;
  padding: 4px 8px;
  width: 400px;
  max-width: 100%;
  border-radius: 4px;
  background-color: #222328;
  border: 0;
  color: ${({ theme }) => theme.font.text};

  :active,
  :focus {
    outline: 1px solid #464646;
  }
`;

const EditModal = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    inset: "50% auto auto 50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#18191d",
    border: "0",
    height: "fit-content",
  },
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: end;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  @media (min-width: ${MEDIA.tablet}) {
    justify-content: space-between;
  }
`;

const EditThumbnail = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bg.card_thumbnail_placeholder};
  color: ${({ theme }) => theme.font.title};
  font-weight: 700;
  font-size: 82px;
  height: 200px;
  width: 200px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  margin-bottom: 16px;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.3);

  @media (min-width: ${MEDIA.tablet}) {
    margin-bottom: 0;
  }
`;

const CloseModal = styled.button`
  border: 0;
  background-color: transparent;
  color: currentColor;
  cursor: pointer;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

const FormBody = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 16px;

  @media (min-width: ${MEDIA.tablet}) {
    align-items: flex-start;
    flex-direction: row;
  }
`;

const FormThumbnail = styled.div`
  width: auto;
  max-width: 200px;
  aspect-ratio: 1;
`;

const FormInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 40ch;
`;

const EditTitle = styled.input`
  padding: 8px 12px;
  background-color: #222328;
  border: 0;
  color: ${({ theme }) => theme.font.text};

  :active,
  :focus {
    outline: 1px solid #464646;
  }
`;

const EditDescription = styled.textarea`
  flex: 2 1 auto;
  height: 18ch;
  padding: 8px 12px;
  background-color: #222328;
  color: ${({ theme }) => theme.font.text};
  border: 0;
  resize: none;

  :active,
  :focus {
    outline: 1px solid #464646;
  }
`;

const FormFooter = styled.div`
  height: auto;
  display: flex;
  justify-content: center;

  @media (min-width: ${MEDIA.tablet}) {
    justify-content: flex-end;
  }
`;

const SaveButton = styled.button`
  width: fit-content;
  margin-top: 16px;
`;

export default PlaylistPage;
