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

interface CollectionStatistic {
  id: string;
  name: string;
  image: string;
  wallet: string;
  number: string;
  mint: string;
  badge: boolean;
  power: number;
  rarity: string;
  totalPower: number;
  forSale: boolean;
  buyPrice: number;
  priceFormatted: string;
  pricePower: number;  
  powerBadge: string;
}

interface CollectionCardProps {
  collection: CollectionStatistic;
}


function formatWallet(address: string) {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

const formatador = new Intl.NumberFormat('pt-BR');
//bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer overflow-hidden
export default function CollectionCard({ collection }: CollectionCardProps) {
  let numeroTemp: string;
  return (
    <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative aspect-square" >
        <img
          src={collection.image}
          alt={collection.name}
          className="flex object-cover object-top w-full h-full"
        />
        {/* Adiciona a imagem do badge sobre a imagem principal se collection.badge for true */}
        {collection.badge && (
          <img
            src={badge_image.src}
            alt="Badge"
            className="absolute top-2 right-2 w-10 h-10"
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
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {collection.badge && (
              <i className="ri-verified-badge-fill text-blue-500 w-12 h-4 flex items-center justify-center">Badge</i>
            )}
          </div>
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

        <div className="grid grid-cols-2 gap-4 text-center mb-4 text-xs">
          <div>
            <div className="text-gray-600">Power</div>
            <div className="font-semibold text-gray-900">{formatador.format(collection.power)}</div>
          </div>
          <div>
            <div className="text-gray-600">Total Power</div>
            <div className="font-semibold text-gray-900">{formatador.format(collection.totalPower)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 text-center mb-1 text-xs">
          <div className='grid grid-cols-1 gap-1 text-center mb-2 text-xs'>
            <div className="text-gray-600">Valor de compra</div>
            <div className="font-semibold text-gray-900 text-sm">{collection.buyPrice}</div>

          </div>
          <div className="grid grid-cols-1 gap-1 text-center mb-2 text-xs">
            <div className="text-gray-600">Valor por Power</div>
            <div className="font-semibold text-gray-900 text-sm">
              {collection.pricePower && collection.pricePower.toString().includes('.')
                ? collection.pricePower.toString().slice(0, collection.pricePower.toString().indexOf('.') + 9)
                : collection.pricePower}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600 mb-1">
                  Rewards
                </div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Claimed:</span>
                    <span className="text-xs font-bold text-green-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Available:</span>
                    <span className="text-xs font-bold text-blue-600">7</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-xs font-semibold text-gray-600 mb-1">Power</div>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Burned:</span>
                    <span className="text-xs font-bold text-orange-600">985 TRD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Total:</span>
                    <span className="text-xs font-bold text-red-600 animate-pulse bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text  shadow-lg relative">
                      <span className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded blur-sm animate-pulse"></span>
                      <span className="relative z-10">9.850</span>
                      <div className="absolute -top-1 -right-2 w-4 h-4 flex items-center justify-center">
                        <i className="ri-fire-fill text-red-500 text-sm animate-bounce"></i>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Carteira Principal</span>
          <span>{formatWallet(collection.wallet)}</span>
        </div>
      </div>
    </div>
  );
}