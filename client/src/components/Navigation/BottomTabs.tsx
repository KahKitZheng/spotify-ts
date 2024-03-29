import styled from "styled-components";
import { MEDIA } from "@/styles/media";
import { NavLink, useLocation } from "react-router-dom";
import { HiOutlineHome, HiHome } from "react-icons/hi";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { MdOutlineLibraryMusic, MdLibraryMusic } from "react-icons/md";

const BottomTabs = () => {
  const location = useLocation();

  return (
    <BottomTabsWrapper>
      <TabLink to={`/`}>
        {location.pathname === "/" ? (
          <TabIcon>
            <HiHome />
          </TabIcon>
        ) : (
          <TabIcon>
            <HiOutlineHome />
          </TabIcon>
        )}
        <span>Home</span>
      </TabLink>
      <TabLink to={`/search`}>
        {location.pathname === "/search" ? (
          <TabIcon>
            <IoSearch />
          </TabIcon>
        ) : (
          <TabIcon>
            <IoSearchOutline />
          </TabIcon>
        )}
        <span>Search</span>
      </TabLink>
      <TabLink to={`/library`}>
        {location.pathname === "/library" ? (
          <TabIcon>
            <MdLibraryMusic />
          </TabIcon>
        ) : (
          <TabIcon>
            <MdOutlineLibraryMusic />
          </TabIcon>
        )}
        <span>Your Library</span>
      </TabLink>
    </BottomTabsWrapper>
  );
};

const BottomTabsWrapper = styled.footer`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  background-color: ${({ theme }) => theme.bg.bottom_tabs};
  padding: 12px 24px;

  @media (min-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

const TabLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 14px;
  color: currentColor;
  text-decoration: none;
  margin: auto;
  width: fit-content;
  cursor: pointer;

  :hover {
    color: #27dc89;
    text-decoration: none;
  }

  &.active {
    color: #27dc89;
  }
`;

const TabIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 2px;
`;

export default BottomTabs;
