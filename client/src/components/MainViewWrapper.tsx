import React from "react";
import styled from "styled-components";
import { MEDIA } from "../styles/media";

type Props = { children: React.ReactNode };

const MainViewWrapper = ({ children }: Props) => {
  return <ViewWrapper>{children}</ViewWrapper>;
};

const ViewWrapper = styled.main`
  --layout-padding: 16px;
  grid-area: main;
  padding: var(--layout-padding);
  overflow: auto;

  @media (min-width: ${MEDIA.laptop}) {
    --layout-padding: 32px;
  }
`;

export default MainViewWrapper;
