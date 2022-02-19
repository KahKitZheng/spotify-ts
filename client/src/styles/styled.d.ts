import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      white: string;
      black: string;
    };

    bg: {
      main: string;
    };

    font: {
      text: string;
    };
  }
}
