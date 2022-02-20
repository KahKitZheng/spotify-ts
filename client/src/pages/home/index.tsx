import React, { useEffect } from "react";
import UserSummary from "./UserSummary";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  getCurrentUser,
  selectCurrentUser,
} from "../../slices/currentUserSlice";

const HomePage = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const userStatus = useSelector(
    (state: RootState) => state.currentUser.status
  );

  useEffect(() => {
    // Remove the access token in url after signing in
    window.history.replaceState(null, "", "/");

    userStatus === "idle" && dispatch(getCurrentUser());
  }, [userStatus, dispatch]);

  return (
    <div>
      <UserSummary
        image={user.images && user.images[0].url}
        name={user.display_name}
        followerCount={user.followers?.total}
        followingCount={0}
        playlistCount={0}
      />

      <p>{JSON.stringify(user)}</p>
      <p>{JSON.stringify(user)}</p>
      <p>{JSON.stringify(user)}</p>
    </div>
  );
};

export default HomePage;
