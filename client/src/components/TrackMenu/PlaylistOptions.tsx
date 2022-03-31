import React from "react";
import Tippy from "@tippyjs/react/headless";
import * as M from "./TrackMenu.style";
import { MdArrowRight } from "react-icons/md";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUserId } from "../../slices/currentUserSlice";
import { selectUserPlaylists } from "../../slices/userSavedPlaylistsSlice";

const PlaylistOptions = () => {
  const userId = useAppSelector(selectCurrentUserId);
  const allPlaylists = useAppSelector(selectUserPlaylists);
  const userPlaylists = allPlaylists.items?.filter(
    (playlist) => playlist.owner.id === userId
  );

  return allPlaylists.items?.length > 0 ? (
    <Tippy
      interactive={true}
      placement="left-start"
      offset={[0, 3]}
      render={(attrs) => (
        <M.PlaylistOptionList {...attrs}>
          <M.OptionItemWrapper>
            <M.OptionItemButton $borderSide="bottom">
              Add to new playlist
            </M.OptionItemButton>
          </M.OptionItemWrapper>

          {userPlaylists.map((playlist) => (
            <M.OptionItemWrapper key={playlist.id}>
              <M.OptionItemButton>{playlist.name}</M.OptionItemButton>
            </M.OptionItemWrapper>
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
    </Tippy>
  ) : null;
};

export default PlaylistOptions;
