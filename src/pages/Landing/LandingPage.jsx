import React, { useEffect, useContext } from "react";
import styles from "../../styles/Home.module.css";
import { SocialProtocol } from "@spling/social-protocol";
import logo from "../../assets/logo.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { Keypair } from "@solana/web3.js";
import { Loader } from "../../components/Loader";
import PostCard from "./PostCard";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useWallet } from "@solana/wallet-adapter-react";
function LandingPage() {
  const SplingContextValue = useContext(SplingContext);
  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [socialProtocolVal, setSocialProtocolVal] = React.useState(null);

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

      const posts = await socialProtocol.getAllPosts(12, 20);
      const finalResult = [];
      //loop through userPosts and add that post to finalResult only when media's array length is greater than 0
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].media.length > 0) {
          finalResult.push(posts[i]);
        }
      }

      console.log(finalResult);
      setResponse(finalResult);
      setIsLoading(false);
    }
    if (!response) {
      initApp();
    }
  }, []);

  const wallet = useWallet();
  useEffect(() => {
    async function initApp() {
      const protocolOptions = {
        useIndexer: true,
        rpcUrl:
          "https://solana-mainnet.g.alchemy.com/v2/2Y3ODmvjlgmxpBH-U7jOJlIy3nrtyt2p",
      };
      const socialProtocolValue = await new SocialProtocol(
        wallet,
        null,
        protocolOptions
      ).init();
      console.log(socialProtocolValue);
      SplingContextValue.updateSocialProtocol(socialProtocolValue);
      setSocialProtocolVal(socialProtocolVal);
    }
    if (wallet?.publicKey && typeof wallet !== "undefined") {
      initApp();
    }
  }, [wallet]);

  return (
    <div className='w-full'>
      <div className={styles.AppHeader}>
        <img src={logo} className='w-[45%] sm:w-[200px]' />
        <WalletMultiButton />
      </div>
      <div>
        {isLoading && (
          <div className='flex justify-center items-center mx-auto my-4'>
            <Loader />
          </div>
        )}
        {!isLoading && (
          <div className=''>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}>
              <Masonry gutter='10px'>
                {response.map((post, index) => (
                  <div className='w-full px-1 mx-auto' key={index}>
                    <PostCard postValue={post} />
                  </div>
                ))}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
