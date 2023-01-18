import React, { useEffect, useContext } from "react";
import styles from "../../styles/Home.module.css";
import { SocialProtocol } from "@spling/social-protocol";
import logo from "../../assets/logo.svg";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { Keypair } from "@solana/web3.js";
import { Loader } from "../../components/Loader";
import PostCard from "./PostCard";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

function LandingPage() {
  const SplingContextValue = useContext(SplingContext);
  const [response, setResponse] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [socialProtocolVal, setSocialProtocolVal] = React.useState(null);
  const [shuoldShowWallet, setShouldShowWallet] = React.useState(false);
  const wallet = useWallet();
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
      setShouldShowWallet(true);
      initApp();
    }
  }, [wallet]);

  return (
    <div className='w-full'>
      <Navbar shouldShowWallet={shuoldShowWallet} />
      <div className='relative inline-flex justify-center rounded-full items-center w-full mt-24  px-2 mb-8 flex-col'>
        <div className='relative text-5xl md:py-10 text-gray-800 text-center font-extrabold  sm:text-5xl lg:text-6xl  rounded-full sm:w-[70%] '>
          <span className='brandGradientBg blur-2xl filter opacity-10 w-full h-full absolute inset-0 rounded-full leading-snug'></span>
          <span className='md:px-5 leading-snug'>
            The Moment Sharing Platform of{" "}
            <span className='text-transparent bg-clip-text brandGradientBg'>
              Web3
            </span>{" "}
            built on{" "}
            <span className='text-transparent bg-clip-text brandGradientBg mt-2'>
              Solana Blockchain
            </span>
          </span>
        </div>
        <div className='my-6'>
          {!(wallet?.publicKey || typeof wallet == "undefined") && (
            <Link
              to='/sign-up'
              className=' bg-[#512DA8] text-white mx-auto lg:mx-0 hover:bg-[#5D3DAA]  rounded my-2 md:my-6 py-4 px-8 shadow-lg w-70 hover:scale-105 '>
              Create Account
            </Link>
          )}
        </div>
      </div>
      <div>
      <div className='my-3 mb-5 '>
          <p className='text-gray-800 text-center text-2xl sm:text-4xl font-bold'>
            Trending Posts on Solpin
          </p>
          <div className='w-full mb-8 mt-1'>
            <div className='h-1 mx-auto brandGradientBg w-72 opacity-25 my-0 py-0 rounded-t'></div>
          </div>
        </div>
        
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
