"use client";
import { useState, useEffect } from "react";

interface Nft {
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

const formatador = new Intl.NumberFormat('pt-BR');

export default function VendaListNFTs({ nfts }: { nfts: Nft[] }) {
    const [selectedNft, setSelectedNft] = useState<Nft | null>(null);

    useEffect(() => {
        if (nfts && nfts.length > 0) {
            setSelectedNft(nfts[0]);
        } else {
            setSelectedNft(null);
        }
    }, [nfts]);

    if (!nfts || nfts.length === 0) {
        return (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <i className="ri-store-2-fill text-green-500 mr-2"></i>
                    Marketplace
                </h2>
                <p className="text-red-500">Nenhum NFT para exibir.</p>
            </div>
        );
    }

    if (!selectedNft) {
        return (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <i className="ri-store-2-fill text-green-500 mr-2"></i>
                    Marketplace
                </h2>
                <p className="text-red-500">Carregando NFTs...</p>
            </div>
        );
    }

    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
            <h2 className="text-2xl font-bold mb-2 flex items-center">
                <i className="ri-store-2-fill text-green-500 mr-2"></i>
                Marketplace
            </h2>

            <div className="mb-6">
                <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="relative">
                            <img alt={selectedNft.name}
                                className="w-full h-64 object-cover object-top"
                                src={selectedNft.image} 
                            />

                            <div className="absolute top-3 left-3">
                                <span className={`px-2 ${selectedNft.rarity === "Common"
                                    ? "bg-gray-100"
                                    : selectedNft.rarity === "Uncommon"
                                        ? "bg-green-100"
                                        : selectedNft.rarity === "Rare"
                                            ? "bg-blue-100"
                                            : selectedNft.rarity === "Epic"
                                                ? "bg-purple-100"
                                                : selectedNft.rarity === "Legendary"
                                                    ? "bg-orange-100"
                                                    : "bg-red-100"} py-1 rounded text-xs text-gray-600`}>
                                    {selectedNft.rarity}
                                </span>
                            </div>
                            <div className="absolute top-3 right-3 flex space-x-2">
                                <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                                    <i className="ri-flashlight-line text-yellow-400 text-sm"></i>
                                    <span className="text-white text-base font-medium">{formatador.format(selectedNft.totalPower)}</span>
                                </div>
                            </div>


                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-2">{selectedNft.name}</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Poder Original:</span>
                                    <span className="font-semibold text-gray-900">{formatador.format(selectedNft.originalPower)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Poder Atual:</span>
                                    <span className="font-semibold text-gray-900">{formatador.format(selectedNft.power)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`font-semibold ${selectedNft.forSale ? 'text-green-600' : 'text-red-600'}`}>{selectedNft.forSale ? 'À Venda' : 'Não Listado'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <button className="whitespace-nowrap cursor-pointer font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 px-4 py-2 text-sm w-full text-sm">
                            <i className="ri-add-line mr-2"></i>
                            {selectedNft.forSale ? 'Atualizar Anúncio' : 'Listar para Venda'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4 max-h-40 overflow-y-auto pr-2">
                {nfts.map((nft) => (
                    <div key={nft.id}
                        onClick={() => setSelectedNft(nft)}
                        className={`relative bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all transform hover:scale-105 ${selectedNft.id === nft.id ? 'ring-2 ring-purple-500' : ''}`}>
                        <img alt={nft.name} className="w-full h-16 object-cover object-top rounded-t-lg" src={nft.image} />
                        <div className="p-2">
                            <h4 className="font-semibold text-xs text-gray-900 truncate">#{nft.number}</h4>
                            <p className="text-xs text-gray-600 truncate">{nft.name.split(' ')[0]}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/5 rounded-lg p-2">
                    <div className="text-lg font-bold">{nfts.length}</div>
                    <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="bg-black/5 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-400">{nfts.filter(n => n.forSale).length}</div>
                    <div className="text-xs text-gray-500">À Venda</div>
                </div>
                <div className="bg-black/5 rounded-lg p-2">
                    <div className="text-lg font-bold text-gray-400">{nfts.filter(n => !n.forSale).length}</div>
                    <div className="text-xs text-gray-500">Não Listados</div>
                </div>
            </div>
        </div>
    );
}