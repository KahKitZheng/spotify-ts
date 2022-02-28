import React from "react";
import styled from "styled-components";
import { overflowNoScrollbar } from "../../styles/utils";

interface Props {
  children: React.ReactNode;
}

export const CollectionGrid = (props: Props) => (
  <CollectionGridWrapper>{props.children}</CollectionGridWrapper>
);

export const CollectionOverflow = (props: Props) => (
  <CollectionOverflowWrapper>{props.children}</CollectionOverflowWrapper>
);

const CollectionBase = styled.div`
  --gap: 16px;
  --columns: 2;
  --colWidth: calc((100% / var(--columns)) - var(--gap));

  display: grid;
  grid-gap: var(--gap);
`;

const CollectionGridWrapper = styled(CollectionBase)`
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fill, minmax(9.85rem, 1fr));
`;

const CollectionOverflowWrapper = styled(CollectionBase)`
  grid-auto-flow: column;
  grid-template-columns: repeat(auto-fit, minmax(calc(10rem - 4px), 12rem));
  margin-left: calc(var(--gap) * -1);
  margin-right: calc(var(--gap) * -1);
  padding: 4px var(--gap) 8px;
  overflow-x: auto;
  ${overflowNoScrollbar};
`;
