
'use client';

import { useState, useEffect } from 'react';
import { useAppContext, Nft } from '../AppContext';
import api from '../services/api'


export default function SearchFilters() {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletList, setWalletList] = useState<string[]>([]);
  const { nfts, setNfts } = useAppContext()

  interface WalletSoma {
    wallet: string;
    soma: number;
  }

  useEffect(() => {
    if (walletList.length > 0) {
      getNFTs();
    } else {
      setNfts([]);
    }
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
    .filter((nft: Nft) => nft.wallet === walletNumber  && !nft.forSale)
    .reduce((acc, nft) => acc + (nft.totalPower || 0), 0);
 }

 const formatador = new Intl.NumberFormat('pt-BR');

  return (
    <div className="sticky top-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Busca por Carteira</h3>

        {/* Wallet Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Adicionar Endereço de Carteira
          </label>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}

              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <button
              onClick={addWallet}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
              Adicionar Carteira
            </button>
          </div>
        </div>

        {/* Wallet List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">
              Carteiras Rastreadas ({walletList.length})
            </label>
            {walletList.length > 0 && (
              <button
                onClick={() => setWalletList([])}
                className="text-xs text-red-500 hover:text-red-700 cursor-pointer font-medium"
              >
                Limpar Todas
              </button>
            )}
          </div>

          {walletList.length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <i className="ri-wallet-line w-8 h-8 flex items-center justify-center mx-auto mb-2 text-gray-400"></i>
              Nenhuma carteira adicionada
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {walletList.map((wallet, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-gray-900 truncate">
                      {wallet.slice(0, 8)}...{wallet.slice(-6)}
                    </p>


                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500 mt-1">Carteira {index + 1}</p>
                      <p className="text-xs font-semibold text-gray-700 mt-1">
                        <i className="ri-flashlight-fill w-4 h-4 inline-flex items-center justify-center mr-1 ml-2"></i>
                        {formatador.format(getSomaByWallet(wallet))} Power
                      </p>
                      
                    </div>


                  </div>
                  <button
                    onClick={() => removeWallet(wallet)}
                    className="ml-3 text-red-500 hover:text-red-700 cursor-pointer p-1" >
                    <i className="ri-close-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estatísticas */}
        {walletList.length > 0 && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <div className="text-center">
              <p className="text-lg font-bold text-purple-600">{walletList.length}</p>
              <p className="text-sm text-purple-700">Carteiras Monitoradas</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}