import { createContext } from "react";
import { SocialProtocol } from "@spling/social-protocol";
const SplingContext = createContext({
  socialProtocol: null,
  updateSocialProtocol: () => {},

  selfInfo: null,
  updateSelfInfo: () => {},
});

export default SplingContext;
