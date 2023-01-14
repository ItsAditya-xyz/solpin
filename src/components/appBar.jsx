import { FC } from 'react'
import styles from "../../src/styles/Home.module.css"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import React from 'react'


export const AppBar = () => {

    return (
        <div className={styles.AppHeader}>

            <WalletMultiButton />
        </div>
    )
}