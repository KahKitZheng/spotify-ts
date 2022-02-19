import React, { useEffect } from "react";
import { token } from "../../spotify/auth";

const HomePage = () => {
  // Remove the access token in url after signing in
  useEffect(() => {
    window.history.replaceState(null, "", "/");
  }, []);

  return (
    <div>
      <h1>HomePage</h1>
      <p>{JSON.stringify(token)}</p>
    </div>
  );
};

export default HomePage;
