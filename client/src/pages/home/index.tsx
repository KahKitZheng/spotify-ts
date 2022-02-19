import React from "react";
import { token } from "../../spotify/auth";

const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
      <p>{JSON.stringify(token)}</p>
    </div>
  );
};

export default HomePage;
