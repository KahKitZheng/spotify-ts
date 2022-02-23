import { css } from "styled-components";

// Hides the scrollbar of elements with overflow
export const overflowNoScrollbar = css`
  overflow: auto;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    width: 0;
  }
`;
