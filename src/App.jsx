import React from "react";
import useIsBot from "./useIsBot";
import MainApp from "./MainApp";

const App = () => {
  const { isLikelyBot } = useIsBot();
  return isLikelyBot ? <div>Are you a bot?</div> : <MainApp />;
};

export default App;
