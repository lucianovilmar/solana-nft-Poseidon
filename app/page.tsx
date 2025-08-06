
'use client';
import { useState } from 'react';
import NFTHero from './components/NFTHero';
import SearchFilters from './components/SearchFilters';
import CollectionGrid from './components/CollectionGrid';
import { AppProvider, useAppContext } from './AppContext';
import SearchIndice from './components/SearchIndice';
import CollectionGrid2 from './components/CollectionGrid2';



export default function Home() {
  const {viewPage, setViewPage} = useAppContext();

  return (
    
      <div className="min-h-screen bg-gray-50">
        <NFTHero  />
        <div className="max-w-7xl mx-auto px-4 py-8">


          {viewPage === 'carteira' ? (

            <div className="flex gap-6">
              {/* Barra Lateral Esquerda - Busca por Carteira */}
              <div className="w-80 flex-shrink-0">
                <SearchFilters />
              </div>

              {/* Área Principal Direita - NFTs */}
              <div className="flex-1">
                <CollectionGrid />
              </div>
            </div>

          ) : (
            <div className="flex gap-6">
              {/* Barra Lateral Esquerda - Busca por Carteira */}
              <div className="w-80 flex-shrink-0">
                <SearchIndice />
              </div>

              {/* Área Principal Direita - NFTs */}
              <div className="flex-1">
                 <CollectionGrid2 />
              </div>
            </div>
          )}


        </div>
      </div>
    
  );
}
