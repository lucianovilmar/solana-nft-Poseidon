
'use client';

import { useAppContext } from '../AppContext';
import CollectionCardStatistic from './CollectionCardStatistic';

interface CollectionGridStatisticProps {
  totalPower: number;
}

export default function CollectionGridStatistic({ totalPower }: CollectionGridStatisticProps) {
  const { nfts } = useAppContext();
  const formatador = new Intl.NumberFormat('pt-BR');

  return (
    <div>
      {/* Header com opções de visualização */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
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


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nfts.map((collection) => (
          <CollectionCardStatistic key={collection.number} collection={collection} />
        ))}
      </div>

    </div>
  );
}
