import { DefaultTheme } from "styled-components";

const WHITE = "#dedede";
const BLACK = "#000";

const TEXT = "#979da4";

const darkTheme: DefaultTheme = {
  colors: {
    white: WHITE,
    black: BLACK,
    spotify: "#1ed760",
  },

  bg: {
    main: "#10111a",
    card: "#1d1d25",
    card_thumbnail_placeholder: "#1c1d25",
    liked_songs: "linear-gradient(149.46deg,#450af5,#8e8ee5 99.16%)",
    bottom_tabs: "#17171e",
  },

  font: {
    text: TEXT,
    title: WHITE,
    link: WHITE,
  },
};

export default darkTheme;
