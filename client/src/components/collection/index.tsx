import React from "react";
import styled from "styled-components";
import { overflowNoScrollbar } from "../../styles/utils";

interface Props {
  children: React.ReactNode;
}

interface OverflowProps extends Props {
  colSize: number;
}

export const CollectionGrid = (props: Props) => (
  <CollectionGridWrapper>{props.children}</CollectionGridWrapper>
);

export const CollectionOverflow = (props: OverflowProps) => (
  <CollectionOverflowWrapper $cols={props.colSize}>
    {props.children}
  </CollectionOverflowWrapper>
);

const CollectionBase = styled.div`
  --gap: 16px;
  --columns: 2;
  --colWidth: calc((100% / var(--columns)) - var(--gap));

  display: grid;
  grid-gap: var(--gap);

  @media (min-width: 560px) {
    --columns: 3;
  }

  @media (min-width: 680px) {
    --columns: 4;
  }

  @media (min-width: 950px) {
    --columns: 5;
  }

  @media (min-width: 1080px) {
    --columns: 6;
  }

  @media (min-width: 1300px) {
    --columns: 7;
  }

  @media (min-width: 14000px) {
    --columns: 8;
  }
`;

const CollectionGridWrapper = styled(CollectionBase)`
  grid-template-columns: repeat(var(--columns), minmax(var(--colWidth), 1fr));
`;

const CollectionOverflowWrapper = styled(CollectionBase)<{ $cols: number }>`
  grid-template-columns: ${({ $cols }) =>
    `repeat(${$cols}, minmax(var(--colWidth), 1fr))`};
  margin-left: calc(var(--gap) * -1);
  margin-right: calc(var(--gap) * -1);
  padding: 4px var(--gap) 8px;
  overflow-x: auto;
  ${overflowNoScrollbar};

  /* Hide all items on the grid with a higher index than colSize */
  a:nth-child(1n + ${(props) => props.$cols + 1}) {
    display: none;
  }
`;
