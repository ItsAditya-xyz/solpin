import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { SocialProtocol } from "@spling/social-protocol";
import { Link } from "react-router-dom";
import styles from "../../styles/Home.module.css";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Loader } from "../../components/Loader";
import logo from "../../assets/logo.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { HiOutlineLink } from "react-icons/hi";
import Tippy from "@tippyjs/react";
import toast, { Toaster } from "react-hot-toast";
export default function Post() {
  const { postID } = useParams();
  const BASE_URL = window.location.origin;

  const SplingContextValue = useContext(SplingContext);
  const [postInfo, setPostInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socialProtocolVal, setSocialProtocolVal] = useState(null);

  const copied = () => {
    console.log("copied");
    toast.success("Copied! link to your clipboard to share");
  };

  useEffect(() => {
    async function initApp() {
      console.log("init app");
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

      const postVal = await socialProtocol.getPost(parseInt(postID));
      console.log(postVal);
      setPostInfo(postVal);
      setIsLoading(false);
    }
    if (postID && !postInfo) {
      initApp();
    }
  }, [postID]);

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
      <Toaster />
      <div className={styles.AppHeader}>
        <Link to='/'>
          <img src={logo} className='w-[45%] sm:w-[200px]' />
        </Link>
        <WalletMultiButton />
      </div>
      <div>
        {isLoading && (
          <div className='flex justify-center items-center mx-auto my-4'>
            <Loader />
          </div>
        )}
        {!isLoading && (
          <div className='w-full max-w-[1024px] shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-3xl mx-auto mt-3'>
            <div className='flex flex-col lg:flex-row overflow-visible'>
              <div className='relative top-0 left-0 z-10 flex-none w-full lg:w-2/4'>
                <div
                  className={`image w-full border border-white/50 h-full rounded-3xl sm:rounded-bl-3xl sm:rounded-tl-3xl flex flex-col items-center justify-start p-4`}>
                  {true && (
                    <>
                      <div
                        style={{
                          backgroundImage: `url(${postInfo.media[0].file})`,
                          filter: "blur(3px)",
                          opacity: ".2",
                        }}
                        className='w-full h-full backdrop-xl backdrop-blur-md p-4 absolute top-0 left-0 rounded-bl-3xl rounded-tl-3xl'
                      />

                      <img
                        className='rounded-3xl shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] w-full object-cover'
                        alt={`Pin by ${postInfo.user.nickname}`}
                        src={postInfo.media[0].file}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className='content flex flex-col w-full lg:w-2/4 pt-8 pb-4 px-8'>
                <div>
                  <div className='flex flex-col items-center'>
                    <Tippy content={"Copy Post Link"} placement='bottom'>
                      <button
                        className='hover:bg-[#080623] hover:text-white bg-gray-200 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${BASE_URL}/post/${postInfo.id}`
                          );
                          toast.success("Copied link to your clipboard!");
                        }}>
                        <HiOutlineLink size={24} />
                      </button>
                    </Tippy>
                  </div>
                </div>
                {/* <ShareCard rootRef={rootRef} post={post} /> */}
                {/* <UserCard
                  user={user}
                  profile={post.ProfileEntryResponse}
                  follows={follows}
                /> */}
                <div className='mt-4 break-words body'>{postInfo.title}</div>
                {/* <MetaCard post={post} />
                <Comments post={post} /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
