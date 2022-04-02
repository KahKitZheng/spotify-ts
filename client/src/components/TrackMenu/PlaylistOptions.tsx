import React from "react";
import * as M from "./TrackMenu.style";
import PlaylistOptionItem from "./PlaylistOptionItem";
import { MdArrowRight } from "react-icons/md";
import { NestedPopover } from "./NestedPopover";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUserId } from "../../slices/currentUserSlice";
import { selectUserPlaylists } from "../../slices/userSavedPlaylistsSlice";
import { SimplifiedTrack, Track } from "../../types/SpotifyObjects";

interface Props {
  track: Track | SimplifiedTrack;
  close: () => void;
}

const PlaylistOptions = (props: Props) => {
  const userId = useAppSelector(selectCurrentUserId);
  const allPlaylists = useAppSelector(selectUserPlaylists);
  const userPlaylists = allPlaylists.items?.filter(
    (playlist) => playlist.owner.id === userId
  );

  return (
    <NestedPopover
      render={() => (
        <M.PlaylistOptionList>
          <M.OptionItemWrapper>
            <M.OptionItemButton $borderSide="bottom">
              Add to new playlist
            </M.OptionItemButton>
          </M.OptionItemWrapper>

          {userPlaylists.map((playlist) => (
            <PlaylistOptionItem
              key={playlist.id}
              close={props.close}
              track={props.track}
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
