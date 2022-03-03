import { RefObject } from "react";

/**
 * Calculate HSL colors based on string value
 * src: // https://stackoverflow.com/a/21682946
 */
export const stringToHSL = (value: string): string => {
  let hash = 0;

  if (value.length == 0) return "hsl(236, 34%, 53%)";

  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32bit integer
  }

  const shortened = hash % 360;
  return `hsl(${shortened}, 40%, 53%)`;
};

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
