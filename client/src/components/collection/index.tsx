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
  --colSize: ${({ $colSize }) => $colSize};

  display: grid;
  grid-template-columns: ${({ $colSize }) =>
    $colSize && `repeat(${$colSize}, minmax(11rem, 1fr))`};
  grid-gap: 16px;
  overflow-x: auto;
  margin-left: -16px;
  margin-right: -16px;
  padding: 4px 16px 8px;
  ${overflowNoScrollbar};

  /* Hide all items on the grid with a higher index than colSize */
  a:nth-child(1n + ${(props) => props.$colSize + 1}) {
    display: none;
  }
`;

export default Collection;
