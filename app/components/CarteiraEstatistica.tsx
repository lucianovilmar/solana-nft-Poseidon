
'use client';

import { useAppContext, Nft } from '../AppContext';
import backGround from '../assets/carteira_statistic.svg'
import CollectionGridStatistic from './CollectionGridStatistic';
import CollectionCardMin from './CollectionCardMind';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function CarteiraEstatistica() {
  const { nfts, setNfts, totalPower } = useAppContext()
  const [valorPesq, setValorPesq] = useState('');
  const [valorPreco, setValorPreco] = useState('');

  const [walletAddress, setWalletAddress] = useState('');
  const [walletList, setWalletList] = useState<string[]>([]);
  const { nftsMin, setNftsMin, addNftsMin } = useAppContext()


  interface WalletSoma {
    wallet: string;
    soma: number;
  }

  useEffect(() => {
    if (
      walletAddress &&
      !walletList.includes(walletAddress)
    ) {
      setWalletList([...walletList, walletAddress]);
      setWalletAddress('');
    }
    if (walletList.length > 0) {
      getNFTs();
    } else if (nfts.length > 0) {
      setNfts([]);
    }

  }, [walletAddress]);

  useEffect(() => {
    setWalletAddress("EtPdv1aSMgidVnaxkHhBNHGszXHLe3Z6nG2wpWMMdLDD");
  }, [walletList]);

  const addWallet = () => {
    if (walletAddress.trim() && !walletList.includes(walletAddress.trim())) {
      setWalletList([...walletList, walletAddress.trim()]);
      setWalletAddress('');
    }
  };

  const removeWallet = (address: string) => {
    setWalletList(walletList.filter(wallet => wallet !== address));
  };

  const handleWalletKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addWallet();
    }
  };

  async function getNFTs() {
    try {
      if (walletList.length === 0) { return }
      const resposta = await api.post(`/poseidons/wallets`, { addresses: walletList })
      const nftsFromApi = resposta.data;
      setNfts(nftsFromApi);
      if (nftsFromApi.length === 0) {

      }
    } catch (erro) {
      console.error('Erro ao buscar NFTs', erro);
    }
  };


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

  const formatador = new Intl.NumberFormat('pt-BR');

  async function pesquisaNumero() {
    try {
      //valorPesq quando tiver mais de 4 digitos mint, de for menor numero
      if (!valorPesq || Number(valorPesq) === 0) { return }
      const url = `/poseidons/number/${valorPesq}`;
      const resposta2 = await api.get(url)
      const nftsFromApiMin = resposta2.data;
      const nftsMin = [nftsFromApiMin];
      setValorPesq('');

      addNftsMin(nftsMin);

    } catch (erro) {
      console.error('Erro ao buscar NFTs', erro);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-teal-900 via-cyan-800 to-blue-900 py-16">
        <div
          className="abSOLute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                    <i className="ri-lightning-line text-white text-xl"></i>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-600">Mestre das Águas</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{formatador.format(totalPower)}</h3>
                <p className="text-gray-600">Poder Total</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-coin-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">178.9 SOL</h3>
                <p className="text-gray-600">Valor Total Investido</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-percent-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">60.8%</h3>
                <p className="text-gray-600">Eficiência de Poder</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-trophy-line text-white text-xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{nfts.length.toLocaleString()}</h3>
                <p className="text-gray-600">NFTs na Coleção</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Poder vs Coleção Total</h4>
                <div className="relative">
                  <div className="flex items-center justify-center h-32">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3">
                        </path>
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gradient1)" strokeWidth="3" strokeDasharray="60.75000000000001, 100" strokeLinecap="round">
                        </path>
                        <defs>
                          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6"></stop>
                            <stop offset="100%" stopColor="#06b6d4"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="abSOLute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800">60.8%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">72.900 / 120.000 poder total</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Distribuição por Raridade</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-purple-100">
                      </div>
                      <span className="text-sm text-gray-700">Mítico</span>
                    </div>
                    <div className="flex items-center space-x-2"><div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-purple-100">
                      </div>
                    </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">1</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-100">
                      </div>
                      <span className="text-sm text-gray-700">Lendário</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-orange-100" >
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">2</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-100">
                      </div>
                      <span className="text-sm text-gray-700">Épico</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-100" >
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-100">
                      </div>
                      <span className="text-sm text-gray-700">Raro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-100" >
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">3</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-100">
                      </div>
                      <span className="text-sm text-gray-700">Comum</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-gray-100" >
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-8">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-96 bg-white rounded-2xl shadow-lg p-6">

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Simulador de Add</h3>

              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="flex flex-col w-full">
                  <label className="text-gray-700 mt-2 mb-1">
                    Nº raridade
                  </label>
                  <input
                    type="text"
                    value={valorPesq}
                    onChange={(e) => setValorPesq(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-gray-700 mt-2 mb-1">
                    Valor
                  </label>
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
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                  >
                    Pesquisa
                  </button>
                </div>
              </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[400px] overflow-y-auto">
              {nftsMin.map((collection) => (
                <div className="h-[250px] mb-2"> {/* altura fixa para cada card */}
                  <CollectionCardMin key={collection.number} collection={collection} />
                </div>
              ))}
            </div>



          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Coleção Completa</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors">
                  <i className="ri-wallet-3-line text-gray-600"></i>
                  <span>Carteiras (3)</span>
                  <i className="ri-arrow-down-s-line transition-transform "></i>
                </button>
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