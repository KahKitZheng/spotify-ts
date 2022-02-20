import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  fetchCurrentUser,
  selectCurrentUser,
} from "../../slices/currentUserSlice";

const HomePage = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  // Remove the access token in url after signing in
  useEffect(() => {
    window.history.replaceState(null, "", "/");
    dispatch(fetchCurrentUser());
  }, []);

  return (
    <div>
      <h1>HomePage</h1>
      <p>{JSON.stringify(user)}</p>
    </div>
  );
};

export default HomePage;
