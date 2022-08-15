import React from "react";
import App from "./App";
import ReactDOM from "react-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";

import GlobalStyle from "./styles/global";
import darkTheme from "./styles/themes/darkTheme";
import { ThemeProvider } from "styled-components";
import "@fontsource/source-sans-3/200.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
