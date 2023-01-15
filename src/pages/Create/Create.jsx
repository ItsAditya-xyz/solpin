import React, { useEffect, useRef, useState, useContext } from "react";
import { BiImageAdd, BiQuestionMark, BiRocket } from "react-icons/bi";
import Tippy from "@tippyjs/react";
import { Loader } from "../../components/Loader";
import { BsTrash } from "react-icons/bs";
import styles from "../../styles/Home.module.css";
import logo from "../../assets/logo.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import toast, { Toaster } from "react-hot-toast";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { SocialProtocol } from "@spling/social-protocol";
import convertBase64 from "../../utils/functions";
export default function Create() {
  const SplingContextValue = useContext(SplingContext);
  const [socialProtocol, setSocialProtocol] = useState(
    SplingContextValue.socialProtocol
  );
  const [postBody, setPostBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputFileRef = useRef(null);
  const fileInput = React.useRef(null);
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState(null);

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

  const handleImageUpload = async (file) => {
    try {
      if (!wallet?.publicKey) return toast.error("Please connect wallet first");
      const file = fileInput.current.files[0];
      if (file.size > 10000000) return toast.error("File size too large");
      if (!file.type.includes("image"))
        return toast.error("Please upload an image file");
      setImageURL(URL.createObjectURL(file));
      setImageFile(file);
    } catch (e) {
      toast.error("Error uploading Image");
      console.log(e);
    }
  };
  const submitPost = async () => {
    if (!wallet || typeof wallet == "undefined")
      return toast.error("Wallet not connected");
    if (!postBody) return toast.error("Please enter a Image Details.");
    if (!imageFile) return toast.error("Please upload an image file");

    const toastID = toast.loading(
      "Creating Post...Please approve transactions"
    );
    try {
      let bs64 = await convertBase64(imageFile);
      let finalObj = {
        base64: bs64,
        size: imageFile.size,
        type: imageFile.type,
      };

      const post = await socialProtocol.createPost(11, postBody, finalObj);
      console.log(post);
      if (post) {
        toast.dismiss(toastID);
        toast.success("Post created successfully");
        setImageFile(null);
        setImageURL("");
        setPostBody("");

        return;
      } else {
        toast.dismiss(toastID);
        toast.error("Error creating post");
        return;
      }
    } catch (e) {
      toast.dismiss(toastID);
      toast.error("Error creating post");
      console.log(e);
      return;
    }
  };

  return (
    <div>
      <div className={styles.AppHeader}>
        <img src={logo} height={30} width={200} />
        <WalletMultiButton />
      </div>
      <Toaster />
      <div className='sm:w-3/4 md:w-3/5 lg:w-1/2 mx-auto my-3 '>
        <textarea
          className='focus:ring-0 focus:outline-none outline-none darkenBg darkenHoverBg border dark:border-[#2D2D33] hover:dark:border-[#43434d] border-gray-200 hover:border-gray-200 resize-none w-full rounded-lg heading px-4 py-2'
          placeholder='About the photo...'
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
        />

        <div className='flex items-center space-x-1'>
          <button
            className={`mx-1 flex items-center justify-center space-x-2 font-medium text-gray-800 px-4 py-3 leading-none rounded-full bg-gray-200 hover:bg-gray-300 my-2`}
            onClick={() => {
              fileInput.current.click();
            }}>
            <input
              ref={fileInput}
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <BiImageAdd size={21} className='text-gray-900' />
            <p className='text-gray-900'>Upload Image</p>
          </button>
          <button
            className={`mx-1 flex items-center justify-center space-x-2 font-medium text-white px-8 py-3 leading-none rounded-full buttonBG my-2`}
            onClick={() => {
              submitPost();
            }}>
            <BiRocket size={21} className='text-gray-100' />
            <p className='text-gray-100'>Post</p>
          </button>
        </div>
        <div className={`${!imageURL ? "hidden" : "flex"}`}>
          <img src={imageURL} className='w-3/4 sm:w-3/5  mx-auto rounded-md' />
        </div>
        <div
          className={`${
            !imageURL
              ? " hw-3/4 sm:w-3/5 h-[60vh] bg-gray-300 mx-auto rouned-md flex justify-center items-center"
              : "hidden"
          }`}>
          <p className='text-gray-600'>
            Your Image will Appear Here after Upload
          </p>
        </div>
      </div>
    </div>
  );
}
