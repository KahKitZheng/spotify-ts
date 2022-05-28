import React, { useEffect } from "react";
import { token } from "./spotify/auth";
import Modal from "react-modal";
import LoginPage from "./pages/login";
import AppRouter from "./components/AppRouter";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { SimplifiedArtist } from "./types/SpotifyObjects";
import * as currentUserSlice from "./slices/currentUserSlice";
import * as playerSlice from "./slices/playerSlice";

Modal.setAppElement("#root");

function App() {
  const dispatch = useAppDispatch();
  const currentUserStatus = useAppSelector(
    currentUserSlice.selectCurrentUserStatus
  );
  const playback = useAppSelector(playerSlice.selectPlayback);
  const track = playback.item;
  const access_token = window.localStorage.getItem(
    "spotify_clone_access_token"
  );

  // Get current user info
  useEffect(() => {
    if (currentUserStatus === "idle" && token) {
      dispatch(currentUserSlice.getCurrentUser());
    }
  }, [currentUserStatus, dispatch]);

  // Change html title to current song
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

  // Init the Spotify playback SDK
  useEffect(() => {
    if (!access_token) return;

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
        getOAuthToken: (cb) => {
          cb(access_token as string);
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

        dispatch(playerSlice.getPlaybackDevices());
        dispatch(playerSlice.setPlaybackDevice({ device_ids: [device_id] }));
        dispatch(playerSlice.getPlaybackDevices()).then(() =>
          dispatch(playerSlice.setPlaybackDevice({ device_ids: [device_id] }))
        );
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) return;

        dispatch(playerSlice.updatePlayback(state));
      });

      player.connect();
    };
  }, [access_token, dispatch]);

  return <div className="App">{token ? <AppRouter /> : <LoginPage />}</div>;
}

export default App;
