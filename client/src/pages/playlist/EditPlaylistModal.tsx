import React, { Dispatch, SetStateAction, useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { MEDIA } from "../../styles/media";
import { MdClose } from "react-icons/md";
import { useAppDispatch } from "../../app/hooks";
import { Playlist } from "../../types/SpotifyObjects";
import { editPlaylistDetails } from "../../slices/userSavedPlaylistsSlice";
import { editCurrentPlaylistDetails } from "../../slices/playlistSlice";

interface Props {
  modal: boolean;
  setModal: Dispatch<SetStateAction<boolean>>;
  playlist: Playlist;
}

const EditPlaylistModal = (props: Props) => {
  const { modal, setModal, playlist } = props;

  const dispatch = useAppDispatch();
  const [playlistName, setPlaylistName] = useState(playlist.name);
  const [playlistDescription, setPlaylistDescription] = useState(playlist.description || "");

  function handleEditPlaylist() {
    const id = playlist.id;
    const name = playlistName;
    const description = playlistDescription;

    dispatch(editPlaylistDetails({ id, name, description }));
    dispatch(editCurrentPlaylistDetails({ id, name, description }));
    setModal(false);
  }

  function closeModal() {
    setModal(false);
  }

  return (
    <Modal isOpen={modal} style={EditModal} onRequestClose={closeModal}>
      <EditPlaylistForm action="" method="dialog">
        <FormHeader>
          <h1>Edit details</h1>
          <CloseModal onClick={closeModal}>
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
              placeholder="New Playlist"
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <EditDescription
              value={playlistDescription}
              placeholder="Add an optional description"
              onChange={(e) => setPlaylistDescription(e.target.value)}
            />
          </FormInputGroup>
        </FormBody>
        <FormFooter>
          <SaveButton onClick={() => handleEditPlaylist()}>Save</SaveButton>
        </FormFooter>
      </EditPlaylistForm>
    </Modal>
  );
};

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

const EditPlaylistForm = styled.form`
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

const CloseModal = styled.button`
  border: 0;
  background-color: transparent;
  color: currentColor;
  cursor: pointer;
  padding: 0;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
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
  aspect-ratio: 1;
  object-fit: cover;
  margin-bottom: 16px;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.3);

  @media (min-width: ${MEDIA.tablet}) {
    margin-bottom: 0;
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
  color: ${({ theme }) => theme.colors.white};

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
  color: ${({ theme }) => theme.colors.white};
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
  background-color: transparent;
  color: ${({ theme }) => theme.colors.white};
  border: 0;
  padding: 0;
  font-weight: 600;
  text-transform: uppercase;
`;

export default EditPlaylistModal;
