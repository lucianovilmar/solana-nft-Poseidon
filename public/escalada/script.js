let climbers = [];
let gameActive = false;
const container = document.getElementById('mountain-container');
const snowEffect = document.getElementById('snowEffect');
const alertBox = document.getElementById('weather-alert');

function startClimb() {
    const names = document.getElementById('nameList').value.split(/,|\n/).map(n => n.trim()).filter(n => n);
    if (names.length < 2) return;

    document.getElementById('setup-card').style.display = 'none';
    container.style.display = 'block';
    
    climbers = names.map((name, i) => {
        const el = document.createElement('div');
        el.className = 'climber';
        el.innerHTML = `🧗 ${name}`;
        el.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        el.style.bottom = "0px";
        el.style.left = `${(i * 60) % 300 + 20}px`;
        container.appendChild(el);
        
        return {
            name,
            element: el,
            y: 0,
            velocity: 0,
            stamina: Math.random() * 100
        };
    });

    gameActive = true;
    requestAnimationFrame(update);
}

function update() {
    if (!gameActive) return;

    let leaderY = Math.max(...climbers.map(c => c.y));
    let isNevasca = false;

    // Ativa nevasca se o líder passar de 60% da montanha
    if (leaderY > container.offsetHeight * 0.6) {
        isNevasca = true;
        snowEffect.style.display = 'block';
        alertBox.style.display = 'block';
        createSnow();
    } else {
        snowEffect.style.display = 'none';
        alertBox.style.display = 'none';
    }

    climbers.forEach(c => {
        // Lógica de Movimento: Pequenos impulsos aleatórios
        if (Math.random() > 0.95) {
            c.velocity += Math.random() * 5 + 2;
        }

        // Efeito da Nevasca: líderes sofrem resistência pesada
        if (isNevasca && c.y > container.offsetHeight * 0.5) {
            c.velocity -= 0.4; // Vento contra
            c.y -= 1.5;        // Escorrega
        }

        // Aplica gravidade e movimento
        c.y += c.velocity;
        c.velocity *= 0.9; // Atrito/Cansaço

        // Limita para não sair por baixo
        if (c.y < 0) c.y = 0;

        // Atualizar visual
        c.element.style.bottom = `${c.y}px`;
        
        // Verifica vitória (20px do topo)
        if (c.y > container.offsetHeight - 60) {
            win(c.name);
        }
    });

    if (gameActive) requestAnimationFrame(update);
}

function createSnow() {
    if (Math.random() > 0.7) {
        const s = document.createElement('div');
        s.className = 'snow-particle';
        s.innerHTML = '❄';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = '0px';
        snowEffect.appendChild(s);
        setTimeout(() => s.remove(), 1000);
    }
}

function win(name) {
    gameActive = false;
    alertBox.style.background = "#27ae60";
    alertBox.innerHTML = `🏆 ${name.toUpperCase()} CHEGOU AO TOPO!`;
    alertBox.style.display = "block";
    
    const btn = document.createElement('button');
    btn.innerText = "Reiniciar";
    btn.style.marginTop = "20px";
    btn.onclick = () => location.reload();
    container.appendChild(btn);
}