let rawData = [];
let basePool = 0;
const SPECIAL_POWER_ID = 89854128;

// CARREGAMENTO INICIAL
window.addEventListener('DOMContentLoaded', () => {
    // COLOQUE O LINK DO ARQUIVO AQUI
    const urlDoArquivoOriginal = 'response_1771685438848.json'; 
    
    document.getElementById('loading').style.display = 'block';
    fetch(urlDoArquivoOriginal)
        .then(response => response.json())
        .then(data => {
            rawData = data;
            document.getElementById('loading').style.display = 'none';
            processData();
        })
        .catch(err => {
            document.getElementById('loading').innerText = "Arquivo inicial não carregado.";
        });
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

    const list = rawData.filter(item => {
        if (item.power === SPECIAL_POWER_ID) {
            basePool = item.power / 3; 
            document.getElementById('rawPower').innerText = item.power.toLocaleString();
            document.getElementById('distPower').innerText = basePool.toLocaleString(undefined, {maximumFractionDigits: 2});
            return false;
        }
        return true;
    });

    const method = document.getElementById('calcMethod').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    let processedList = [];

    // CÁLCULOS
    if (method === "1") {
        const share = basePool / list.length;
        processedList = list.map(item => ({ ...item, receive: share }));
    } 
    else if (method === "2") {
        const totalBurned = list.reduce((sum, item) => sum + item.nftBurned, 0);
        const ratio = basePool / (totalBurned + 921);
        processedList = list.map(item => ({ ...item, receive: (item.nftBurned + 1) * ratio }));
    }
    else if (method === "3") {
        const sumFactors = list.reduce((sum, item) => sum + (item.nftBurned + 1 + (item.trdBurned / 10000)), 0);
        const ratio = basePool / (sumFactors + 921);
        processedList = list.map(item => ({ 
            ...item, 
            receive: (item.nftBurned + 1 + (item.trdBurned / 10000)) * ratio 
        }));
    }

    // ORDENAÇÃO POR POWER ORIGINAL (ESSENCIAL PARA O RANKING)
    processedList.sort((a, b) => b.power - a.power);

    // ADICIONAR O NÚMERO DO RANKING APÓS A ORDENAÇÃO
    const rankedList = processedList.map((item, index) => ({
        ...item,
        rank: index + 1
    }));

    // FILTRO DE BUSCA
    const filteredList = rankedList.filter(item => 
        item.mint.toLowerCase().includes(searchTerm)
    );

    renderTable(filteredList);
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const totalFinal = item.power + item.receive;
        tbody.innerHTML += `<tr>
            <td class="rank-col">${item.rank}</td>
            <td style="font-family: monospace; font-size: 0.85em; color: #8892b0;">${item.mint}</td>
            <td style="font-weight: bold;">${item.power.toLocaleString()}</td>
            <td>${item.nftBurned}</td>
            <td class="highlight">+ ${item.receive.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            <td style="color: #fff; background: rgba(100, 255, 218, 0.05); font-weight: bold;">
                ${totalFinal.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </td>
        </tr>`;
    });
}