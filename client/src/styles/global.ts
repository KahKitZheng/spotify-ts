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
`;

export default withTheme(GlobalStyle);
