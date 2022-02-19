import React from "react";
import styled from "styled-components";

type Props = { children: React.ReactNode };

const MainViewWrapper = ({ children }: Props) => {
  return <ViewWrapper>{children}</ViewWrapper>;
};

const ViewWrapper = styled.main`
  flex: 1;
  padding: 16px;
`;

export default MainViewWrapper;
