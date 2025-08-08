
'use client';
import { useAppContext } from '../AppContext';



export default function Header() {
    const { viewPage, setViewPage, setNfts, viewHeader, setViewHeader } = useAppContext();

    return (

        <header className="w-full bg-gradient-to-r from-teal-900 via-cyan-800 to-blue-900 shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <nav className="flex items-center space-x-8">
                        <button className="px-4 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 ">
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <i className="ri-wallet-3-line text-lg"></i>
                                </div><span className="font-medium">Carteiras</span>
                            </div>
                        </button>
                        <button className="px-4 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 ">
                            <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <i className="ri-image-line text-lg"></i>
                                </div><span className="font-medium">NFT</span></div>
                        </button>
                        <button className="px-4 py-2 rounded-lg transition-all duration-200 text-white hover:bg-white/10 "
                            onClick={() => { setViewPage('mercado'); setNfts([]) }}
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
                        <button className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <i className="ri-secure-payment-line text-lg"></i>
                            </div>
                            <div className="text-left">
                                <div className="text-xs text-gray-200">Wallet
                                </div>
                                <div className="text-sm font-mono">0x1234...5678
                                </div>
                            </div>
                        </button>
                        <button className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white">
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