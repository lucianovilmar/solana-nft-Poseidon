
'use client';

import { useState } from 'react';
import { useAppContext, Nft } from '../AppContext';
import CollectionCard from './CollectionCard';

export default function CollectionGrid() {
  const [viewMode, setViewMode] = useState('grid');
  const { nfts, setNfts, totalPower } = useAppContext()

  const handleRemoveCard = (nftId: string) => {
    setNfts(nfts.filter(nft => nft.number !== nftId));
  };



  const formatador = new Intl.NumberFormat('pt-BR');

  return (
    <div>
      {/* Header com opções de visualização */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Seus Poseidons
            </h2>
            <div className="flex items-center gap-6 mt-1">
              <span className="text-sm text-gray-600">
                <i className="ri-image-fill w-4 h-4 inline-flex items-center justify-center mr-1"></i>
                {nfts.length.toLocaleString()} NFTs
              </span>
              <span className="text-sm text-gray-600">
                <i className="ri-flashlight-fill w-4 h-4 inline-flex items-center justify-center mr-1"></i>
                {formatador.format(totalPower)} Power
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <i className="ri-grid-fill w-5 h-5 flex items-center justify-center"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded cursor-pointer ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <i className="ri-list-check w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>
      </div>

      {/* Grid de Coleções */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
        {nfts.map((collection) => (
          <CollectionCard key={collection.number} collection={collection} viewMode={viewMode} onRemove={handleRemoveCard} />
        ))}
      </div>

    </div>
  );
}
