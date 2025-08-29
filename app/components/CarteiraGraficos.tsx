'use client';
import { useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

// Interface para os dados de ranking recebidos via props
interface Ranking {
    id: string;
    wallet: string;
    totalPower: number;
    totalNfts: number;
    powerShare: number;
}

// Interface para as props do componente
interface CarteiraGraficosProps {
    data: Ranking[];
    userWallet?: string;
    condition?: string;
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

export default function CarteiraGraficos({ data, userWallet, condition }: CarteiraGraficosProps) {
    const [chartType, setChartType] = useState('bar');
    const posicao = data.findIndex(item => item.wallet === userWallet);

    // Se não houver dados, exibe uma mensagem de carregamento.
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 h-full flex items-center justify-center">Carregando dados do ranking...</div>;
    }

    //     // Prepara os dados para os gráficos a partir da prop 'data'
    //      const labels = data.map(item => shortenAddress(item.wallet));
    //     const totalPowerData = data.map(item => item.totalPower);
    //      const powerShareData = data.map(item => item.powerShare);
const labeGrafic =
  condition === 'power'
    ? 'Poder Total'
    : condition === 'nfts'
    ? 'Quantidade de NFTs'
    : 'Percentual de Poder Total (%)';

const sortedData = [...data].sort((a, b) => {
  if (condition === 'power') {
    return b.totalPower - a.totalPower;   // maior poder primeiro
  } else if (condition === 'nfts') {
    return b.totalNfts - a.totalNfts;     // mais NFTs primeiro
  } else if (condition === 'share') {
    return b.powerShare - a.powerShare;   // maior participação primeiro
  }
  return 0;
});

    // Prepara os dados para os gráficos, limitando aos 10 primeiros do ranking
    const topData = sortedData.slice(0, 45);
    //     const labels = topData.map(item => shortenAddress(item.wallet));

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
                barThickness: 10, // Controla a largura da barra em pixels
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
                    : 'Ranking de Poder Total'
            },
        },
    };

    return (
        <div className="p-4">
            {/*          <div className="flex items-center justify-center mb-4 gap-4">
                <label className="font-semibold text-gray-700">Tipo de gráfico:</label>
                <select
                    value={chartType}
                    onChange={e => setChartType(e.target.value)}
                    className="p-2 border rounded-lg bg-gray-100"
                >
                    {chartOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        */}
            <div className="relative h-[400px] w-full flex items-center justify-center">
                {chartType === 'bar' && <Bar data={barData} options={chartOptionsConfig} />}
                {chartType === 'line' && <Line data={lineData} options={chartOptionsConfig} />}
                {chartType === 'circle' && <Doughnut data={doughnutData} options={chartOptionsConfig} />}
            </div>
        </div >
    );
}