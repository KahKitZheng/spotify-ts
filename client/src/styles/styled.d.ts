import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      white: string;
      black: string;
      spotify: string;
    };

    bg: {
      main: string;
      card: string;
      card_thumbnail_placeholder: string;
      liked_songs: string;
      bottom_tabs: string;
    };

    font: {
      text: string;
      title: string;
      link: string;
    };
  }
}
