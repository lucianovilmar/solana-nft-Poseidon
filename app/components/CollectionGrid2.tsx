
'use client';

import { useState } from 'react';
import { useAppContext, Nft } from '../AppContext';
import CollectionCard from './CollectionCard';

export default function CollectionGrid() {
  const [viewMode, setViewMode] = useState('grid');
  const { nfts, setNfts } = useAppContext()

  return (
    <div>

      {/* Grid de Coleções */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
        {nfts.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} viewMode={viewMode} />
        ))}
      </div>

    </div>
  );
}
