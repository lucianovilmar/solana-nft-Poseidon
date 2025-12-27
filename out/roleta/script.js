const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const winnerDisplay = document.getElementById('winner');
let currentRotation = 0;
let isSpinning = false;

function drawRoulette() {
    const names = document.getElementById('namesList').value.split('\n').filter(n => n.trim() !== "");
    if (names.length === 0) return;

    const arcSize = (2 * Math.PI) / names.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((name, i) => {
        const angle = i * arcSize;
        
        // Desenha a fatia
        ctx.beginPath();
        ctx.fillStyle = `hsl(${(i * 360 / names.length)}, 70%, 50%)`;
        ctx.moveTo(200, 200);
        ctx.arc(200, 200, 200, angle, angle + arcSize);
        ctx.lineTo(200, 200);
        ctx.fill();
        ctx.stroke();

        // Desenha o texto
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.fillText(name, 180, 10);
        ctx.restore();
    });
}

function spin() {
    if (isSpinning) return;
    const names = document.getElementById('namesList').value.split('\n').filter(n => n.trim() !== "");
    if (names.length < 2) { alert("Insira pelo menos 2 nomes!"); return; }

    isSpinning = true;
    winnerDisplay.innerText = "Girando...";
    
    const extraSpins = Math.floor(Math.random() * 5 + 5); // 5 a 10 voltas completas
    const randomStop = Math.random() * 360; 
    const totalRotation = extraSpins * 360 + randomStop;
    
    let start = null;
    const duration = 4000; // 4 segundos de giro

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const easeOut = 1 - Math.pow(1 - (progress / duration), 3); // Efeito de desaceleração
        
        const rotation = easeOut * totalRotation;
        canvas.style.transform = `rotate(${rotation % 360}deg)`;

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            currentRotation = rotation % 360;
            determineWinner(names, currentRotation);
        }
    }
    requestAnimationFrame(animate);
}

function determineWinner(names, rotation) {
    // Ajuste para o ponteiro estar no topo (270 graus no círculo trigonométrico)
    const actualRotation = (360 - (rotation % 360) + 270) % 360;
    const segmentSize = 360 / names.length;
    const winnerIndex = Math.floor(actualRotation / segmentSize) % names.length;
    winnerDisplay.innerText = "O sorteado é: " + names[winnerIndex];
}

// Atualiza a roleta visualmente quando o usuário digita nomes
document.getElementById('namesList').addEventListener('input', drawRoulette);
drawRoulette();