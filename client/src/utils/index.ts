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
    console.log(htmlElement);
    return (htmlElement.current.scrollTop = 0);
  }
};
