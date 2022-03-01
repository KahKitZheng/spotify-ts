import { DefaultTheme } from "styled-components";

const WHITE = "#dedede";
const BLACK = "#000";

const TEXT = "#979da4";

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
