import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from "../../styles/Home.module.css"
import LandingPage from '../../components/landingPage';
import logo from "../../assets/logo.png"
function SignUp() {
    return (
        <div>
            <div className={styles.AppHeader}>
                <img src={logo} height={30} width={200} />
                <WalletMultiButton />
            </div>
            <LandingPage/>
        </div>
    );
}

export default SignUp;