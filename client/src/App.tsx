import React from "react";
import { token } from "./spotify/auth";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";

function App() {
  console.log(token);

  return <div className="App">{token ? <HomePage /> : <LoginPage />}</div>;
}

export default App;
