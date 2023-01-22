import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { Loader } from "../../components/Loader";
import { SocialProtocol } from "@spling/social-protocol";
import toast, { Toaster } from "react-hot-toast";
import { Keypair, PublicKey } from "@solana/web3.js";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import PostCard from "../Landing/PostCard";
import Navbar from "../../components/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { protocolOptions } from "../../utils/constants";
function ProfilePage(props) {
  const { publicKey } = useParams();
  const { publicKey: walletPublicKey } = useWallet();
  const [publicKeyVal, setPublicKeyVal] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const SplingContextValue = useContext(SplingContext);
  const [socialProtocolValue, setSocialProtocolValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [userContent, setUserContent] = useState(null);

  const [isLiking, setIsLiking] = useState(false);
  const currentLoggedInUser = SplingContextValue.selfInfo;
  const [currentUserID, setCurrentUserID] = useState(null);
  const [currentFollowing, setCurrentFollowing] = useState([]);
  const wallet = useWallet();
  useEffect(() => {
    if (currentLoggedInUser) {
      setCurrentUserID(currentLoggedInUser.userId);
      setCurrentFollowing(currentLoggedInUser.following);
    }
    console.log(currentLoggedInUser);
  }, [currentLoggedInUser]);

  useEffect(() => {
    if (!publicKey) return;
    setPublicKeyVal(publicKey);
  }, [publicKey]);

  useEffect(() => {
    async function initApp() {
      const socialProtocolValue = await new SocialProtocol(
        wallet,
        null,
        protocolOptions
      ).init();
      console.log(socialProtocolValue);
      SplingContextValue.updateSocialProtocol(socialProtocolValue);
      setSocialProtocolValue(socialProtocolValue);
    }

    if (!walletPublicKey) {
      SplingContextValue.updateSelfInfo(null);
    } else {
      initApp();
    }
  }, [walletPublicKey, wallet]);

  useEffect(() => {
    if (!publicKeyVal) return;
    if (userContent) return;
    if (userInfo) return;
    async function getUserInfo() {
      console.log(publicKeyVal);
      //convert address stored in publicKeyVal to Keypair
      console.log(socialProtocolValue);
      try {
        const publicKeyObj = new PublicKey(publicKeyVal);
        console.log(publicKeyObj);
        const userInfo = await socialProtocolValue.getUserByPublicKey(
          publicKeyObj
        );
        console.log(userInfo);
        if (userInfo) {
          const userID = userInfo.userId;

          setUserInfo(userInfo);
          setIsLoading(false);
          const userPosts = await socialProtocolValue.getAllPostsByUserId(
            userID
          );
          const finalResult = [];
          //loop through userPosts and add that post to finalResult only when media's array length is greater than 0
          for (let i = 0; i < userPosts.length; i++) {
            if (userPosts[i].media.length > 0) {
              finalResult.push(userPosts[i]);
            }
          }
          setUserContent(finalResult);
          setLoadingPosts(false);
        } else {
          setIsLoading(false);
          toast.error("Something went wrong. Please try again later.");
        }
      } catch (err) {
        console.log(err);
        toast.error("Something went wrong. Make sure this is a valid address");
      }
    }
    async function initSocialProtocol() {
      const sp = await new SocialProtocol(
        Keypair.generate(),
        null,
        protocolOptions
      ).init();
      setSocialProtocolValue(sp);
    }

    if (socialProtocolValue) {
      getUserInfo();
    } else {
      if (SplingContextValue.socialProtocol) {
        setSocialProtocolValue(SplingContextValue.socialProtocol);
      } else {
        initSocialProtocol();
      }
    }
  }, [publicKeyVal, socialProtocolValue]);

  const likePost = async (publicKeyOfPost) => {
    if (!walletPublicKey) {
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
      const likeResult = await socialProtocolValue.likePost(publicKeyOfPost);
      toast.dismiss(waitingToast);
      //loop through response and update the likedBy array of the post that was liked
      let wasLike = false;
      const updatedResponse = userContent.map((post) => {
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
      setUserContent(updatedResponse);
      setIsLiking(false);
    } catch (err) {
      toast.dismiss(waitingToast);
      toast.error(`Error liking post ${err.message}`);
      console.log(err);
      setIsLiking(false);
    }
  };

  const followUser = async (isFollow) => {
    console.log("in it");

    if (!walletPublicKey) {
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
      if (isFollow) {
        const followResult = await socialProtocolValue.followUser(
          userInfo.userId
        );
        setCurrentFollowing([...currentFollowing, userInfo.userId]);
        
      toast.dismiss(waitingToast);
      toast.success("Followed successfully");
      } else {
        const followResult = await socialProtocolValue.unfollowUser(
          userInfo.userId
        );
        setCurrentFollowing(
          currentFollowing.filter((userId) => userId !== userInfo.userId)
        );
        
      toast.dismiss(waitingToast);
      toast.success("Unfollowed successfully");
      }

      setIsLiking(false);
    } catch (err) {
      toast.dismiss(waitingToast);
      toast.error("Something went wrong. Please try again later.");
      setIsLiking(false);
    }
  };

  return (
    <div className="w-full">
      <Toaster />
      <Navbar shouldShowWallet={true} socialProtocol={socialProtocolValue} />
      <div>
        {isLoading && (
          <div className="flex justify-center items-center mt-10">
            <Loader />
          </div>
        )}
        {!isLoading && userInfo && (
          <div className="flex flex-col justify-center items-center mt-10 px-2">
            <div className="flex  justify-center space-x-3">
              <img
                src={userInfo.avatar}
                className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full"
              />
              <div className="flex flex-col ">
                <div className="flex justify-between items-center">
                  <p className="text-3xl sm:text-4xl font-bold mt-2">
                    {userInfo.nickname}
                  </p>
                  {walletPublicKey != publicKeyVal && (
                    <div className="mt-3 ml-2 sm:ml-0">
                      {!currentFollowing.includes(userInfo.userId) ? (
                        <button
                          className="px-4 py-2 border-[#512DA8] border-2 hover:bg-[#512DA8] hover:text-white rounded-full text-sm ml-1 sm:ml-0"
                          onClick={() => {
                            followUser(true);
                          }}
                        >
                          Follow
                        </button>
                      ) : (
                        <button
                          className="px-4 py-2 border-[#512DA8] border-2 hover:bg-[#512DA8] hover:text-white rounded-full text-sm ml-1 sm:ml-0"
                          onClick={() => {
                            followUser(false);
                          }}
                        >
                          Unfollow
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xl text-gray-800 mt-3 ml-1 break-words">
                  {userInfo.bio}
                </p>
                <div className="flex flex-col sm:flex-row sm:space-x-2 sm:items-center mt-5 ml-1 sm:ml-0">
                  <div className="flex flex-row space-x-2 items-start ">
                    <p className=" text-gray-700 ">
                      {userInfo.following.length} Following
                    </p>
                    <p className=" text-gray-700  ">
                      {userInfo.groups.length} Followers
                    </p>
                  </div>
                  <button
                    className="px-2 py-1 bg-[#512DA8] hover:bg-[#3e237f] text-white rounded-md text-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(publicKey.toString());
                      toast.success("Public Key Copied to clipboard!");
                    }}
                  >
                    {publicKey.toString().slice(0, 15)}...{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && loadingPosts && (
          <div className="flex justify-center items-center mt-10">
            <Loader />
          </div>
        )}
      </div>
      {!isLoading && !loadingPosts && !userContent && (
        <div className="flex justify-center items-center  mt-10">
          <p className="text-2xl font-bold">No posts found</p>
        </div>
      )}

      {!isLoading && !loadingPosts && userContent && (
        <div className="mt-10">
          <p className="text-2xl font-bold text-center my-3">
            Posts by {userInfo.nickname}
          </p>
          <div className="w-full mb-8 mt-1">
            <div className="h-1 mx-auto brandGradientBg w-72 opacity-25 my-0 py-0 rounded-t"></div>
          </div>
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}
          >
            <Masonry gutter="10px">
              {userContent.map((post, index) => (
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
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
