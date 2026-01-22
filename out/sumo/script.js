const ARENA_SIZE = 600;
const FIGHTER_RADIUS = 37.5;
const ARENA_CENTER = ARENA_SIZE / 2;
const MIN_EXIT_VELOCITY = 15; 

let fighters = [];
let gameInterval;
let isGameRunning = false;
let eliminatedCount = 0;

function startGame() {
    const names = document.getElementById('nameList').value.split(/,|\n/).map(n => n.trim()).filter(n => n !== '');
    if (names.length < 2) return;
    document.getElementById('setup-card').style.display = 'none';
    document.getElementById('arena-container').style.display = 'block';
    document.getElementById('sidebar').style.display = 'block';
    initializeFighters(names);
    isGameRunning = true;
    gameInterval = setInterval(gameLoop, 30);
}

function initializeFighters(names) {
    const arena = document.getElementById('arena-container');
    arena.innerHTML = '';
    fighters = [];
    names.forEach((name, index) => {
        const el = document.createElement('div');
        el.className = 'fighter';
        el.innerHTML = `<span>${name}</span><div class="force-badge" id="force-${index}">F: 1.0</div>`;
        const hue = Math.random() * 360;
        el.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
        el.dataset.hue = hue; // Guarda a cor para a aura

        let startX = ARENA_CENTER - FIGHTER_RADIUS + (Math.random() - 0.5) * 200;
        let startY = ARENA_CENTER - FIGHTER_RADIUS + (Math.random() - 0.5) * 200;
        let angle = Math.random() * Math.PI * 2;

        const fighter = {
            id: index, name, element: el, x: startX, y: startY,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            force: 1.0, isEliminated: false
        };
        fighters.push(fighter);
        arena.appendChild(el);
    });
}

function gameLoop() {
    if (!isGameRunning) return;
    let active = fighters.filter(f => !f.isEliminated);
    
    if (active.length <= 1) {
        endGame(active.length === 1 ? active[0].name : "Empate!");
        return;
    }

    active.forEach(f => {
        let baseSpeedLimit = Math.max(0.8, 3.5 - (f.force * 0.8));
        let currentSpeed = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
        
        if (active.length <= 3) {
            let target = active.find(other => other !== f);
            if (target) {
                let dx = (target.x - f.x);
                let dy = (target.y - f.y);
                let angle = Math.atan2(dy, dx);
                f.vx += Math.cos(angle) * 0.1;
                f.vy += Math.sin(angle) * 0.1;
            }
        }

        if (currentSpeed < baseSpeedLimit) {
            f.vx *= 1.05; f.vy *= 1.05;
        }

        f.x += f.vx;
        f.y += f.vy;
        f.vx *= 0.99;
        f.vy *= 0.99;

        active.forEach(other => {
            if (f === other) return;
            let dx = (f.x + FIGHTER_RADIUS) - (other.x + FIGHTER_RADIUS);
            let dy = (f.y + FIGHTER_RADIUS) - (other.y + FIGHTER_RADIUS);
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < FIGHTER_RADIUS * 2) {
                let angle = Math.atan2(dy, dx);
                
                f.force = Math.min(5, f.force + 0.1);
                document.getElementById(`force-${f.id}`).innerText = `F: ${f.force.toFixed(1)}`;

                // APLICA EFEITO VISUAL DE IMPACTO
                f.element.classList.remove('hit-flash');
                void f.element.offsetWidth; // Trigger reflow
                f.element.classList.add('hit-flash');

                let impactPower = (f.force + other.force) * 2.5;
                f.vx = Math.cos(angle) * impactPower;
                f.vy = Math.sin(angle) * impactPower;
                other.vx = -Math.cos(angle) * impactPower;
                other.vy = -Math.sin(angle) * impactPower;

                f.x += f.vx * 0.5; f.y += f.vy * 0.5;
            }
        });

        let distCenter = Math.sqrt(Math.pow(f.x + FIGHTER_RADIUS - ARENA_CENTER, 2) + Math.pow(f.y + FIGHTER_RADIUS - ARENA_CENTER, 2));
        if (distCenter > (ARENA_CENTER - FIGHTER_RADIUS)) {
            let speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
            
            if (speed < MIN_EXIT_VELOCITY) {
                f.force = Math.max(0.5, f.force - 0.3);
                document.getElementById(`force-${f.id}`).innerText = `F: ${f.force.toFixed(1)}`;

                let angleToCenter = Math.atan2(ARENA_CENTER - (f.y + FIGHTER_RADIUS), ARENA_CENTER - (f.x + FIGHTER_RADIUS));
                let bounceSpeed = baseSpeedLimit + 3; 
                f.vx = Math.cos(angleToCenter) * bounceSpeed;
                f.vy = Math.sin(angleToCenter) * bounceSpeed;
                f.x += f.vx; f.y += f.vy;
            } else {
                eliminateFighter(f);
            }
        }

        // ATUALIZA VISUAL COM AURA DE FORÇA
        f.element.style.left = `${f.x}px`;
        f.element.style.top = `${f.y}px`;
        
        let visualScale = 0.6 + (f.force * 0.2);
        f.element.style.transform = `scale(${visualScale})`;

        // Lógica da Aura: Brilha mais conforme a força aumenta
        if (f.force > 2) {
            let glowIntensity = (f.force - 2) * 10; 
            f.element.style.boxShadow = `0 0 ${glowIntensity}px ${glowIntensity/2}px hsl(${f.element.dataset.hue}, 80%, 60%)`;
        } else {
            f.element.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
        }
    });
}

function eliminateFighter(f) {
    f.isEliminated = true;
    f.element.style.display = 'none';
    eliminatedCount++;
    const list = document.getElementById('eliminated-list');
    const item = document.createElement('div');
    item.className = 'eliminated-item';
    item.innerHTML = `<span>${eliminatedCount}º ${f.name}</span> <small>F: ${f.force.toFixed(1)}</small>`;
    list.prepend(item);
}

function endGame(winner) {
    isGameRunning = false;
    clearInterval(gameInterval);
    const display = document.getElementById('winner-display');
    display.innerHTML = `🏆 VENCEDOR: ${winner}!<br><button onclick="location.reload()" style="margin-top:20px">Novo Jogo</button>`;
    display.style.display = 'block';
}