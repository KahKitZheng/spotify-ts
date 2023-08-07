import React from "react";
import * as M from "./TrackMenu.style";
import PlaylistOptionItem from "./PlaylistOptionItem";
import { MdArrowRight } from "react-icons/md";
import { NestedPopover } from "../Popover";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectCurrentUserId } from "@/slices/currentUserSlice";
import { SimplifiedTrack, Track } from "@/types/SpotifyObjects";
import { addTrackToPlaylist } from "@/slices/playlistSlice";
import {
  selectUserPlaylists,
  createPlaylist,
} from "@/slices/userSavedPlaylistsSlice";

interface Props {
  track: Track | SimplifiedTrack;
  close: () => void;
}

const PlaylistOptions = ({ track, close }: Props) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectCurrentUserId);
  const allPlaylists = useAppSelector(selectUserPlaylists);
  const userPlaylists = allPlaylists.items?.filter(
    (playlist) => playlist.owner.id === userId
  );

  function CreateNewPlaylistWithTrack() {
    const newPlaylistPayload = { user_id: userId, name: track.name };
    dispatch(createPlaylist(newPlaylistPayload)).then((res) => {
      const payload = { playlist_id: res.payload.id, uris: [track.uri] };
      dispatch(addTrackToPlaylist(payload));
    });

    close();
  }

  return (
    <NestedPopover
      render={() => (
        <M.PlaylistOptionList>
          <M.OptionItemWrapper>
            <M.OptionItemButton
              onClick={CreateNewPlaylistWithTrack}
              $borderSide="bottom"
            >
              Add to new playlist
            </M.OptionItemButton>
          </M.OptionItemWrapper>

          {userPlaylists.map((playlist) => (
            <PlaylistOptionItem
              key={playlist.id}
              close={close}
              track={track}
              playlist={playlist}
            />
          ))}
        </M.PlaylistOptionList>
      )}
    >
      <M.OptionItemWrapper>
        <M.OptionItemButton>Add to playlist</M.OptionItemButton>
        <M.MoreOptionIcon>
          <MdArrowRight />
        </M.MoreOptionIcon>
      </M.OptionItemWrapper>
    </NestedPopover>
  );
};

export default PlaylistOptions;
