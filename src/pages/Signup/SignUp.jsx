import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from "../../styles/Home.module.css"
import logo from "../../assets/logo.png"
import ProfileForm from './ProfileForm';
import { Link } from 'react-router-dom';
function SignUp() {
    return (
        <div>
            <div className={styles.AppHeader}>
            <Link to='/'>
        <img src={logo} height={30} width={200} />
        </Link>
                <WalletMultiButton />
            </div>
           <ProfileForm/>
        </div>
    );
}

export default SignUp;