'use client';
import React from 'react';
import diamond_gray from '../assets/diamond_gray.svg'
import diamond_green from '../assets/diamond_green.svg'
import diamond_blue from '../assets/diamond_blue.svg'
import diamond_purple from '../assets/diamond_purple.svg'
import diamond_orange from '../assets/diamond_orange.svg'
import diamond_red from '../assets/diamond_red.svg'
import listado from '../assets/listado_pretobranco.svg'
import badge_image from '../assets/badge_image.svg';

interface Collection {
  id: string;
  name: string;
  image: string;
  wallet: string;
  number: string;
  mint: string;
  badge: boolean;
  burned: boolean;
  power: number;
  rarity: string;
  totalPower: number;
  forSale: boolean;
  buyPrice: number;
  priceFormatted: string;
  pricePower: number;
  powerBadge: number;
  rewardsClaimed: number;
  rewardsAvailable: number;
  trdBurned: number;
  nftBurned: number;
  burnedPower: number;
  originalPower: number;
  poseidonBurned: number;
}

interface CollectionCardProps {
  collection: Collection;
  viewMode: string;
  onRemove: (id: string) => void;
}

const formatador = new Intl.NumberFormat('pt-BR');
const formatadorDecimal = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function CollectionCard({ collection, viewMode, onRemove }: CollectionCardProps) {
  let numeroTemp: string;
  if (viewMode !== 'remove') {
       numeroTemp = "0";
  } else {
       numeroTemp = collection.number;
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-center p-4 gap-4">
          <div className="flex-shrink-0">
            <img
              src={collection.image}
              alt={collection.name}
              className="w-16 h-16 rounded-lg object-cover object-top"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{collection.name}</h3>
              {collection.badge && (
                <i className="ri-verified-badge-fill text-blue-500 w-4 h-4 flex items-center justify-center"></i>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">{collection.rarity}</span>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="text-lg font-bold text-gray-900">{collection.power}</div>
            <div className="text-xs text-gray-600">Power</div>
          </div>

          <div className="flex-shrink-0 text-right">
            <div className="text-lg font-bold text-gray-900">{collection.totalPower}</div>
            <div className="text-xs text-gray-600">Total Power</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative aspect-square"
        onClick={() => onRemove(numeroTemp)}
        >
        <img
          src={collection.image}
          alt={collection.name}
          className="flex object-cover object-top w-full h-full"
        />
        {/* Verifica se o item está à venda para exibir a imagem de sobreposição */}
        {collection.forSale && (
          <img
            src={listado.src}
            alt="NFT a venda"
            className="absolute top-0 left-0 w-full h-full object-cover object-top opacity-50"
          />
        )}        
        <div className="absolute top-3 left-3">
          <span className={`px-2 ${collection.rarity === "Common"
            ? "bg-gray-100"
            : collection.rarity === "Uncommon"
              ? "bg-green-100"
              : collection.rarity === "Rare"
                ? "bg-blue-100"
                : collection.rarity === "Epic"
                  ? "bg-purple-100"
                  : collection.rarity === "Legendary"
                    ? "bg-orange-100"
                    : "bg-red-100"} py-1 rounded text-xs text-gray-600`}>
            {collection.rarity}
          </span>
        </div>




        <div className="absolute top-3 right-3 flex space-x-2">
          <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <i className="ri-flashlight-line text-yellow-400 text-sm"></i>
            <span className="text-white text-base font-medium">{formatador.format(collection.totalPower)}</span>
          </div>
        </div>

        {/* Adiciona a imagem do badge sobre a imagem principal se collection.badge for true */}
        {collection.badge && (
          <img
            src={badge_image.src}
            alt="Badge"
            className="absolute w-10 h-10 bottom-3 right-3 transition-colors"
          />
        )}
        {/* Verifica se o item está à venda para exibir a imagem de sobreposição */}
        {collection.forSale && (
          <img
            src={listado.src}
            alt="NFT a venda"
            className="absolute top-0 left-0 w-full h-full object-cover object-top opacity-50"
          />
        )}
      </div>



      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{collection.name}</h3>
          </div>
          <div className="grid grid-cols-2 gap-1 text-center mb-1 text-xs">
            <div className='flex items-center justify-center w-full  '>
              <img src={collection.rarity === "Common"
                ? diamond_gray.src
                : collection.rarity === "Uncommon"
                  ? diamond_green.src
                  : collection.rarity === "Rare"
                    ? diamond_blue.src
                    : collection.rarity === "Epic"
                      ? diamond_purple.src
                      : collection.rarity === "Legendary"
                        ? diamond_orange.src
                        : diamond_red.src} className="fex h-12" />
            </div>
            <div className="grid grid-cols-1 gap-1 text-center mb-2 text-xs">
              <div className="text-gray-600">numero</div>
              <div className="font-semibold text-gray-900 text-sm">{collection.number}</div>
            </div>
          </div>

        </div>


        <div className="grid grid-cols-2 gap-4 text-center mb-2 text-xs">
          <div>
            <div className="text-gray-600">Original Power</div>
            <div className="font-semibold text-gray-900">{formatador.format(collection.power - collection.burnedPower)}</div>
          </div>
        {collection.badge && (            
          <div>
            <div className="text-gray-600">Badge 3x</div>
            <div className="font-semibold text-gray-900">{formatador.format(collection.powerBadge)}</div>
          </div>
        )}          
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
          <div className="grid ">
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600 mb-1">
                  Power Update
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600 mb-1"></div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Total:</span>
                    {collection.burnedPower <= 0 ? (
                      <span className="text-xs font-bold text-gray-900">
                        <span className="relative z-10">0</span>
                      </span>
                    ) : (
                    <span className="text-xs font-bold text-red-600 animate-pulse bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text  shadow-lg relative">
                      <span className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded blur-sm animate-pulse"></span>
                      <span className="relative z-10">{formatador.format(collection.burnedPower)}</span>
                      <div className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center">
                        <i className="ri-fire-fill text-red-500 text-sm animate-bounce"></i>
                      </div>
                    </span>                      
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
          <div className="grid gap-3">
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600 mb-1">
                  Rewards
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Available:</span>
                    <span className="text-xs font-bold text-blue-600">{formatadorDecimal.format(collection.rewardsAvailable || 0)} TRD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 

                <div className="grid gap-4 text-center mb-2 text-xs">
                  <div>
                    <span className="text-xs text-gray-500">Poseidon Burned:</span>
                    <span className={`text-xs font-bold ${collection.poseidonBurned > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                      {(collection.poseidonBurned || 0)}
                    </span>
                  </div>
                </div>


      </div>
    </div>

  );
}