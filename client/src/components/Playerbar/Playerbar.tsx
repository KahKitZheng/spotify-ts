import React from "react";
import styled from "styled-components";
import PlayerTrack from "./PlayerTrack";
import PlayerTrackControls from "./PlayerTrackControls";
import PlayerVolume from "./PlayerVolume";
import PlayerDevices from "./PlayerDevices";
import { MEDIA } from "../../styles/media";

const Playbar = () => (
  <PlaybarWrapper>
    <PlayerTrack />
    <PlayerTrackControls />
    <PlayerControlsWrapper>
      <PlayerDevices />
      <PlayerVolume />
    </PlayerControlsWrapper>
  </PlaybarWrapper>
);

const PlaybarWrapper = styled.footer`
  grid-area: playbar;
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.5fr;
  grid-gap: 16px;
  height: 90px;
  padding: 16px;
  background-color: #17171f;

  @media (max-width: ${MEDIA.tablet}) {
    display: none;
  }
`;

const PlayerControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ButtonIcon = styled.button`
  background-color: transparent;
  color: currentColor;
  font-size: 20px;
  border: 0;
  margin: 0 16px;
  padding: 0;
  cursor: pointer;
`;

export default Playbar;
