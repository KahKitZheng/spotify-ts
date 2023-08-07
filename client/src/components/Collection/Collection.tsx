import React from "react";
import styled from "styled-components";
import { overflowNoScrollbar } from "@/styles/utils";

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
  --column-width: 190px;

  display: grid;
  grid-gap: 16px;
`;

const CollectionGridWrapper = styled(CollectionBase)`
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
`;

const CollectionOverflowWrapper = styled(CollectionBase)`
  grid-auto-flow: column;
  grid-template-columns: repeat(auto-fit, var(--column-width));
  margin-left: calc(var(--layout-padding) * -1);
  margin-right: calc(var(--layout-padding) * -1);
  padding-top: calc(var(--layout-padding) / 2);
  padding-left: var(--layout-padding);
  padding-right: var(--layout-padding);
  ${overflowNoScrollbar};
  overflow-y: hidden;
`;
