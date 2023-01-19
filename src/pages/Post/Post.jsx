import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { SocialProtocol } from "@spling/social-protocol";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Loader } from "../../components/Loader";
import { useWallet } from "@solana/wallet-adapter-react";
import { HiOutlineLink } from "react-icons/hi";
import Tippy from "@tippyjs/react";
import toast, { Toaster } from "react-hot-toast";
import ProfileCard from "./ProfileCard";
import BottomMeta from "./BottomMeta";
import { timeStampToTimeAgo } from "../../utils/functions";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import PostCard from "../Landing/PostCard";
import Navbar from "../../components/Navbar";
import { protocolOptions } from "../../utils/constants";
export default function Post() {
  const { postID } = useParams();
  const BASE_URL = window.location.origin;
  const SplingContextValue = useContext(SplingContext);
  const { publicKey: walletPublicKey } = useWallet();
  const [postInfo, setPostInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socialProtocolVal, setSocialProtocolVal] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);

  const [otherPostInfo, setOtherPostInfo] = useState(null);
  const [loadingOtherPosts, setLoadingOtherPosts] = useState(true);
  useEffect(() => {
    async function initApp() {
      setIsLoading(true);
      console.log("init app");
      const socialProtocol = await new SocialProtocol(
        Keypair.generate(),
        null,
        protocolOptions
      ).init();
      console.log(socialProtocol);

      const postVal = await socialProtocol.getPost(parseInt(postID));
      if (postVal) {
        console.log(postVal);
        setPostInfo(postVal);
        setTimeAgo(timeStampToTimeAgo(postVal.timestamp * 1e9));
        setIsLoading(false);

        const userID = postVal.userId;

        const userPosts = await socialProtocol.getAllPostsByUserId(userID);
        const finalResult = [];
        //loop through userPosts and add that post to finalResult only when media's array length is greater than 0
        for (let i = 0; i < userPosts.length; i++) {
          if (userPosts[i].media.length > 0) {
            finalResult.push(userPosts[i]);
          }
        }
        setOtherPostInfo(finalResult);
        setLoadingOtherPosts(false);
      } else {
        toast.error("Post not found");
      }
    }
    if (postID) {
      initApp();
    }
  }, [postID]);

  const wallet = useWallet();
  useEffect(() => {
    async function initApp() {
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
      <Navbar />
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
              <div className='content flex flex-col w-full lg:w-2/4 pt-8 pb-4'>
                <div>
                  <div className='flex justify-between border-b-2 pb-4  px-8'>
                    <ProfileCard
                      userInfo={postInfo.user}
                      selfPublicKey={walletPublicKey}
                    />
                    <Tippy content={"Copy Post Link"} placement='bottom'>
                      <button
                        className='hover:bg-[#080623] hover:text-white bg-gray-200 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full'
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${BASE_URL}/post/${postInfo.id}`
                          );
                          toast.success("Copied post link to your clipboard!");
                        }}>
                        <HiOutlineLink size={24} />
                      </button>
                    </Tippy>
                  </div>
                </div>

                <div className='mt-4 break-words body px-8'>
                  {postInfo.title}
                </div>
                <div className='border-t-2 my-8'>
                  <BottomMeta post={postInfo} timesAgo={timeAgo} />
                </div>

                {/* <MetaCard post={post} />
                <Comments post={post} /> */}
              </div>
            </div>
          </div>
        )}

        {!isLoading && loadingOtherPosts && (
          <div className='flex justify-center items-center mx-auto my-4'>
            <Loader />
          </div>
        )}
        {!isLoading && !loadingOtherPosts && otherPostInfo && (
          <div className='mt-10 px-1'>
            <p className='text-2xl font-bold text-center my-3'>
              Other Posts by {postInfo.user.nickname}
            </p>
            <div className='w-full mb-8 mt-1'>
              <div className='h-1 mx-auto brandGradientBg w-72 opacity-25 my-0 py-0 rounded-t'></div>
            </div>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}>
              <Masonry gutter='10px'>
                {otherPostInfo.map((post, index) => (
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
