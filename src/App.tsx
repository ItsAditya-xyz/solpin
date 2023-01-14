import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/styles.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUp from './pages/Signup/SignUp';
import WalletContextProvider from './components/walletContextProvider';
import LandingPage from './components/landingPage';

function App() {
  return (

    <WalletContextProvider>
       <BrowserRouter>


      <Routes>
        <Route path='/' element={
          <LandingPage/>
        } />
        <Route path='/sign-up' element={
          <SignUp />
        } />
        
      </Routes>
      </BrowserRouter>
    </WalletContextProvider>
  );
}

export default App;
