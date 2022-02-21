import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { MdLibraryMusic } from "react-icons/md";

const BottomTabs = () => {
  return (
    <BottomTabsWrapper>
      <TabLink to={`/`}>
        <TabIcon>
          <HiHome />
        </TabIcon>
        <span>Home</span>
      </TabLink>
      <TabLink to={`/search`}>
        <TabIcon>
          <IoSearch />
        </TabIcon>
        <span>Search</span>
      </TabLink>
      <TabLink to={`/library`}>
        <TabIcon>
          <MdLibraryMusic />
        </TabIcon>
        <span>Your Library</span>
      </TabLink>
    </BottomTabsWrapper>
  );
};

const BottomTabsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  background-color: #1c1f2f;
  padding: 12px 24px;
`;

const TabLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 14px;
  color: currentColor;
  text-decoration: none;
  margin: auto;
  width: fit-content;
`;

const TabIcon = styled.div`
  font-size: 1.25rem;
  margin-bottom: 4px;
`;

export default BottomTabs;
