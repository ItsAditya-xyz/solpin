import React from "react";
import { Link } from "react-router-dom";
import { timeStampToTimeAgo } from "../../utils/functions";
import { BsHeartFill } from "react-icons/bs";
import noImage from "../../assets/noImage.png";
import defaultPic from "../../assets/default_profile_pic.png";
export default function PostCard({ postValue }) {
  const post = postValue;
  const timeAgo = timeStampToTimeAgo(post.timestamp * 1e9);
  const posterPublicKey = postValue.user.publicKey.toString();
  const totalLikes = postValue.likes.length;

  return (
    <div className="hover:scale-105 transition-transform duration-300">
      <div className="flex flex-col w-full shadow-sm border-md  rounded-xl my-1 bg-[#f7f7fa]">
        <Link to={`/post/${post.postId}`} className="flex flex-col w-full">
          <img
            src={`${post.media[0].file}`}
            className="w-full rounded-t-xl"
            alt="Post Image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = noImage;
            }}
          />
        </Link>
        <div className="flex w-full py-4 px-2 space-x-1">
          <Link
            to={`/u/${posterPublicKey}`}
            className="cursor-pointer relative flex items-center justify-center space-x-1"
          >
            <img
              src={`${post.user.avatar}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultPic;
              }}
              className="w-6 h-6 darkenBg darkenBorder rounded-full"
              alt={`${post.user.nickname}`}
            />
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-1">
              <Link
                to={`/u/${posterPublicKey}`}
                className=" text-base hover:underline"
              >
                {post.user.nickname}
              </Link>
              <span className="middot" />
              <p className="text-xs text-gray-700">{timeAgo}</p>
            </div>
            <div className="justify-end">
              <div className="flex items-center justify-center px-2 py-2 rounded-full space-x-1">
                <BsHeartFill size={16} color="gray" />
                <p className="text-xs text-gray-700">{totalLikes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
