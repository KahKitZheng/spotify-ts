import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BsFillVolumeMuteFill,
  BsFillVolumeDownFill,
  BsFillVolumeUpFill,
} from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as playerSlice from "@/slices/playerSlice";
import debounce from "lodash.debounce";

const PlayerVolume = () => {
  const dispatch = useAppDispatch();
  const currentVolume = useAppSelector(playerSlice.selectCurrentVolume);

  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [oldVolume, setOldVolume] = useState(0);

  useEffect(() => {
    setVolume(currentVolume);
  }, [currentVolume]);

  function renderVolumeIcon() {
    if (volume === 0) {
      return <BsFillVolumeMuteFill />;
    } else if (0 <= volume && volume < 50) {
      return <BsFillVolumeDownFill />;
    } else if (50 <= volume && volume <= 100) {
      return <BsFillVolumeUpFill />;
    }
  }

  function handleMuteVolume() {
    if (isMuted) {
      setIsMuted(!isMuted);
      dispatch(playerSlice.setPlaybackVolume({ volume_percent: oldVolume }));
    } else {
      setIsMuted(!isMuted);
      setOldVolume(volume);
      dispatch(playerSlice.setPlaybackVolume({ volume_percent: 0 }));
    }
  }

  const debounceVolume = debounce((volume: number) => {
    dispatch(playerSlice.setPlaybackVolume({ volume_percent: volume }));
  }, 30);

  return (
    <VolumeBarWrapper>
      <VolumeIcon onClick={handleMuteVolume}>{renderVolumeIcon()}</VolumeIcon>
      <VolumeBar
        type="range"
        min={0}
        value={volume | 0}
        max={100}
        onChange={(e) => debounceVolume(+e.target.value)}
      />
    </VolumeBarWrapper>
  );
};

const VolumeBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VolumeIcon = styled.button`
  background-color: transparent;
  color: currentColor;
  border: 0;
  font-size: 20px;
  padding: 0;
  cursor: pointer;
  margin-right: 16px;
`;

const VolumeBar = styled.input.attrs({ type: "range" })`
  width: 100%;
`;

export default PlayerVolume;
