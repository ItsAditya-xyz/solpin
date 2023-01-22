import React from "react";
import { timeStampToTimeAgo } from "../../utils/functions";
import { Link } from "react-router-dom";
import defaultPic from "../../assets/default_profile_pic.png";
import { BiTrash } from "react-icons/bi";
function CommentCard({ comment, currentUserID, deleteComment }) {
  const timeAgo = timeStampToTimeAgo(comment.timestamp * 1e9);
  const posterPublicKey = comment.user.publicKey.toString();
  const avatar = comment.user.avatar;
  const nickname = comment.user.nickname;

  return (
    <div className="flex flex-col shadow-sm">
      <div className="flex w-full py-4 px-2 space-x-1">
        <Link
          to={`/u/${posterPublicKey}`}
          className="cursor-pointer relative flex items-center justify-center space-x-1"
        >
          <img
            src={`${avatar}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultPic;
            }}
            className="w-10 h-10 darkenBg darkenBorder rounded-full"
            alt={`${nickname}`}
          />
        </Link>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-1">
            <Link
              to={`/u/${posterPublicKey}`}
              className=" text-base hover:underline"
            >
              {nickname}
            </Link>
            <span className="middot" />
            <p className="text-xs text-gray-700">{timeAgo}</p>
          </div>
          {comment.userId === currentUserID && (
            <div className="justify-end flex space-x-1 items-center"
            onClick={()=>{
                deleteComment(comment)
            }}
            >
              <button className="flex items-center justify-center px-2 py-2 rounded-full  border bg-gray-100 border-gray-300 hover:bg-red-200">
                <BiTrash size={16} color="red" />
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="px-2">{comment.text}</p>
    </div>
  );
}

export default CommentCard;
