import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./styles/styles.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/Signup/SignUp";
import WalletContextProvider from "./components/walletContextProvider";
import LandingPage from "./components/landingPage";
import SplingContext from "./Context/SplingContext/SplingContext";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <WalletContextProvider>
      <SplingContext>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-up" element={<SignUp />} />
          
          </Routes>
        </BrowserRouter>
      </SplingContext>
    </WalletContextProvider>
  );
}

export default App;
