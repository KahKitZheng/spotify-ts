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
  selectRecommendedPlaylistStatus,
  selectRecommendedPlaylistTracks,
} from "../../slices/recommendationSlice";

Modal.setAppElement("#root");

const PlaylistPage = () => {
  // Component state
  const { id } = useParams();
  const [fetchOffset, setFetchOffset] = useState(0);
  const [gradient, setGradient] = useState(`hsl(0, 0%, 40%)`);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
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
  const recommendStatus = useAppSelector(selectRecommendedPlaylistStatus);
  const recommendedTracks = useAppSelector(selectRecommendedPlaylistTracks);

  /** Fetch playlist info plus up to 100 tracks */
  const fetchPlaylistInfo = useCallback(() => {
    if (playlist.id !== id && id !== undefined) {
      dispatch(getPlaylistInfo({ playlist_id: id }));
    }
  }, [dispatch, id, playlist.id]);

  /** Check whether the current user has liked the playlist or not*/
  const fetchPlaylistIsSaved = useCallback(() => {
    if (playlistStatus === "succeeded") {
      dispatch(checkSavedPlaylist({ playlist_id: playlist.id, userId }));
    }
  }, [dispatch, playlist.id, playlistStatus, userId]);

  /** Fetch the remaining playlist tracks if the initial fetch has not retrieved them all */
  const fetchOffsetPlaylistTracks = useCallback(() => {
    const playlistItems = playlist.tracks?.items;
    const url = playlist.tracks?.next;
    const startIndex = fetchOffset;

    if (startIndex >= playlistItems?.length && url !== null) {
      dispatch(getPlaylistTracksWithOffset({ startIndex, url }));
    }
  }, [dispatch, fetchOffset, playlist.tracks?.items, playlist.tracks?.next]);

  /** Check which playlist tracks the current user has liked */
  const fetchSavedTracks = useCallback(() => {
    const list = playlist.tracks?.items;
    const incrementBy = 50;
    const startIndex = fetchOffset;
    const endIndex = fetchOffset + incrementBy;

    if (startIndex < list?.length && startIndex < playlist.tracks?.total) {
      const ids = extractTrackId(list?.slice(startIndex, endIndex));
      dispatch(checkSavedPlaylistTracks({ startIndex, ids })).then(() => {
        setFetchOffset(endIndex);
      });
    }
  }, [dispatch, fetchOffset, playlist.tracks?.items, playlist.tracks?.total]);

  /** Fetch tracks based on the search input */
  const fetchQueryTracks = useCallback(() => {
    if (query !== "" && debouncedValue) {
      dispatch(getAllSearchResults({ q: query, limit: 10 }));
    }
  }, [dispatch, query, debouncedValue]);

  /** Fetch recommended tracks for your playlist based on the existing tracks */
  const fetchRecommendedTracks = useCallback(() => {
    const playlistItems = playlist.tracks?.items;
    const seed = [];

    if (recommendStatus === "idle") {
      if (0 < playlistItems?.length && playlistItems?.length <= 5) {
        playlistItems.forEach((item) => {
          seed.push(item.track.id);
        });
      }

      if (playlistItems?.length > 5) {
        for (let index = 0; index < 5; index++) {
          const randomSeed = random(1, playlistItems?.length);
          seed.push(playlistItems[randomSeed].track.id);
        }
      }

      if (seed.length > 0) {
        dispatch(recommendPlaylistTracks({ seed, limit: 10 }));
      }
    }
  }, [dispatch, playlist.tracks?.items, recommendStatus]);

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
    if (id) {
      setFetchOffset(0);
    }
  }, [id]);

  useEffect(() => {
    fetchPlaylistInfo();
    fetchPlaylistIsSaved();
  }, [fetchPlaylistInfo, fetchPlaylistIsSaved]);

  useEffect(() => {
    fetchOffsetPlaylistTracks();
  }, [fetchOffsetPlaylistTracks]);

  useEffect(() => {
    fetchSavedTracks();
  }, [fetchSavedTracks]);

  useEffect(() => {
    setPlaylistBackground();
    setPlaylistdDuration();
  }, [setPlaylistBackground, setPlaylistdDuration]);

  useEffect(() => {
    fetchRecommendedTracks();
    fetchQueryTracks();
  }, [fetchQueryTracks, fetchRecommendedTracks]);

  function handleSavePlaylist(isSaved?: boolean) {
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
            {playlist.tracks?.items.length} songs,{" "}
            {formatDuration(playlistDuration, "playlist")}
          </H.HeaderStats>
        </div>
      </H.HeaderWrapper>
      <ActionBar
        isSaved={playlist.is_saved}
        handleClick={() => handleSavePlaylist(playlist.is_saved)}
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

      {playlist.owner.id === userId && isSearching ? (
        <PlaylistDiscovery>
          <PlaylistDiscoveryHeaderWrapper>
            <PlaylistDiscoveryHeader>
              <PlaylistDiscoveryName>
                Let&apos;s find something for your playlist
              </PlaylistDiscoveryName>
              <SearchInput
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for songs"
              />
            </PlaylistDiscoveryHeader>
            <ToggleDiscovery onClick={() => setIsSearching(!isSearching)}>
              <MdClose />
            </ToggleDiscovery>
          </PlaylistDiscoveryHeaderWrapper>
          {query !== "" && (
            <T.TrackList>
              {searchResults.tracks?.items.map((track) => (
                <Track key={track.id} item={track} variant={"playlist-add"} />
              ))}
            </T.TrackList>
          )}
        </PlaylistDiscovery>
      ) : null}

      {playlist.owner.id === userId && !isSearching ? (
        <PlaylistDiscovery>
          <PlaylistDiscoveryHeaderWrapper>
            <div>
              <PlaylistDiscoveryName>Recommended</PlaylistDiscoveryName>
              <p>Based on what&apos;s in this playlist</p>
            </div>
            <ToggleDiscovery onClick={() => setIsSearching(!isSearching)}>
              Search songs
            </ToggleDiscovery>
          </PlaylistDiscoveryHeaderWrapper>
          <T.TrackList>
            {recommendedTracks.tracks?.map((track) => (
              <Track key={track.id} item={track} variant={"playlist-add"} />
            ))}
          </T.TrackList>
          <RefreshRecommendation>refresh</RefreshRecommendation>
        </PlaylistDiscovery>
      ) : null}

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

const PlaylistDiscovery = styled.section`
  position: relative;
  margin-top: 64px;
`;

const PlaylistDiscoveryHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PlaylistDiscoveryHeader = styled.div`
  flex: 2 1 auto;
`;

const PlaylistDiscoveryName = styled.h2`
  font-size: 20px;
  line-height: 1.2;

  @media (min-width: ${MEDIA.tablet}) {
    font-size: revert;
  }
`;

const ToggleDiscovery = styled.button`
  flex: 0 1 auto;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 0;
  margin-left: 16px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  cursor: pointer;

  @media (max-width: ${MEDIA.mobile}) {
    display: none;
  }

  @media (min-width: ${MEDIA.tablet}) {
    font-size: 14px;
  }
`;

const RefreshRecommendation = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 0;
  margin-right: 16px;
  text-transform: uppercase;
  font-size: 14px;
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
  width: 100%;
  max-width: 400px;
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
