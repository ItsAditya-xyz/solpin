import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { Loader } from "../../components/Loader";
import { SocialProtocol } from "@spling/social-protocol";
import { Link } from "react-router-dom";
import Tippy from "@tippyjs/react";
import toast, { Toaster } from "react-hot-toast";
import { Keypair, PublicKey } from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import styles from "../../styles/Home.module.css";
import logo from "../../assets/logo.png";
function ProfilePage(props) {
  const { publicKey } = useParams();
  const [publicKeyVal, setPublicKeyVal] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const SplingContextValue = useContext(SplingContext);
  const [socialProtocolValue, setSocialProtocolValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!publicKey) return;
    setPublicKeyVal(publicKey);
  }, [publicKey]);

  useEffect(() => {
    if (!publicKeyVal) return;
    async function getUserInfo() {
      console.log(publicKeyVal);
      //convert address stored in publicKeyVal to Keypair
      console.log(socialProtocolValue);
      const publicKeyObj = new PublicKey(publicKeyVal);
      console.log(publicKeyObj);
      const userInfo = await socialProtocolValue.getUserByPublicKey(
        publicKeyObj
      );
      if (userInfo) {
        setIsLoading(false);
        setUserInfo(userInfo);
      } else {
        setIsLoading(false);
        toast.error("Something went wrong. Please try again later.");
      }
    }

    async function initSocialProtocol() {
      const protocolOptions = {
        useIndexer: true,
        rpcUrl:
          "https://rpc.helius.xyz/?api-key=d9bf1217-df34-4b46-a45c-3481095e3942",
      };
      const sp = await new SocialProtocol(
        Keypair.generate(),
        null,
        protocolOptions
      ).init();
      SplingContextValue.updateSocialProtocol(sp);
      setSocialProtocolValue(sp);
    }

    if (socialProtocolValue) {
      getUserInfo();
    } else {
      if (SplingContextValue.socialProtocol) {
        setSocialProtocolValue(SplingContextValue.socialProtocol);
      } else {
        initSocialProtocol();
      }
    }
  }, [publicKeyVal, socialProtocolValue]);

  return (
    <div>
      <Toaster />
      <div className={styles.AppHeader}>
        <Link to="/">
          <img src={logo} className="w-[45%] sm:w-[200px]" />
        </Link>
        <WalletMultiButton />
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      )}
      {!isLoading && userInfo && (
        <div className="flex flex-col justify-center items-center mt-10">
          <div className="flex  justify-center space-x-3">
            <img
              src={userInfo.avatar}
              className="w-[120px] h-[120px] rounded-full"
            />
            <div className="flex flex-col ">
              <p className="text-4xl font-bold mt-2">{userInfo.nickname}</p>
              <p className="text-xl text-gray-800 mt-8">{userInfo.bio}</p>
            </div>
            <div className="mt-3">
              <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full">
                Folllow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
