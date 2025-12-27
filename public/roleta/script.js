const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const winnerText = document.getElementById('winner-text');
const statusMsg = document.getElementById('status');
const btnSingle = document.getElementById('btnSingle');
const btnElim = document.getElementById('btnElimination');

let isSpinning = false;
let eliminationMode = false;

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
        ctx.fillStyle = (highlightIdx === i) ? '#f1c40f' : `hsl(${(i * 360 / names.length)}, 60%, 40%)`;
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, angle + arcSize);
        ctx.lineTo(centerX, centerY);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.fillText(name.substring(0, 15), radius - 30, 10);
        ctx.restore();
    });
}

function startSpin(mode) {
    if (isSpinning) return;
    const names = getNames();
    if (names.length < 2) {
        alert("Precisa de pelo menos 2 nomes!");
        return;
    }

    eliminationMode = (mode === 'elimination');
    executeSpin();
}

function executeSpin() {
    const names = getNames();
    isSpinning = true;
    toggleButtons(true);
    
    winnerText.classList.remove('winner-anim');
    statusMsg.innerText = eliminationMode ? `Eliminando... (Restam ${names.length})` : "Sorteando vencedor...";

    const extraSpins = 5 + Math.random() * 5;
    const totalRotation = extraSpins * 360 + Math.random() * 360;
    const duration = 4000;
    let start = null;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const easeOut = 1 - Math.pow(1 - (progress / duration), 3);
        const currentRotation = easeOut * totalRotation;
        
        canvas.style.transform = `rotate(${currentRotation % 360}deg)`;

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            finishSpin(currentRotation % 360);
        }
    }
    requestAnimationFrame(animate);
}

function finishSpin(rotation) {
    const names = getNames();
    const actualRotation = (360 - rotation + 270) % 360;
    const winnerIndex = Math.floor(actualRotation / (360 / names.length)) % names.length;
    const chosenName = names[winnerIndex];

    drawRoulette(winnerIndex);
    
    if (eliminationMode) {
        winnerText.innerText = "❌ ELIMINADO: " + chosenName;
        
        // Remove o nome da lista
        const newNames = names.filter((_, i) => i !== winnerIndex);
        document.getElementById('namesInput').value = newNames.join(', ');

        if (newNames.length > 1) {
            statusMsg.innerText = "Próximo giro em 7 segundos...";
            setTimeout(() => {
                if (newNames.length > 0) {
                    drawRoulette();
                    executeSpin();
                }
            }, 7000);
        } else {
            winnerText.innerText = "🏆 VENCEDOR FINAL: " + newNames[0];
            winnerText.classList.add('winner-anim');
            statusMsg.innerText = "Fim do jogo!";
            isSpinning = false;
            toggleButtons(false);
        }
    } else {
        winnerText.innerText = "🏆 SORTEADO: " + chosenName;
        winnerText.classList.add('winner-anim');
        statusMsg.innerText = "Sorteio concluído!";
        isSpinning = false;
        toggleButtons(false);
    }
}

function toggleButtons(disabled) {
    btnSingle.disabled = disabled;
    btnElim.disabled = disabled;
}

document.getElementById('namesInput').addEventListener('input', () => drawRoulette());
drawRoulette();