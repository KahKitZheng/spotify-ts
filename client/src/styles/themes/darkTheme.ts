import { DefaultTheme } from "styled-components";

const WHITE = "#f3f3f3";
const BLACK = "#000";

const TEXT = "lightsteelblue";

const darkTheme: DefaultTheme = {
  colors: {
    white: WHITE,
    black: BLACK,
  },

  bg: {
    main: "#10111a",
  },

  font: {
    text: TEXT,
    title: WHITE,
    link: WHITE,
  },
};

export default darkTheme;
