import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import Track from "../../components/track";
import ActionBar from "../../components/actionbar";
import * as H from "../../styles/components/headers";
import * as T from "../../styles/components/track";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../slices/currentUserSlice";
import {
  extractTrackId,
  formatAddedAt,
  formatDuration,
  stringToHSL,
} from "../../utils";
import {
  checkSavedPlaylist,
  checkSavedPlaylistTracks,
  countPlaylistDuration,
  editCurrentPlaylistDetails,
  getPlaylistTracksWithOffset,
  removeSavedPlaylist,
  savePlaylist,
  selectPlaylistStatus,
} from "../../slices/playlistSlice";
import {
  getPlaylist,
  selectPlaylist,
  selectPlaylistDuration,
} from "../../slices/playlistSlice";
import { MEDIA } from "../../styles/media";
import { MdClose } from "react-icons/md";
import { editPlaylistDetails } from "../../slices/currentUserPlaylistsSlice";

Modal.setAppElement("#root");

const PlaylistPage = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectCurrentUserId);
  const playlist = useAppSelector(selectPlaylist);
  const playlistStatus = useAppSelector(selectPlaylistStatus);
  const playlistDuration = useAppSelector(selectPlaylistDuration);

  const { id } = useParams();
  const [gradient, setGradient] = useState(`hsl(0, 0%, 40%)`);
  const [modal, setModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  console.log(playlist.name, playlist.description);

  const offsetStatus = useSelector(
    (state: RootState) => state.playlist.offsetStatus
  );

  useEffect(() => {
    if (playlist.name !== null || playlist.description) {
      setPlaylistName(playlist.name);
      setPlaylistDescription(playlist.description || "");
    }
  }, [playlist.description, playlist.name]);

  // Fetch playlist for initial render
  useEffect(() => {
    if (id) {
      dispatch(getPlaylist({ playlist_id: id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (playlistStatus === "succeeded") {
      dispatch(checkSavedPlaylist({ playlist_id: playlist.id, userId }));
    }
  }, [dispatch, playlist.id, playlistStatus, userId]);

  // useEffect(() => {
  //   if (offsetStatus === "succeeded") {
  //     dispatch(countPlaylistDuration());
  //   }
  // }, [dispatch, offsetStatus]);

  // Fetch again if the tracklist is incomplete
  useEffect(() => {
    // Check if the tracklist is not empty before fetching next batch of tracks and
    // has items to count the playlist duration
    if (playlist.tracks?.items.length > 0) {
      setGradient(stringToHSL(playlist.name));

      // // Make sure that only one request is dispatched to the API at a time
      // if (offsetStatus === "idle" && playlist.tracks?.next !== null) {
      //   dispatch(getPlaylistTracksWithOffset({ url: playlist.tracks?.next }));
      // }
    } else {
      setGradient(`hsl(0, 0%, 40%)`);
    }
  }, [
    dispatch,
    offsetStatus,
    playlist.name,
    playlist.tracks?.items.length,
    playlist.tracks?.next,
  ]);

  useEffect(() => {
    if (playlist.tracks?.items.length > 0) {
      const list = playlist.tracks?.items;
      dispatch(checkSavedPlaylistTracks(extractTrackId(list?.slice(0, 50))));
    }
  }, [dispatch, playlist.tracks?.items]);

  function handleSaveTrack(isSaved?: boolean) {
    isSaved
      ? dispatch(removeSavedPlaylist(playlist.id))
      : dispatch(savePlaylist(playlist.id));
  }

  function handleShowModal() {
    playlist.owner.id === userId ? setModal(true) : setModal(false);
  }

  function handleEditPlaylist() {
    const id = playlist.id;
    const name = playlistName;
    const description = playlistDescription;

    // Update playlist details in current playlist and list with all playlists
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
          <H.HeaderName onClick={() => handleShowModal()}>
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
      {playlist.tracks?.items && (
        <T.TrackList>
          {playlist.tracks?.items.map((item, index) => {
            return "track" in item.track ? (
              <Track
                key={item.track.id}
                variant="playlist"
                index={index}
                item={item.track}
                addedAt={
                  item.added_at !== null ? formatAddedAt(item.added_at) : ""
                }
              />
            ) : null;
          })}
        </T.TrackList>
      )}
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
