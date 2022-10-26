import React, { useEffect } from "react";
import styled from "styled-components";
import PlayerTrack from "./PlayerTrack";
import PlayerTrackControls from "./PlayerTrackControls";
import PlayerVolume from "./PlayerVolume";
import PlayerDevices from "./PlayerDevices";
import * as playerSlice from "../../slices/playerSlice";
import { MEDIA } from "../../styles/media";
import { useAppDispatch } from "../../app/hooks";

const Playbar = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("spotify_clone_access_token");

  // Init the Spotify playback SDK
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
        name: "Spotify-ts | Web Playback SDK",
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.3,
      });

      // Error handling
      player.addListener("initialization_error", ({ message }: any) => {
        console.error(message);
      });
      player.addListener("authentication_error", ({ message }: any) => {
        console.error(message);
      });
      player.addListener("account_error", ({ message }: any) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }: any) => {
        console.error(message);
      });

      player.addListener("ready", ({ device_id }: any) => {
        dispatch(playerSlice.getPlaybackDevices());
        dispatch(playerSlice.setPlaybackDevice({ device_ids: [device_id] }));
      });

      player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        dispatch(playerSlice.updatePlayback(state));
      });

      player.connect();
    };
  }, [dispatch, token]);

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
  grid-template-columns: 1.5fr 2fr 1.5fr;
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
  margin: 0 16px;
  padding: 0;
  cursor: pointer;
`;

export default Playbar;
