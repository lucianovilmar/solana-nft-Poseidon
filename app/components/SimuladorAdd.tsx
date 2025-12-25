"use client";
import { useState } from "react";
import { useAppContext, NftQueima } from '../AppContext';
import api from '../services/api';


// O tipo que vem do AppContext (ajuste se necessário)
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

interface Bloco {
    id: number;
    selectedNftId: string | null;
    image: string | null;
    name: string | null;
    number: string | null;
    power: number | null;
    rarity: string | null;
    boost: number;
    badge?: boolean;
    poseidonBurned: number;
}

export default function GaleriaNFTs({ nfts }: { nfts: Nft[] }) {
    const { userProfile, setNfts, totalPower, nftsMin, setNftsMin, addNftsMin } = useAppContext()
    const [blocos, setBlocos] = useState<Bloco[]>([]);
    const [selectedNftId, setSelectedNftId] = useState<string | null>(null);
    const [activeBlockId, setActiveBlockId] = useState<number | null>(null);
    const [nextBlockId, setNextBlockId] = useState(1);
    const [receiverNftId, setReceiverNftId] = useState<string | null>(null);
    const [activeReceiverTab, setActiveReceiverTab] = useState<'total' | 'summary'>('total');
    const [valorPesq, setValorPesq] = useState('');
    const [valorPreco, setValorPreco] = useState('');




    const adicionarBloco = () => {
        const newBlock: Bloco = {
            id: nextBlockId,
            selectedNftId: null,
            image: null,
            name: null,
            number: null,
            power: null,
            rarity: null,
            boost: 0,
            poseidonBurned: 0,
        };
        setBlocos((prev) => [...prev, newBlock]);
        setNextBlockId((prev) => prev + 1);
        setActiveBlockId(newBlock.id);
        setSelectedNftId(null);
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nftId = e.target.value;
        setSelectedNftId(nftId);

        if (activeBlockId === null) return;

        // Handle selecting a valid NFT
        if (nftId) {

            const nft = nfts.find((n) => String(n.id) === String(nftId));

            if (!nft) return;

            setBlocos((prev) =>
                prev.map((bloco) =>
                    bloco.id === activeBlockId
                        ? {
                            ...bloco,
                            selectedNftId: nft.id,
                            image: nft.image,
                            name: nft.name,
                            number: nft.number,
                            power: nft.power,
                            rarity: nft.rarity,
                            boost: 0, // Reset boost on new NFT selection
                            badge: nft.badge,
                            poseidonBurned: nft.poseidonBurned,
                        }
                        : bloco
                )
            );
            console.log("NFT selecionado:", nft);
            console.log("Bloco ativo:", activeBlock);
            console.log("Blocos atuais:", blocos);
            console.log("ID do bloco ativo:", activeBlockId);
            console.log("ID do NFT selecionado:", nftId);
        } else {
            // Handle selecting the placeholder ("Selecione um NFT")
            setBlocos((prev) =>
                prev.map((bloco) =>
                    bloco.id === activeBlockId
                        ? {
                            ...bloco,
                            selectedNftId: null, image: null, name: null,
                            number: null, power: null, rarity: null, boost: 0,
                        }
                        : bloco
                )
            );
        }
    };

    const handleBlockClick = (bloco: Bloco) => {
        setActiveBlockId(bloco.id);
        setSelectedNftId(bloco.selectedNftId);
        console.log("Bloco clicado:", bloco);
    };

    const removerBloco = (idParaRemover: number) => {
        setBlocos((prev) => prev.filter((bloco) => bloco.id !== idParaRemover));
        // Se o bloco removido era o ativo, limpa a seleção
        if (activeBlockId === idParaRemover) {
            setActiveBlockId(null);
            setSelectedNftId(null);
        }
    };

    const handleBoostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeBlockId === null) return;

        const boostValue = parseInt(e.target.value, 10);
        const newBoost = !isNaN(boostValue) && boostValue >= 0 ? boostValue : 0;

        setBlocos((prev) =>
            prev.map((bloco) =>
                bloco.id === activeBlockId ? { ...bloco, boost: newBoost } : bloco
            )
        );
    };

    const handleReceiverSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const nftId = e.target.value;
        setReceiverNftId(nftId || null);
    };

    // IDs de NFTs usados nos blocos de queima
    const burnerNftsInUse = blocos
        .map((bloco) => bloco.selectedNftId)
        .filter((id): id is string => id !== null);

    const hasAnyBurnerNft = burnerNftsInUse.length > 0;

    // IDs indisponíveis para o seletor de QUEIMA (inclui outros blocos e o receptor)
    const selectedNftsIds = blocos
        .filter((bloco) => bloco.id !== activeBlockId) // Exclui o bloco ativo da filtragem
        .map((bloco) => bloco.selectedNftId)
        .filter((id): id is string => id !== null)
        .concat(receiverNftId ? [receiverNftId] : []);

    const activeBlock = blocos.find((b) => b.id === activeBlockId);
    const activeNft = activeBlock?.selectedNftId
        ? nfts.find((n) => n.id === activeBlock.selectedNftId)
        : null;

    const originalPower = activeBlock?.power ?? 0;
    const boostAmount = activeBlock?.boost ?? 0;
    const boostPower = boostAmount * 3;
    const totalPowerWithBoost = originalPower + boostPower;
    const transferPower = Math.floor(totalPowerWithBoost * 1);

    const totalTransferPower = blocos
        .filter((bloco) => bloco.selectedNftId)
        .reduce((total, bloco) => {
            const pwr = bloco.power ?? 0;
            const bst = bloco.boost ?? 0;
            // This calculation must match the one in the summary tab for consistency
            let transfer;
            if (bloco.poseidonBurned > 0) {
                transfer = Math.floor(pwr + (bst * 3));
            } else {
                if (bloco.badge) {
                    transfer = Math.floor((pwr + (bst * 3)) * 4);
                } else {
                    transfer = Math.floor((pwr + (bst * 3)) * 2);
                }
            }
            return total + transfer;
        }, 0);

    const receiverNft = receiverNftId
        ? nfts.find((n) => String(n.id) === String(receiverNftId))
        : null;
    const receiverOriginalPower = receiverNft?.power ?? 0;
    const receiverFinalPower = receiverOriginalPower + totalTransferPower;


    async function pesquisaNumero() {
        try {
            if (!valorPesq.trim() || Number(valorPesq) === 0 || Number(valorPesq) > 1273) {
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


            if (nftFromApiMin.number === undefined){
                addNftsMin([
                    ...nftsMin,
                    {
                        ...nftFromApiMin,
                        buyPriceAdd: priceValue
                    }
                ]);
            } else {
                adicionarBloco();
               

                const updatedNfts = nftsMin.map(nft =>
                    nft.number === valorPesq
                        ? { ...nft, buyPriceAdd: priceValue }
                        : nft
                );


    const nftId = nftFromApiMin.id; 



      if (!nftFromApiMin) return;

      setBlocos((prev) =>
        prev.map((bloco) =>
          bloco.id === blocos.length + 1
            ? {
              ...bloco,
              selectedNftId: nftFromApiMin.id,
              image: nftFromApiMin.image,
              name: nftFromApiMin.name,
              number: nftFromApiMin.number,
              power: nftFromApiMin.power,
              rarity: nftFromApiMin.rarity,
              boost: 0, // Reset boost on new NFT selection
              badge: nftFromApiMin.badge,
              poseidonBurned: nftFromApiMin.poseidonBurned,
            }
            : bloco
            
        )
      );
      console.log("NFT selecionado:", nftFromApiMin);
      console.log("Bloco ativo:", activeBlock);
      console.log("Blocos atuais:", blocos);
      console.log("ID do bloco ativo:", activeBlockId);
      console.log("ID do NFT selecionado:", nftId);

   










                

 //               addNftsMin(updatedNfts);
            }

            console.log('Valor pesquisado:', valorPesq);
            console.log('Valor do preço:', valorPreco);

            setValorPesq('');
            setValorPreco('');



            




        } catch (erro) {
            console.error('Erro ao buscar NFTs', erro);
        }
    }

    const formatador = new Intl.NumberFormat('pt-BR');

    return (
        <div>
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
                            onChange={(e) => {
                                const regex = /^[0-9]*\.?[0-9]*$/; // só números e ponto
                                if (regex.test(e.target.value)) {
                                    setValorPreco(e.target.value);
                                }
                            }}
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
                            Pesquisar
                        </button>
                    </div>
                </div>
            </div>



            <div className="p-1">
                {/* Cabeçalho */}


                {/* Renderizar blocos */}
                {blocos.length > 0 && (
                    <div className="mb-2">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                            {blocos.map((bloco) => {
                                const isActive = bloco.id === activeBlockId;

                                return (
                                    <div
                                        key={bloco.id}
                                        onClick={() => handleBlockClick(bloco)}
                                        className={`min-w-[100px] bg-red-50 border rounded-lg p-1 cursor-pointer transition-all  
                    ${isActive
                                                ? "border-red-600 bg-red-200 shadow-md"
                                                : "border-red-500 bg-red-100"
                                            }`}
                                    >
                                        {bloco.selectedNftId ? (
                                            <div className="text-center">
                                                <div className="relative mx-auto mb-1 w-16 h-16">
                                                    <img
                                                        src={bloco.image || ""}
                                                        alt={bloco.name || ""}
                                                        className="w-full h-full rounded-md object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-red-500/20 rounded-md flex items-center justify-center">
                                                        <i className="ri-fire-fill text-red-500 text-lg animate-pulse"></i>
                                                    </div>
                                                    <p className="absolute bottom-0 left-0 right-0 rounded-b-md bg-black bg-opacity-50 py-0.5 text-center text-xs font-semibold text-white">
                                                        #{bloco.number}
                                                    </p>
                                                    <p className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-md rounded-tr-md">
                                                        ⚡{bloco.power}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Impede que handleBlockClick seja acionado
                                                        removerBloco(bloco.id);
                                                    }}
                                                    className="mt-1 text-red-500 hover:text-red-700 text-xs"
                                                    aria-label={`Remover bloco ${bloco.id}`}
                                                >
                                                    <i className="ri-close-line"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <i className="ri-add-line text-2xl mb-2"></i>
                                                <p className="text-xs">Vazio</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Seletor */}
                {blocos.length > 0 && (
                    <div className="mb-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <label className="text-sm font-medium text-gray-700 flex-shrink-0">
                                Selecionar NFT
                            </label>
                        </div>

                        {/* Detalhes do NFT selecionado no bloco ativo */}
                        {hasAnyBurnerNft && (
                            <>
                                {activeBlock && activeNft ? (
                                    <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="relative">
                                                <img
                                                    alt={activeNft.name}
                                                    className="w-16 h-16 object-cover rounded-lg border border-red-300"
                                                    src={activeNft.image}
                                                />
                                                <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                    <i className="ri-fire-fill text-red-500 text-lg animate-pulse"></i>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-800 truncate">
                                                    {activeNft.name}
                                                </h4>
                                                <p className="text-xs text-gray-600 truncate">
                                                    #{activeNft.number}
                                                </p>
                                                <div className="flex items-center space-x-2 text-xs mt-1">
                                                    <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase">
                                                        {activeNft.rarity}
                                                    </span>
                                                    <span>Poder: {formatador.format(activeNft.power)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor={`boost-input-${activeBlock.id}`}
                                                className="block text-xs font-medium text-gray-700 mb-1"
                                            >
                                                Boost adicional (cada 1 = +3 poder):
                                            </label>
                                            <input
                                                id={`boost-input-${activeBlock.id}`}
                                                min="0"
                                                className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder="0"
                                                type="number"
                                                value={activeBlock.boost}
                                                onChange={handleBoostChange}
                                            />
                                        </div>
                                        <div className="bg-red-100 rounded-lg p-2">
                                            <div className="text-xs space-y-1">
                                                <div className="flex justify-between">
                                                    <span>Poder original:</span>
                                                    <span>{formatador.format(originalPower)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Boost aplicado:</span>
                                                    <span>+{formatador.format(boostPower)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-red-600">
                                                    <span>Poder total para transferir:</span>
                                                    <span>{formatador.format(transferPower)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-3 p-4 bg-gray-100 rounded-lg border border-dashed border-gray-300 text-center">
                                        <p className="text-sm text-gray-500">
                                            Clique em um bloco com NFT para ver os detalhes ou selecione um NFT para o bloco ativo.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Seletor2 */}
                {hasAnyBurnerNft && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-1">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-800">NFT que receberá poder</h3>
                            <select
                                value={receiverNftId || ""}
                                onChange={handleReceiverSelectChange}
                                className="max-w-[30%] p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-xs pr-8 cursor-pointer"
                            >
                                <option value="">Selecione um NFT para receber poder...</option>
                                {nfts
                                    .filter(
                                        (nft) =>
                                            !burnerNftsInUse.includes(nft.id) || nft.id === receiverNftId
                                    )
                                    .map((nft) => (
                                        <option key={nft.id} value={nft.id}>
                                            #{nft.number}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Detalhes do NFT Receptor */}
                        {receiverNft && (
                            <div className="mt-3">
                                <div className="flex items-start gap-4 mb-1">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            alt={receiverNft.name}
                                            className="w-16 h-16 rounded-lg object-cover object-top"
                                            src={receiverNft.image}
                                        />
                                        <p className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md rounded-br-md uppercase">
                                            {receiverNft.rarity}
                                        </p>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {receiverNft.name}
                                        </h3>
                                        <div className="flex gap-4 mt-1">
                                            <div>
                                                <span className="text-xs text-gray-600">Poder Original</span>
                                                <p className="font-semibold text-base">{formatador.format(receiverOriginalPower)}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-green-600">Poder Recebido</span>
                                                <p className="font-semibold text-base text-green-600">
                                                    +{formatador.format(totalTransferPower)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs for Receiver Details */}
                                <div className="border-b border-gray-200 mb-3">
                                    <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                                        <button
                                            onClick={() => setActiveReceiverTab('total')}
                                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs ${activeReceiverTab === 'total'
                                                ? 'border-green-500 text-green-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            Poder Final
                                        </button>
                                        <button
                                            onClick={() => setActiveReceiverTab('summary')}
                                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-xs ${activeReceiverTab === 'summary'
                                                ? 'border-green-500 text-green-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            Resumo da Queima
                                        </button>
                                    </nav>
                                </div>

                                {/* Tab Content */}
                                {activeReceiverTab === 'total' && (
                                    <>
                                        {receiverNft?.badge ? (
                                            <div className="bg-green-100 p-3 rounded-lg grid grid-cols-2 gap-4 text-center">
                                                <div>
                                                    <span className="text-sm text-green-700">Poder Total Final</span>
                                                    <p className="font-bold text-xl text-green-700">{formatador.format(receiverFinalPower)}</p>
                                                </div>
                                                <div className="border-l border-green-200 pl-4">
                                                    <span className="text-sm text-yellow-600 font-semibold">BADGE</span>
                                                    <p className="font-bold text-xl text-yellow-600">{formatador.format(receiverFinalPower * 3)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-green-100 p-3 rounded-lg">
                                                <span className="text-sm text-green-700">Poder Total Final</span>
                                                <p className="font-bold text-xl text-green-700">{formatador.format(receiverFinalPower)}</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {activeReceiverTab === 'summary' && (
                                    <div className="bg-white p-3 rounded-lg border max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                                        {blocos.filter(b => b.selectedNftId).map(bloco => {
                                            const pwr = bloco.power ?? 0;
                                            const bst = bloco.boost ?? 0;
                                            let singleTransferPower;
                                            if (bloco.badge) {
                                                singleTransferPower = Math.floor((pwr + bst * 3) * 4);
                                            } else {
                                                singleTransferPower = Math.floor((pwr + bst * 3) * 2);
                                            }
                                            return (<div key={`summary-${bloco.id}`} className="flex items-center justify-between text-xs mb-1">
                                                <span className="truncate mr-2">#{bloco.number} - {bloco.name}</span>
                                                <span className="font-medium text-red-600">+{formatador.format(singleTransferPower)}</span>
                                            </div>)
                                        })}
                                        <div className="border-t pt-2 mt-2 flex items-center justify-between font-semibold text-sm">
                                            <span>Total:</span>
                                            <span className="text-red-600">+{formatador.format(totalTransferPower)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>






    );
}