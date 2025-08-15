
'use client';
import { useState } from 'react';
import { useAppContext } from '../AppContext';
import WalletConect from './WalletConect';



export default function Header() {
    const { viewPage, setViewPage, setNfts, viewHeader, setViewHeader, setIsWalletConnectOpen, userProfile, setIsProfileModalOpen, nfts } = useAppContext();

    const [holdHover, setHoldHover] = useState(false);

    const walletConnected = userProfile?.wallets?.length > 0;
    const hasPoseidonNft = nfts && nfts.some(nft => nft.name.toLowerCase().includes('poseidon'));
    const canNavigate = walletConnected && hasPoseidonNft;


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
                                disabled={!canNavigate}
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
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max text-center text-yellow-200 bg-yellow-700/30 py-2 px-4 rounded-lg font-medium z-10">
                                    Para entrar nessa área, selecione uma wallet e tenha pelo menos 1 NFT Poseidon.
                                </div>
                            )}
                        </div>
                        <button className="px-4 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 "
                            onClick={() => { setViewHeader('Nft');  }}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <i className="ri-image-line text-lg"></i>
                                </div><span className="font-medium">NFT</span></div>
                        </button>
                        <button className="px-4 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 "
                            onClick={() => { setViewHeader('mercado');  }}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <i className="ri-store-2-line text-lg"></i>
                                </div><span className="font-medium">Mercado</span>


                            </div>
                        </button>
                    </nav>
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <div className="text-2xl font-['Pacifico'] text-white cursor-pointer">Poseidon
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