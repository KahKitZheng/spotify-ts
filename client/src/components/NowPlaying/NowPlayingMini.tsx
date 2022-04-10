import React, { Fragment, useState } from "react";
import styled, { keyframes } from "styled-components";
import { MEDIA } from "../../styles/media";
import { BiPlay, BiPause } from "react-icons/bi";
import { BiDevices } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  pausePlayback,
  selectAvailableDevices,
  selectDeviceId,
  selectPlayback,
  startPlayback,
} from "../../slices/playerSlice";
import { SimplifiedArtist } from "../../types/SpotifyObjects";
import NowPlayingModal from "./NowPlayingModal";
import NowPlayingDevicesModal from "./NowPlayingDevicesModal";

const NowPlayingMini = () => {
  const [devicesModal, setDevicesModal] = useState(false);
  const [nowPlayingModal, setNowPlayingModal] = useState(false);

  const dispatch = useAppDispatch();
  const playback = useAppSelector(selectPlayback);
  const track = playback.item;
  const isPlaying = playback.is_playing;

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

  const setPlayState = () => {
    isPlaying ? dispatch(pausePlayback()) : dispatch(startPlayback());
  };

  const handleDeviceModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setDevicesModal(true);
  };

  return devices.length > 0 && track ? (
    <>
      <NowPlayingWrapper onClick={() => setNowPlayingModal(true)}>
        {track !== undefined && (
          <CurrentTrack>
            <TrackCover src={track?.album.images[0].url} alt="" />
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
          {isPlaying ? (
            <ButtonIcon $large onClick={setPlayState}>
              <BiPause />
            </ButtonIcon>
          ) : (
            <ButtonIcon $large onClick={setPlayState}>
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
  grid-gap: 16px;
  grid-template-columns: calc(80vw - 40px) calc(20vw);
  padding: 4px 16px;
  height: 64px;
  background-color: ${({ theme }) => theme.bg.bottom_tabs};
  border-top: 1px solid #25292f;
  border-bottom: 1px solid #25292f;

  :hover {
    cursor: pointer;
  }

  @media (min-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

const CurrentTrack = styled.div`
  display: flex;
  align-items: center;
  flex: 2 1 auto;
`;

const TrackCover = styled.img`
  height: 44px;
  width: 44px;
  object-fit: cover;
  aspect-ratio: 1;
`;

const PlaybackInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  width: calc(100% - 44px - 16px);
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
  grid-template-columns: 1fr 1fr;
  align-items: center;
`;

const ButtonIcon = styled.button<{ $large?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  background-color: transparent;
  color: currentColor;
  font-size: ${({ $large }) => ($large ? "40px" : "24px")};
  border: 0;
  padding: 0;
  cursor: pointer;
`;

export default NowPlayingMini;
