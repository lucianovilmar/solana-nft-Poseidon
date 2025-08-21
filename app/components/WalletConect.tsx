'use client';

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Importa os estilos do Wallet Adapter para a UI
import '@solana/wallet-adapter-react-ui/styles.css';

// Componente principal que irá conter a lógica de conexão
const WalletConect = () => {
    return (
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white">
            <WalletMultiButton />
        </div>
    );
};

export default WalletConect;