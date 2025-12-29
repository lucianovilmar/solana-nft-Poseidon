const ARENA_SIZE = 600; // Largura/Altura da arena
const FIGHTER_RADIUS = 35; // Raio de cada lutador (metade da largura/altura)
const ARENA_CENTER = ARENA_SIZE / 2;
const ARENA_INNER_RADIUS = ARENA_CENTER - FIGHTER_RADIUS; // Limite para o centro do lutador

let fighters = [];
let gameInterval;
let isGameRunning = false;

function showErrorMessage(message) {
    const errorBox = document.getElementById('setup-error');
    errorBox.innerText = message;
    errorBox.style.display = 'block';
    setTimeout(() => errorBox.style.display = 'none', 3000);
}

function startGame() {
    const nameList = document.getElementById('nameList').value;
    const names = nameList.split(/,|\n/).map(name => name.trim()).filter(name => name !== '');

    if (names.length < 2) {
        showErrorMessage("Por favor, insira pelo menos 2 nomes para a batalha.");
        return;
    }
    if (names.length > 20) {
        showErrorMessage("Máximo de 20 lutadores por batalha para melhor visualização.");
        return;
    }

    document.getElementById('setup-card').style.display = 'none';
    document.getElementById('arena-container').style.display = 'block';
    document.getElementById('winner-display').style.display = 'none';

    initializeFighters(names);
    isGameRunning = true;
    gameInterval = setInterval(gameLoop, 50); // Loop principal do jogo
}

function initializeFighters(names) {
    const arena = document.getElementById('arena-container');
    arena.innerHTML = ''; // Limpa lutadores anteriores
    fighters = [];

    names.forEach((name, index) => {
        const fighterElement = document.createElement('div');
        fighterElement.classList.add('fighter');
        fighterElement.innerText = name;
        fighterElement.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`; // Cor aleatória

        // Posição inicial no centro, com leve variação para não sobrepor
        let startX = ARENA_CENTER - FIGHTER_RADIUS + (Math.random() - 0.5) * 50;
        let startY = ARENA_CENTER - FIGHTER_RADIUS + (Math.random() - 0.5) * 50;

        fighterElement.style.left = `${startX}px`;
        fighterElement.style.top = `${startY}px`;

        const fighter = {
            id: index,
            name: name,
            element: fighterElement,
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 2, // Velocidade inicial aleatória
            vy: (Math.random() - 0.5) * 2,
            radius: FIGHTER_RADIUS,
            isEliminated: false,
            force: 1 // Força base para empurrar outros
        };
        fighters.push(fighter);
        arena.appendChild(fighterElement);
    });
}

function gameLoop() {
    if (!isGameRunning) return;

    let activeFighters = fighters.filter(f => !f.isEliminated);

    if (activeFighters.length <= 1) {
        endGame(activeFighters.length === 1 ? activeFighters[0].name : "Nenhum vencedor (todos eliminados simultaneamente)");
        return;
    }

    activeFighters.forEach(f => {
        // Movimento básico (pode ser mais complexo depois)
        f.x += f.vx;
        f.y += f.vy;

        // "Rebate" nas bordas invisíveis da arena (mantém dentro)
        // Usando a distância do centro do lutador ao centro da arena
        let distFromCenter = Math.sqrt(Math.pow(f.x + FIGHTER_RADIUS - ARENA_CENTER, 2) + Math.pow(f.y + FIGHTER_RADIUS - ARENA_CENTER, 2));

        if (distFromCenter > ARENA_INNER_RADIUS) {
            // Calculo para "rebater" mais suavemente, apontando para o centro
            let angleToCenter = Math.atan2((ARENA_CENTER - (f.y + FIGHTER_RADIUS)), (ARENA_CENTER - (f.x + FIGHTER_RADIUS)));
            f.vx = Math.cos(angleToCenter) * Math.abs(f.vx) * 0.8; // Reduz um pouco a velocidade
            f.vy = Math.sin(angleToCenter) * Math.abs(f.vy) * 0.8;
        } else {
            // Pequena força aleatória para simular "luta"
            f.vx += (Math.random() - 0.5) * 0.1;
            f.vy += (Math.random() - 0.5) * 0.1;

            // Limita a velocidade máxima
            let speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
            const MAX_SPEED = 3;
            if (speed > MAX_SPEED) {
                f.vx = (f.vx / speed) * MAX_SPEED;
                f.vy = (f.vy / speed) * MAX_SPEED;
            }
        }

        // Colisões entre lutadores
        activeFighters.forEach(otherF => {
            if (f === otherF) return; // Não colide consigo mesmo

            let dx = (f.x + FIGHTER_RADIUS) - (otherF.x + FIGHTER_RADIUS);
            let dy = (f.y + FIGHTER_RADIUS) - (otherF.y + FIGHTER_RADIUS);
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (f.radius + otherF.radius)) {
                // Colisão detectada!
                // Empurra os lutadores para fora um do outro
                let angle = Math.atan2(dy, dx);
                let overlap = (f.radius + otherF.radius) - distance;

                f.x += Math.cos(angle) * (overlap / 2) * (otherF.force / (f.force + otherF.force)); // Empurra um com base na força
                f.y += Math.sin(angle) * (overlap / 2) * (otherF.force / (f.force + otherF.force));

                otherF.x -= Math.cos(angle) * (overlap / 2) * (f.force / (f.force + otherF.force)); // E o outro na direção oposta
                otherF.y -= Math.sin(angle) * (overlap / 2) * (f.force / (f.force + otherF.force));

                // Transfere um pouco da velocidade (simulando impacto)
                let avgVx = (f.vx + otherF.vx) / 2;
                let avgVy = (f.vy + otherF.vy) / 2;

                f.vx = avgVx + (Math.random() - 0.5) * 1;
                f.vy = avgVy + (Math.random() - 0.5) * 1;

                otherF.vx = avgVx + (Math.random() - 0.5) * 1;
                otherF.vy = avgVy + (Math.random() - 0.5) * 1;
            }
        });

        // Atualiza a posição visual
        f.element.style.left = `${f.x}px`;
        f.element.style.top = `${f.y}px`;

        // Verifica eliminação
        if (distFromCenter > ARENA_CENTER) { // Centro do lutador passou da borda externa da arena
            f.isEliminated = true;
            f.element.classList.add('eliminated');
        }
    });
}

function endGame(winnerName) {
    isGameRunning = false;
    clearInterval(gameInterval);
    document.getElementById('winner-display').innerText = `🏆 Vencedor: ${winnerName}!`;
    document.getElementById('winner-display').style.display = 'block';

    // Adiciona botão para jogar novamente
    const playAgainBtn = document.createElement('button');
    playAgainBtn.innerText = "Jogar Novamente";
    playAgainBtn.onclick = () => location.reload();
    document.getElementById('winner-display').appendChild(playAgainBtn);
}