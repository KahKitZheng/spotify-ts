import { RefObject } from "react";
import { SimplifiedTrack, Track, PlaylistItem } from "../types/SpotifyObjects";

/**
 * Calculate HSL colors based on string value
 * src: // https://stackoverflow.com/a/21682946
 */
const stringToHue = (value: string): string => {
  let hash = 0;
  if (value.length == 0) return "hsl(236, 34%, 53%)";

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  return `${hash % 360}`;
};

export const getHeaderHue = (value: string) =>
  `hsl(${stringToHue(value)}, 70%, 40%)`;

export const getBrowseCardHue = (value: string) =>
  `hsl(${stringToHue(value)}, 40%, 53%)`;

/**
 * Reset scroll overflow to 0
 */
export const resetScroll = (htmlElement: RefObject<HTMLElement>) => {
  if (htmlElement.current) {
    return (htmlElement.current.scrollTop = 0);
  }
};

/**
 * Format milliseconds into either HH:MM or MM:SS
 */
export const formatDuration = (
  duration: number,
  formatType: "playlist" | "short" | "track"
) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));

  if (formatType === "playlist") {
    if (hours >= 1) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${minutes} min ${seconds < 10 ? "0" + seconds : seconds} sec`;
    }
  } else if (formatType === "short") {
    return `${minutes} min ${seconds < 10 ? "0" + seconds : seconds} sec`;
  } else if (formatType === "track") {
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }
};

/**
 * Get a random number between two values inlusive the min but not the max
 */
export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Format the date when a track was added to playlist i.e. "Jan 1, 1970"
 */
export const formatAddedAt = (dateAdded: string | undefined) => {
  if (dateAdded !== undefined) {
    const date = new Date(dateAdded);

    const Day = date.getDate();
    const Month = date.toLocaleString("default", { month: "short" });
    const Year = date.getFullYear();

    return `${Month} ${Day}, ${Year}`;
  } else {
    return "";
  }
};

/**
 * Helper function to group objects with same property value i.e. tracks with same disc_number
 * src: https://gist.github.com/robmathers/1830ce09695f759bf2c4df15c29dd22d?permalink_comment_id=3554018#gistcomment-3554018
 */
type ItemKey = string | number | symbol;

export const groupBy = <Key extends ItemKey, T extends Record<Key, ItemKey>>(
  items: T[],
  key: Key
): Record<ItemKey, T[]> =>
  items?.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [...(result[item[key]] || []), item],
    }),
    {} as Record<ItemKey, T[]>
  );

/** Extract id from object and push it into an array */
export const extractTrackId = (
  list: Array<Track | SimplifiedTrack | PlaylistItem>
) => {
  let ids: string[] = [];
  list?.map((item) => {
    if ("added_at" in item) {
      if (item !== undefined) {
        ids = [...ids, item.track.id];
      }
    } else {
      ids = [...ids, item.id];
    }
  });
  return ids;
};
