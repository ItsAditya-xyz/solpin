import React, { useEffect, useContext } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./styles/styles.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/Signup/SignUp";
import WalletContextProvider from "./components/walletContextProvider";
import LandingPage from "./components/landingPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SplingContext from "./Context/SplingContext/SplingContext";


function App() {
  

  return (
    <WalletContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/u/:publicKey" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;
