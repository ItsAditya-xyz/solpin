import React, { useEffect } from 'react';
import styles from "../../src/styles/Home.module.css"
import { ProtocolOptions, SocialProtocol } from '@spling/social-protocol';
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
function LandingPage() {
    const wallet = useAnchorWallet();
    console.log(wallet)

    useEffect(() => {
        async function initApp() {
            const protocolOptions = { useIndexer: true } as ProtocolOptions
            const socialProtocol: SocialProtocol = await new SocialProtocol(wallet, null, protocolOptions).init()
            console.log(socialProtocol)
        }
        if (wallet?.publicKey && typeof wallet !== "undefined") {
            initApp()
        }


    }, [wallet])

    return (
        <div className='w-full'>
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