import React from "react";
import ProfileForm from "./ProfileForm";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
function SignUp() {
  return (
    <div>
      <Navbar shouldShowWallet={true} />
      <div className='flex justify-center mx-auto'>
        <div>
          <div className='relative text-3xl md:py-10 text-gray-800 text-center font-extrabold  sm:text-5xl lg:text-4xl  rounded-full sm:w-[70%] flex justify-center mx-auto px-2 '>
            <span className='brandGradientBg blur-2xl filter opacity-10 w-full h-full absolute inset-0 rounded-full leading-snug'></span>
            <span className='md:px-5 leading-snug'>
              Welcome to
              <span className='text-transparent bg-clip-text brandGradientBg'>
                {" "}
                Solpin.
              </span>{" "}
              Create your profile to get started.
            </span>
          </div>
          <div className='flex justify-center mx-auto px-2 '>
            <div className='bg-yellow-200 px-4 py-1 border-l-2 mb-4 mt-3 border-yellow-500'>
              Make sure you have enough $SOL and $SHDW tokens in your wallet to
              cover the gas fee.
              <br></br>
              You can buy some $SHDW tokens from{" "}
              <a
                href='https://jup.ag/swap/SOL-SHDW'
                target={"_blank"}
                className='text-blue-400 underline'>
                here
              </a>
              . We are working to make everything gasless
            </div>
          </div>
        </div>
      </div>
      <div className='mb-10'>
        <ProfileForm />
      </div>
    </div>
  );
}

export default SignUp;
