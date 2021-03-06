/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const path = require("path");
const qs = require("qs");
const history = require("connect-history-api-fallback");
const base64url = require("base64url");
const SHA256 = require("crypto-js/sha256");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
let REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:8888/callback";
let FRONTEND_URI = process.env.FRONTEND_URI || "http://localhost:3000";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";
const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));

app
  .use(express.static(path.resolve(__dirname, "../client/build")))
  .use(cors())
  .use(cookieParser())
  .use(
    history({
      verbose: true,
      rewrites: [
        { from: /\/login/, to: "/login" },
        { from: /\/callback/, to: "/callback" },
        { from: /\/refresh_token/, to: "/refresh_token" },
      ],
    })
  )
  .use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/", function (req, res) {
  res.render(path.resolve(__dirname, "../client/build/index.html"));
});

app.get("/login", function (req, res) {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = [
    "streaming",
    "user-read-private",
    "user-read-email",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-top-read",
    "user-follow-read",
    "user-follow-modify",
    "user-library-read",
    "user-library-modify",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
  ];

  res.redirect(
    `https://accounts.spotify.com/authorize?${qs.stringify({
      response_type: "code",
      client_id: CLIENT_ID,
      scope: scope.join(", "),
      redirect_uri: REDIRECT_URI,
      state: state,
      code_challenge_method: "S256",
      code_challenge: SHA256(base64url(state)),
    })}`
  );
});

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens after checking the state parameter

  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${qs.stringify({ error: "state_mismatch" })}`);
    return;
  }

  res.clearCookie(stateKey);

  axios({
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    params: {
      code: code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code_verifier: SHA256(base64url(state)),
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64url(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
  })
    .then((response) => {
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      axios({
        url: "https://api.spotify.com/v1/me",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      })
        .then(() => {
          res.redirect(
            `${FRONTEND_URI}/#${qs.stringify({
              access_token: accessToken,
              refresh_token: refreshToken,
            })}`
          );
        })
        .catch((err) => {
          res.redirect(`/#${qs.stringify({ error: "invalid token" })}`);
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/refresh_token", function (req, res) {
  axios({
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    params: {
      grant_type: "refresh_token",
      refresh_token: req.query.refresh_token,
      client_id: CLIENT_ID,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET,
    },
  })
    .then((response) => {
      const access_token = response.data.access_token;
      res.send({ access_token: access_token });
    })
    .catch((error) => console.log(error));
});

app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

console.log("Listening on port: 8888");
app.listen(8888);
