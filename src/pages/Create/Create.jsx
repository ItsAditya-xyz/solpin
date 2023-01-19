import React, { useEffect, useRef, useState, useContext } from "react";
import { BiImageAdd, BiRocket } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { SocialProtocol } from "@spling/social-protocol";
import { convertBase64 } from "../../utils/functions";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Keypair } from "@solana/web3.js";
import { protocolOptions } from "../../utils/constants";
export default function Create() {
  const SplingContextValue = useContext(SplingContext);
  const [socialProtocol, setSocialProtocol] = useState(
    SplingContextValue.socialProtocol
  );
  const { publicKey } = useWallet();
  const [postBody, setPostBody] = useState("");
  const fileInput = React.useRef(null);
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [postCreationDone, setPostCreationDone] = useState(false);

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
      console.log("spling init");
    } else {
      console.log("spling not init");
    }
  }, [wallet]);

  useEffect(() => {
    async function initApp() {
      const socialProtocolVal = await new SocialProtocol(
        Keypair.generate(),
        null,
        protocolOptions
      ).init();
      console.log(socialProtocolVal);
      SplingContextValue.updateSocialProtocol(socialProtocol);
      setSocialProtocol(socialProtocolVal);
    }
    if (!socialProtocol) {
      initApp();
      console.log("spling init");
    }
  }, [socialProtocol]);
  const handleImageUpload = async (file) => {
    try {
      if (!wallet?.publicKey) {
        toast.error("Please connect wallet first");
        //mkae fileInput null
        fileInput.current.value = null;

        return;
      }
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
    if (!wallet?.publicKey || typeof wallet == "undefined")
      return toast.error("Wallet not connected");
    if (!imageFile) return toast.error("Please upload an image file");
    if (!postBody) return toast.error("Please enter a Image Details.");

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

      const post = await socialProtocol.createPost(12, postBody, "", finalObj);
      console.log(post);
      if (post) {
        toast.dismiss(toastID);
        toast.success("Post created successfully");
        setPostCreationDone(true);
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
      if (e.message.includes("Account does not exist")) {
        toast.dismiss(toastID);
        toast.success("Post created successfully");
        setImageFile(null);
        setImageURL("");
        setPostBody("");
        return;
      }
      toast.dismiss(toastID);
      toast.error("Error creating post");
      console.log(e);
      return;
    }
  };

  return (
    <div>
      <Navbar shouldShowWallet={false} socialProtocol={socialProtocol} />
      <Toaster />
      <div className='flex justify-center mx-auto'>
        <div>
          <div className='relative text-3xl md:py-10 text-gray-800 text-center font-extrabold  sm:text-5xl lg:text-4xl  rounded-full sm:w-[70%] flex justify-center mx-auto px-2 '>
            <span className='brandGradientBg blur-2xl filter opacity-10 w-full h-full absolute inset-0 rounded-full leading-snug'></span>
            <span className='md:px-5 leading-snug'>
              <span className='text-transparent bg-clip-text brandGradientBg'>
                {" "}
                Create
              </span>{" "}
              a high-performing post to get your photos across!
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

          {postCreationDone && (
            <div className='flex justify-center mx-auto px-2 my-2'>
              <div className='bg-green-500 px-4 py-1 border-l-2 mb-4 mt-3 border-green-700 text-white'>
                View your Posts
                <Link
                  to={`/u/${publicKey}`}
                  className='text-blue-100 underline'>
                  {" "}
                  here
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='sm:w-3/4 md:w-3/5 lg:w-1/2 mx-auto my-3 '>
        <textarea
          className='focus:ring-0 h-28 focus:outline-none outline-none darkenBg darkenHoverBg border dark:border-[#2D2D33] hover:dark:border-[#43434d] border-gray-200 hover:border-gray-200 resize-none w-full rounded-lg heading px-4 py-2'
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
