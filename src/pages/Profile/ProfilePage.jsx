import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SplingContext from "../../Context/SplingContext/SplingContext";
import { Loader } from "../../components/Loader";
import { SocialProtocol } from "@spling/social-protocol";
import { Link } from "react-router-dom";

import { Keypair, PublicKey } from "@solana/web3.js";
function ProfilePage(props) {
  const { publicKey } = useParams();
  const [publicKeyVal, setPublicKeyVal] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const SplingContextValue = useContext(SplingContext);
  const [socialProtocolValue, setSocialProtocolValue] = useState(null);
  useEffect(() => {
    if (!publicKey) return;
    setPublicKeyVal(publicKey);
  }, [publicKey]);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

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
      console.log(userInfo);
      setUserInfo(userInfo);
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

  return <div>TEST</div>;
}

export default ProfilePage;
