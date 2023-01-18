import React from "react";
import logo from "../assets/logo.svg";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router-dom";
export default function Navbar({ shouldShowWallet }) {
  return (
    <div className='bg-[#20252e] flex items-center justify-between px-2 py-3'>
      <Link to='/'>
        <img src={logo} className='w-[160px]' alt="logo" />
      </Link>
      {shouldShowWallet && <WalletMultiButton />}
      {!shouldShowWallet && (
        <div className=''>
          <Link
            to='/sign-up'
            className=' bg-[#512DA8] text-white mx-auto lg:mx-0 hover:bg-[#5D3DAA]  rounded my-2 md:my-6 py-4 px-8 shadow-lg w-70 hover:scale-105 text-sm'>
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
