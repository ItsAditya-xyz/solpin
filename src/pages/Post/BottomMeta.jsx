import { BsHeart, BsHeartFill } from "react-icons/bs";
const BottomMeta = ({ post, timesAgo, likeFunction, currentUserID }) => {
  const totalLikes = post.likes.length;
  const isLiked = post.likes.includes(currentUserID);
  return (
    <div className="flex flex-row justify-end w-full items-center pt-3 px-8">
      <div className="flex flex-row flex-auto text-gray-700 ">
        <div className="flex flex-row justify-center items-center">
          <div className="justify-end">
            <button
              className="flex items-center justify-center px-2 py-2 rounded-full  border bg-gray-100 border-gray-300 hover:bg-red-200"
              onClick={() => likeFunction(post.publicKey)}
            >
              {isLiked ? (
                <BsHeartFill size={16} color="red" />
              ) : (
              <BsHeart size={16} color="red" />
              )}
            </button>
          </div>
          <span className="ml-1">{totalLikes}</span>
        </div>
      </div>
      <div className="flex flex-row flex-1 items-center justify-end">
        <span className="ml-1 text-sm text-gray-700">
          Posted {timesAgo} ago
        </span>
      </div>
    </div>
  );
};

export default BottomMeta;
