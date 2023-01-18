import React from "react";
import { Link } from "react-router-dom";
import { timeStampToTimeAgo } from "../../utils/functions";
import { BsHeart, BsHeartFill } from "react-icons/bs";
export default function PostCard({ postValue }) {
  const post = postValue;
  const timeAgo = timeStampToTimeAgo(post.timestamp * 1e9);
  const posterPublicKey = postValue.user.publicKey.toString();

  return (
    <div className='hover:scale-105 transition-transform duration-300'>
      <div className='flex flex-col w-full shadow-sm border-md  rounded-xl my-1 bg-[#f7f7fa]'>
        <Link to={`/post/${post.postId}`} className='flex flex-col w-full'>
          <img src={`${post.media[0].file}`} className='w-full rounded-t-xl' />
        </Link>
        <div className='flex w-full py-4 px-2 space-x-1'>
          <Link
            to={`/u/${posterPublicKey}`}
            className='cursor-pointer relative flex items-center justify-center space-x-1'>
            <img
              src={`${post.user.avatar}`}
              className='w-6 h-6 darkenBg darkenBorder rounded-full'
              alt={`${post.user.nickname}`}
            />
          </Link>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center space-x-1'>
              <Link
                to={`/u/${posterPublicKey}`}
                className=' text-base hover:underline'>
                {post.user.nickname}
              </Link>
              <span className='middot' />
              <p className='text-xs text-gray-700'>{timeAgo}</p>
            </div>
            <div className='justify-end'>
              <button className='flex items-center justify-center px-2 py-2 rounded-full  border bg-gray-100 border-gray-300 hover:bg-red-200'>
                <BsHeart size={16} color='red' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
