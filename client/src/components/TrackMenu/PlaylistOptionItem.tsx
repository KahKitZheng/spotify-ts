import React from "react";
import * as M from "./TrackMenu.style";
import * as SpotifyObjects from "../../types/SpotifyObjects";
import { useAddPlaylistTrack } from "../Track/Track.hooks";

interface Props {
  track: SpotifyObjects.Track | SpotifyObjects.SimplifiedTrack;
  playlist: SpotifyObjects.SimplifiedPlaylist;
  close: () => void;
}

const PlaylistItem = ({ track, playlist, close }: Props) => {
  const addTrackToPlaylist = useAddPlaylistTrack(track, playlist.id);

  const handleClick = () => {
    addTrackToPlaylist();
    close();
  };

  return (
    <M.OptionItemWrapper key={playlist.id}>
      <M.OptionItemButton onClick={handleClick}>
        {playlist.name}
      </M.OptionItemButton>
    </M.OptionItemWrapper>
  );
};

export default PlaylistItem;
