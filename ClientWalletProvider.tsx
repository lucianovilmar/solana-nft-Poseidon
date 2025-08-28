'use client';

import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { BackpackWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Importa os estilos do Wallet Adapter para a UI
import '@solana/wallet-adapter-react-ui/styles.css';

export function ClientWalletProvider({ children }: { children: React.ReactNode }) {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    
    // Adicione aqui os adaptadores das carteiras que você quer suportar.
//    const wallets = useMemo(
        //() => [new BackpackWalletAdapter(), new PhantomWalletAdapter()],
  //      [] // A lista de carteiras não depende da rede, então a dependência pode ser vazia.
        const wallets = useMemo(
        () => [
             new PhantomWalletAdapter(),

        ],

    );



    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}