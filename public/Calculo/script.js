let rawData = [];
let listCalculated = []; 
let basePool = 0;
let totalGeneralPower = 0;
const SPECIAL_POWER_IDS = [89854128, 29951376]; 
const CONSTANTE_DIVISORA = 998;

window.addEventListener('DOMContentLoaded', () => {
    const urlDoArquivoOriginal = '/assets/message (1).txt'; 
    fetch(urlDoArquivoOriginal)
        .then(response => response.text())
        .then(text => {
            rawData = JSON.parse(text);
            processData();
        }).catch(e => console.log("Aguardando arquivo ou erro na leitura."));
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

    let list = [];
    basePool = 0;
    totalGeneralPower = 0;

    // 1. Filtragem e captura do Mestre
    const tempFiltered = rawData.filter(item => {
        if (SPECIAL_POWER_IDS.includes(item.power)) {
            basePool = item.power;
            document.getElementById('rawPower').innerText = basePool.toLocaleString();
            return false;
        }
        return true;
    });

    // 2. Cálculo do Poder com Badge e Soma do Poder Geral
    list = tempFiltered.map(item => {
        let powerWithBadge = item.boost === true ? item.power * 3 : item.power;
        totalGeneralPower += powerWithBadge;
        return { ...item, powerWithBadge };
    });

    document.getElementById('generalPower').innerText = totalGeneralPower.toLocaleString();

    const method = document.getElementById('calcMethod').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    let tempList = [];

    // 3. Aplicação da Estratégia Escolhida
    list.forEach(item => {
        let receive = 0;
        let percentAnterior = (item.powerWithBadge / totalGeneralPower) * 100;

        if (method === "1") {
            receive = basePool / list.length;
        } 
        else if (method === "2") {
            const totalBurned = list.reduce((sum, i) => sum + (i.poseidonBurned || 0), 0);
            receive = ((item.poseidonBurned || 0) + 1) * (basePool / (totalBurned + CONSTANTE_DIVISORA));
        }
        else if (method === "3") {
            const sumFactors = list.reduce((sum, i) => sum + ((i.poseidonBurned || 0) + 1 + ((i.trdBurned || 0) / 10000)), 0);
            receive = ((item.poseidonBurned || 0) + 1 + ((item.trdBurned || 0) / 10000)) * (basePool / (sumFactors + CONSTANTE_DIVISORA));
        }
        else if (method === "4") {
            receive = (percentAnterior / 100) * basePool;
        }
        tempList.push({ ...item, receive, percentAnterior });
    });

    // 4. Ordenação por Power Original
    tempList.sort((a, b) => (b.power || 0) - (a.power || 0));

    // 5. Mapeamento final para exibição e exportação (Atualiza listCalculated GLOBAL)
    listCalculated = tempList.map((item, index) => {
        const totalFinalValue = item.powerWithBadge + item.receive;
        const percentageFinal = (totalFinalValue / totalGeneralPower) * 100;
        return {
            ...item,
            rank: index + 1,
            totalFinal: totalFinalValue,
            percentFinal: percentageFinal
        };
    });

    // 6. Filtro de Busca (Visual apenas)
    const filteredList = listCalculated.filter(item => 
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
            <td style="color: #a2d2ff; opacity: 0.8;">${item.percentAnterior.toFixed(4)}%</td>
            <td>${item.poseidonBurned || 0}</td>
            <td class="highlight">+ ${item.receive.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            <td style="color: #fff; background: rgba(100, 255, 218, 0.1); font-weight: bold;">
                ${item.totalFinal.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </td>
            <td style="color: #ffd700;">${item.percentFinal.toFixed(4)}%</td>
        </tr>`;
    });
}

function exportV4() {
    if (listCalculated.length === 0) {
        alert("Carregue os dados primeiro!");
        return;
    }

    // Agora pega os dados exatos da listCalculated que foi atualizada no processData
    const exportData = listCalculated.map(item => ({
        nftMint: item.nftMint,
        powerAReceber: parseFloat(item.receive.toFixed(6)) // Aumentado precisão para exportação
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "poseidon_v4_export.json";
    link.click();
    
    URL.revokeObjectURL(url);
}