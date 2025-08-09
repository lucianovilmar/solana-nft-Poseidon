import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
//import { PhantomWalletAdapter, BackpackWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';

// Importa os estilos do Wallet Adapter para a UI
import '@solana/wallet-adapter-react-ui/styles.css';

// Componente principal que irá conter a lógica de conexão
const WalletConect = () => {
    // A variável `network` define a rede da Solana que você está usando (devnet, testnet, mainnet-beta)
    const network = WalletAdapterNetwork.Devnet;

    // A URL do endpoint da RPC para a rede selecionada
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // Lista de carteiras que o aplicativo suporta.
    // WalletProvider irá verificar quais dessas carteiras estão instaladas.
    const wallets = useMemo(
        () => [
 //           new PhantomWalletAdapter(),
            //      new BackpackWalletAdapter(),
        ],
        [network]
    );
    //flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white
    //bg-gray-900 min-h-screen text-white flex flex-col items-center justify-center p-4
    return (
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white">
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider
                        
                    >
                        <WalletMultiButton />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </div>
    );
};

// Componente que lida com a lógica de exibição e verificação da carteira
const WalletVerifier = () => {
    const { publicKey, connected } = useWallet();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="bg-gray-800 p-8 rounded-3xl shadow-2xl max-w-xl w-full text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.h1
                className="text-4xl font-extrabold text-teal-400 mb-4"
                variants={itemVariants}
            >
                Verificador de Carteira Solana
            </motion.h1>
            <motion.p
                className="text-gray-400 mb-8"
                variants={itemVariants}
            >
                Conecte sua carteira para verificação.
            </motion.p>

            <motion.div variants={itemVariants}>
                <WalletMultiButton />
            </motion.div>

            {connected && publicKey && (
                <motion.div
                    className="mt-8 p-6 bg-gray-700 rounded-xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h2
                        className="text-xl font-bold text-green-400 mb-2"
                        variants={itemVariants}
                    >
                        Carteira Conectada com Sucesso!
                    </motion.h2>
                    <motion.p
                        className="text-gray-300 break-all font-mono"
                        variants={itemVariants}
                    >
                        Endereço Público: <span className="text-white font-bold">{publicKey.toBase58()}</span>
                    </motion.p>
                </motion.div>
            )}

            {!connected && (
                <motion.p
                    className="mt-8 text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Nenhuma carteira conectada.
                </motion.p>
            )}
        </motion.div>
    );
};

export default WalletConect;