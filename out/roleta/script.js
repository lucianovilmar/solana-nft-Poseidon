const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const winnerText = document.getElementById('winner-text');
const statusMsg = document.getElementById('status');
const setas = [document.getElementById('seta1'), document.getElementById('seta2'), document.getElementById('seta3')];

let isSpinning = false;
let gameMode = 'single';
let currentRotation = 0;
const fixAngles = [0, 120, 240];

function getNames() {
    return document.getElementById('namesInput').value.split(',').map(n => n.trim()).filter(n => n !== "");
}

function drawRoulette(highlightIndices = []) {
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
        ctx.fillStyle = (names.length === 1) ? '#f1c40f' : (highlightIndices.includes(i) ? '#ffffff' : `hsl(${(i * 360 / names.length)}, 65%, 45%)`);
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
        ctx.fillStyle = highlightIndices.includes(i) ? "#000" : "white";
        ctx.font = "bold 18px Arial";
        ctx.fillText(name.substring(0, 15), radius - 30, 10);
        ctx.restore();
    });
}

function updateSetasVisibility() {
    const names = getNames();
    setas.forEach(s => s.style.display = 'none');

    if (gameMode === 'chaos') {
        if (names.length >= 6) {
            setas[0].style.display = 'block'; setas[1].style.display = 'block'; setas[2].style.display = 'block';
        } else if (names.length >= 4) {
            setas[0].style.display = 'block'; setas[1].style.display = 'block';
        } else {
            setas[0].style.display = 'block';
        }
    } else {
        setas[0].style.display = 'block';
    }
}

function startSpin(mode) {
    if (isSpinning) return;
    const names = getNames();
    if (mode === 'chaos' && names.length < 6) { alert("O Modo Caos exige 6+ nomes!"); return; }
    if (names.length < 2) return;

    gameMode = mode;
    toggleButtons(true);
    updateSetasVisibility();
    executeSpin();
}

function executeSpin() {
    isSpinning = true;
    winnerText.classList.remove('vencedor-final', 'flash-red');
    statusMsg.innerText = "GIRANDO...";

    const addRot = (8 + Math.random() * 5) * 360;
    currentRotation += addRot;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(finishSpin, 4000);
}

function finishSpin() {
    const names = getNames();
    const totalSlots = names.length;
    const eliminatedIndices = [];
    
    let numAtivas = 1;
    if (gameMode === 'chaos') {
        if (names.length >= 6) numAtivas = 3;
        else if (names.length >= 4) numAtivas = 2;
    }

    for (let i = 0; i < numAtivas; i++) {
        const rotFinal = currentRotation % 360;
        const setaAng = fixAngles[i];
        const angleUnderSeta = (360 - rotFinal + setaAng + 270) % 360;
        const idx = Math.floor(angleUnderSeta / (360 / totalSlots)) % totalSlots;
        if (!eliminatedIndices.includes(idx)) eliminatedIndices.push(idx);
    }

    const chosenNames = eliminatedIndices.map(i => names[i]);
    drawRoulette(eliminatedIndices);
    
    if (gameMode !== 'single') {
        winnerText.innerHTML = `<span class="flash-red">ELIMINADOS:</span><br>${chosenNames.join(', ')}`;
        
        setTimeout(() => {
            const newNames = names.filter((_, i) => !eliminatedIndices.includes(i));
            document.getElementById('namesInput').value = newNames.join(', ');
            drawRoulette();

            if (newNames.length > 1) {
                statusMsg.innerText = "Preparando próximo giro...";
                
                setTimeout(() => {
                    updateSetasVisibility();
                    executeSpin();
                }, 1000);
            } else {
                statusMsg.innerText = "🏆 FIM DE JOGO!";
                winnerText.innerHTML = `VENCEDOR FINAL:<br>${newNames[0] || chosenNames[0]}`;
                winnerText.classList.add('vencedor-final');
                isSpinning = false;
                toggleButtons(false);
            }
        }, 3000); 
    } else {
        winnerText.innerHTML = `SORTEADO:<br>${chosenNames[0]}`;
        winnerText.classList.add('vencedor-final');
        isSpinning = false;
        toggleButtons(false);
    }
}

function toggleButtons(dis) {
    document.querySelectorAll('button').forEach(b => b.disabled = dis);
}

drawRoulette();
document.getElementById('namesInput').addEventListener('input', () => { if(!isSpinning) drawRoulette(); });