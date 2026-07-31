'use client';
import { useAppContext } from '../AppContext';
import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { useWallet } from '@solana/wallet-adapter-react';
import badge_image from '../assets/badge_image.svg';
import diamond_gray from '../assets/diamond_gray.svg';
import diamond_green from '../assets/diamond_green.svg';
import diamond_blue from '../assets/diamond_blue.svg';
import diamond_purple from '../assets/diamond_purple.svg';
import diamond_orange from '../assets/diamond_orange.svg';
import diamond_red from '../assets/diamond_red.svg';

const formatador = new Intl.NumberFormat('pt-BR');

interface Nft {
    id: string;
    name: string;
    image: string;
    rarity: string;
    number: string;
    mint: string;
    power: number;
    rewardsAvailable: number;
    rewardsClaimed: number;
    priceFormatted: string;
    buyPrice: number;
    trdBurned: number;
    burnedPower: number;
    badge: boolean;
    totalPower: number;
    originalPower: number;
    powerBadge: number;
    pricePower: number;
}

const EXEMPT_WALLETS = [
    '6q4oj5hhZuXVtct9YaxLAwxL9ufTU5ewQSBbj7BwRuba', // Sua carteira pessoal
    'bZAucYLwqDCWpxEvpwdP7sX3z4EfLpbxyjNqtia9Z89'  // Carteira de recebimento do site
];

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
            case 'Mythic':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    console.log('Renderizando CompraNFT');
    
    // Conexão com a carteira Solana
    const { publicKey, sendTransaction } = useWallet();
    const { userProfile, setUserProfile } = useAppContext();

    // Estados dos Filtros
    const [mercadoOrigem, setMercadoOrigem] = useState<'local' | 'magiceden'>('local');
    const [filtroRaridade, setFiltroRaridade] = useState<string>('Todas');
    const [filtroPreco, setFiltroPreco] = useState<string>('Todos');
    const [filtroRecompensa, setFiltroRecompensa] = useState<string>('Todas');
    const [ordenacao, setOrdenacao] = useState<string>('relevancia');

    // Estado dos dados do mercado e pagamento
    const [marketNfts, setMarketNfts] = useState<Nft[]>([]);
    const [bidValues, setBidValues] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validação da Licença
    const userHasLicense = useMemo(() => {
        if (!publicKey) return false;
        const connectedAddress = publicKey.toBase58();
        
        // Isento se a carteira conectada é VIP
        if (EXEMPT_WALLETS.includes(connectedAddress)) {
            return true;
        }
        
        // Isento se qualquer carteira associada ao perfil é VIP
        if (userProfile.wallets.some(w => EXEMPT_WALLETS.includes(w))) {
            return true;
        }
        
        // Ativo se comprou licença e ela não expirou
        if (userProfile.paidUntil && userProfile.paidUntil > Date.now()) {
            return true;
        }
        
        return false;
    }, [publicKey, userProfile]);

    useEffect(() => {
        // Só faz a requisição se for mercado local OU se tiver licença ativa para ver a Magic Eden
        if (mercadoOrigem === 'magiceden' && !userHasLicense) {
            setIsLoading(false);
            return;
        }

        const walletList = "EtPdv1aSMgidVnaxkHhBNHGszXHLe3Z6nG2wpWMMdLDD";
        console.log('Buscando NFTs para as carteiras:', walletList, 'origem:', mercadoOrigem);

        const getMarketplaceNFTs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let nftsForSale: Nft[] = [];

                if (mercadoOrigem === 'local') {
                    // Busca todos os NFTs à venda no marketplace simulado local
                    const resposta = await api.post(`/poseidons/wallets`, { addresses: [walletList] });
                    const nftsFromApi = resposta.data;
                    
                    nftsForSale = nftsFromApi.map((nft: any) => {
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
                } else {
                    // Busca os anúncios reais da Magic Eden através do nosso backend
                    const resposta = await api.get('/poseidons/marketplace');
                    nftsForSale = resposta.data;
                }

                setMarketNfts(nftsForSale);
            } catch (err: any) {
                console.error('Erro ao buscar NFTs do marketplace:', err);
                setError('Não foi possível carregar os NFTs do mercado. Tente novamente mais tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        getMarketplaceNFTs();
    }, [mercadoOrigem, userHasLicense]);

    // Executa pagamento de licença na rede Solana e valida no backend
    const handleBuyLicense = async (plan: 'daily' | 'monthly') => {
        if (!publicKey) {
            alert('Por favor, conecte sua carteira primeiro!');
            return;
        }

        const price = plan === 'daily' ? 0.01 : 0.05;
        const receiver = 'bZAucYLwqDCWpxEvpwdP7sX3z4EfLpbxyjNqtia9Z89';
        
        setIsPaymentLoading(true);
        try {
            const { Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } = await import('@solana/web3.js');
            
            // Conexão com RPC Mainnet
            const heliusKeys = ['ba5116a6-1395-4ecf-9081-ca08d8ddd92e'];
            const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${heliusKeys[0]}`, 'confirmed');
            
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(receiver),
                    lamports: price * LAMPORTS_PER_SOL,
                })
            );

            // Obtém o blockhash mais recente
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // Envia e assina a transação
            const signature = await sendTransaction(transaction, connection);
            console.log('Transação enviada, aguardando confirmação on-chain:', signature);

            await connection.confirmTransaction(signature, 'confirmed');

            // Valida o pagamento no backend
            const response = await api.post('/users/license', {
                walletAddress: publicKey.toBase58(),
                signature,
                planType: plan
            });

            if (response.data.success) {
                setUserProfile(response.data.userProfile);
                alert(response.data.message);
            } else {
                alert('Erro na validação: ' + response.data.error);
            }
        } catch (err: any) {
            console.error('Falha no pagamento de licença:', err);
            alert('Falha na transação: ' + (err.message || 'Transação cancelada ou sem saldo suficiente.'));
        } finally {
            setIsPaymentLoading(false);
        }
    };

    // Lógica de Filtragem e Ordenação
    const filteredNfts = useMemo(() => {
        let list = [...marketNfts];

        // Filtro por Raridade
        if (filtroRaridade !== 'Todas') {
            list = list.filter(nft => nft.rarity === filtroRaridade);
        }

        // Filtro por Preço
        if (filtroPreco !== 'Todos') {
            if (filtroPreco === 'menor0.5') {
                list = list.filter(nft => nft.buyPrice < 0.5);
            } else if (filtroPreco === '0.5-2') {
                list = list.filter(nft => nft.buyPrice >= 0.5 && nft.buyPrice <= 2.0);
            } else if (filtroPreco === 'maior2') {
                list = list.filter(nft => nft.buyPrice > 2.0);
            }
        }

        // Filtro por Recompensas
        if (filtroRecompensa !== 'Todas') {
            if (filtroRecompensa === 'comRewards') {
                list = list.filter(nft => (nft.rewardsAvailable || 0) > 0);
            } else if (filtroRecompensa === 'semRewards') {
                list = list.filter(nft => (nft.rewardsAvailable || 0) === 0);
            }
        }

        // Ordenação
        if (ordenacao === 'preco_menor') {
            list.sort((a, b) => (a.buyPrice || 0) - (b.buyPrice || 0));
        } else if (ordenacao === 'preco_maior') {
            list.sort((a, b) => (b.buyPrice || 0) - (a.buyPrice || 0));
        } else if (ordenacao === 'poder_maior') {
            list.sort((a, b) => (b.totalPower || 0) - (a.totalPower || 0));
        } else if (ordenacao === 'custo_beneficio') {
            list.sort((a, b) => (a.pricePower || 0) - (b.pricePower || 0));
        }

        return list;
    }, [marketNfts, filtroRaridade, filtroPreco, filtroRecompensa, ordenacao]);

    const handleClearFilters = () => {
        setFiltroRaridade('Todas');
        setFiltroPreco('Todos');
        setFiltroRecompensa('Todas');
        setOrdenacao('relevancia');
    };

    if (isLoading) {
        return <div className="text-center text-white p-10 text-xl">Carregando NFTs do Mercado...</div>;
    }

    if (error) {
        return <div className="text-center text-red-400 p-10 text-xl">{error}</div>;
    }

    // Tela do Paywall Premium caso não tenha licença
    if (mercadoOrigem === 'magiceden' && !userHasLicense) {
        return (
            <div className="mt-8">
                <div className="bg-black/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <i className="ri-shopping-cart-line text-blue-500 mr-2"></i>
                        Loja de NFTs
                    </h2>
                    
                    {/* Filtro Mercado para permitir voltar para o simulado */}
                    <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-white font-medium mb-2">Mercado:</label>
                                <select
                                    value={mercadoOrigem}
                                    onChange={(e) => setMercadoOrigem(e.target.value as 'local' | 'magiceden')}
                                    className="w-full p-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm"
                                >
                                    <option value="local">Mercado Local (Simulado)</option>
                                    <option value="magiceden">Magic Eden (Ao Vivo)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Paywall Container */}
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-b from-gray-900/60 to-black/80 rounded-2xl border border-teal-500/20 shadow-2xl relative overflow-hidden max-w-3xl mx-auto my-8">
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                        
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20">
                            <i className="ri-key-2-fill text-white text-3xl"></i>
                        </div>
                        
                        <h3 className="text-3xl font-extrabold text-white mb-2 text-center bg-gradient-to-r from-teal-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            Área Premium - Magic Eden Ao Vivo
                        </h3>
                        <p className="text-gray-300 text-center mb-8 max-w-lg text-sm leading-relaxed">
                            Adquira a licença de uso para visualizar todos os NFTs Poseidon à venda na Magic Eden em tempo real, integrados com o poder de jogo e raridade do nosso banco de dados. Encontre as melhores pechinchas no mercado!
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg mb-8">
                            {/* Card Plano Diário */}
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-teal-500/30 transition-all flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-teal-400 mb-1">Acesso Diário</h4>
                                    <p className="text-xs text-gray-400 mb-4">Válido até a meia-noite (23:59:59) do horário do servidor no dia da compra.</p>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white mb-4">0.01 SOL</div>
                                    <button 
                                        onClick={() => handleBuyLicense('daily')}
                                        disabled={isPaymentLoading}
                                        className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-lg text-xs transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                                    >
                                        {isPaymentLoading ? 'Confirmando...' : 'Adquirir Diário'}
                                    </button>
                                </div>
                            </div>

                            {/* Card Plano Mensal */}
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-bold text-purple-400 mb-1">Acesso Mensal</h4>
                                    <p className="text-xs text-gray-400 mb-4">Acesso total e ilimitado liberado por 30 dias seguidos.</p>
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white mb-4">0.05 SOL</div>
                                    <button 
                                        onClick={() => handleBuyLicense('monthly')}
                                        disabled={isPaymentLoading}
                                        className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg text-xs transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                                    >
                                        {isPaymentLoading ? 'Confirmando...' : 'Adquirir Mensal'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {userProfile.paidUntil && userProfile.paidUntil > 0 && (
                            <p className="text-xs text-gray-400">
                                Sua última licença expirou em: {new Date(userProfile.paidUntil).toLocaleString('pt-BR')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="mt-8">
            <div className="bg-black/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <i className="ri-shopping-cart-line text-blue-500 mr-2"></i>
                    Loja de NFTs
                </h2>
                
                {/* Painel de Filtros */}
                <div className="bg-black/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <i className="ri-filter-3-line mr-2"></i>
                        Filtros
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-white font-medium mb-2">Mercado:</label>
                            <select
                                value={mercadoOrigem}
                                onChange={(e) => setMercadoOrigem(e.target.value as 'local' | 'magiceden')}
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm"
                            >
                                <option value="local">Mercado Local (Simulado)</option>
                                <option value="magiceden">Magic Eden (Ao Vivo)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">Preço:</label>
                            <select
                                value={filtroPreco}
                                onChange={(e) => setFiltroPreco(e.target.value)}
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm"
                            >
                                <option value="Todos">Todos os Preços</option>
                                <option value="menor0.5">Menor que 0.5 SOL</option>
                                <option value="0.5-2">0.5 a 2.0 SOL</option>
                                <option value="maior2">Maior que 2.0 SOL</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">Raridade:</label>
                            <select
                                value={filtroRaridade}
                                onChange={(e) => setFiltroRaridade(e.target.value)}
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm"
                            >
                                <option value="Todas">Todas as Raridades</option>
                                <option value="Common">Common</option>
                                <option value="Uncommon">Uncommon</option>
                                <option value="Rare">Rare</option>
                                <option value="Epic">Epic</option>
                                <option value="Legendary">Legendary</option>
                                <option value="Mythic">Mythic</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">Recompensas:</label>
                            <select
                                value={filtroRecompensa}
                                onChange={(e) => setFiltroRecompensa(e.target.value)}
                                className="w-full p-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm"
                            >
                                <option value="Todas">Todas as Recompensas</option>
                                <option value="comRewards">Com Recompensas</option>
                                <option value="semRewards">Sem Recompensas</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-300">Exibindo {filteredNfts.length} de {marketNfts.length} NFTs</div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-white text-sm font-medium">Ordenar por:</label>
                                <select
                                    value={ordenacao}
                                    onChange={(e) => setOrdenacao(e.target.value)}
                                    className="p-1 px-2 bg-white border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm"
                                >
                                    <option value="relevancia">Relevância</option>
                                    <option value="preco_menor">Menor Preço</option>
                                    <option value="preco_maior">Maior Preço</option>
                                    <option value="poder_maior">Maior Poder</option>
                                    <option value="custo_beneficio">Melhor Custo-Benefício</option>
                                </select>
                            </div>
                            <button 
                                onClick={handleClearFilters}
                                className="whitespace-nowrap cursor-pointer font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 px-3 py-1.5 text-sm"
                            >
                                <i className="ri-refresh-line mr-2"></i>
                                Limpar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grade de NFTs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {filteredNfts && filteredNfts.length > 0 ? (
                        filteredNfts.map((nft) => (
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
                                            <div className='flex items-center justify-center w-full'>
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
                                                                    : diamond_red.src} className="fex h-12" alt="Raridade" />
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
                                        {nft.badge && (
                                            <div>
                                                <div className="text-gray-600">Badge 3x</div>
                                                <div className="font-semibold text-gray-900">{formatador.format(nft.powerBadge)}</div>
                                            </div>
                                        )}
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
                                                                <span className="text-xs font-bold text-red-600 animate-pulse bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text shadow-lg relative">
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
                                    
                                    {/* Ações baseadas na Origem do Mercado */}
                                    {mercadoOrigem === 'local' ? (
                                        <>
                                            <div className="mb-3">
                                                <div className="flex gap-2">
                                                    <div className="w-full">
                                                        <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent flex-1 text-black text-sm" placeholder="Lance" min="0" step="0.1" type="number"
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
                                        </>
                                    ) : (
                                        <a
                                            href={`https://magiceden.io/item-details/solana/${nft.mint || nft.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-center whitespace-nowrap cursor-pointer font-medium rounded-lg transition-colors bg-purple-600 hover:bg-purple-700 text-white px-3 py-2.5 text-sm w-full"
                                        >
                                            <i className="ri-external-link-line mr-2"></i>
                                            Ver no Magic Eden
                                        </a>
                                    )}
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