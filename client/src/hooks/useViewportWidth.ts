import { useState, useEffect } from "react";

/**
 * Compare the current window width with the given viewport size
 * @param viewport viewport size to compare to
 * @returns {boolean} Returns a boolean of whether the window is larger than the viewport
 */
export const useViewportWidth = (viewport: number): boolean => {
  const [isViewportSize, setIsViewportSize] = useState(window.innerWidth > viewport);

  function updateMedia() {
    setIsViewportSize(window.innerWidth > viewport);
  }

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  return isViewportSize;
};
