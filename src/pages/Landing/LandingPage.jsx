import React, { useEffect, useContext, useState } from "react";
import { SocialProtocol } from "@spling/social-protocol";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { Keypair } from "@solana/web3.js";
import { Loader } from "../../components/Loader";
import PostCard from "./PostCard";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import toast, { Toaster } from "react-hot-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import Navbar from "../../components/Navbar";
import SignUpModal from "../../components/modals/SignUpModal";
import { protocolOptions } from "../../utils/constants";
import InfiniteScroll from "react-infinite-scroll-component";
function LandingPage() {
  const SplingContextValue = useContext(SplingContext);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socialProtocolVal, setSocialProtocolVal] = useState(null);
  const [showSingUpModal, setShowSignUpModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const wallet = useWallet();
  const [isLiking, setIsLiking] = useState(false);
  const [currentUserID, setCurrentUserID] = useState(null);
  useEffect(() => {
    async function initApp() {
      const socialProtocol = await new SocialProtocol(
        Keypair.generate(),
        null,
        protocolOptions
      ).init();
      setSocialProtocolVal(socialProtocol);
      console.log(socialProtocol);
      try {
        const posts = await socialProtocol.getAllPosts(12, 30);
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
      } catch (err) {
        toast.error(`Something went wrong. Please reload the page. ${err.message}`);
      }
    }
    if (!response) {
      initApp();
    }
  }, []);

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

  useEffect(() => {
    if (SplingContextValue.socialProtocol) {
      setSocialProtocolVal(SplingContextValue.socialProtocol);
    }
  }, [SplingContextValue.socialProtocol]);

  useEffect(() => {
    if (SplingContextValue.selfInfo) {
      setCurrentUserID(SplingContextValue.selfInfo.userId);
    }
  }, [SplingContextValue.selfInfo]);

  const fetchMoreData = async () => {
    try {
      if (!hasMore) return;
      let currentOffset = offset;
      currentOffset += 30;
      setOffset(currentOffset);
      const posts = await socialProtocolVal.getAllPosts(12, 30, currentOffset);
      console.log(posts);
      const finalResult = [];
      //loop through userPosts and add that post to finalResult only when media's array length is greater than 0
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].media.length > 0) {
          finalResult.push(posts[i]);
        }
      }
      console.log(finalResult.length);
      if (finalResult.length === 0) {
        setHasMore(false);
      }
      setResponse([...response, ...finalResult]);
    } catch (err) {
     toast.error(`Something went wrong.${err.message}`);
    }
  };

  const likePost = async (publicKeyOfPost) => {
    if (!SplingContextValue.selfInfo) {
      toast.error("Please connect wallet first");
      return;
    }
    if (isLiking) {
      toast.error("Please wait for the previous request to complete");
      return;
    }

    const waitingToast = toast.loading("Waiting for transaction approval...");
    setIsLiking(true);
    try {
      const likeResult = await socialProtocolVal.likePost(publicKeyOfPost);
      toast.dismiss(waitingToast);
      //loop through response and update the likedBy array of the post that was liked
      let wasLike = false;
      const updatedResponse = response.map((post) => {
        if (post.publicKey === publicKeyOfPost) {
          const updatedPost = post;
          //if the post was already liked by the user, remove the user from the likedBy array
          if (post.likes.includes(currentUserID)) {
            updatedPost.likes = updatedPost.likes.filter(
              (userId) => userId !== currentUserID
            );
          } else {
            updatedPost.likes.push(currentUserID);
            wasLike = true;
          }
          return updatedPost;
        } else {
          return post;
        }
      });
      toast.success(`Successfully ${wasLike ? "liked" : "unliked"} post`);
      setResponse(updatedResponse);
      setIsLiking(false);
    } catch (err) {
      toast.dismiss(waitingToast);
      toast.error(`Error liking post ${err.message}`);
      console.log(err);
      setIsLiking(false);
    }
  };
  return (
    <div className="w-full">
      <Navbar shouldShowWallet={false} socialProtocol={socialProtocolVal} />
      <SignUpModal
        showModal={showSingUpModal}
        setShowModal={setShowSignUpModal}
        useWallet={useWallet}
      />
      <Toaster />
      <div className="relative inline-flex justify-center rounded-full items-center w-full mt-24  px-2 mb-8 flex-col">
        <div className="relative text-5xl md:py-10 text-gray-800 text-center font-extrabold  sm:text-5xl lg:text-6xl  rounded-full sm:w-[70%] ">
          <span className="brandGradientBg blur-2xl filter opacity-10 w-full h-full absolute inset-0 rounded-full leading-snug"></span>
          <span className="md:px-5 leading-snug">
            The Moment Sharing Platform of{" "}
            <span className="text-transparent bg-clip-text brandGradientBg">
              Web3
            </span>{" "}
            built on{" "}
            <span className="text-transparent bg-clip-text brandGradientBg mt-2">
              Solana Blockchain
            </span>
          </span>
        </div>
        <div className="my-6">
          {!(wallet?.publicKey || typeof wallet == "undefined") && (
            <button
              onClick={() => setShowSignUpModal(true)}
              className=" bg-[#512DA8] text-white mx-auto lg:mx-0 hover:bg-[#5D3DAA]  rounded my-2 md:my-6 py-4 px-8 shadow-lg w-70 hover:scale-105 "
            >
              Create Account
            </button>
          )}
        </div>
      </div>
      <div>
        <div className="my-3 mb-5 ">
          <p className="text-gray-800 text-center text-2xl sm:text-4xl font-bold">
            Trending Posts on Solpin
          </p>
          <div className="w-full mb-8 mt-1">
            <div className="h-1 mx-auto brandGradientBg w-72 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center mx-auto my-4 pb-8">
            <Loader />
          </div>
        )}

        {!isLoading && (
          <div className="">
            <InfiniteScroll
              dataLength={response.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center items-center mx-auto my-4 pb-8">
                  <Loader />
                </div>
              }
            >
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}
              >
                <Masonry gutter="10px">
                  {response.map((post, index) => (
                    <div className="w-full px-1 mx-auto" key={index}>
                      <PostCard
                        postValue={post}
                        likeFunction={likePost}
                        currentUserID={currentUserID}
                      />
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
