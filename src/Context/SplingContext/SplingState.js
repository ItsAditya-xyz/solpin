import SplingContext from "./SplingContext";
import { useState } from "react";
const SplingState = (props) => {
  const [socialProtocol, setSocialProtocol] = useState(null);
  const updateSocialProtocol = (socialProtocol) => {
    setSocialProtocol(socialProtocol);
  };
  const [selfInfo, setSelfInfo] = useState(null);
  const updateSelfInfo = (selfInfo) => {
    setSelfInfo(selfInfo);
  };

  return (
    <SplingContext.Provider
      value={{
        socialProtocol,
        updateSocialProtocol,
        selfInfo,
        updateSelfInfo,
      }}>
      {props.children}
    </SplingContext.Provider>
  );
};
export default SplingState;
