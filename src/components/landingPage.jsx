import React, { useEffect, useContext } from "react";
import styles from "../../src/styles/Home.module.css";
import { ProtocolOptions, SocialProtocol } from "@spling/social-protocol";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import logo from "../assets/logo.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import SplingContext from "../Context/SplingContext/SplingContext";

function LandingPage() {
  const SplingContextValue = useContext(SplingContext);
  const wallet = useAnchorWallet();

  useEffect(() => {
    async function initApp() {
      console.log(wallet);
      const protocolOptions = {
        useIndexer: true,
        rpcUrl:
          "https://solana-mainnet.g.alchemy.com/v2/2Y3ODmvjlgmxpBH-U7jOJlIy3nrtyt2p",
      };
      const socialProtocol = await new SocialProtocol(
        wallet,
        null,
        protocolOptions
      ).init();
      console.log(socialProtocol);
      SplingContextValue.updateSocialProtocol(socialProtocol);
    }
    if (wallet?.publicKey && typeof wallet !== "undefined") {
      initApp();
    }
  }, [wallet]);

  return (
    <div className="w-full">
      <div className={styles.AppHeader}>
        <img src={logo} height={30} width={200} />
        <WalletMultiButton />
      </div>
      <div>
        <div className="bg-yellow-300 text-gray-900 mx-auto px-5  flex items-center justify-center py-5">
          <div>Solpin is in Beta. Things may break</div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
