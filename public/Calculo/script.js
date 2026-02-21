let rawData = [];
let basePool = 0;
let totalGeneralPower = 0;
const SPECIAL_POWER_IDS = [89854128, 29951376]; 

window.addEventListener('DOMContentLoaded', () => {
    const urlDoArquivoOriginal = '/assets/message (1).txt'; 
    fetch(urlDoArquivoOriginal)
        .then(response => response.text())
        .then(text => {
            rawData = JSON.parse(text);
            processData();
        }).catch(e => console.log("Aguardando arquivo..."));
});

document.getElementById('fileInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        rawData = JSON.parse(event.target.result);
        processData();
    };
    reader.readAsText(e.target.files[0]);
});

function processData() {
    if (rawData.length === 0) return;

    // 1. Isolar Mestre e Calcular "Poder com Badge" individual + Soma Geral
    let list = [];
    basePool = 0;
    totalGeneralPower = 0;

    // Primeiro passo: Identificar pool e filtrar
    const tempFiltered = rawData.filter(item => {
        if (SPECIAL_POWER_IDS.includes(item.power)) {
            basePool = item.power;
            document.getElementById('rawPower').innerText = basePool.toLocaleString();
            return false;
        }
        return true;
    });

    // Segundo passo: Calcular poder com badge e Soma Geral
    list = tempFiltered.map(item => {
        let powerWithBadge = item.boost === true ? item.power * 3 : item.power;
        totalGeneralPower += powerWithBadge;
        return { ...item, powerWithBadge };
    });

    document.getElementById('generalPower').innerText = totalGeneralPower.toLocaleString();

    const method = document.getElementById('calcMethod').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    let processedList = [];

    // 2. Cálculos de Distribuição (Mantendo exclusão do mestre)
    if (method === "1") {
        const share = basePool / list.length;
        processedList = list.map(item => ({ ...item, receive: share }));
    } 
    else if (method === "2") {
        const totalBurned = list.reduce((sum, item) => sum + (item.poseidonBurned || 0), 0);
        const ratio = basePool / (totalBurned + 921);
        processedList = list.map(item => ({ ...item, receive: ((item.poseidonBurned || 0) + 1) * ratio }));
    }
    else if (method === "3") {
        const sumFactors = list.reduce((sum, item) => sum + ((item.poseidonBurned || 0) + 1 + ((item.trdBurned || 0) / 10000)), 0);
        const ratio = basePool / (sumFactors + 921);
        processedList = list.map(item => ({ 
            ...item, 
            receive: ((item.poseidonBurned || 0) + 1 + ((item.trdBurned || 0) / 10000)) * ratio 
        }));
    }

    // 3. Ordenação por Power Original
    processedList.sort((a, b) => (b.power || 0) - (a.power || 0));

    // 4. Ranking, Total Final e Percentual
    const finalProcessed = processedList.map((item, index) => {
        // Total Final: (Poder com Badge) + (Power a Receber)
        const totalFinalValue = item.powerWithBadge + item.receive;
        // Percentual: Total Final / Poder Geral
        const percentage = (totalFinalValue / totalGeneralPower) * 100;
        
        return {
            ...item,
            rank: index + 1,
            totalFinal: totalFinalValue,
            percent: percentage
        };
    });

    // 5. Filtro de Busca
    const filteredList = finalProcessed.filter(item => 
        (item.nftMint || "").toLowerCase().includes(searchTerm)
    );

    renderTable(filteredList);
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    data.forEach(item => {
        tbody.innerHTML += `<tr>
            <td class="rank-col">${item.rank}</td>
            <td style="font-family: monospace; color: #8892b0;">${item.nftMint}</td>
            <td>${item.power.toLocaleString()}</td>
            <td class="${item.boost ? 'boost-text' : ''}">${item.powerWithBadge.toLocaleString()}</td>
            <td>${item.poseidonBurned || 0}</td>
            <td class="highlight">+ ${item.receive.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            <td style="color: #fff; background: rgba(100, 255, 218, 0.1); font-weight: bold;">
                ${item.totalFinal.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </td>
            <td style="color: #ffd700;">${item.percent.toFixed(4)}%</td>
        </tr>`;
    });
}