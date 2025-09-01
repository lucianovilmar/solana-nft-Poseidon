'use client';
import { useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Ranking } from '../types/ranking';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Interface para as props do componente
interface CarteiraGraficosProps {
    data: Ranking[];
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

    // Se não houver dados, exibe uma mensagem de carregamento.
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 h-full flex items-center justify-center">Carregando dados do ranking...</div>;
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
                            : 'Percentual de Poder Total (%)';

    const sortedData = [...data].sort((a, b) => {
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
        }
        return 0;
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

    if (condition === 'burned') {
        // Para o gráfico de queima, usamos dados fictícios
        const burnedData = topData.map(() => Math.floor(Math.random() * 1000) + 100); // Dados aleatórios entre 100 e 1100
        const burnedLabels = topData.map((item, index) => `Dia ${index + 1}`);

        const burnedChartData = {
            labels: burnedLabels,
            datasets: [
                {
                    label: 'Queima por Dia',
                    data: burnedData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    barThickness: 7,
                },
            ],
        };

        return (
            <div className="p-4">
                <div className={`relative h-[${tamanhoGrafico}px] w-full flex items-center justify-center`}>
                    {chartType === 'bar' && <Bar data={burnedChartData} options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                            title: {
                                display: true,
                                text: 'Queima por Dia'
                            },
                        },
                    }} />}
                </div>
            </div >
        );
    }

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