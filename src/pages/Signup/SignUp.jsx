import React from "react";
import ProfileForm from "./ProfileForm";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
function SignUp() {
  return (
    <div>
      <Navbar shouldShowWallet={true} />
      <ProfileForm />
    </div>
  );
}

export default SignUp;
