import { createContext } from "react";
import { SocialProtocol } from "@spling/social-protocol";
const SplingContext = createContext({
  socialProtocol: null,
  updateSocialProtocol: () => {},
});

export default SplingContext;
