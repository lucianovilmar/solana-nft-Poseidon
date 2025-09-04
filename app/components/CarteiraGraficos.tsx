'use client';
import { useState, useMemo } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Ranking, RankingBurned } from '../types/ranking';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Interface para as props do componente
interface CarteiraGraficosProps {
    data: (Ranking | RankingBurned)[];
    userWallet?: string;
    condition?: string;
    tamanhoGrafico?: string;
    quantityDados?: number;
}

const chartOptions = [
    { value: 'bar', label: 'Ranking de Poder (Barras)' },
    { value: 'line', label: 'Ranking de Poder (Linha)' },
    { value: 'circle', label: 'Distribuição de Poder (Pizza)' },
];

// Função para encurtar o endereço da carteira para melhor visualização
const shortenAddress = (address: string) => {
    if (!address || address.length < 8) return address;
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

export default function CarteiraGraficos({ data, userWallet, condition, tamanhoGrafico, quantityDados }: CarteiraGraficosProps) {
    const [chartType, setChartType] = useState('bar');
    const [timeFrame, setTimeFrame] = useState<'dia' | 'mes'>('dia');

    // Hooks devem ser chamados no nível superior, não dentro de condicionais.
    // A lógica de `useMemo` agora verifica a condição internamente.
    const processedChartData = useMemo(() => {
        if (condition !== 'burnedTime' || !data || data.length === 0) {
            return null;
        }

        const burnedRankingData = data as RankingBurned[];
        let processedData;
        let labels;

        if (timeFrame === 'mes') {
            const monthlyData = burnedRankingData.reduce((acc, item) => {
                const date = new Date(item.date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!acc[monthKey]) {
                    acc[monthKey] = {
                        date: new Date(date.getFullYear(), date.getMonth(), 1),
                        nftBurned: 0,
                        trdBburned: 0,
                        totalPower: 0,
                    };
                }

                acc[monthKey].nftBurned += item.nftBurned || 0;
                acc[monthKey].trdBburned += item.trdBburned || 0;
                acc[monthKey].totalPower += item.totalPower || 0;

                return acc;
            }, {} as Record<string, { date: Date; nftBurned: number; trdBburned: number; totalPower: number }>);

            processedData = Object.values(monthlyData).sort((a, b) => a.date.getTime() - b.date.getTime());
            labels = processedData.map(item => new Date(item.date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' }));
        } else {
            // Inverte o array para que as datas fiquem em ordem crescente no gráfico.
            processedData = burnedRankingData.slice(0, quantityDados || 45).reverse();
            labels = processedData.map(item => new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }));
        }

        const datasetConfigs = [
            { label: 'NFTs', data: processedData.map(item => item.nftBurned || 0), color: '255, 99, 132' /* Vermelho */ },
            { label: 'TRD', data: processedData.map(item => item.trdBburned || 0), color: '54, 162, 235' /* Azul */ },
            { label: 'Power Total', data: processedData.map(item => item.totalPower || 0), color: '255, 206, 86' /* Amarelo */ },
        ];

        return {
            labels,
            datasets: datasetConfigs.map(config => ({
                label: config.label,
                data: config.data,
                backgroundColor: `rgba(${config.color}, 0.6)`,
                borderColor: `rgba(${config.color}, 1)`,
                borderWidth: 1,
                barThickness: 7,
            })),
        };
    }, [data, condition, timeFrame, quantityDados]);

    // Se não houver dados, exibe uma mensagem de carregamento.
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 h-full flex items-center justify-center">Carregando dados do ranking...</div>;
    }

    // Lógica para o gráfico de queima (condição 'burned')
    if (condition === 'burnedTime') {
        return (
            <div className="p-4">
                <div className="absolute top-2 right-2 flex bg-gray-100 rounded-full shadow-sm">
                    <button
                        onClick={() => setTimeFrame('dia')}
                        className={`px-3 py-1 text-xs font-medium rounded-l-full transition-colors ${timeFrame === 'dia' ? 'bg-white text-gray-800 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Dia
                    </button>
                    <button
                        onClick={() => setTimeFrame('mes')}
                        className={`px-3 py-1 text-xs font-medium rounded-r-full transition-colors ${timeFrame === 'mes' ? 'bg-white text-gray-800 shadow' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        Mês
                    </button>
                </div>

                <div className={`relative h-[${tamanhoGrafico}px] w-full flex items-center justify-center`}>
                    {chartType === 'bar' && processedChartData && <Bar data={processedChartData} options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                            title: {
                                display: true,
                                text: 'Histórico de Queima'
                            },
                        },
                    }} />}
                </div>
            </div >
        );
    }

    const labeGrafic =
        condition === 'power'
            ? 'Poder Total'
            : condition === 'nfts'
                ? 'Quantidade de NFTs'
                : condition === 'investment'
                    ? 'Investimento Total (SOLANA)'
                    : condition === 'burned'
                        ? 'Burned'
                        : condition === 'burnedTRD'
                            ? 'Burned (TRD)'
                            : condition === 'nftQueimados'
                                ? 'Burned (NFTs)'
                            : 'Percentual de Poder Total (%)';

    // Para outras condições, assumimos que `data` é do tipo `Ranking[]`
    const rankingData = data as Ranking[];
    const sortedData = [...rankingData].sort((a, b) => {
        if (condition === 'power') {
            return b.totalPower - a.totalPower;
        } else if (condition === 'nfts') {
            return b.totalNfts - a.totalNfts;
        } else if (condition === 'share') {
            return b.powerShare - a.powerShare;
        } else if (condition === 'investment') {
            return b.totalInvestment - a.totalInvestment;
        } else if (condition === 'burnedTRD') {   
            return b.trdBurned - a.trdBurned;
        } else if (condition === 'nftQueimados') {
            return b.nftBurned - a.nftBurned;
        } else if (condition === 'rewards') {
            return b.nftBurned - a.nftBurned;
        }
    });
    
    // --- FIX: Calculate position after sorting the data ---
    const posicao = sortedData.findIndex(item => item.wallet === userWallet);

    const topData = sortedData.slice(0, quantityDados || 45);

    const labels = topData.map((item, index) => {
        if (userWallet && item.wallet === userWallet) {
            return 'You';
        }
        return `${index + 1}`;
    });

    const totalPowerData =
        condition === 'power'
            ? topData.map(item => item.totalPower)
            : condition === 'nfts'
                ? topData.map(item => item.totalNfts)
                : condition === 'investment'
                    ? topData.map(item => item.totalInvestment)
                    : condition === 'burnedTRD'
                        ? topData.map(item => item.trdBurned)
                        : condition === 'rewards'
                            ? topData.map(item => item.trdBurned)
                            : condition === 'nftQueimados'
                                ? topData.map(item => item.nftBurned)
                                : topData.map(item => item.powerShare);

    const powerShareData = topData.map(item => item.powerShare);
    const totalNftsData = topData.map(item => item.totalNfts);

    // Define as cores para o gráfico de barras, destacando a barra do usuário
    const barBackgroundColors = labels.map(label =>
        label === 'You' ? 'rgba(196, 72, 23, 0.6)' : 'rgba(136, 132, 216, 0.6)'
    );

    const barBorderColors = labels.map(label =>
        label === 'You' ? 'rgba(199, 66, 25, 1)' : 'rgba(136, 132, 216, 1)'
    );    

    const barData = {
        labels,
        datasets: [
            {
                label: labeGrafic,
                data: totalPowerData,
                backgroundColor: barBackgroundColors,
                borderColor: barBorderColors,
                borderWidth: 1,
                barThickness: 10,
            },
        ],
    };


    const lineData = {
        labels,
        datasets: [
            {
                label: 'Poder Total',
                data: totalNftsData,
                borderColor: '#6366f1',
                backgroundColor: '#a5b4fc',
                fill: false,
                tension: 0.1,
            },
        ],
    };

    const doughnutData = {
        labels,
        datasets: [
            {
                label: 'Distribuição de Poder (%)',
                data: powerShareData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                    'rgba(83, 102, 255, 0.6)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptionsConfig = {
        responsive: true,
        plugins: {
            legend: { display: true },
            title: {
                display: true,
                text: chartType === 'circle'
                    ? 'Distribuição de Poder (%)'
                    : condition === 'power'
                        ? 'Ranking de Poder'
                        : condition === 'nfts'
                            ? 'Ranking de NFTs'
                            : condition === 'investment'
                                ? 'Ranking de Investimento'
                                : condition === 'burned'
                                    ? 'Queima por Dia'
                                    : condition === 'burnedTRD'
                                        ? 'Queima de TRD'
                                        : 'Ranking'
            },
        },
    };

    return (
        <div className="p-4">
            <div className={`relative h-[${tamanhoGrafico}px] w-full flex items-center justify-center`}>
                {chartType === 'bar' && <Bar data={barData} options={chartOptionsConfig} />}
                {chartType === 'line' && <Line data={lineData} options={chartOptionsConfig} />}
                {chartType === 'circle' && <Doughnut data={doughnutData} options={chartOptionsConfig} />}
            </div>
            {condition !== 'burned' && posicao >= 0 && (
                <div className="text-center mt-4 font-bold text-lg text-gray-700">
                    Sua posição no ranking é: {posicao + 1}
                </div>
            )}
        </div >
    );
}