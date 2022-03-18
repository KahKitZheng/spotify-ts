import React from "react";
import styled from "styled-components";

type Props = { children: React.ReactNode };

const MainViewWrapper = ({ children }: Props) => {
  return <ViewWrapper>{children}</ViewWrapper>;
};

const ViewWrapper = styled.main`
  grid-area: main;
  padding: 16px;
  overflow: auto;
`;

export default MainViewWrapper;
