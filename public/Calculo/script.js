let rawData = [];
let listCalculated = []; // Armazena os dados atuais para exportação
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

    let list = [];
    basePool = 0;
    totalGeneralPower = 0;

    const tempFiltered = rawData.filter(item => {
        if (SPECIAL_POWER_IDS.includes(item.power)) {
            basePool = item.power;
            document.getElementById('rawPower').innerText = basePool.toLocaleString();
            return false;
        }
        return true;
    });

    list = tempFiltered.map(item => {
        let powerWithBadge = item.boost === true ? item.power * 3 : item.power;
        totalGeneralPower += powerWithBadge;
        return { ...item, powerWithBadge };
    });

    document.getElementById('generalPower').innerText = totalGeneralPower.toLocaleString();

    const method = document.getElementById('calcMethod').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    let processedList = [];

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
        processedList.push({ ...item, receive, percentAnterior });
    });

    processedList.sort((a, b) => (b.power || 0) - (a.power || 0));

    listCalculated = processedList.map((item, index) => {
        const totalFinalValue = item.powerWithBadge + item.receive;
        const percentageFinal = (totalFinalValue / totalGeneralPower) * 100;
        return {
            ...item,
            rank: index + 1,
            totalFinal: totalFinalValue,
            percentFinal: percentageFinal
        };
    });

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

// --- NOVA FUNÇÃO DE EXPORTAÇÃO ---
function exportV4() {
    if (listCalculated.length === 0) {
        alert("Nenhum dado para exportar!");
        return;
    }

    // Mapeia apenas os campos nftMint e Power a Receber
    const exportData = listCalculated.map(item => ({
        nftMint: item.nftMint,
        powerAReceber: parseFloat(item.receive.toFixed(4))
    }));

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = "distribuicao_v4.json";
    link.click();
    
    URL.revokeObjectURL(url);
}