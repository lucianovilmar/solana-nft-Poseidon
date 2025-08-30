
'use client';

import { Nft } from '../AppContext';
import CollectionCardStatistic from './CollectionCardStatistic';

interface CollectionGridStatisticProps {
  nfts: Nft[];
  totalPower: number;
}

export default function CollectionGridStatistic({ nfts, totalPower }: CollectionGridStatisticProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nfts.map((collection) => (
          <CollectionCardStatistic key={collection.number} collection={collection} />
        ))}
      </div>
    </div>
  );
}