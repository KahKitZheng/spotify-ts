import React, { useEffect } from "react";
import { getAccessToken, token } from "./spotify/auth";
import Modal from "react-modal";
import LoginPage from "./pages/login";
import AppRouter from "./components/AppRouter";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  getCurrentUser,
  selectCurrentUserStatus,
} from "./slices/currentUserSlice";
import {
  getPlaybackDevices,
  selectPlayback,
  setPlaybackDevice,
  updatePlayback,
} from "./slices/playerSlice";
import { SimplifiedArtist } from "./types/SpotifyObjects";

Modal.setAppElement("#root");

function App() {
  const dispatch = useAppDispatch();
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);
  const playback = useAppSelector(selectPlayback);
  const track = playback.item;

  useEffect(() => {
    if (currentUserStatus === "idle" && token) {
      dispatch(getCurrentUser());
    }
  }, [currentUserStatus, dispatch]);

  useEffect(() => {
    const renderArtistNames = (list: SimplifiedArtist[]) => {
      let artists = "";

      list.map((artist, index, arr) => {
        artists = artists.concat(
          `${artist.name}${index !== arr.length - 1 ? `, ` : ""}`
        );
      });

      return artists;
    };

    if (track?.artists === undefined) return;

    document.title = playback.is_playing
      ? `${track?.name} ${`\u2022`} ${renderArtistNames(track?.artists)}`
      : "Spotify-TS";
  }, [playback.is_playing, track?.artists, track?.name]);

  useEffect(() => {
    if (!token) getAccessToken();

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

        dispatch(updatePlayback(state));
      });

      player.connect();
    };
  }, [dispatch]);

  return <div className="App">{token ? <AppRouter /> : <LoginPage />}</div>;
}

export default App;
