import React, { useState } from "react";
import party from "party-js";
import { Loader } from "../../components/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BiUpload, BiX } from "react-icons/bi";
import banner from "../../assets/banner.jpg";
import default_profile_pic from "../../assets/default_profile_pic.png";
import { SocialProtocol } from "@spling/social-protocol";
function ProfileForm() {
  const [profileImage, setProfileImage] = useState(default_profile_pic);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false);

  const fileInput = React.useRef(null);

  const updateProfile = async () => {
    // const user = await socialProtocol.createUser(nickname: string, avatar: FileData | FileUriData, biography: string)
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleProfilePicUpload = async () => {
    setIsUploadingProfileImage(true);
  };

  return (
    <div className="flex   mx-auto  justify-center items-start w-full md:w-2/3 mb-24">
      <div className="flex mx-auto  w-full space-y-6 md:flex-row md:space-x-10 md:space-y-0">
        <div className="flex mx-auto flex-col w-full md:w-3/4 secondaryBg border secondaryBorder rounded-xl p-4">
          <div
            style={{
              backgroundImage: `url(${banner})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            className="rounded-lg w-full h-40 md:h-64 relative flex justify-center items-center dark:border-[#2D2D33] border-gray-100 border z-20 "
          >
            <div className="flex  -bottom-12 left-auto absolute items-center">
              <div
                className="w-24 h-24 my-2 group rounded-full relative z-20 flex items-center justify-center dark:border-[#2D2D33] border-white border-2"
                id="profilePicOnSignUp"
                style={{
                  backgroundImage: `url(${profileImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {!isUploadingProfilePic ? (
                  <button
                    className="bg-white/[.7]  group-hover:flex rounded-full px-2 py-2 hover:bg-white/[.9]"
                    onClick={() => {
                      fileInput.current.click();
                    }}
                  >
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      style={{ display: "none" }}
                    />
                    <BiUpload size={24} />
                  </button>
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-10 pt-5 w-full space-y-4 items-center">
            <div className="w-full md:w-3/5">
              <p className="font-semibold mb-2 primaryTextColor">Username</p>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="GavinBelson"
                className="search rounded-full darkenBg darkenBorder border darkenHoverBg px-3 py-2 w-full outline-none focus:shadow transition delay-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            {/* <div className='w-full md:w-3/5'>
              <p className='font-semibold mb-2 primaryTextColor'>
                Display Name
              </p>
              <input
                type='text'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder='Gavin Belson'
                className='search rounded-full darkenBg darkenBorder border darkenHoverBg px-3 py-2 w-full outline-none focus:shadow transition delay-50 placeholder:text-gray-400 dark:placeholder:text-gray-500'
              />
            </div> */}
            <div className="w-full md:w-3/5">
              <p className="font-semibold mb-2 primaryTextColor">Description</p>
              <textarea
                placeholder="CEO OF HOOLI"
                className="search rounded-xl darkenBg darkenBorder border darkenHoverBg h-32 px-3 py-2 w-full outline-none focus:shadow transition delay-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mx-auto">
              <button
                onClick={() => updateProfile()}
                className={` flex items-center justify-center space-x-2 font-medium text-white px-6 py-3 leading-none rounded-full buttonBG my-2 ${
                  loading ? "cursor-not-allowed bg-opacity-50" : ""
                }`}
              >
                {loading && <Loader className="w-3.5 h-3.5" />}
                <span>Create Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;
