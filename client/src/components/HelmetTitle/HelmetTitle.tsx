import React from "react";
import { Helmet } from "react-helmet-async";
import { useAppSelector } from "../../app/hooks";
import { selectPlayback } from "../../slices/playerSlice";
import { SimplifiedArtist } from "../../types/SpotifyObjects";

const HelmetTitle = () => {
  const playback = useAppSelector(selectPlayback);
  const track = playback.item;

  const renderArtistNames = (list: SimplifiedArtist[]) => {
    let artists = "";

    list.map((artist, index, arr) => {
      artists = artists.concat(
        `${artist.name}${index !== arr.length - 1 ? `, ` : ""}`
      );
    });

    return artists;
  };

  return (
    <Helmet>
      {track?.artists !== undefined && (
        <title>
          {playback.is_playing
            ? `${track?.name} ${`\u2022`} ${renderArtistNames(track?.artists)}`
            : "Spotify-TS"}
        </title>
      )}
    </Helmet>
  );
};

export default HelmetTitle;
