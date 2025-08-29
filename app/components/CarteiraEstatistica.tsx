
'use client';

import { useAppContext, Nft } from '../AppContext';
import backGround from '../assets/carteira_statistic.svg'
import CollectionGridStatistic from './CollectionGridStatistic';
import CollectionCardMin from './CollectionCardMind';
import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import CarteiraGraficos from './CarteiraGraficos';
import { useWallet } from '@solana/wallet-adapter-react';
import { number } from 'framer-motion';
import { Ranking } from '../types/ranking';

export default function CarteiraEstatistica() {
  const { connected, publicKey } = useWallet();
  // 1. Obter o userProfile do AppContext, que contém a lista de carteiras global.
  const { userProfile, nfts, setNfts, totalPower, nftsMin, setNftsMin, addNftsMin } = useAppContext()
  const [valorPesq, setValorPesq] = useState('');
  const [valorPreco, setValorPreco] = useState('');
  const [rankNfts, setrankNfts] = useState<Ranking[]>([]);
  const [conditionGrafic, setConditionGrafic] = useState<'power' | 'nfts' | 'share'>('power');
  const [activeTab, setActiveTab] = useState<'add' | 'burn' | 'sell'>('add');
  const [nftsCounts, setNftsCounts] = useState<Counts>({
    mythic: 0,
    legendary: 0,
    epic: 0,
    rare: 0,
    uncommon: 0,
    common: 0,
    invested: 0,
  });


  interface WalletSoma {
    wallet: string;
    soma: number;
  }

  interface Counts {
    mythic: number;
    legendary: number;
    epic: number;
    rare: number;
    uncommon: number;
    common: number;
    invested: number;
  }

  interface NftMin {
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



  useEffect(() => {
    montaGrafico();
  }, []);

  // 2. Este useEffect agora reage a mudanças na lista de carteiras global (userProfile.wallets)
  useEffect(() => {
    const getNFTs = async () => {
      try {
        // Usa a lista de carteiras do userProfile
        const walletList = userProfile.wallets;

        // Se a lista de carteiras estiver vazia, limpa os NFTs e para a execução.
        if (walletList.length === 0) {
          setNfts([]);
          return;
        }

        // 3. A chamada da API agora usa a lista de carteiras do userProfile
        const resposta = await api.post(`/poseidons/wallets`, { addresses: walletList });

        const nftsFromApi = resposta.data;

        nftsCounts.common = 0;
        nftsCounts.uncommon = 0;
        nftsCounts.rare = 0;
        nftsCounts.epic = 0;
        nftsCounts.legendary = 0;
        nftsCounts.mythic = 0;
        nftsCounts.invested = 0;

        const nftsWithBadgePower = nftsFromApi.map((nft: Nft) => {
          if (nft.rarity === 'Common') {
            nftsCounts.common += 1;
          } else if (nft.rarity === 'Uncommon') {
            nftsCounts.uncommon += 1;
          } else if (nft.rarity === 'Rare') {
            nftsCounts.rare += 1;
          } else if (nft.rarity === 'Epic') {
            nftsCounts.epic += 1;
          } else if (nft.rarity === 'Legendary') {
            nftsCounts.legendary += 1;
          } else {
            nftsCounts.mythic += 1;
          }
          nftsCounts.invested += nft.buyPrice || 0;
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
        setNfts(nftsWithBadgePower);
      } catch (erro) {
        console.error('Erro ao buscar NFTs', erro);
      }
    };

    getNFTs();
  }, [userProfile.wallets, setNfts]); // A dependência agora é a lista global


  function getSomaByWallet(walletNumber: string): number {
    return nfts
      .filter((nft: Nft) => nft.wallet === walletNumber)
      .reduce((acc, nft) => acc + (nft.totalPower || 0), 0);
  }

  function getSomaByWalletList(walletNumber: string): number {
    return nfts
      .filter((nft: Nft) => nft.wallet === walletNumber && !nft.forSale)
      .reduce((acc, nft) => acc + (nft.totalPower || 0), 0);
  }

  const setMinPrice = (nftNumber: string, newPrice: string) => {
    const priceValue = parseFloat(newPrice);

    if (isNaN(priceValue) || priceValue <= 0) {
      console.error('Valor inválido para o preço:', newPrice);
      return;
    }

    // Atualiza sobre a lista global nftsMin
    const updatedNfts = nftsMin.map(nft =>
      nft.number === nftNumber
        ? { ...nft, buyPrice: priceValue }
        : nft
    );

    console.log('NFTs atualizados:', updatedNfts);
    console.log('novo preco:', priceValue);

    // Aqui substitui a lista no estado global
    addNftsMin(updatedNfts);
  };

  const formatador = new Intl.NumberFormat('pt-BR');

  async function pesquisaNumero() {
    try {
      if (!valorPesq.trim() || Number(valorPesq) === 0) {
        alert('Por favor, insira um número de raridade válido.');
        return;
      }
      if (!valorPreco.trim()) {
        alert('Por favor, insira um valor para o preço.');
        return;
      }

      const url = `/poseidons/number/${valorPesq}`;
      const resposta2 = await api.get(url);
      const nftFromApiMin = resposta2.data;

      const priceValue = parseFloat(valorPreco);

      // Se o NFT já existir em nftsMin, atualiza o preço
      const exists = nftsMin.some(nft => nft.number === valorPesq);

      if (!exists) {
        addNftsMin([
          ...nftsMin,
          {
            ...nftFromApiMin,
            buyPriceAdd: priceValue   // ✅ aqui adiciona o buyPriceAdd
          }
        ]);
      } else {
        // Atualiza o preço do existente
        const updatedNfts = nftsMin.map(nft =>
          nft.number === valorPesq
            ? { ...nft, buyPriceAdd: priceValue } // ✅ atualiza apenas o buyPriceAdd
            : nft
        );
        addNftsMin(updatedNfts);
      }

      console.log('Valor pesquisado:', valorPesq);
      console.log('Valor do preço:', valorPreco);

      setValorPesq('');
      setValorPreco('');

    } catch (erro) {
      console.error('Erro ao buscar NFTs', erro);
    }
  }

  async function montaGrafico() {
    try {
      const url = "/poseidons/ranking";
      const resposta3 = await api.get(url)
      // A API provavelmente já retorna um array, então usamos diretamente.
      setrankNfts(resposta3.data);

    } catch (erro) {
      console.error('Erro ao buscar ranking', erro);
    }
  };

  function formatWallet(address: string) {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  const userWalletAddress = publicKey ? publicKey.toBase58() : undefined;

  const eficienciaPower = useMemo(() => {
    if (!userWalletAddress || rankNfts.length === 0) return 0;
    const me = rankNfts.find(r => r.wallet === userWalletAddress);
    return me?.powerShare ?? 0; // número (ex.: 12.34)
  }, [rankNfts, userWalletAddress]);

  return (

    <div className="min-h-screen bg-gray-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 py-16">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url("${backGround.src}")`
          }}
        >
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Coleção de NFTs</h1>
          <p className="text-xl text-gray-200 mb-8">Gerencie e explore sua coleção de NFTs Poseidon</p>
        </div>
      </section>
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8 mb-12">
          <div className="flex-1 space-y-6">

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Estatísticas da Coleção</h2>
            <div className="bg-white rounded-2xl shadow-lg block h-[460px] overflow-y-auto">
              <div className=" p-2">
                {/* Passando os dados do ranking e a carteira do usuário para o componente do gráfico */}
                <CarteiraGraficos data={rankNfts} userWallet={userWalletAddress} condition={conditionGrafic} />
              </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Poder vs Coleção Total</h4>
                <div className="relative flex items-center justify-center h-32">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3"></path>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradient1)" strokeWidth="3" strokeDasharray="60.75000000000001, 100" strokeLinecap="round"></path>
                      <defs><linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6"></stop><stop offset="100%" stopColor="#06b6d4"></stop></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-800">60.8%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">572.900 / 33.120.000 poder total</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-white rounded-2xl shadow-lg p-2">
                  {/* Total Power Section */}
                  <div className="flex items-center gap-4 mb-4"> {/* Changed justify-between to gap-4 */}
                    <button
                      onClick={() => setConditionGrafic('power')}
                      className="w-9 h-9 ml-2 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center"
                    >
                      <i className="ri-flashlight-fill text-white text-xl"></i>
                    </button>
                    <div className="rounded-2xl p-2">
                      <h3 className="text-sm font-bold text-gray-800">
                        {formatador.format(totalPower)}
                      </h3>
                      <p className="text-sm text-gray-600">Poder Total</p>
                    </div>
                  </div>

                  {/* Valor Investido Section */}
                  <div className="flex items-center gap-4 mb-4"> {/* Changed justify-between to gap-4 */}
                    <button
                      onClick={() => setConditionGrafic('share')}
                      className="w-9 h-9 ml-2 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center"
                    >
                      <i className="ri-coin-line text-white text-xl"></i>
                    </button>
                    <div className="rounded-2xl p-2">
                      <h3 className="text-sm font-bold text-gray-800">
                        {nftsCounts.invested.toFixed(2)} SOL
                      </h3>
                      <p className="text-sm text-gray-600">Valor Investido</p>
                    </div>
                  </div>

                  {/* Eficiência Section */}
                  <div className="flex items-center gap-4 mb-4"> {/* Changed justify-between to gap-4 */}
                    <button
                      onClick={() => setConditionGrafic('share')}
                      className="w-9 h-9 ml-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center"
                    >
                      <i className="ri-percent-line text-white text-xl"></i>
                    </button>
                    <div className="rounded-2xl p-2">
                      <h3 className="text-sm font-bold text-gray-800">{eficienciaPower.toFixed(2)}</h3>
                      <p className="text-sm text-gray-600">Eficiência</p>
                    </div>
                  </div>
                </div>


                <div className="bg-white rounded-2xl shadow-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setConditionGrafic('nfts')}
                      className="w-9 h-9 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center"
                    >
                      <i className="ri-trophy-line text-white text-xl"></i>
                    </button>
                    <div className="rounded-2xl p-2">
                      <h3 className="text-sm font-bold text-gray-800">
                        {nfts.length.toLocaleString()}
                      </h3>
                      <p className="text-sm text-gray-600">NFTs na Coleção</p>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 mb-4">Raridades</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-100"></div>
                        <span className="text-sm text-gray-700">Mítico</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-purple-100"></div></div>
                        <span className="text-sm font-semibold text-gray-800 w-8">{nftsCounts.mythic}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-orange-100"></div>
                        <span className="text-sm text-gray-700">Lendário</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-10 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-orange-100"></div></div>
                        <span className="text-sm font-semibold text-gray-800 w-8">{nftsCounts.legendary}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-100"></div>
                        <span className="text-sm text-gray-700">Épico</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-purple-100"></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 w-8">{nftsCounts.epic}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                        <span className="text-sm text-gray-700">Raro</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-blue-100"></div></div>
                        <span className="text-sm font-semibold text-gray-800 w-8">{nftsCounts.rare}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-100"></div>
                        <span className="text-sm text-gray-700">Uncommon</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-green-100">
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-800 w-8">{nftsCounts.uncommon}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                        <span className="text-sm text-gray-700">Comum</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full bg-gray-100"></div></div>
                        <span className="text-sm font-semibold text-gray-800 w-8">{nftsCounts.common}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="w-96 bg-white rounded-2xl shadow-lg p-6">
            {/* Abas de navegação */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
              <button
                onClick={() => setActiveTab('add')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'add'
                  ? 'bg-white text-purple-600 shadow'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Simulador Add
              </button>
              <button
                onClick={() => setActiveTab('burn')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'burn'
                  ? 'bg-white text-red-600 shadow'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Simulador Queima
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'sell'
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Sell
              </button>
            </div>

            {/* Conteúdo das Abas */}
            {activeTab === 'add' && (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">

                  <div className="mb-6 grid grid-cols-3 gap-3">
                    <div className="flex flex-col w-full">
                      <label className="text-gray-700 mt-2 mb-1">Nº raridade</label>
                      <input
                        type="text"
                        value={valorPesq}
                        onChange={(e) => setValorPesq(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label className="text-gray-700 mt-2 mb-1">Valor</label>
                      <input
                        type="text"
                        value={valorPreco}
                        onChange={(e) => setValorPreco(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="flex flex-col justify-end w-full">
                      <button
                        onClick={pesquisaNumero}
                        disabled={!valorPesq.trim() || !valorPreco.trim()}
                        className={`w-full px-4 py-3 text-white rounded-lg transition-colors whitespace-nowrap font-medium 
                ${!valorPesq.trim() || !valorPreco.trim()
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
                          }`}
                      >
                        Pesquisa
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[400px] overflow-y-auto">
                  {nftsMin.map((collection) => (
                    <div key={collection.number} className="h-[250px] mb-2">
                      <CollectionCardMin key={collection.number} collection={collection} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'burn' && (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Simulador de Queima</h3>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                  SOON
                </span>
                <p className="text-gray-600 text-sm">
                  Aqui você pode simular o impacto de queimar NFTs e TRD (exemplo: aumento de power, TRD gasto etc.).
                </p>
                {/* 👉 futuramente você coloca inputs e lógica da queima aqui */}
              </div>
            )}

            {activeTab === 'sell' && (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Sell</h3>
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800">
                  SOON
                </span>
                <p className="text-gray-600 text-sm">
                  Aqui vai a simulação de venda ou listagem do NFT.
                </p>
                {/* 👉 futuramente você coloca inputs e lógica de venda aqui */}
              </div>
            )}
          </div>




        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Coleção Completa</h2>

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


            <div className="flex items-center space-x-4">
              <div className="relative">
                <select className="p-3 pr-8 bg-gray-100 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"

                >
                  <option value="Todas">Todas as Carteiras ({userProfile.wallets.length})</option>
                  {userProfile.wallets.map((wallet) => (
                    <option key={wallet} value={wallet}>
                      {formatWallet(wallet)}
                    </option>
                  ))}
                </select>
              </div>
              <select className="p-3 pr-8 bg-gray-100 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none">
                <option value="poder">Maior Poder</option>
                <option value="raridade">Raridade</option>
                <option value="numero">Número</option>
                <option value="valor">Maior Valor</option>
                <option value="tempo">Tempo de Aquisição</option>
              </select>
            </div>
          </div>
          <div >
            <CollectionGridStatistic totalPower={totalPower} />
          </div>
        </div>
      </div>
    </div>
  );
}