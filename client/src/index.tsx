import React from "react";
import App from "./App";
import axios from "axios";
import ReactDOM from "react-dom";
import { token } from "./spotify/auth";
import { store } from "./app/store";
import { Provider } from "react-redux";

import GlobalStyle from "./styles/global";
import darkTheme from "./styles/themes/darkTheme";
import { ThemeProvider } from "styled-components";
import "@fontsource/source-sans-3/200.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";

import * as serviceWorker from "./serviceWorker";

axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
