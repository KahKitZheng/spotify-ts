import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import PlayerTrack from "./PlayerTrack";
import PlayerTrackControls from "./PlayerTrackControls";
import PlayerVolume from "./PlayerVolume";
import PlayerDevices from "./PlayerDevices";
import * as playerSlice from "@/slices/playerSlice";
import { MEDIA } from "@/styles/media";
import { useAppDispatch } from "../../app/hooks";
import { refreshAccessToken } from "../../spotify/auth";
import { startPlayback } from "@/slices/playerSlice";

const Playbar = () => {
  const dispatch = useAppDispatch();
  const checkInterval = 1000 * 60 * 60;

  const [counter, setCounter] = useState(1);

  // Remove duplicate scripts and iframes in index.html
  const removePlayers = useCallback(() => {
    const players = document.querySelectorAll(`.spotify-player`);
    const iframes = document.querySelectorAll(
      '[alt="Audio Playback Container"]'
    );

    for (let index = 1; index < counter; index++) {
      players[index].remove();
      iframes[index].remove();
    }
  }, [counter]);

  // Create new player instanec
  const connectPlayer = useCallback(() => {
    const script = document.createElement("script");

    script.className = `spotify-player`;
    script.type = "text/javascript";
    script.async = true;
    script.defer = true;
    script.src = "https://sdk.scdn.co/spotify-player.js";

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem("spotify_clone_access_token");

      const player = new window.Spotify.Player({
        name: "Spotify-ts | Web Playback SDK",
        getOAuthToken: (cb: any) => cb(token),
        volume: 0.5,
      });

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
      dispatch(startPlayback()); // Resume immediate playback after renewing the player
      setCounter(counter + 1);
      removePlayers();
    };
  }, [counter, dispatch, removePlayers]);

  // Connect the first player player
  useEffect(() => {
    if (counter === 1) {
      connectPlayer();
    }
  }, [connectPlayer, counter]);

  // Disconnect player with expired token and create new one
  const replacePlayer = useCallback(() => {
    const TIMESTAMP_KEY = "spotify_clone_token_timestamp";
    const tokenTimestamp = localStorage.getItem(TIMESTAMP_KEY);

    const now = new Date();
    const expireTimestamp = new Date(
      parseInt(tokenTimestamp ?? "0") + checkInterval
    );

    console.log(tokenTimestamp, expireTimestamp, now);

    if (tokenTimestamp && expireTimestamp < now) {
      refreshAccessToken().then((res) => {
        console.log("new token: ", res);
        connectPlayer();
      });
    }
  }, [checkInterval, connectPlayer]);

  // Check if access token is still valid
  useEffect(() => {
    const timer = setTimeout(() => replacePlayer(), checkInterval);
    return () => clearTimeout(timer);
  }, [checkInterval, replacePlayer, connectPlayer]);

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
