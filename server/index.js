const express = require("express");
const auth = require("./api/auth");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const history = require("connect-history-api-fallback");

app.use(express.json({ extended: false }));

app.use("/api/auth", auth);

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

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
