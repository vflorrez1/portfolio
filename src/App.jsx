import React from "react";
import useIsBot from "./useIsBot";

const App = () => {
  const { isLikelyBot } = useIsBot();
  return isLikelyBot ? (
    <div>Are you a bot?</div>
  ) : (
    <div>Vics new portfolio app 1</div>
  );
};

export default App;
