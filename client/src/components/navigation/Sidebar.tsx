import React, { Fragment, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  TiHomeOutline as HomeOutline,
  TiHome as HomeFill,
} from "react-icons/ti";
import {
  IoSearchOutline as SearchOutline,
  IoSearch as SearchFill,
} from "react-icons/io5";
import {
  MdOutlineLibraryMusic as LibraryOutline,
  MdLibraryMusic as LibraryFill,
} from "react-icons/md";
import { MdAddBox, MdMusicNote } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as savedPlaylists from "../../slices/userSavedPlaylistsSlice";
import { overflowNoScrollbar, textOverflow } from "../../styles/utils";
import { MEDIA } from "../../styles/media";
import { selectCurrentUser } from "../../slices/currentUserSlice";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectCurrentUser);
  const playlists = useAppSelector(savedPlaylists.selectUserPlaylists);
  const status = useAppSelector(savedPlaylists.selectPlaylistsStatus);
  const offsetStatus = useAppSelector(
    savedPlaylists.selectPlaylistsOffsetStatus
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(savedPlaylists.getCurrentUserPlaylists({ limit: 50 }));
    }
    if (offsetStatus === "idle" && playlists.next !== null) {
      dispatch(savedPlaylists.getPlaylistWithOffset({ url: playlists.next }));
    }
  }, [dispatch, offsetStatus, playlists.next, playlists.offset, status]);

  function createNewPlaylist() {
    dispatch(
      savedPlaylists.createPlaylist({ user_id: user.id, name: "New Playlist" })
    ).then((res) => navigate(`/playlist/${res.payload.id}`));
  }

  return playlists.items ? (
    <SidebarWrapper>
      <ShortcutLinks>
        <li>
          <ListItem to="/">
            <ListItemIcon>
              {location.pathname === "/" ? <HomeFill /> : <HomeOutline />}
            </ListItemIcon>
            <ListItemText>Home</ListItemText>
          </ListItem>
        </li>
        <li>
          <ListItem to="/search">
            <ListItemIcon>
              {location.pathname === "/search" ? (
                <SearchFill />
              ) : (
                <SearchOutline />
              )}
            </ListItemIcon>
            <ListItemText>Search</ListItemText>
          </ListItem>
        </li>
        <li>
          <ListItem to="/library">
            <ListItemIcon>
              {location.pathname === "/library" ? (
                <LibraryFill />
              ) : (
                <LibraryOutline />
              )}
            </ListItemIcon>
            <ListItemText>Your Library</ListItemText>
          </ListItem>
        </li>
        <li>
          <CreatePlaylist onClick={createNewPlaylist}>
            <ListItemIcon>
              <MdAddBox />
            </ListItemIcon>
            <ListItemText>Create Playlist</ListItemText>
          </CreatePlaylist>
        </li>
        <li>
          <ListItem to="/liked-songs">
            <ListItemIcon>
              <img
                src="https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png"
                height={20}
                width={20}
                alt=""
                loading="lazy"
              />
            </ListItemIcon>
            <ListItemText>Liked Songs</ListItemText>
          </ListItem>
        </li>
      </ShortcutLinks>

      {playlists.items && (
        <TestWrapper>
          <Test />
          <UserPlaylists>
            {playlists.items.map((playlist) => (
              <Fragment key={playlist.id}>
                <li>
                  <ListItem to={`/playlist/${playlist.id}`}>
                    <ListItemText>{playlist.name}</ListItemText>
                  </ListItem>
                </li>
              </Fragment>
            ))}
          </UserPlaylists>
        </TestWrapper>
      )}
    </SidebarWrapper>
  ) : null;
};

const SidebarWrapper = styled.aside`
  grid-area: sidebar;
  padding: 24px 24px 0;
  background-color: black;
  display: flex;
  flex-direction: column;
  overflow: auto;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled(NavLink)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.font.text};

  :hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }

  &.active {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ListItemIcon = styled.span`
  margin-right: 16px;

  svg {
    font-size: 1.25rem;
  }
`;

const ListItemText = styled.span`
  ${textOverflow(1)};
`;

const CreatePlaylist = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  width: 100%;
  color: currentColor;
  padding: 4px 0;

  :hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ShortcutLinks = styled(List)`
  flex: 0 1 auto;
  li:nth-child(4) {
    margin-top: 16px;
  }
`;

const TestWrapper = styled.div`
  margin-top: 8px;
  padding-bottom: 16px;
  border-top: 1px solid #292e32;
  flex: 2 1 auto;
  overflow: hidden;
  position: relative;
`;

const Test = styled.div`
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent);
  height: 16px;
  width: 100%;
  position: absolute;
  top: 0;
`;

const UserPlaylists = styled(List)`
  padding-top: 8px;
  height: 100%;
  overflow: auto;
  ${overflowNoScrollbar}

  a {
    font-weight: 400;
  }
`;

export default Sidebar;
