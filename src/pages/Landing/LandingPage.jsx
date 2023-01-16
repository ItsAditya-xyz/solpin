import React, { useEffect, useContext } from "react";
import styles from "../../styles/Home.module.css";
import { SocialProtocol } from "@spling/social-protocol";
import logo from "../../assets/logo.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { Keypair } from "@solana/web3.js";
import { Loader } from "../../components/Loader";

function LandingPage() {
  const SplingContextValue = useContext(SplingContext);
  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    async function initApp() {
      const protocolOptions = {
        useIndexer: true,
        rpcUrl:
          "https://solana-mainnet.g.alchemy.com/v2/2Y3ODmvjlgmxpBH-U7jOJlIy3nrtyt2p",
      };
      const socialProtocol = await new SocialProtocol(
        Keypair.generate(),
        null,
        protocolOptions
      ).init();
      console.log(socialProtocol);

      const posts = await socialProtocol.getAllPosts(12, 50);
      console.log(posts);
      setResponse(posts);
      setIsLoading(false);
    }
    if (!response) {
      initApp();
    }
  }, []);

  return (
    <div className='w-full'>
      <div className={styles.AppHeader}>
        <img src={logo} height={30} width={200} />
        <WalletMultiButton />
      </div>
      <div>
        {isLoading && (
          <div className='flex justify-center items-center mx-auto my-4'>
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
