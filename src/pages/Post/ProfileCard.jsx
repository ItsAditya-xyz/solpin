import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
export default function ProfileCard({ userInfo, selfPublicKey }) {
  const publicKey = userInfo.publicKey.toString();
  return (
    <div className='flex flex-col '>
      <Toaster />
      <div className='flex space-x-3'>
        <img src={userInfo.avatar} className='w-14 h-14 rounded-full' />
        <div className='flex flex-col '>
          <div className='flex justify-between items-center space-x-2 '>
            <Link
              to={`/u/${publicKey}`}
              className='text-xl font-bold mt-2 hover:underline'>
              {userInfo.nickname}{" "}
            </Link>
            {selfPublicKey != publicKey && (
              <div className='mt-3'>
                <button className='px-3 py-1 border-[#512DA8] border-2 hover:bg-[#512DA8] hover:text-white rounded-full text-sm'>
                  Folllow
                </button>
              </div>
            )}
          </div>

          <div className='flex flex-row space-x-2 items-center mt-3'>
            <button
              className='px-2 py-1 bg-[#512DA8] hover:bg-[#3e237f] text-white rounded-md text-xs'
              onClick={() => {
                navigator.clipboard.writeText(publicKey.toString());
                toast.success("Public Key Copied to clipboard!");
              }}>
              {publicKey.toString().slice(0, 15)}...{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
