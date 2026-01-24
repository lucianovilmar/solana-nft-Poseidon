let participants = [];

function setupGame() {
    const text = document.getElementById('namesInput').value;
    participants = text.split('\n').filter(n => n.trim() !== '');
    
    if (participants.length === 0) {
        alert("Por favor, digite pelo menos um nome.");
        return;
    }

    // Embaralhar nomes
    participants.sort(() => Math.random() - 0.5);

    const board = document.getElementById('board');
    board.innerHTML = '';
    document.getElementById('result').innerText = "Fogo à vontade! Escolha um quadrante.";

    // Criar o tabuleiro baseado no número de pessoas (máximo 25 para o grid 5x5)
    participants.forEach((name, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.innerText = `B-${index + 1}`;
        cell.onclick = () => revealName(cell, name);
        board.appendChild(cell);
    });
}

function revealName(element, name) {
    if (element.classList.contains('revealed')) return;

    element.classList.add('hit', 'revealed');
    element.innerText = "💥";
    
    document.getElementById('result').innerHTML = `ALVO ATINGIDO: <span style="color:#64ffda">${name}</span>!`;
}