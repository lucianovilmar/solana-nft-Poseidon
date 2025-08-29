'use client';
import React from 'react';
import diamond_gray from '../assets/diamond_gray.svg'
import diamond_green from '../assets/diamond_green.svg'
import diamond_blue from '../assets/diamond_blue.svg'
import diamond_purple from '../assets/diamond_purple.svg'
import diamond_orange from '../assets/diamond_orange.svg'
import diamond_red from '../assets/diamond_red.svg'
import listado from '../assets/listado_pretobranco.svg'

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
    buyPriceAdd?: number;
    priceFormatted: string;
    pricePower: number;
    powerBadge: number;
    rewardsClaimed: number;
    rewardsAvailable: number;
    trdBurned: number;
    burnedPower: number;
    originalPower: number;
}

interface CollectionCardProps {
    collection: CollectionStatistic;
}


function formatWallet(address: string) {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

const formatador = new Intl.NumberFormat('pt-BR');

export default function CollectionCardMin({ collection }: CollectionCardProps) {
    let numeroTemp: string;
    return (
        <div className="bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer overflow-hidden ">
            <div className="relative aspect-square" >
                <img
                    src={collection.image}
                    alt={collection.name}
                    className="flex object-cover object-top w-full h-full"
                />
                <div className="absolute top-2 left-2 bg-white/80 text-gray-900 font-bold px-3 py-1 rounded shadow text-sm pointer-events-none">
                    {collection.number}
                </div>
                {/* Verifica se o item está à venda para exibir a imagem de sobreposição */}
                {collection.forSale && (
                    <img
                        src={listado.src}
                        alt="NFT a venda"
                        className="absolute top-0 left-0 w-full h-full object-cover object-top opacity-50"
                    />
                )}
            </div>

            <div className="p-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                            {collection.name.replace(/poseidon/gi, '').trim()}
                        </h3>
                    </div>
                </div>
                <div className="flex flex-col items-center mb-2"> {/* Changed items-start to items-center here */}
                    <span className={`self-center mt-1 px-2 ${collection.rarity === "Common"
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
                    <div style={{ minHeight: 24 }} className="flex items-center gap-2 w-full justify-center">
                        {collection.badge && (
                            <i className="ri-verified-badge-fill text-blue-500 w-12 h-4 flex items-center justify-center">Badge</i>
                        )}
                    </div>
                </div>
                {/* Changed the classes on these three divs */}
                <div className="flex flex-col items-center mb-1 text-center text-xs">
                    <div>
                        <div className="text-gray-600 text-[8px] ">Total Power</div>
                        <div className="font-semibold text-gray-900">{formatador.format(collection.totalPower)}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center mb-1 text-center text-xs">
                    <div>
                        <div className="text-gray-600 text-[8px] ">Valor</div>
                        <div className="font-semibold text-gray-900">{formatador.format(collection.buyPriceAdd ?? 0)}</div>
                    </div>
                </div>
                {/* AQUI ESTÁ O NOVO BLOCO DE INFORMAÇÕES */}
                <div className="bg-gray-100 rounded-lg p-2 mt-2">
                    <h4 className="text-sm font-bold text-gray-800 text-center mb-2">Valor</h4>
                    <div className="flex flex-col justify-between items-center text-xs">
                        <div className="flex flex-col items-center">
                            <span className="text-gray-500">Original</span>
                            <span className="font-semibold text-gray-900">
                                {formatador.format((collection.buyPriceAdd ?? 0) / (collection.power / 1000))}
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-gray-500">Total</span>
                            <span className="font-semibold text-gray-900">
                                {formatador.format((collection.buyPriceAdd ?? 0) / (collection.totalPower / 1000))}
                            </span>
                        </div>
                    </div>
                </div>
                {/* FIM DO NOVO BLOCO */}
            </div>
        </div>
    );
}