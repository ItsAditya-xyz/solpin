import React, { useState, useContext, useEffect } from "react";
import { Loader } from "../../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { SocialProtocol } from "@spling/social-protocol";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
function Delete() {
  const SplingContextValue = useContext(SplingContext);
  const [loading, setLoading] = useState(false);
  const [socialProtocol, setSocialProtocol] = useState(
    SplingContextValue.socialProtocol
  );

  const wallet = useWallet();
  useEffect(() => {
    async function initApp() {
      const protocolOptions = {
        useIndexer: true,
        rpcUrl:
          "https://solana-mainnet.g.alchemy.com/v2/2Y3ODmvjlgmxpBH-U7jOJlIy3nrtyt2p",
      };
      const socialProtocolVal = await new SocialProtocol(
        wallet,
        null,
        protocolOptions
      ).init();
      console.log(socialProtocolVal);
      SplingContextValue.updateSocialProtocol(socialProtocol);
      setSocialProtocol(socialProtocolVal);
    }
    if (wallet?.publicKey && typeof wallet !== "undefined") {
      initApp();
    }
  }, [wallet]);

  const deleteProfile = async () => {
    if (!wallet || typeof wallet == "undefined")
      return toast.error("Wallet not connected");
    
    if (!socialProtocol) return toast.error("Wallet not connected");

    const loadingToast = toast.loading("Deleting Profile...");
    const user = await socialProtocol.deleteUser();
    toast.dismiss(loadingToast);
    toast.success("Profile Deleted");

    console.log(user);
  };

  return (
    <div>
    <Navbar/>

      <div className='flex   mx-auto  justify-center items-start w-full md:w-2/3 mb-24'>
        <Toaster />
        <div className='flex mx-auto  w-full space-y-6 md:flex-row md:space-x-10 md:space-y-0 my-28'>
          <div className='mx-auto flex justify-center items-center flex-col'>
            <h1 className='text-xl text-red-400'>
              This will delete your Profile on Solpin
            </h1>
            <button
              onClick={() => deleteProfile()}
              className={` flex items-center justify-center space-x-2 font-medium text-white px-6 py-3 leading-none rounded-full buttonBG my-2 ${
                loading ? "cursor-not-allowed bg-opacity-50" : ""
              }`}>
              {loading && <Loader className='w-3.5 h-3.5' />}
              <span>Delete Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delete;
