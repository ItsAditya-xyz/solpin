import React, { useState, useContext, useEffect } from "react";
import { Loader } from "../../components/Loader";
import toast, { Toaster } from "react-hot-toast";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { SocialProtocol } from "@spling/social-protocol";
import Navbar from "../../components/Navbar";
import {protocolOptions} from "../../utils/constants";
function CreateGroup() {
  const SplingContextValue = useContext(SplingContext);
  const [loading, setLoading] = useState(false);
  const [socialProtocol, setSocialProtocol] = useState(
    SplingContextValue.socialProtocol
  );

  const wallet = useWallet();
  useEffect(() => {
    async function initApp() {
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

  const createGroup = async () => {
    if (!wallet || typeof wallet == "undefined")
      return toast.error("Wallet not connected");
    if (!socialProtocol) return toast.error("Wallet not connected");
    const loadingToast = toast.loading("Creating Group");
    const group = await socialProtocol.createGroup(
      "solpin",
      "Solpin is a social platform to share pics on Decentralized Social Network built on Spling Protocol on Solana",
      null
    );
    toast.dismiss(loadingToast);
    toast.success("Group Created");
    console.log(group);
  };

  const deleteGroup = async () => {
    if (!wallet || typeof wallet == "undefined")
      return toast.error("Wallet not connected");
    if (!socialProtocol) return toast.error("Wallet not connected");
    const loadingToast = toast.loading("Deleting Group");
    const group = await socialProtocol.deleteGroup();
    toast.dismiss(loadingToast);
    toast.success("Group Deleted");
    console.log(group);
  };

  return (
    <div>
    <Navbar/>
      <div className='flex   mx-auto  justify-center items-start w-full md:w-2/3 mb-24'>
        <Toaster />
        <div className='flex mx-auto  w-full space-y-6 md:flex-row md:space-x-10 md:space-y-0 my-28'>
          <div className='mx-auto flex justify-center items-center flex-col'>
            <h1 className='text-xl text-red-400'>
              This will create the solpin group
            </h1>
            <button
              onClick={() => createGroup()}
              className={` flex items-center justify-center space-x-2 font-medium text-white px-6 py-3 leading-none rounded-full buttonBG my-2 ${
                loading ? "cursor-not-allowed bg-opacity-50" : ""
              }`}>
              {loading && <Loader className='w-3.5 h-3.5' />}
              <span>Create Group</span>
            </button>
            <button
              onClick={() => deleteGroup()}
              className={` flex items-center justify-center space-x-2 font-medium text-white px-6 py-3 leading-none rounded-full buttonBG my-2 ${
                loading ? "cursor-not-allowed bg-opacity-50" : ""
              }`}>
              {loading && <Loader className='w-3.5 h-3.5' />}
              <span>Delete Group</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
