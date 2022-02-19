import React from "react";
import { token } from "./spotify/auth";
import LoginPage from "./pages/login";
import AppRouter from "./components/AppRouter";

function App() {
  return <div className="App">{token ? <AppRouter /> : <LoginPage />}</div>;
}

export default App;
