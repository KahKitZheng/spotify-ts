import React, { useEffect } from "react";
import { getAccessToken, token } from "./spotify/auth";
import Modal from "react-modal";
import LoginPage from "./pages/login";
import AppRouter from "./components/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  selectCurrentUserStatus,
} from "./slices/currentUserSlice";
import {
  getPlaybackDevices,
  setPlaybackDevice,
  updatePlayback,
} from "./slices/playerSlice";

Modal.setAppElement("#root");

function App() {
  const dispatch = useDispatch();
  const currentUserStatus = useSelector(selectCurrentUserStatus);

  useEffect(() => {
    if (currentUserStatus === "idle" && token) {
      dispatch(getCurrentUser());
    }
  }, [currentUserStatus, dispatch]);

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
