import React from "react";
import styled from "styled-components";
import { HiHome } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { MdLibraryMusic } from "react-icons/md";
import { Link } from "react-router-dom";

const BottomTabs = () => {
  return (
    <BottomTabsWrapper>
      <Tab>
        <HiHome />
        <TabName to={`/`}>Home</TabName>
      </Tab>
      <Tab>
        <IoSearch />
        <TabName to={`/search`}>Search</TabName>
      </Tab>
      <Tab>
        <MdLibraryMusic />
        <TabName to={`/library`}>Your Library</TabName>
      </Tab>
    </BottomTabsWrapper>
  );
};

const BottomTabsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  padding: 16px 0;
  background-color: #1c1f2f;
  padding: 12px;
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 1.25rem;

  :first-of-type {
    padding-left: 24px;
  }

  :last-of-type {
    padding-right: 24px;
  }
`;

const TabName = styled(Link)`
  margin-top: 4px;
  font-size: 14px;
  color: currentColor;
  text-decoration: none;
`;

export default BottomTabs;
