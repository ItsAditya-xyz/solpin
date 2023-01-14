import React, { useEffect } from 'react';
import styles from "../../src/styles/Home.module.css"
import { ProtocolOptions, SocialProtocol } from '@spling/social-protocol';
import { Wallet } from '@project-serum/anchor';
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import logo from "../assets/logo.png"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function LandingPage() {
    const wallet: AnchorWallet | undefined = useAnchorWallet()


    useEffect(() => {
        async function initApp() {
            console.log(wallet)
            const protocolOptions = { useIndexer: true } as ProtocolOptions
            const socialProtocol: SocialProtocol = await new SocialProtocol(wallet as Wallet, null, protocolOptions).init()
            console.log(socialProtocol)
        }
        if (wallet?.publicKey && typeof wallet !== "undefined") {
            initApp()
        }


    }, [wallet])

    return (
        <div className='w-full'>
             <div className={styles.AppHeader}>
                <img src={logo} height={30} width={200} />
                <WalletMultiButton />
            </div>
            <div>
                <div className="bg-yellow-300 text-gray-900 mx-auto px-5  flex items-center justify-center py-5">
                    <div>
                        Solpin is in Beta. Things may break
                    </div>
                </div>
            </div>

        </div>
    );
}

export default LandingPage;