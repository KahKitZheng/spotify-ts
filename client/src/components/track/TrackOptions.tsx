import React from "react";
import styled from "styled-components";
import { BsThreeDots } from "react-icons/bs";

const TrackOptions = () => {
  return (
    <TrackOptionsWrapper>
      <BsThreeDots />
    </TrackOptionsWrapper>
  );
};

const TrackOptionsWrapper = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.font.text};
  border: 0;
  padding: 0;
  font-weight: 600;
  cursor: pointer;
`;

export default TrackOptions;
