import { createContext } from "react";
const SplingContext = createContext({
  socialProtocol: null,
  updateSocialProtocol: () => {},
});

export default SplingContext;
