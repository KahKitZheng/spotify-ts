import "@fontsource/source-sans-3/200.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
import { createGlobalStyle, withTheme } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html, body {
    height: 100%;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    font-family: "Source Sans 3", "Open Sans", "Ubuntu", "sans-serif";
    background-color: ${({ theme }) => theme.bg.main};
    color: ${({ theme }) => theme.font.text};
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.font.title};
  }


  #root, .App {
    isolation: isolate;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }


  a {
    color: ${({ theme }) => theme.font.link};
    text-decoration: none;

    :hover {
      text-decoration: underline;
    }

    :focus {
      text-decoration: none;
    }
  }

  span.bull {
    margin-left: 4px;
    margin-right: 4px;
  }

  input[type=range] {
      /* reset input range */
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 100%;

    /***** Track Styles *****/
    /***** Chrome, Safari, Opera, and Edge Chromium *****/
    &::-webkit-slider-runnable-track {
      background: #404246;
      height: 0.25rem;
    }

    /******** Firefox ********/
    &::-moz-range-track {
      background: #404246;
      height: 0.25rem;
    }

    /***** Thumb Styles *****/
    /***** Chrome, Safari, Opera, and Edge Chromium *****/
    &::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;
      margin-top: -4px; /* Centers thumb on the track */
      background-color: #fff;
      height: 12px;
      width: 12px;
      border-radius: 50%;
    }

    /***** Firefox *****/
    &::-moz-range-thumb {
      border: none; /*Removes extra border that FF applies*/
      border-radius: 50%;
      background-color: #fff;
      height: 12px;
      width: 12px;
    }
  }
  
  .List > div > div {
    margin-top: 8px;
    margin-left: -16px;
    margin-right: -16px;
  }

  .List::-webkit-scrollbar {
    width: .3em;
  }

  .List::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    outline: 1px solid slategrey;
    border-radius: 12px;
  }
`;

export default withTheme(GlobalStyle);
