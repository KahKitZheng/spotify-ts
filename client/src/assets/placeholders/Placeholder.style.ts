import styled, { css } from "styled-components";

const BaseWrapper = css`
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  font-size: 3rem;
`;

export const ArtistPlaceholderWrapper = styled.div`
  ${BaseWrapper};
  background-color: #41454a;
  border-radius: 50%;
`;

export const TrackPlaceholderWrapper = styled.div<{
  $transparent?: boolean;
}>`
  ${BaseWrapper};
  background-color: ${(p) => (p.$transparent ? "transparent" : "#41454a")};
  position: relative;

  > svg {
    position: relative;
    left: -8px;
  }
`;
