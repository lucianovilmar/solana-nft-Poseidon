
'use client';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import NFTHero from './components/NFTHero';
import SearchFilters from './components/SearchFilters';
import CollectionGrid from './components/CollectionGrid';
import { AppProvider, useAppContext } from './AppContext';
import SearchIndice from './components/SearchIndice';
import CollectionGrid2 from './components/CollectionGrid2';
import LojaTemp from './components/Lojatemp';
import { ProfileModal } from './components/ProfileModal';
import CarteiraEstatistica from './components/CarteiraEstatistica';
import Doacao from './components/Doacao';

export default function Home() {
    const { viewPage, setViewPage, viewHeader, setViewHeader, isProfileModalOpen } = useAppContext();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {/* O modal é renderizado apenas no lado do cliente */}
            {isClient && isProfileModalOpen && <ProfileModal />}

            {/* O conteúdo dinâmico também é renderizado apenas no cliente para evitar o erro de hidratação */}
            {isClient && (
                <div className="min-h-screen bg-gray-50">
                    {viewHeader === 'mercado' ? (
                        <LojaTemp />
                    ) : viewHeader === 'carteiraEstatistica' ? (
                        <CarteiraEstatistica />
                    ) : (
                        <>
                            <NFTHero />
                            <div className="max-w-7xl mx-auto px-4 py-8">
                                {viewPage === 'carteira' ? (
                                    <div className="flex gap-6">
                                        <div className="w-80 flex-shrink-0">
                                            <SearchFilters  />
                                            
                                        </div>
                                        <div className="flex-1 flex flex-col gap-8">
                                            <CollectionGrid />
                                            <Doacao />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-6">
                                        <div className="w-80 flex-shrink-0">
                                            <SearchIndice />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-8">
                                            <CollectionGrid2 />
                                            <Doacao />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}