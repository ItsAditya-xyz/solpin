import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from "../../styles/Home.module.css"
function SignUp() {
    return (
        <div>
            <div className={styles.AppHeader}>
                <img src="/logo.svg" height={30} width={200} />
                <WalletMultiButton />
            </div>
        </div>
    );
}

export default SignUp;