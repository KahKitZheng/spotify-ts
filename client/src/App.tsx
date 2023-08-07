import { useEffect } from "react";
import Modal from "react-modal";
import LoginPage from "@/pages/login";
import AppRouter from "@/components/AppRouter";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { SimplifiedArtist } from "@/types/SpotifyObjects";
import * as currentUserSlice from "@/slices/currentUserSlice";
import * as playerSlice from "@/slices/playerSlice";

Modal.setAppElement("#root");

function App() {
  const dispatch = useAppDispatch();
  const currentUserStatus = useAppSelector(
    currentUserSlice.selectCurrentUserStatus
  );
  const playback = useAppSelector(playerSlice.selectPlayback);
  const track = playback.item;
  const token = localStorage.getItem("spotify_clone_access_token");

  // Get current user info
  useEffect(() => {
    if (currentUserStatus === "idle" && token) {
      dispatch(currentUserSlice.getCurrentUser());
    }
  }, [currentUserStatus, dispatch, token]);

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

  return (
    <div className="App">
      {token === "null" || token === "undefined" || !token ? (
        <LoginPage />
      ) : (
        <AppRouter />
      )}
    </div>
  );
}

export default App;
