let rawData = [];
let poolPower = 0;
const SPECIAL_POWER = 89854128;

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

    // 1. Filtrar o item especial e definir o Pool de distribuição
    const list = rawData.filter(item => {
        if (item.power === SPECIAL_POWER) {
            poolPower = item.power;
            return false;
        }
        return true;
    });

    document.getElementById('distPower').innerText = poolPower.toLocaleString();

    const method = document.getElementById('calcMethod').value;
    let finalData = [];

    // --- CÁLCULOS ---
    
    if (method === "1") {
        // IGUALITÁRIA
        const share = poolPower / list.length;
        finalData = list.map(item => ({
            ...item,
            receive: share
        }));
    } 
    else if (method === "2") {
        // NÚMERO DE QUEIMADOS
        const totalBurned = list.reduce((sum, item) => sum + item.nftBurned, 0);
        const divisor = totalBurned + 921;
        const ratio = poolPower / divisor;
        
        finalData = list.map(item => ({
            ...item,
            receive: (item.nftBurned + 1) * ratio
        }));
    }
    else if (method === "3") {
        // APLICAR COM TRD
        const totalBurned = list.reduce((sum, item) => sum + item.nftBurned, 0);
        const divisorBase = totalBurned + 921;
        
        // Soma dos fatores individuais: (nftBurned + 1 + (trdBurned/10000))
        const totalFactor = list.reduce((sum, item) => {
            return sum + (item.nftBurned + 1 + (item.trdBurned / 10000));
        }, 0);

        const ratio = poolPower / totalFactor;

        finalData = list.map(item => ({
            ...item,
            receive: (item.nftBurned + 1 + (item.trdBurned / 10000)) * ratio
        }));
    }

    // 2. Ordenar por Power do maior para o menor
    finalData.sort((a, b) => b.power - a.power);

    // 3. Renderizar Tabela
    renderTable(finalData);
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    data.forEach(item => {
        const row = `<tr>
            <td style="font-size: 0.8em;">${item.mint}</td>
            <td>${item.power.toLocaleString()}</td>
            <td>${item.nftBurned}</td>
            <td class="highlight">${item.receive.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            <td>${(item.power + item.receive).toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}