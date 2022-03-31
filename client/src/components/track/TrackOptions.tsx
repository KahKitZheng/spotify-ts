import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Tippy from "@tippyjs/react/headless";
import { Link } from "react-router-dom";
import { MEDIA } from "../../styles/media";
import { BsThreeDots } from "react-icons/bs";
import { MdArrowRight } from "react-icons/md";
import { SimplifiedArtist } from "../../types/SpotifyObjects";
import { useAppSelector } from "../../app/hooks";
import { useScrollBlock } from "../../hooks/useScrollBlock";
import { selectUserPlaylists } from "../../slices/userSavedPlaylistsSlice";
import { overflowNoScrollbar, textOverflow } from "../../styles/utils";
import { selectCurrentUserId } from "../../slices/currentUserSlice";

type Props = {
  artistId?: SimplifiedArtist[];
  albumId?: string;
  isSaved?: boolean;
  isPlaylistOwner?: boolean;
};

const TrackOptions = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const [blockScroll, allowScroll] = useScrollBlock();

  const show = () => {
    setVisible(true);
    blockScroll();
  };

  const hide = useCallback(() => {
    setVisible(false);
    allowScroll();
  }, [allowScroll]);

  return (
    <Tippy
      interactive={true}
      visible={visible}
      onClickOutside={hide}
      onDestroy={hide}
      placement="left"
      render={(attrs) => <DefaultOptions {...props} {...attrs} />}
    >
      <TrackOptionsWrapper onClick={visible ? hide : show}>
        <BsThreeDots />
      </TrackOptionsWrapper>
    </Tippy>
  );
};

const DefaultOptions = (props: Props) => {
  return (
    <OptionsList>
      <OptionGroup>
        <OptionItemWrapper>
          <OptionItemButton>Add to queue</OptionItemButton>
        </OptionItemWrapper>
      </OptionGroup>

      <OptionGroup>
        {props.artistId !== undefined && (
          <ArtistOptions artistIds={props.artistId} />
        )}

        {props.albumId && (
          <OptionItemWrapper>
            <OptionLink to={`/album/${props.albumId}`}>Go to album</OptionLink>
          </OptionItemWrapper>
        )}
      </OptionGroup>

      <OptionGroup>
        {props.isSaved === true ? (
          <OptionItemWrapper>
            <OptionItemButton>Remove to your liked songs</OptionItemButton>
          </OptionItemWrapper>
        ) : (
          <OptionItemWrapper>
            <OptionItemButton>Save to your liked songs</OptionItemButton>
          </OptionItemWrapper>
        )}
        {props.isPlaylistOwner && (
          <OptionItemWrapper>
            <OptionItemButton>Remove from this playlist</OptionItemButton>
          </OptionItemWrapper>
        )}
        <PlaylistOptions />
      </OptionGroup>
    </OptionsList>
  );
};

const ArtistOptions = (props: { artistIds: SimplifiedArtist[] }) => {
  if (props.artistIds && props.artistIds.length === 1) {
    return (
      <OptionItemWrapper>
        <OptionLink to={`/artist/${props.artistIds[0].id}`}>
          Go to artist
        </OptionLink>
      </OptionItemWrapper>
    );
  } else if (props.artistIds && props.artistIds.length > 1) {
    return (
      <div>
        <Tippy
          interactive={true}
          placement="left-start"
          offset={[0, 3]}
          render={(attrs) => (
            <OptionsList {...attrs}>
              {props.artistIds.map((artist) => (
                <OptionItemWrapper key={artist.id}>
                  <OptionLink to={`/artist/${artist.id}`}>
                    {artist.name}
                  </OptionLink>
                </OptionItemWrapper>
              ))}
            </OptionsList>
          )}
        >
          <OptionItemWrapper>
            <OptionItemButton>Go to artist</OptionItemButton>
            <MoreOptionIcon>
              <MdArrowRight />
            </MoreOptionIcon>
          </OptionItemWrapper>
        </Tippy>
      </div>
    );
  } else {
    return null;
  }
};

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
        <PlaylistOptionList {...attrs}>
          <OptionGroup>
            <OptionItemWrapper>
              <OptionItemButton>Add to new playlist</OptionItemButton>
            </OptionItemWrapper>
          </OptionGroup>
          <OptionGroup>
            {userPlaylists.map((playlist) => (
              <OptionItemWrapper key={playlist.id}>
                <OptionItemButton>{playlist.name}</OptionItemButton>
              </OptionItemWrapper>
            ))}
          </OptionGroup>
        </PlaylistOptionList>
      )}
    >
      <OptionItemWrapper>
        <OptionItemButton>Add to playlist</OptionItemButton>
        <MoreOptionIcon>
          <MdArrowRight />
        </MoreOptionIcon>
      </OptionItemWrapper>
    </Tippy>
  ) : null;
};

export const TrackOptionsWrapper = styled.button`
  visibility: hidden;
  background-color: transparent;
  color: ${({ theme }) => theme.font.text};
  border: 0;
  padding: 0 0 0 16px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

const OptionsList = styled.ul`
  background-color: #262a35;
  color: currentColor;
  box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  list-style: none;
  margin: 0;
  padding: 4px;
`;

const PlaylistOptionList = styled(OptionsList)`
  max-height: 50vh;
  max-width: 200px;
  overflow: auto;
  ${overflowNoScrollbar};
`;

const OptionGroup = styled.div`
  border-bottom: 1px solid #394046;

  :last-of-type {
    border-bottom: 0;
  }
`;

const OptionItemWrapper = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.font.text};

  :hover {
    background-color: #20222c;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const OptionItemButton = styled.button`
  background-color: transparent;
  color: currentColor;
  border: 0;
  padding: 12px;
  /* padding: 0; */
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  /* ${textOverflow(1)}; */
`;

const MoreOptionIcon = styled.span`
  display: inline-block;
  font-size: 24px;
  padding-right: 4px;
  /* margin-right: -8px; */
`;

const OptionLink = styled(Link)`
  color: ${({ theme }) => theme.font.text};
  display: inline-block;
  width: 100%;
  padding: 12px;
  ${textOverflow(1)};

  :hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

export default TrackOptions;
