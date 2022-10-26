import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { interceptRefreshAccessToken } from "../spotify/auth";

axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers.post["Content-Type"] = "application/json";

// Request interceptor for API calls
axios.interceptors.request.use(
  async (config) => {
    const token = window.localStorage.getItem("spotify_clone_access_token");
    config.headers = { Authorization: `Bearer ${token}` };

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Fetch new refresh token if a 401 API response is intercepted
createAuthRefreshInterceptor(axios, interceptRefreshAccessToken, {
  statusCodes: [401],
});

export default axios;
