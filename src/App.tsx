import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from './pages/Signup/SignUp';
import WalletContextProvider from './components/walletContextProvider';
function App() {
  return (

    <WalletContextProvider>
      <Routes>
        <Route path='/' element={
          <SignUp />
        } />
      </Routes>
    </WalletContextProvider>
  );
}

export default App;
