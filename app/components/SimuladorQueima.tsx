"use client";
import { useState } from "react";

// O tipo que vem do AppContext (ajuste se necessário)
interface Nft {
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
}

export default function GaleriaNFTs({ nfts }: { nfts: Nft[] }) {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [selectedNftId, setSelectedNftId] = useState<string | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<number | null>(null);
  const [nextBlockId, setNextBlockId] = useState(1);
  const [receiverNftId, setReceiverNftId] = useState<string | null>(null);
  const [activeReceiverTab, setActiveReceiverTab] = useState<'total' | 'summary'>('total');
  console.log("Nfts recebidos:", nfts);
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
    };
    setBlocos((prev) => [...prev, newBlock]);
    setNextBlockId((prev) => prev + 1);
    console.log("Bloco adicionado:", newBlock);
    setActiveBlockId(newBlock.id);
    setSelectedNftId(null);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nftId = e.target.value;
    setSelectedNftId(nftId);

    if (activeBlockId === null) return;

    // Handle selecting a valid NFT
    if (nftId) {
      const nft = nfts.find((n) => n.id === nftId);
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
            }
            : bloco
        )
      );
      console.log("NFT selecionado:", nft);
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
      if (bloco.badge) {
        transfer = Math.floor((pwr + bst * 3) * 4);
      } else {
        transfer = Math.floor((pwr + bst * 3) * 2);
      }
      return total + transfer;
    }, 0);

  const receiverNft = receiverNftId
    ? nfts.find((n) => n.id === receiverNftId)
    : null;
  const receiverOriginalPower = receiverNft?.power ?? 0;
  const receiverFinalPower = receiverOriginalPower + totalTransferPower;

  return (
    <div className="p-1">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          NFTs para Queimar
        </label>
        <button
          onClick={adicionarBloco}
          className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors"
        >
          <i className="ri-add-line text-sm"></i>
        </button>
      </div>

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
            <select
              value={selectedNftId || ""}
              onChange={handleSelectChange}
              className="w-1/2 p-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-8 cursor-pointer"
            >
              <option key="placeholder" value="">
                Selecione um NFT
              </option>
              {nfts
                .filter(
                  (nft) =>
                    !selectedNftsIds.includes(nft.id) ||
                    nft.id === activeBlock?.selectedNftId
                )
                .map((nft) => (
                  <option key={nft.id} value={nft.id}>
                    #{nft.number}
                  </option>
                ))}
            </select>
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
                        <span>Poder: {activeNft.power}</span>
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
                        <span>{originalPower}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Boost aplicado:</span>
                        <span>+{boostPower}</span>
                      </div>
                      <div className="flex justify-between font-bold text-red-600">
                        <span>Poder total para transferir:</span>
                        <span>{transferPower}</span>
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
                      <p className="font-semibold text-base">{receiverOriginalPower}</p>
                    </div>
                    <div>
                      <span className="text-xs text-green-600">Poder Recebido</span>
                      <p className="font-semibold text-base text-green-600">
                        +{totalTransferPower}
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
                <div className="bg-green-100 p-3 rounded-lg">
                  <span className="text-sm text-green-700">Poder Total Final</span>
                  <p className="font-bold text-xl text-green-700">{receiverFinalPower}</p>
                </div>
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
                      <span className="font-medium text-red-600">+{singleTransferPower}</span>
                    </div>)
                  })}
                  <div className="border-t pt-2 mt-2 flex items-center justify-between font-semibold text-sm">
                    <span>Total:</span>
                    <span className="text-red-600">+{totalTransferPower}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}