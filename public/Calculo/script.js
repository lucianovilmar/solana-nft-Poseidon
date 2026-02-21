let rawData = [];
let basePool = 0;
const SPECIAL_POWER_ID = 89854128;

document.getElementById('fileInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            rawData = JSON.parse(event.target.result);
            processData();
        } catch (err) {
            alert("Erro no arquivo JSON.");
        }
    };
    reader.readAsText(e.target.files[0]);
});

function processData() {
    if (rawData.length === 0) return;

    // 1. Filtragem do especial e cálculo do pool (dividido por 3)
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

    // 2. Cálculos das Estratégias
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

    // 3. Ordenação por Power Original
    processedList.sort((a, b) => b.power - a.power);

    // 4. Filtro de Busca (aplica após o cálculo para manter os totais corretos)
    const filteredList = processedList.filter(item => 
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