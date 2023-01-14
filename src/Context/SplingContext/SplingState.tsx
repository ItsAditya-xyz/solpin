import SplingContext from "./SplingContext";
import { useState } from "react";
const SplingState = (props: any) => {
  const [socialProtocol, setSocialProtocol] = useState(null);
  const updateSocialProtocol = (socialProtocol: any) => {
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
