import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectPlayback } from "@/slices/playerSlice";

/**
 *
 * @param trackUri value to compare to the current playback track
 * @returns `[isCurrentTrack, isCurrentTrackPlaying]`
 * first value is a boolean of whether the given track uri is the same as the current playback track,
 * second value is a boolean of whether the given track uri is playing right now
 */
export const usePlayingTrack = (trackUri: string) => {
  const [isCurrentTrackPlaying, setIsCurrentTrackPlaying] = useState(false);

  const playback = useAppSelector(selectPlayback);
  const currentTrackUri = playback.item?.uri;
  const isPlayerPlaying = playback.is_playing;

  const isCurrentTrack = trackUri === currentTrackUri;

  useEffect(() => {
    isPlayerPlaying && isCurrentTrack
      ? setIsCurrentTrackPlaying(true)
      : setIsCurrentTrackPlaying(false);
  }, [isCurrentTrack, isPlayerPlaying]);

  return [isCurrentTrack, isCurrentTrackPlaying];
};
