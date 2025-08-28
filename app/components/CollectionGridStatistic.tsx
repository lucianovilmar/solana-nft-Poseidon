
'use client';

import { useAppContext } from '../AppContext';
import CollectionCardStatistic from './CollectionCardStatistic';

interface CollectionGridStatisticProps {
  totalPower: number;
}



export default function CollectionGridStatistic({ totalPower }: CollectionGridStatisticProps) {
  const { nfts } = useAppContext();


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
