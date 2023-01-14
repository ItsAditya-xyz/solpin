import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from "../../styles/Home.module.css"
import LandingPage from '../../components/landingPage';
import logo from "../../assets/logo.png"
import ProfileForm from './ProfileForm';
function SignUp() {
    return (
        <div>
            <div className={styles.AppHeader}>
                <img src={logo} height={30} width={200} />
                <WalletMultiButton />
            </div>
           <ProfileForm/>
        </div>
    );
}

export default SignUp;