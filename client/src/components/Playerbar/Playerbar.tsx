import React, { useEffect } from "react";
import styled from "styled-components";
import PlayerTrack from "./PlayerTrack";
import PlayerTrackControls from "./PlayerTrackControls";
import { token } from "../../spotify/auth";
import { useAppDispatch } from "../../app/hooks";
import {
  getPlaybackDevices,
  setPlaybackDevice,
  updatePlayback,
} from "../../slices/playerSlice";
import PlayerVolume from "./PlayerVolume";
import { MEDIA } from "../../styles/media";
import PlayerDevices from "./PlayerDevices";

const Playbar = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const script = document.createElement("script");

    script.id = "spotify-player";
    script.type = "text/javascript";
    script.async = true;
    script.defer = true;
    script.src = "https://sdk.scdn.co/spotify-player.js";

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "KKZ | Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token as string);
        },
        volume: 0.1,
      });

      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);

        dispatch(getPlaybackDevices());
        dispatch(setPlaybackDevice({ device_ids: [device_id] }));
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        console.log(state);

        dispatch(updatePlayback(state));
      });

      player.connect();
    };
  }, [dispatch]);

  return (
    <PlaybarWrapper>
      <PlayerTrack />
      <PlayerTrackControls />
      <PlayerControlsWrapper>
        <PlayerDevices />
        <PlayerVolume />
      </PlayerControlsWrapper>
    </PlaybarWrapper>
  );
};

const PlaybarWrapper = styled.footer`
  grid-area: playbar;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap: 16px;
  height: 90px;
  padding: 16px;
  background-color: #17171f;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

const PlayerControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ButtonIcon = styled.button`
  background-color: transparent;
  color: currentColor;
  font-size: 20px;
  border: 0;
  margin-left: 16px;
  padding: 0;
  cursor: pointer;
`;

export default Playbar;
