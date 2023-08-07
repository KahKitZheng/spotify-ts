import React, { Fragment, useState } from "react";
import styled, { keyframes } from "styled-components";
import { MEDIA } from "@/styles/media";
import { BiPlay, BiPause } from "react-icons/bi";
import { BiDevices } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  pausePlayback,
  removeSavedCurrentTrack,
  saveCurrentTrack,
  selectAvailableDevices,
  selectCheckCurrentSavedTrack,
  selectDeviceId,
  selectPlayback,
  startPlayback,
} from "@/slices/playerSlice";
import { SimplifiedArtist } from "@/types/SpotifyObjects";
import NowPlayingModal from "./NowPlayingModal";
import NowPlayingDevicesModal from "./NowPlayingDevicesModal";
import { RiHeart3Fill, RiHeart3Line } from "react-icons/ri";
import { TrackPlaceholder } from "@/assets/placeholders";

const NowPlayingMini = () => {
  const [devicesModal, setDevicesModal] = useState(false);
  const [nowPlayingModal, setNowPlayingModal] = useState(false);

  const dispatch = useAppDispatch();
  const playback = useAppSelector(selectPlayback);
  const track = playback.item;
  const isPlaying = playback.is_playing;
  const isCurrentTrackSaved = useAppSelector(selectCheckCurrentSavedTrack);

  const deviceId = useAppSelector(selectDeviceId);
  const devices = useAppSelector(selectAvailableDevices);
  const currentDevice = devices.filter((device) => device.id === deviceId);

  const renderArtists = (list: SimplifiedArtist[]) => {
    return list.map((artist, index, arr) => (
      <Fragment key={index}>
        {`${artist.name}${index !== arr.length - 1 ? `, ` : ""}`}
      </Fragment>
    ));
  };

  const setPlayState = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    isPlaying ? dispatch(pausePlayback()) : dispatch(startPlayback({}));
  };

  const handleDeviceModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setDevicesModal(true);
  };

  const handleSaveTrack = () => {
    if (track === null) return;

    isCurrentTrackSaved.isSaved
      ? dispatch(removeSavedCurrentTrack(track.id))
      : dispatch(saveCurrentTrack(track.id));
  };

  return devices.length > 0 && track ? (
    <>
      <NowPlayingWrapper onClick={() => setNowPlayingModal(true)}>
        {track !== undefined && (
          <CurrentTrack>
            {track?.album.images.length > 0 ? (
              <TrackCover
                src={track?.album.images[0].url}
                alt=""
                loading="lazy"
              />
            ) : (
              <TrackPlaceholder />
            )}
            <PlaybackInfo>
              <Marquee>
                <MarqueeInner>
                  <TrackInfo>
                    {track?.name}
                    <span className="bull">&bull;</span>
                    {renderArtists(track?.artists)}
                  </TrackInfo>
                  <TrackInfo>
                    {track?.name}
                    <span className="bull">&bull;</span>
                    {renderArtists(track?.artists)}
                  </TrackInfo>
                  <TrackInfo>
                    {track?.name}
                    <span className="bull">&bull;</span>
                    {renderArtists(track?.artists)}
                  </TrackInfo>
                  <TrackInfo>
                    {track?.name}
                    <span className="bull">&bull;</span>
                    {renderArtists(track?.artists)}
                  </TrackInfo>
                </MarqueeInner>
              </Marquee>
              {currentDevice && (
                <PlaybackDevice>{currentDevice[0]?.name}</PlaybackDevice>
              )}
            </PlaybackInfo>
          </CurrentTrack>
        )}
        <NowPlayingActions>
          <ButtonIcon onClick={(e) => handleDeviceModal(e)}>
            <BiDevices />
          </ButtonIcon>
          <SaveTrack
            onClick={handleSaveTrack}
            $isSaved={isCurrentTrackSaved.isSaved}
          >
            {isCurrentTrackSaved.isSaved ? <RiHeart3Fill /> : <RiHeart3Line />}
          </SaveTrack>
          {isPlaying ? (
            <ButtonIcon $large onClick={setPlayState}>
              <BiPause />
            </ButtonIcon>
          ) : (
            <ButtonIcon $large onClick={(e) => setPlayState(e)}>
              <BiPlay />
            </ButtonIcon>
          )}
        </NowPlayingActions>
      </NowPlayingWrapper>

      <NowPlayingModal modal={nowPlayingModal} setModal={setNowPlayingModal} />
      <NowPlayingDevicesModal modal={devicesModal} setModal={setDevicesModal} />
    </>
  ) : null;
};

const MarqueeAnimation = keyframes`
  from { 
    transform: translate3d(var(--move-initial), 0, 0);
  }

  to { 
    transform: translate3d(var(--move-final), 0, 0);
  }
`;

const MarqueeInner = styled.div`
  width: fit-content;
  display: flex;
  position: relative;
  transform: translate3d(var(--move-initial), 0, 0);
  animation: ${MarqueeAnimation} 10s linear infinite;
  animation-play-state: running;
`;

const Marquee = styled.div`
  position: relative;
  overflow: hidden;
  --offset: 20vw;
  --move-initial: calc(-25% + var(--offset));
  --move-final: calc(-50% + var(--offset));
`;

const NowPlayingWrapper = styled.div`
  display: grid;
  grid-gap: 12px;
  grid-template-columns: calc(100% - 160px - 12px) 160px;
  height: 56px;
  background-color: ${({ theme }) => theme.bg.bottom_tabs};
  border-top: 1px solid #25292f;
  border-bottom: 1px solid #25292f;

  @media (min-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

const CurrentTrack = styled.div`
  display: flex;
  align-items: center;
`;

const TrackCover = styled.img`
  height: 56px;
  width: 56px;
  object-fit: cover;
  aspect-ratio: 1;
`;

const PlaybackInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  width: calc(100% - 44px - 12px);
`;

const TrackInfo = styled.small`
  color: ${({ theme }) => theme.colors.white};
  font-weight: 600;
  width: max-content;
  margin-right: 48px;
`;

const PlaybackDevice = styled.small`
  color: ${({ theme }) => theme.colors.spotify};
`;

const NowPlayingActions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
`;

const ButtonIcon = styled.button<{ $large?: boolean; $active?: boolean }>`
  height: 32px;
  background-color: transparent;
  color: currentColor;
  font-size: ${({ $large }) => ($large ? "32px" : "24px")};
  border: 0;
  margin: auto;
  padding: 0;
`;

const SaveTrack = styled.button<{ $isSaved: boolean }>`
  color: ${({ $isSaved, theme }) =>
    $isSaved ? theme.colors.spotify : "currentColor"};
  background-color: transparent;
  border: 0;
  margin: 0 auto;
  padding: 0;
  font-size: 24px;
`;

export default NowPlayingMini;
