import React, { useEffect } from "react";
import { token } from "./spotify/auth";
import LoginPage from "./pages/login";
import AppRouter from "./components/AppRouter";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentUser,
  selectCurrentUserStatus,
} from "./slices/currentUserSlice";

function App() {
  const dispatch = useDispatch();
  const currentUserStatus = useSelector(selectCurrentUserStatus);

  useEffect(() => {
    if (currentUserStatus === "idle") {
      dispatch(getCurrentUser());
    }
  }, [currentUserStatus, dispatch]);

  return <div className="App">{token ? <AppRouter /> : <LoginPage />}</div>;
}

export default App;
