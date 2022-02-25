import React from "react";
import styled from "styled-components";
import { overflowNoScrollbar } from "../../styles/utils";

type Props = {
  children: React.ReactNode;
  colSize: number;
};

const Collection = (props: Props) => {
  return (
    <CollectionGrid $colSize={props.colSize}>{props.children}</CollectionGrid>
  );
};

const CollectionGrid = styled.div<{ $colSize: number }>`
  --colWidth: calc((100% / 2) - var(--gap));
  --gap: 16px;
  display: grid;
  grid-template-columns: ${({ $colSize }) =>
    $colSize && `repeat(${$colSize}, minmax(var(--colWidth), 1fr))`};
  grid-gap: var(--gap);
  overflow-x: auto;
  margin-left: calc(var(--gap) * -1);
  margin-right: calc(var(--gap) * -1);
  padding: 4px var(--gap) 8px;
  ${overflowNoScrollbar};

  /* Hide all items on the grid with a higher index than colSize */
  a:nth-child(1n + ${(props) => props.$colSize + 1}) {
    display: none;
  }

  @media (min-width: 560px) {
    --colWidth: calc((100% / 3) - var(--gap));
  }

  @media (min-width: 680px) {
    --colWidth: calc((100% / 4) - var(--gap));
  }

  @media (min-width: 950px) {
    --colWidth: calc((100% / 5) - var(--gap));
  }

  @media (min-width: 1080px) {
    --colWidth: calc((100% / 6) - var(--gap));
  }

  @media (min-width: 1300px) {
    --colWidth: calc((100% / 7) - var(--gap));
  }

  @media (min-width: 14000px) {
    --colWidth: calc((100% / 8) - var(--gap));
  }
`;

export default Collection;
