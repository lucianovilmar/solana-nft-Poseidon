
'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAppContext, UserProfile } from '../AppContext';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import api from '../services/api';

const WalletConect = dynamic(() => import('./WalletConect'), { ssr: false });

export default function Header() {
    // 1. Obter o estado do perfil do nosso AppContext
    const { userProfile, setUserProfile, setNfts, viewHeader, setViewHeader, setIsProfileModalOpen, nfts } = useAppContext();

    const [holdHover, setHoldHover] = useState(false);
    // 2. Obter o estado da carteira do hook useWallet
    const { connected, publicKey } = useWallet();

    const walletConnected = userProfile?.wallets?.length > 0;
    //    const hasPoseidonNft = nfts && nfts.some(nft => nft.name.toLowerCase().includes('poseidon'));
    //    console.log(hasPoseidonNft);

    const walletAddress = publicKey ? publicKey.toBase58() : null;
    //    console.log('Endereço da carteira conectada:', walletAddress);
    const canNavigate = walletConnected; // && hasPoseidonNft;
    //        const canNavigate = userProfile.isHolder;
    //const [userProfile, setUserProfile] = useState<UserProfile>({ wallets: [] });



    useEffect(() => {
        const fetchUserProfile = async () => {
            // A função só deve rodar se tivermos uma carteira conectada e um endereço.
            // Adicionamos uma verificação para garantir que walletAddress é uma string.
            if (!connected || !walletAddress || typeof walletAddress !== 'string') {
                console.warn('fetchUserProfile abortado: carteira não conectada ou endereço inválido.', { connected, walletAddress });
                return;
            }


            try {
                const url = `/users/${walletAddress}`;
                const response = await api.get(url);
                const profileData = response.data;



                const canNavigate = profileData.isHolder;


                // Usamos a forma funcional do "setUserProfile" para acessar o estado anterior
                // sem precisar adicionar `userProfile` à lista de dependências do useEffect.
                setUserProfile((prevProfile: UserProfile) => {
                    // Perfil encontrado: combina as carteiras existentes com as da API, sem duplicatas.
                    if (profileData && profileData.wallets) {
                        const combinedWallets = [...new Set([...prevProfile.wallets, ...profileData.wallets, walletAddress])];
                        return {
                            id: profileData.id,
                            name: profileData.name,
                            image: profileData.image,
                            wallets: combinedWallets,
                            isHolder: profileData.isHolder,
                        };
                    }
                    // Perfil não encontrado: adiciona a carteira atual à lista, se ainda não existir.
                    if (!prevProfile.wallets.includes(walletAddress)) {
                        return { ...prevProfile, wallets: [...prevProfile.wallets, walletAddress] };
                    }
                    // Se nada mudou, retorna o estado anterior para evitar re-renderizações.
                    return prevProfile;
                });
            } catch (error) {
                // Erro (ex: 404) também indica um novo usuário. Adiciona a carteira, se ainda não existir.
                console.error('Erro ao buscar o perfil do usuário:', error);    
                setUserProfile(prevProfile => {
                    if (!prevProfile.wallets.includes(walletAddress)) {
                        return { ...prevProfile, wallets: [...prevProfile.wallets, walletAddress] };
                    }
                    return prevProfile;
                });
            }
        };

        fetchUserProfile();
        // A lista de dependências foi otimizada para rodar apenas quando a carteira conectada muda.
    }, [connected, walletAddress, setUserProfile]);

    return (

        <header className="w-full bg-gradient-to-r from-teal-900 via-cyan-800 to-blue-900 shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <nav className="flex items-center space-x-8">
                        <div className="relative">
                            <button
                                className={`px-4 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 ${!canNavigate ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => {
                                    if (canNavigate) {
                                        setViewHeader('carteiraEstatistica');
                                    }
                                }}
                                onMouseEnter={() => setHoldHover(true)}
                                onMouseLeave={() => setHoldHover(false)}
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <i className="ri-wallet-3-line text-lg"></i>
                                    </div>
                                    <span className="font-medium">Hold</span>
                                </div>
                            </button>
                            {!canNavigate && holdHover && (
                                <div className="absolute left-1/2 transform -translate-x-1/2 translate-x-[10px] mt-2 w-max text-center text-yellow-200 bg-yellow-700/30 py-2 px-4 rounded-lg font-medium z-10">
                                    Para entrar nessa área, selecione uma wallet que tenha pelo menos 1 NFT Poseidon.
                                </div>
                            )}
                        </div>
                        <button className="px-4 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 "
                            onClick={() => { setViewHeader('Nft'); setNfts([]);  }}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <i className="ri-image-line text-lg"></i>
                                </div><span className="font-medium">NFT</span></div>
                        </button>
                        <button className="px-4 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 "
                            onClick={() => { setViewHeader('mercado'); }}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <i className="ri-store-2-line text-lg"></i>
                                </div><span className="font-medium">Mercado</span>


                            </div>
                        </button>
                    </nav>
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="text-4xl font-['Pacifico'] text-white cursor-pointer">Poseidon
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <WalletConect></WalletConect>
                        <button
                            className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white"
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <i className="ri-user-line text-lg text-white"></i>
                                </div>
                            </div>
                            <span className="font-medium">Perfil</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}