import axios from "axios";
import { refreshAccessToken } from "../spotify/auth";

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

// Response interceptor for API calls
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      console.warn("Access token has expired, refreshing...");

      originalRequest._retry = true;
      const access_token = await refreshAccessToken();

      originalRequest.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${access_token}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axios;
