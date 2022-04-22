import React, { Fragment, useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import styled, { keyframes } from "styled-components";
import { MEDIA } from "../../styles/media";
import { useViewportWidth } from "../../hooks/useViewportWidth";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SimplifiedArtist } from "../../types/SpotifyObjects";
import * as playerSlice from "../../slices/playerSlice";
import * as bi from "react-icons/bi";
import * as md from "react-icons/md";
import { BsChevronDown } from "react-icons/bs";
import { formatDuration } from "../../utils";
import NowPlayingDevicesModal from "./NowPlayingDevicesModal";
import { RiHeart3Fill, RiHeart3Line } from "react-icons/ri";
import { TrackPlaceholder } from "../../assets/placeholders";

interface Props {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const NowPlayingModal = ({ modal, setModal }: Props) => {
  const [devicesModal, setDevicesModal] = useState(false);

  const dispatch = useAppDispatch();
  const isDesktop = useViewportWidth(+MEDIA.tablet.slice(0, -2));
  const isCurrentTrackSaved = useAppSelector(
    playerSlice.selectCheckCurrentSavedTrack
  );

  const playback = useAppSelector(playerSlice.selectPlayback);
  const track = playback.item;
  const isPlaying = playback.is_playing;

  const shuffleMode = playback.shuffle_state;
  const repeatMode = playback.repeat_state;

  const closeModal = useCallback(() => {
    setModal(false);
  }, [setModal]);

  useEffect(() => {
    isDesktop && closeModal();
  }, [closeModal, isDesktop]);

  const [seeker, setSeeker] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (playback.progress_ms !== null) {
      setSeeker(playback.progress_ms);
    }

    if (playback.item?.duration_ms !== undefined) {
      setDuration(playback.item?.duration_ms);
    }
  }, [playback.item?.duration_ms, playback.progress_ms]);

  useEffect(() => {
    const interval = setInterval(() => {
      isPlaying ? setSeeker(seeker + 1000) : clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, seeker]);

  const setPlayState = () => {
    isPlaying
      ? dispatch(playerSlice.pausePlayback())
      : dispatch(playerSlice.startPlayback());
  };

  const handlePreviousTrack = () => {
    if (seeker > 3000) {
      dispatch(playerSlice.seekPosition({ position_ms: 0 }));
    } else {
      dispatch(playerSlice.playPreviousTrack());
    }
  };

  const handleNextTrack = () => {
    dispatch(playerSlice.playNextTrack());
  };

  const handleShuffleMode = () => {
    dispatch(playerSlice.setShuffle({ shuffleState: !shuffleMode }));
  };

  const handleRepeatMode = () => {
    switch (repeatMode) {
      case "context":
        dispatch(playerSlice.setRepeat({ repeatState: "track" }));
        break;
      case "track":
        dispatch(playerSlice.setRepeat({ repeatState: "off" }));
        break;
      case "off":
        dispatch(playerSlice.setRepeat({ repeatState: "context" }));
        break;
      default:
        dispatch(playerSlice.setRepeat({ repeatState: "off" }));
        break;
    }
  };

  const setSeekerPosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(playerSlice.seekPosition({ position_ms: +e.target.value }));
  };

  const renderArtists = (list: SimplifiedArtist[]) => {
    return list.map((artist, index, arr) => (
      <Fragment key={index}>
        {`${artist.name}${index !== arr.length - 1 ? `, ` : ""}`}
      </Fragment>
    ));
  };

  const handleSaveTrack = () => {
    if (track === null) return;

    isCurrentTrackSaved.isSaved
      ? dispatch(playerSlice.removeSavedCurrentTrack(track.id))
      : dispatch(playerSlice.saveCurrentTrack(track.id));
  };

  return track ? (
    <>
      <Modal
        isOpen={modal}
        style={NowPlayingModalStyle}
        onRequestClose={closeModal}
        closeTimeoutMS={500}
      >
        <NowPlayingWrapper $isOpen={modal}>
          <ModalHeader>
            <CloseIcon onClick={() => closeModal()}>
              <BsChevronDown />
            </CloseIcon>
            <DeviceIcon onClick={() => setDevicesModal(true)}>
              <bi.BiDevices />
            </DeviceIcon>
            {track.album.images?.length > 0 ? (
              <TrackCover
                src={track?.album.images[0].url}
                alt=""
                loading="lazy"
              />
            ) : (
              <TrackPlaceholder />
            )}
          </ModalHeader>
          <div>
            {track !== null && (
              <TrackInfoWrapper>
                <div>
                  <TrackName>{track?.name}</TrackName>
                  <span>{renderArtists(track?.artists)}</span>
                </div>
                <SaveTrack
                  onClick={handleSaveTrack}
                  $isSaved={isCurrentTrackSaved.isSaved}
                >
                  {isCurrentTrackSaved.isSaved ? (
                    <RiHeart3Fill />
                  ) : (
                    <RiHeart3Line />
                  )}
                </SaveTrack>
              </TrackInfoWrapper>
            )}
            <TrackProgessWrapper>
              <TrackProgress
                type="range"
                min={0}
                onChange={(e) => setSeekerPosition(e)}
                value={seeker | 0}
                max={duration | 0}
              />
              <TrackDurations>
                <small>{formatDuration(seeker | 0, "track")}</small>
                <small>{formatDuration(duration | 0, "track")}</small>
              </TrackDurations>
            </TrackProgessWrapper>
            <ControlsWrapper>
              <ButtonIcon $active={shuffleMode} onClick={handleShuffleMode}>
                <bi.BiShuffle />
              </ButtonIcon>
              <ButtonIcon $large onClick={handlePreviousTrack}>
                <bi.BiSkipPrevious />
              </ButtonIcon>
              <PlayPauseWrapper $large onClick={setPlayState}>
                {isPlaying ? (
                  <bi.BiPause />
                ) : (
                  <span>
                    <bi.BiPlay />
                  </span>
                )}
              </PlayPauseWrapper>
              <ButtonIcon $large onClick={handleNextTrack}>
                <bi.BiSkipNext />
              </ButtonIcon>
              <ButtonIcon
                $active={repeatMode === "context" || repeatMode === "track"}
                onClick={handleRepeatMode}
              >
                {repeatMode === "track" ? <md.MdRepeatOne /> : <md.MdRepeat />}
              </ButtonIcon>
            </ControlsWrapper>
          </div>
        </NowPlayingWrapper>
      </Modal>
      <NowPlayingDevicesModal modal={devicesModal} setModal={setDevicesModal} />
    </>
  ) : null;
};

const fadeIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0%);
    opacity: 1;

  }
`;

const fadeOut = keyframes`
  from {
    transform: translateY(0%);
    opacity: 1;
  }
  
  to {
    transform: translateY(100%);
    opacity: 0;

  }
`;

const NowPlayingModalStyle = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    inset: "auto",
    backgroundColor: "#18191d",
    border: "0",
    height: "100vh",
    width: "100vw",
    display: "flex",
    padding: "0",
    overflow: "hidden",
    flexDirection: "column" as const,
  },
};

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 2 1 auto;
`;

const IconWrapper = styled.button`
  position: absolute;
  top: 32px;
  background-color: transparent;
  color: ${({ theme }) => theme.font.text};
  border: 0;
  padding: 0;
  cursor: pointer;
`;

const CloseIcon = styled(IconWrapper)`
  left: 32px;
  font-size: 18px;
`;

const DeviceIcon = styled(IconWrapper)`
  right: 32px;
  font-size: 20px;
`;

const NowPlayingWrapper = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  padding: 32px;
  height: 100%;
  animation: ${({ $isOpen }) => ($isOpen ? fadeIn : fadeOut)} 0.5s
    cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

const TrackInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const TrackCover = styled.img`
  aspect-ratio: 1;
  object-fit: cover;
  margin: 48px auto;
  min-width: 100%;
  width: 100%;

  @media (min-width: ${MEDIA.mobile}) {
    min-width: 440px;
    max-width: 60%;
  }
`;

const TrackName = styled.p`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  font-size: 24px;
`;

const TrackProgessWrapper = styled.div`
  margin-top: 8px;
`;

const TrackProgress = styled.input.attrs({ type: "range" })`
  margin: 0;
  width: 100%;
`;

const TrackDurations = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;

const ButtonIcon = styled.button<{ $large?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  margin: 0 24px;
  padding: 0;
  font-size: ${({ $large }) => ($large ? "40px" : "24px")};
  color: ${({ $active, theme }) => ($active ? "#17aa4b" : theme.font.text)};
  background-color: transparent;
  cursor: pointer;

  :hover {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.spotify : theme.colors.white};
  }
`;

const PlayPauseWrapper = styled(ButtonIcon)`
  padding: 2px;
  border-radius: 50%;
  background-color: white;
  color: ${({ theme }) => theme.colors.black};
  transition: transform 0.15s ease-in-out;

  span {
    display: block;
    transform: translateX(2px);
  }

  :hover {
    color: ${({ theme }) => theme.colors.black};
    transform: scale(1.1);
  }
`;

const SaveTrack = styled.button<{ $isSaved: boolean }>`
  color: ${({ $isSaved, theme }) =>
    $isSaved ? theme.colors.spotify : "currentColor"};
  background-color: transparent;
  border: 0;
  margin-left: 20px;
  padding: 0;
  cursor: pointer;
  font-size: 28px;
`;

export default NowPlayingModal;
