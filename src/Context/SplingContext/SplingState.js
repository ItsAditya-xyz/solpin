import SplingContext from "./SplingContext";
import { useState } from "react";
const SplingState = (props) => {
  const [socialProtocol, setSocialProtocol] = useState(null);
  const updateSocialProtocol = (socialProtocol) => {
    setSocialProtocol(socialProtocol);
  };

  return (
    <SplingContext.Provider
      value={{
        socialProtocol,
        updateSocialProtocol,
      }}
    >
      {props.children}
    </SplingContext.Provider>
  );
};
export default SplingState;
