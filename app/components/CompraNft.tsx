'use client';
import { useAppContext } from '../AppContext';
import { useState, useEffect } from 'react';
import api from '../services/api';
import badge_image from '../assets/badge_image.svg';
import diamond_gray from '../assets/diamond_gray.svg'
import diamond_green from '../assets/diamond_green.svg'
import diamond_blue from '../assets/diamond_blue.svg'
import diamond_purple from '../assets/diamond_purple.svg'
import diamond_orange from '../assets/diamond_orange.svg'
import diamond_red from '../assets/diamond_red.svg'

const formatador = new Intl.NumberFormat('pt-BR');

interface Nft {
    id: string;
    name: string;
    image: string;
    rarity: string;
    number: string;
    power: number;
    rewardsAvailable: number;
    priceFormatted: string;
    buyPrice: number;
    burnedPower: number;
    badge: boolean;
    totalPower: number;
}

// Este componente é apenas um exemplo de como sua página LojaTemp pode ser.
// Ele foi corrigido para resolver problemas de sintaxe no JSX.
export default function CompraNFT() {
    const getRarityStyles = (rarity: string) => {
        switch (rarity) {
            case 'Common':
                return 'text-gray-600 bg-gray-100';
            case 'Uncommon':
                return 'text-green-600 bg-green-100';
            case 'Rare':
                return 'text-blue-600 bg-blue-100';
            case 'Epic':
                return 'text-purple-600 bg-purple-100';
            case 'Legendary':
                return 'text-yellow-600 bg-yellow-100';
            default:
                return 'text-red-600 bg-red-100'; // Mythic e outros
        }
    };






    console.log('Renderizando CompraNFT');
    const { nfts, setNfts } = useAppContext();
    const [bidValues, setBidValues] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {


        const walletList = "EtPdv1aSMgidVnaxkHhBNHGszXHLe3Z6nG2wpWMMdLDD";

        console.log('Buscando NFTs para as carteiras:', walletList);

        const getMarketplaceNFTs = async () => {
            setIsLoading(true);
            setError(null);
            try {

                if (walletList.length === 0) {
                    setNfts([]);
                    return;
                }

                // Endpoint para buscar todos os NFTs à venda no marketplace
                const resposta = await api.post(`/poseidons/wallets`, { addresses: [walletList] });
                const nftsFromApi = resposta.data;
                console.log('NFTs do marketplace:', nftsFromApi);
                // A lógica de processamento pode ser mantida se for relevante para a loja
                const nftsForSale = nftsFromApi.map((nft: Nft) => {
                    const originalPowerValue = (nft.power || 0) - (nft.burnedPower || 0);
                    const powerBadgeValue = nft.badge ? originalPowerValue * 3 : originalPowerValue;
                    const pricePowerValue = nft.buyPrice && powerBadgeValue ? nft.buyPrice / (powerBadgeValue / 1000) : 0;
                    return {
                        ...nft,
                        powerBadge: powerBadgeValue,
                        pricePower: pricePowerValue,
                        originalPower: originalPowerValue,
                    };
                });

                setNfts(nftsForSale);
            } catch (err: any) {
                console.error('Erro ao buscar NFTs do marketplace', err);
                if (err.response && err.response.status === 400) {
                    setError('Erro na requisição: os dados enviados são inválidos. Verifique o formato da carteira.');
                } else {
                    setError('Não foi possível carregar os NFTs. Tente novamente mais tarde.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        getMarketplaceNFTs();
    }, []); // O array de dependências pode ser [], já que setNfts é estável.

    if (isLoading) {
        return <div className="text-center text-white p-10 text-xl">Carregando NFTs...</div>;
    }

    if (error) {
        return <div className="text-center text-red-400 p-10 text-xl">{error}</div>;
    }


    return (



        <div className="mt-8">
            <div className="bg-black/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <i className="ri-shopping-cart-line text-blue-500 mr-2"></i>
                    Loja de NFTs</h2>
                <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <i className="ri-filter-3-line mr-2"></i>
                        Filtros
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Preço:
                            </label>
                            <div className="relative ">
                                <button type="button" className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                                    <span className="block truncate">Todos os Preços</span>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <i className="ri-arrow-down-s-line text-gray-400"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">Raridade:</label>
                            <div className="relative ">
                                <button type="button" className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                                    <span className="block truncate">Todas as Raridades</span>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <i className="ri-arrow-down-s-line text-gray-400"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">Recompensas:</label>
                            <div className="relative ">
                                <button type="button" className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                                    <span className="block truncate">Todas as Recompensas</span>
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <i className="ri-arrow-down-s-line text-gray-400"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-300">Exibindo {nfts.length} de {nfts.length} NFTs</div>
                        <button className="whitespace-nowrap cursor-pointer font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 px-3 py-1.5 text-sm ">
                            <i className="ri-refresh-line mr-2"></i>
                            Limpar Filtros
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {nfts && nfts.length > 0 ? (
                        nfts.map((nft) => (
                            <div key={nft.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="relative">
                                    <img alt={nft.name} className="w-full h-64 object-cover object-top" src={nft.image} />
                                    <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${getRarityStyles(nft.rarity)}`}>{nft.rarity}</div>
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        <div className="bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                                            <i className="ri-flashlight-line text-yellow-400 text-sm"></i>
                                            <span className="text-white text-base font-medium">{formatador.format(nft.totalPower)}</span>
                                        </div>
                                    </div>
                                    {/* Adiciona a imagem do badge sobre a imagem principal se nft.badge for true */}
                                    {nft.badge && (
                                        <img
                                            src={badge_image.src}
                                            alt="Badge"
                                            className="absolute w-10 h-10 bottom-3 right-3 transition-colors"
                                        />
                                    )}
                                </div>


                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">{nft.name}</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1 text-center mb-1 text-xs">
                                            <div className='flex items-center justify-center w-full  '>
                                                <img src={nft.rarity === "Common"
                                                    ? diamond_gray.src
                                                    : nft.rarity === "Uncommon"
                                                        ? diamond_green.src
                                                        : nft.rarity === "Rare"
                                                            ? diamond_blue.src
                                                            : nft.rarity === "Epic"
                                                                ? diamond_purple.src
                                                                : nft.rarity === "Legendary"
                                                                    ? diamond_orange.src
                                                                    : diamond_red.src} className="fex h-12" />
                                            </div>
                                            <div className="grid grid-cols-1 gap-1 text-center mb-2 text-xs">
                                                <div className="text-gray-600">numero</div>
                                                <div className="font-semibold text-gray-900 text-sm">{nft.number}</div>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="grid grid-cols-2 gap-4 text-center mb-2 text-xs">
                                        <div>
                                            <div className="text-gray-600">Original Power</div>
                                            <div className="font-semibold text-gray-900">{formatador.format(nft.power - nft.burnedPower)}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-600">Badge 3x</div>
                                            <div className="font-semibold text-gray-900">{formatador.format(nft.powerBadge)}</div>
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
                                                            <span className="text-xs font-bold text-green-600">{nft.rewardsClaimed}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Available:</span>
                                                            <span className="text-xs font-bold text-blue-600">{nft.rewardsAvailable}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-center">
                                                    <div className="text-xs font-semibold text-gray-600 mb-1">Power Update</div>
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Burned:</span>
                                                            {nft.trdBurned === 0 || String(nft.trdBurned) === '' ? (
                                                                <span className="text-xs font-bold text-gray-900">0 TRD</span>
                                                            ) : (
                                                                <span className="text-xs font-bold text-orange-600">{nft.trdBurned} TRD</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Total:</span>
                                                            {nft.burnedPower <= 0 ? (
                                                                <span className="text-xs font-bold text-gray-900">
                                                                    <span className="relative z-10">0</span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs font-bold text-red-600 animate-pulse bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text  shadow-lg relative">
                                                                    <span className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded blur-sm animate-pulse"></span>
                                                                    <span className="relative z-10">{nft.burnedPower}</span>
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




                                    <div className="space-y-1 mb-3 text-sm">

                                        <div className="flex justify-between items-center pt-1 border-t border-gray-200">
                                            <span className="font-bold text-gray-900">Preço:</span>
                                            <span className="text-lg font-bold text-purple-600">{nft.priceFormatted}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3"><div className="flex gap-2">
                                        <div className="w-full">
                                            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent  flex-1 text-black text-sm" placeholder="Lance" min="0" step="0.1" type="number"
                                                value={bidValues[nft.id] || ''}
                                                onChange={(e) => setBidValues(prev => ({ ...prev, [nft.id]: e.target.value }))}
                                            />
                                        </div>
                                        <button className="whitespace-nowrap cursor-pointer font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 px-3 py-1.5 text-sm px-3" disabled>
                                            <i className="ri-auction-line mr-1"></i>
                                            Bid
                                        </button>
                                    </div>
                                    </div>
                                    <button className="whitespace-nowrap cursor-pointer font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 px-3 py-1.5 text-sm w-full">
                                        <i className="ri-shopping-cart-line mr-2"></i>
                                        Comprar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-white">Nenhum NFT encontrado no mercado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}