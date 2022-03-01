import { css } from "styled-components";

/**
 * Helper function to reduces the visible lines of a text with ellipsis
 * @param visibleLines the amount of lines visible to the user
 */
export const textOverflow = (visibleLines: number) => {
  return css`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    overflow-wrap: anywhere;

    @supports (-webkit-line-clamp: ${visibleLines}) {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: ${visibleLines};
      -webkit-box-orient: vertical;
    }
  `;
};

// Hides the scrollbar of elements with overflow
export const overflowNoScrollbar = css`
  overflow: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
  }
`;
