'use client';

import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { AddToProfileButton } from '../../AddToProfileButton';
import { useAppContext } from '../AppContext';

// Importa os estilos do Wallet Adapter para a UI
import '@solana/wallet-adapter-react-ui/styles.css';

// Componente principal que irá conter a lógica de conexão
const WalletConect = () => {
    const { publicKey } = useWallet();
    const { userProfile, setUserProfile } = useAppContext(); // 1. Obter setUserProfile do contexto
    const [showAddButton, setShowAddButton] = useState(false);

    useEffect(() => {
        // Verifica se a carteira está conectada e se o perfil do usuário foi carregado
        if (publicKey && userProfile.wallets) {
            const connectedWalletAddress = publicKey.toBase58();
            // Mostra o botão apenas se a carteira conectada NÃO estiver na lista de carteiras do perfil.
            setShowAddButton(!userProfile.wallets.includes(connectedWalletAddress));
            console.log('Endereço da carteira conectada:', connectedWalletAddress, userProfile);
            handleAddWalletToProfile();

        } else {
            // Se não houver carteira conectada ou o perfil não estiver carregado, esconde o botão.
            setShowAddButton(false);
        }
    }, [publicKey, userProfile.wallets]); // Roda o efeito quando a carteira ou o perfil mudam

    // 2. Criar a função para adicionar a carteira ao perfil
    const handleAddWalletToProfile = () => {
        if (!publicKey || !userProfile) return; // Verificação de segurança

        const newWalletAddress = publicKey.toBase58();

        // Impede a adição se a carteira já existir na lista
        if (userProfile.wallets.includes(newWalletAddress)) {
            return;
        }

        // 3. Criar um novo objeto de perfil com a carteira adicionada
        const updatedProfile = {
            ...userProfile, // Copia todas as propriedades existentes do perfil
            wallets: [...userProfile.wallets, newWalletAddress], // Cria um novo array de carteiras com a nova adicionada
        };

        // 4. Atualiza o estado global com o novo perfil
        setUserProfile(updatedProfile);
    };

    return (
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white">
            <WalletMultiButton />
            {showAddButton && <AddToProfileButton onClick={handleAddWalletToProfile} />}
        </div>
    );
};

export default WalletConect;