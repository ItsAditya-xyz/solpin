import React, { useEffect, useContext } from "react";

import "./App.css";
import "./styles/styles.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/Signup/SignUp";
import WalletContextProvider from "./components/walletContextProvider";
import LandingPage from "./pages/Landing/LandingPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import Delete from "./pages/DeleteProfile/Delete";
import Create from "./pages/Create/Create";
import CreateGroup from "./pages/Group/CreateGroup";
import Post from "./pages/Post/Post";

function App() {
  return (
    <WalletContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/u/:publicKey' element={<ProfilePage />} />
          <Route path='/delete' element={<Delete />} />
          <Route path='/create' element={<Create />} />
          <Route path='/create-group' element={<CreateGroup />} />
          <Route path = '/post/:postID' element = {<Post/>} />
        </Routes>
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;
