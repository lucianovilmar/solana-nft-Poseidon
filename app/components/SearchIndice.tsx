
'use client';

import { useState, useEffect } from 'react';
import { useAppContext, Nft } from '../AppContext';
import api from '../services/api'


export default function SearchFilters() {
    const [valorPesq, setValorPesq] = useState('');
    const [valorMint, setValorMint] = useState('');    
//    const { nfts, setNfts } = useAppContext()
    const { nfts, addNfts } = useAppContext()

    //  useEffect(() => {
    //    pesquisaNumero();
    //  }, [valorPesq]);

    
    async function pesquisaNumero() {
        try {
            //valorPesq quando tiver mais de 4 digitos mint, de for menor numero
            if (!valorPesq || Number(valorPesq) === 0) { return }
            const url = `/poseidons/number/${valorPesq}`;
            const resposta2 = await api.get(url)
            const nftsFromApi = resposta2.data;
            const nfts = [nftsFromApi];
            addNfts(nfts);

        } catch (erro) {
            console.error('Erro ao buscar NFTs', erro);
        }
    };


    async function pesquisaMint() {
        try {
            //valorPesq quando tiver mais de 4 digitos mint, de for menor numero
            if (!valorMint || Number(valorMint) === 0) { return }
            const url = `/poseidons/mint/${valorMint}`;
            const resposta2 = await api.get(url)
            const nftsFromApi = resposta2.data;
            const nfts = [nftsFromApi];
            addNfts(nfts);

        } catch (erro) {
            console.error('Erro ao buscar NFTs', erro);
        }
    };    


    return (
        <div className="sticky top-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Busca por</h3>

                {/* Wallet Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Nº raridade
                    </label>
                    <div className="flex grid-cols-2 gap-3 mb-6">
                        <input
                            type="text"
                            value={valorPesq}
                            onChange={(e) => setValorPesq(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                        />
                        <button
                            onClick={pesquisaNumero}
                            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                        >
                            Pesquisa
                        </button>
                    </div>
                    <div className="flex flex-col gap-3 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Mint
                            </label>
                            <input
                                type="text"
                                value={valorMint}
                                onChange={(e) => setValorMint(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm mb-2"
                            />
                            <button
                                onClick={pesquisaMint}
                                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
                            >
                                Pesquisa
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}