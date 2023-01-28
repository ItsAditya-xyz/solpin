import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { SocialProtocol } from "@spling/social-protocol";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Loader } from "../../components/Loader";
import { useWallet } from "@solana/wallet-adapter-react";
import { HiOutlineLink } from "react-icons/hi";
import { BiTrash } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import toast, { Toaster } from "react-hot-toast";
import ProfileCard from "./ProfileCard";
import BottomMeta from "./BottomMeta";
import { timeStampToTimeAgo } from "../../utils/functions";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import PostCard from "../Landing/PostCard";
import Navbar from "../../components/Navbar";
import { protocolOptions } from "../../utils/constants";
import defaultPostPic from "../../assets/noImage.png";
import CommentCard from "./CommentCard";
import Linkify from 'linkify-react';
import { LinkifyOptions } from "../../utils/constants";
export default function Post() {
  const { postID } = useParams();
  const navigate = useNavigate();
  const BASE_URL = window.location.origin;
  const SplingContextValue = useContext(SplingContext);
  const { publicKey: walletPublicKey } = useWallet();
  const [postInfo, setPostInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socialProtocolVal, setSocialProtocolVal] = useState(null);
  const [timeAgo, setTimeAgo] = useState(null);

  const [otherPostInfo, setOtherPostInfo] = useState(null);
  const [loadingOtherPosts, setLoadingOtherPosts] = useState(true);

  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentLoggedInUser = SplingContextValue.selfInfo;
  const [currentUserID, setCurrentUserID] = useState(null);
  const [currentFollowing, setCurrentFollowing] = useState([]);

  const [commentValue, setCommentValue] = useState("");

  const [commentList, setCommentList] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  

  useEffect(() => {
    if (currentLoggedInUser) {
      setCurrentUserID(currentLoggedInUser.userId);
      setCurrentFollowing(currentLoggedInUser.following);
    }
    console.log(currentLoggedInUser);
  }, [currentLoggedInUser]);
  useEffect(() => {
    async function initApp() {
      setIsLoading(true);
      console.log("init app");
      const socialProtocol = await new SocialProtocol(
        Keypair.generate(),
        null,
        protocolOptions
      ).init();
      setSocialProtocolVal(socialProtocol);
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
        const userComments = await socialProtocol.getAllPostReplies(
          postVal.postId,
          10
        );
        setCommentList(userComments);
        setLoadingComments(false);
        console.log(userComments);
      } else {
        toast.error("Post not found");
      }
    }
    if (postID ) {
      try {
        initApp();
      } catch (err) {
        toast.error(`Something went wrong. Please try again ${err.message}`);
      }
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
      setSocialProtocolVal(socialProtocolValue);
    }
    if (wallet?.publicKey && typeof wallet !== "undefined") {
      initApp();
    }
  }, [wallet]);

  useEffect(() => {
    setSocialProtocolVal(SplingContextValue.socialProtocol);
  }, [SplingContextValue.socialProtocol]);
  const likePost = async (publicKeyOfPost) => {
    if (!walletPublicKey) {
      toast.error("Please connect wallet first");
      return;
    }
    if (isLiking) {
      toast.error("Please wait for the previous request to complete");
      return;
    }

    const waitingToast = toast.loading("Waiting for wallet approval...");
    setIsLiking(true);
    try {
      const likeResult = await socialProtocolVal.likePost(publicKeyOfPost);

      toast.dismiss(waitingToast);

      //in postInfo.likes which is an array of userID's, add userID of current user if it is not already present else remove it
      if (postInfo.likes.includes(currentUserID)) {
        const newLikes = postInfo.likes.filter(
          (item) => item !== currentUserID
        );
        setPostInfo({ ...postInfo, likes: newLikes });
        toast.success("Post Unliked!");
      } else {
        setPostInfo({ ...postInfo, likes: [...postInfo.likes, currentUserID] });
        toast.success("Post Liked!");
      }

      setIsLiking(false);
    } catch (err) {
      toast.dismiss(waitingToast);
      toast.error("Error liking post");
      console.log(err);
      setIsLiking(false);
    }
  };

  const handleDeletePost = async (postPublicKey) => {
    if (!walletPublicKey) return toast.error("Please connect wallet first");
    if (isDeleting)
      return toast.error("Please wait for the previous request to complete");
    setIsDeleting(true);
    const waitingToast = toast.loading("Deleting post...");
    try {
      const deleteResult = await socialProtocolVal.deletePost(postPublicKey);
      console.log(deleteResult);
      toast.dismiss(waitingToast);
      setIsDeleting(false);
      toast.success("Post deleted successfully");
      const posterPublicKey = currentLoggedInUser.publicKey.toString();
      navigate("/u/" + posterPublicKey);
    } catch (err) {
      toast.dismiss(waitingToast);
      toast.error("Error deleting post");
      setIsDeleting(false);
      console.log(err);
    }
  };

  const likePostFromMasonry = async (publicKeyOfPost) => {
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
      const likeResult = await socialProtocolVal.likePost(publicKeyOfPost);
      toast.dismiss(waitingToast);
      let wasLike = false;
      //loop through response and update the likedBy array of the post that was liked
      const updatedResponse = otherPostInfo.map((post) => {
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
      setOtherPostInfo(updatedResponse);
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
    const userID = postInfo.userId;
    try {
      if (isFollow) {
        const followResult = await socialProtocolVal.followUser(userID);
        setCurrentFollowing([...currentFollowing, userID]);

        toast.dismiss(waitingToast);
        toast.success("Followed successfully");
      } else {
        const followResult = await socialProtocolVal.unfollowUser(userID);
        setCurrentFollowing(
          currentFollowing.filter((userId) => userId !== userID)
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

  const handleComment = async () => {
    const postID = postInfo.postId;
    if (!walletPublicKey) {
      toast.error("Please connect wallet first");
      return;
    }
    if (isLiking) {
      toast.error("Please wait for the previous request to complete");
      return;
    }
    if (!commentValue) return toast.error("Please enter a comment");
    const waitingToast = toast.loading("Waiting for transaction approval...");
    setIsLiking(true);
    try {
      const commentResult = await socialProtocolVal.createPostReply(
        postID,
        commentValue
      );
      if (commentResult) {
        toast.dismiss(waitingToast);
        //add commentResult to the commentList
        console.log(commentResult);
        let tempResult = commentResult;
        tempResult.user.publicKey = currentLoggedInUser.publicKey.toString();
        setCommentList([...commentList, tempResult]);
        toast.success("Commented successfully");
        setCommentValue("");
      } else {
        toast.dismiss(waitingToast);
        toast.error("Something went wrong. Please try again later.");
      }
      setIsLiking(false);
    } catch (err) {
      toast.dismiss(waitingToast);
      toast.error("Something went wrong. Please try again later.");
      setIsLiking(false);
    }
  };

  const deleteComment = async (comment) => {
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
      const deleteResult = await socialProtocolVal.deletePostReply(
        comment.publicKey
      );

      //remove comment from the commentList
      const updatedCommentList = commentList.filter(
        (commentItem) => commentItem.publicKey !== comment.publicKey
      );
      setCommentList(updatedCommentList);

      toast.dismiss(waitingToast);
      toast.success("Comment deleted successfully");
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
      <Navbar shouldShowWallet={false} socialProtocol={socialProtocolVal} />
      <div>
        {isLoading && (
          <div className="flex justify-center items-center mx-auto my-4">
            <Loader />
          </div>
        )}
        {!isLoading && (
          <div className="w-full max-w-[1024px] shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-3xl mx-auto mt-3">
            <div className="flex flex-col lg:flex-row overflow-visible">
              <div className="relative top-0 left-0 z-10 flex-none w-full lg:w-2/4">
                <div
                  className={`image w-full border border-white/50 h-full rounded-3xl sm:rounded-bl-3xl sm:rounded-tl-3xl flex flex-col items-center justify-start p-4`}
                >
                  {true && (
                    <>
                      <div
                        style={{
                          backgroundImage: `url(${postInfo.media[0].file})`,
                          filter: "blur(3px)",
                          opacity: ".2",
                          backgroundRepeat: "no-repeat",
                        }}
                        className="w-full h-full backdrop-xl backdrop-blur-md p-4 absolute top-0 left-0 rounded-bl-3xl rounded-tl-3xl "
                      />

                      <img
                        className="rounded-3xl shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] w-full object-cover z-10"
                        alt={`Pin by ${postInfo.user.nickname}`}
                        src={postInfo.media[0].file}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultPostPic;
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="content flex flex-col w-full lg:w-2/4 pt-8 pb-4">
                <div>
                  <div className="flex justify-between border-b-2 pb-4  px-8">
                    <ProfileCard
                      userInfo={postInfo.user}
                      selfPublicKey={walletPublicKey}
                      followFunction={followUser}
                      currentFollowing={currentFollowing}
                      posterID={postInfo.userId}
                    />
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Tippy content={"Copy Post Link"} placement="bottom">
                        <button
                          className="hover:bg-[#080623] hover:text-white bg-gray-200 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${BASE_URL}/post/${postInfo.postId}`
                            );
                            toast.success(
                              "Copied post link to your clipboard!"
                            );
                          }}
                        >
                          <HiOutlineLink size={24} />
                        </button>
                      </Tippy>
                      {postInfo.userId === currentUserID && (
                        <Tippy content={"Delete Post"} placement="bottom">
                          <button
                            className="hover:bg-[#080623] hover:text-white bg-gray-200 duration-75 delay-75 w-12 h-12 flex justify-center items-center text-center rounded-full"
                            onClick={() => {
                              handleDeletePost(postInfo.publicKey);
                            }}
                          >
                            <BiTrash size={24} color="red" />
                          </button>
                        </Tippy>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 break-words body px-8">
                <Linkify options={LinkifyOptions}> {postInfo.title}</Linkify>
                </div>
                <div className="border-t-2 mt-8 mb-3">
                  <BottomMeta
                    post={postInfo}
                    timesAgo={timeAgo}
                    likeFunction={likePost}
                    currentUserID={currentUserID}
                  />
                </div>
                <div className="border-t-2 my-1 flex flex-col justify-end ">
                  <textarea
                    className="bg-gray-50 w-full resize-none h-28 border-1 hover:border-none active:border-none active:outline-none p-4 rounded-lg focus:outline-none   focus:border-transparent"
                    placeholder="Write a comment..."
                    value={commentValue}
                    onChange={(e) => {
                      setCommentValue(e.target.value);
                    }}
                  />
                  <div className="border-b-2 flex justify-end items-center px-2 my-2 ">
                    <button
                      className="bg-[#512DA8] hover:bg-[#4a289a] mb-2  border-1 hover:border-none active:border-none active:outline-none px-4 py-2 rounded-lg focus:outline-none focus:ring-2  focus:border-transparent text-white"
                      onClick={handleComment}
                    >
                      Comment
                    </button>
                  </div>
                </div>
                {!loadingComments && (
                  <div className="px-2">
                    <p className="text-2xl font-semibold">
                      {commentList.length} Comment{commentList.length > 1? "s" : ""}
                    </p>
                  </div>
                )}
                <div className=" my-1 flex flex-col justify-end px-4 ">
                  {commentList.map((comment) => {
                    return (
                      <CommentCard
                        key={comment.timestamp}
                        comment={comment}
                        currentUserID={currentUserID}
                        deleteComment={deleteComment}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && loadingOtherPosts && (
          <div className="flex justify-center items-center mx-auto my-4 mb-10">
            <Loader />
          </div>
        )}
        {!isLoading && !loadingOtherPosts && otherPostInfo && (
          <div className="mt-10 px-1">
            <p className="text-2xl font-bold text-center my-3">
              Other Posts by {postInfo.user.nickname}
            </p>
            <div className="w-full mb-8 mt-1">
              <div className="h-1 mx-auto brandGradientBg w-72 opacity-25 my-0 py-0 rounded-t"></div>
            </div>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 2, 750: 3, 900: 5 }}
            >
              <Masonry gutter="10px">
                {otherPostInfo.map((post, index) => (
                  <div className="w-full px-1 mx-auto" key={index}>
                    <PostCard
                      postValue={post}
                      likeFunction={likePostFromMasonry}
                      currentUserID={currentUserID}
                    />
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
