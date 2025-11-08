
'use client';

import { useState } from 'react';
import { useAppContext, Nft } from '../AppContext';
import CollectionCard from './CollectionCard';

export default function CollectionGrid() {
  const [viewMode, setViewMode] = useState('remove');
  const { nfts, setNfts } = useAppContext()

  const handleRemoveCard = (nftId: string) => {
    setNfts(nfts.filter(nft => nft.number !== nftId));
  };

  return (
    <div className="grid grid-cols-2">

      {/* Grid de Coleções */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
        {nfts.map((collection) => (
          <CollectionCard key={collection.number} collection={collection} viewMode={viewMode} onRemove={handleRemoveCard} />
        ))}
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl h-full min-h-[600px] border border-white/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <i className="ri-picture-in-picture-2-line text-white text-3xl"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Área Reservada</h3>
          <p className="text-gray-300 max-w-md">Este espaço está reservado para futuros conteúdos e funcionalidades</p>
        </div>
      </div>







    </div>
  );
}
