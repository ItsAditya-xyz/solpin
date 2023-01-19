import React from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
import SignUpModal from "./modals/SignUpModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import SplingContext from "../Context/SplingContext/SplingContext";
import { useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
export default function Navbar({ shouldShowWallet, socialProtocol = null }) {
  const SplingContextValue = useContext(SplingContext);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [checkingForProfile, setCheckingForProfile] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    async function checkUser() {
      setCheckingForProfile(true);
      setShowModal(false);
      const publicKeyObj = new PublicKey(publicKey);
      const userInfo = await socialProtocol.getUserByPublicKey(publicKeyObj);
      if (userInfo) {
        setProfileInfo(userInfo);
        SplingContextValue.updateSelfInfo(userInfo);
        setCheckingForProfile(false);
      } else {
        navigate("/sign-up");
      }

      setCheckingForProfile(false);
    }
    if (publicKey && socialProtocol && !profileInfo) {
      checkUser();
    }
  }, [publicKey]);

  useEffect(() => {
    let selfInfoContext = SplingContextValue.selfInfo;
    console.log(selfInfoContext);
    if (selfInfoContext) {
      setProfileInfo(selfInfoContext);
    }
  }, [SplingContextValue.selfInfo]);
  return (
    <div className='bg-[#20252e] flex items-center justify-between px-2 py-3'>
      <Link to='/'>
        <img src={logo} className='w-[160px]' alt='logo' />
      </Link>
      <SignUpModal
        showModal={showModal}
        setShowModal={setShowModal}
        useWallet={useWallet}
      />
      {shouldShowWallet && <WalletMultiButton />}
      {!shouldShowWallet && (
        <div>
          {checkingForProfile && (
            <div className='flex items-center justify-center'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
            </div>
          )}

          {profileInfo && (
            <div className='flex items-center justify-cente space-x-1'>
              <Link
                className='bg-[#512DA8] text-white mx-auto lg:mx-0 hover:bg-[#5D3DAA]  rounded my-2 py-3 px-9 shadow-lg w-70 hover:scale-105 text-sm hidden sm:block'
                to='/create'>
                Create
              </Link>
              <Link
                className='flex items-center justify-center space-x-2'
                to={`/u/${publicKey}`}>
                <div className='ml-2'>
                  <div className='text-white text-sm font-bold'>
                    {profileInfo.nickname}
                  </div>
                </div>
                <div className='flex items-center justify-center'>
                  <img
                    src={profileInfo.avatar}
                    className='w-10 h-10 rounded-full'
                    alt='profile pic'
                  />
                </div>
              </Link>
            </div>
          )}
          {!profileInfo && !checkingForProfile && !publicKey && (
            <button
              className=' bg-[#512DA8] text-white mx-auto lg:mx-0 hover:bg-[#5D3DAA]  rounded my-2 py-3 px-9 shadow-lg w-70 hover:scale-105 text-sm'
              onClick={() => setShowModal(true)}>
              Login
            </button>
          )}

          {!profileInfo && !checkingForProfile && publicKey && (
            <Link
              className=' bg-[#512DA8] text-white mx-auto lg:mx-0 hover:bg-[#5D3DAA]  rounded my-2 py-3 px-9 shadow-lg w-70 hover:scale-105 text-sm'
              to='/sign-up'>
              Create Profile
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
