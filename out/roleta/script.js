const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const winnerText = document.getElementById('winner-text');
const statusMsg = document.getElementById('status');
const btnSingle = document.getElementById('btnSingle');
const btnElim = document.getElementById('btnElimination');

let isSpinning = false;
let eliminationMode = false;
let currentRotation = 0;

function getNames() {
    return document.getElementById('namesInput').value
        .split(',')
        .map(n => n.trim())
        .filter(n => n !== "");
}

function drawRoulette(highlightIdx = null) {
    const names = getNames();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (names.length === 0) return;

    const arcSize = (2 * Math.PI) / names.length;

    names.forEach((name, i) => {
        const angle = i * arcSize;
        ctx.beginPath();
        
        // Cor da fatia
        if (names.length === 1) {
            ctx.fillStyle = '#f1c40f'; // Dourado para o vencedor único
        } else {
            ctx.fillStyle = (highlightIdx === i) ? '#ffffff' : `hsl(${(i * 360 / names.length)}, 65%, 45%)`;
        }
        
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nome
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = (highlightIdx === i) ? "#000" : "white";
        ctx.font = "bold 20px Arial";
        ctx.fillText(name.substring(0, 18), radius - 30, 10);
        ctx.restore();
    });
}

function startSpin(mode) {
    if (isSpinning) return;
    const names = getNames();
    if (names.length < 2) {
        alert("Precisa de pelo menos 2 nomes para jogar!");
        return;
    }
    eliminationMode = (mode === 'elimination');
    toggleButtons(true);
    executeSpin();
}

function executeSpin() {
    const names = getNames();
    isSpinning = true;
    winnerText.classList.remove('vencedor-final');
    winnerText.classList.remove('flash-red');
    
    statusMsg.innerText = eliminationMode ? `MODO ELIMINAÇÃO: ${names.length} na disputa...` : "SORTEANDO...";

    const spins = 5 + Math.random() * 5;
    const deg = spins * 360 + Math.random() * 360;
    currentRotation += deg;
    
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Espera a animação do CSS (4s) terminar
    setTimeout(() => {
        finishSpin();
    }, 4000);
}

function finishSpin() {
    const names = getNames();
    const normalizedRotation = currentRotation % 360;
    const actualRotation = (360 - normalizedRotation + 270) % 360;
    const winnerIndex = Math.floor(actualRotation / (360 / names.length)) % names.length;
    const chosenName = names[winnerIndex];

    drawRoulette(winnerIndex);
    
    if (eliminationMode) {
        winnerText.innerHTML = `<span class="flash-red">ELIMINADO:</span><br>${chosenName}`;
        
        // Remove o nome da lista após o sorteio
        setTimeout(() => {
            const newNames = names.filter((_, i) => i !== winnerIndex);
            document.getElementById('namesInput').value = newNames.join(', ');
            drawRoulette();

            if (newNames.length > 1) {
                statusMsg.innerText = `Próximo giro em 4 segundos...`;
                setTimeout(() => executeSpin(), 4000);
            } else {
                // GRANDE FINAL
                statusMsg.innerText = "TEMOS UM VENCEDOR! 🏆";
                winnerText.innerHTML = `VENCEDOR FINAL:<br>${newNames[0]}`;
                winnerText.classList.add('vencedor-final');
                isSpinning = false;
                toggleButtons(false);
                drawRoulette(); // Redesenha para ficar só a cor do vencedor
            }
        }, 1500); // Pequena pausa para ver quem foi eliminado antes de sumir
    } else {
        winnerText.innerHTML = `SORTEADO:<br>${chosenName}`;
        winnerText.classList.add('vencedor-final');
        statusMsg.innerText = "Sorteio finalizado!";
        isSpinning = false;
        toggleButtons(false);
    }
}

function toggleButtons(disabled) {
    btnSingle.disabled = disabled;
    btnElim.disabled = disabled;
}

document.getElementById('namesInput').addEventListener('input', () => {
    if(!isSpinning) drawRoulette();
});

drawRoulette();