import axios from "axios";

// 3600 seconds * 1000 = 1 hour in milliseconds
const EXPIRATION_TIME = 3600 * 1000;
const TOKEN_TIMESTAMP = "spotify_clone_token_timestamp";
const ACCESS_TOKEN    = "spotify_clone_access_token";
const REFRESH_TOKEN   = "spotify_clone_refresh_token";

// Get tokens from localstorage
function getTokenTimestamp() {
  return window.localStorage.getItem(TOKEN_TIMESTAMP);
}

function getLocalAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN);
}

function getLocalRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN);
}

// Set tokens from localstorage
function setTokenTimestamp() {
  const now = Date.now();
  window.localStorage.setItem(TOKEN_TIMESTAMP, JSON.stringify(now));
}

function setLocalAccessToken(token: string) {
  setTokenTimestamp();
  window.localStorage.setItem(ACCESS_TOKEN, token);
}

function setLocalRefreshToken(token: string) {
  window.localStorage.setItem(REFRESH_TOKEN, token);
}

async function refreshAccessToken() {
  try {
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${getLocalRefreshToken()}`
    );
    const { access_token } = data;
    setLocalAccessToken(access_token);
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
  }
}

function getHashParams() {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce(function (initial: { [key: string]: unknown }, item) {
      if (item) {
        const parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
}

// Retrieve access token from query params (called on application init)
export const getAccessToken = () => {
  const tokenTimestamp = getTokenTimestamp();
  const accessToken = getLocalAccessToken();
  const refreshToken = getLocalRefreshToken();
  const { access_token, refresh_token, error } = getHashParams();

  if (error) {
    console.error(error);
    refreshAccessToken();
  }

  // If token has expired
  if (typeof tokenTimestamp === "string") {
    if (Date.now() - parseInt(tokenTimestamp) > EXPIRATION_TIME) {
      console.warn("Access token has expired, refreshing...");
      refreshAccessToken();
    }
  }

  // If there is no REFRESH token in local storage, set it as `refresh_token` from params
  if (!refreshToken || refreshToken === "undefined") {
    setLocalRefreshToken(refresh_token as string);
  }

  // If there is no ACCESS token in local storage, set it and return `access_token` from params
  if (!accessToken || accessToken === "undefined") {
    setLocalAccessToken(access_token as string);
    return access_token;
  }

  return accessToken;
};

export const logout = () => {
  window.localStorage.removeItem(TOKEN_TIMESTAMP);
  window.localStorage.removeItem(ACCESS_TOKEN);
  window.localStorage.removeItem(REFRESH_TOKEN);
  window.location.reload();
};

export const token = getAccessToken();
