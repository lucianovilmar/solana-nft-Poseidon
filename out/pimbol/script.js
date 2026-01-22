// --- Configurações e Variáveis Globais ---
const { Engine, Render, Runner, Bodies, Composite, Events, Body, Vector } = Matter;

// Elementos do DOM
const playerListEl = document.getElementById('playerList');
const playerNameInput = document.getElementById('playerName');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const actionBtn = document.getElementById('actionBtn');
const statusMessageEl = document.getElementById('statusMessage');
const roundInfoEl = document.getElementById('roundInfo');
const currentGroupListEl = document.getElementById('currentGroupList');

// Estado do Jogo
let players = []; // { id, name, score, color, eliminated, lastScore }
let gameState = 'REGISTRATION'; // REGISTRATION, PLAYING, ROUND_END, TIE_BREAKER, GAME_OVER
let currentRound = 1;
let currentGroupIndex = 0;
let activeBalls = 0;
let bucketScores = []; // Pontuações dos 9 copos
let initialPlayerCount = 0;
let isFinalRound = false;
let processingTieBreaker = false;
let playersInTie = [];
let targetSurvivors = 0;
let ballBarTimers = new Map();
let ballStuckTimers = new Map();

// Cores para os jogadores
const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

// --- Configuração do Matter.js ---
const engine = Engine.create();
const world = engine.world;
engine.timing.timeScale = 0.5; // Reduz a velocidade pela metade (Slow Motion)

const largura = 500; // Aumentado para caber 9 copos melhor
const altura = 700;

const render = Render.create({
    element: document.getElementById('canvas-container'),
    engine: engine,
    options: {
        width: largura,
        height: altura,
        wireframes: false,
        background: '#1a1a1a'
    }
});

// --- Funções de Construção do Cenário ---

function setupWorld() {
    Composite.clear(world);
    Engine.clear(engine);
    ballBarTimers.clear();
    ballStuckTimers.clear();

    // 1. Pinos (Obstáculos)
    const pinos = [];
    const linhas = 12;
    const cols = 11;
    const espacamentoX = largura / cols;
    
    // Escolher 3 linhas aleatórias para se moverem
    // Bloquear primeira (0), segunda (1) e ultima (linhas - 1)
    let movingRows = [];
    let attempts = 0;
    while(movingRows.length < 3 && attempts < 100) {
        let min = 2;
        let max = linhas - 2;
        let r = Math.floor(Math.random() * (max - min + 1)) + min;
        
        // Verifica se já existe ou se é adjacente (garante linha fixa entre elas)
        let isAdjacent = movingRows.some(row => Math.abs(row - r) <= 1);

        if(!movingRows.includes(r) && !isAdjacent) movingRows.push(r);
        attempts++;
    }
    if (movingRows.length < 3) movingRows = [3, 6, 9]; // Fallback

    for (let l = 0; l < linhas; l++) {
        // Se for a 7ª linha (índice 6), escolhe 3 colunas aleatórias para serem especiais
        let specialCols = [];
        if (l === 6) {
            while(specialCols.length < 3) {
                let r = Math.floor(Math.random() * cols);
                if(!specialCols.includes(r)) specialCols.push(r);
            }
        }

        for (let c = 0; c < cols; c++) {
            let x = c * espacamentoX + (l % 2 === 0 ? espacamentoX/2 : 0) + 25;
            let y = l * 45 + 80;
            
            if (x > 10 && x < largura - 10) {
                let isSpecial = (l === 6 && specialCols.includes(c));
                let isMoving = movingRows.includes(l);

                let radius = isSpecial ? 8 : 4; // Dobro do tamanho
                let color = isSpecial ? '#ff0055' : (isMoving ? '#00ffff' : '#ffffff');
                let restitution = isSpecial ? 1.6 : 0; // Impacto alto

                const pino = Bodies.circle(x, y, radius, { 
                    isStatic: true,
                    render: { fillStyle: color },
                    label: isSpecial ? 'pino-especial' : 'pino',
                    restitution: restitution,
                    plugin: {
                        isMoving: isMoving,
                        initialX: x,
                        speed: 0.002,
                        range: 30,
                        offset: l * 1000
                    }
                });
                pinos.push(pino);
            }
        }
    }

    // 2. Copos (9 copos)
    const numCopos = 9;
    const larguraCopo = largura / numCopos;
    const paredesCopo = [];
    bucketScores = [];

    for (let i = 0; i <= numCopos; i++) {
        // Paredes verticais
        const x = i * larguraCopo;
        const div = Bodies.rectangle(x, altura - 40, 4, 80, { 
            isStatic: true, 
            render: { fillStyle: '#555' },
            label: 'parede'
        });
        paredesCopo.push(div);

        // Sensores de pontuação (chão de cada copo)
        if (i < numCopos) {
            const score = Math.floor(Math.random() * 15) + 1; // Pontuação 1 a 15
            bucketScores.push(score);
            
            const sensorX = x + larguraCopo / 2;
            // Barra visível acima da pontuação (que fica em altura - 20)
            const sensor = Bodies.rectangle(sensorX, altura - 40, larguraCopo - 6, 10, {
                isStatic: true,
                isSensor: false, // Agora é sólido para a bola parar nele
                label: `sensor-${score}`,
                render: { visible: true, fillStyle: '#3b82f6' } // Barra azul visível
            });
            paredesCopo.push(sensor);
        }
    }

    // 3. Barras Inclinadas (Aparecem apenas nas linhas que se movem)
    const barras = [];
    
    // 3 áreas no meio (centralizadas)
    const margin = largura * 0.15;
    const areaWidth = (largura - (margin * 2)) / 3;
    const positions = [0, 1, 2].sort(() => Math.random() - 0.5);
    
    movingRows.forEach((r, i) => {
        const posIndex = positions[i % 3];
        const minX = margin + (posIndex * areaWidth) + 10;
        const maxX = margin + ((posIndex + 1) * areaWidth) - 10;
        
        const bx = Math.random() * (maxX - minX) + minX;
        const by = r * 45 + 80; // Mesma altura da linha que se move
        const angle = (Math.random() * Math.PI / 2) - (Math.PI / 4); // +/- 45 graus

        const barra = Bodies.rectangle(bx, by, 80, 10, {
            isStatic: true,
            angle: angle,
            render: { fillStyle: '#a855f7' },
            label: 'barra',
            plugin: { isRotating: false }
        });
        barras.push(barra);
    });

    // Paredes laterais para a bola não sair
    const paredeEsq = Bodies.rectangle(0, altura/2, 10, altura, { isStatic: true, render: { visible: false } });
    const paredeDir = Bodies.rectangle(largura, altura/2, 10, altura, { isStatic: true, render: { visible: false } });

    Composite.add(world, [...pinos, ...paredesCopo, ...barras, paredeEsq, paredeDir]);
}

// Custom Render para desenhar os números nos copos
Events.on(render, 'afterRender', function() {
    const ctx = render.context;
    const numCopos = 9;
    const larguraCopo = largura / numCopos;

    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#fbbf24";

    for (let i = 0; i < numCopos; i++) {
        if (bucketScores[i]) {
            const x = i * larguraCopo + larguraCopo / 2;
            ctx.fillText(bucketScores[i], x, altura - 20);
        }
    }

    // Desenhar iniciais nas bolas
    ctx.font = "bold 10px Arial";
    ctx.fillStyle = "#000000";
    const bodies = Composite.allBodies(engine.world);
    bodies.forEach(body => {
        if (body.label.startsWith('ball') && body.plugin && body.plugin.initials) {
            ctx.fillText(body.plugin.initials, body.position.x, body.position.y + 4);
        }
    });
});

// --- Lógica do Jogo ---

function addPlayer() {
    const inputVal = playerNameInput.value;
    if (!inputVal) return;

    // Separa por vírgula, remove espaços extras e filtra nomes vazios
    const names = inputVal.split(',').map(n => n.trim()).filter(n => n.length > 0);

    names.forEach(name => {
        // Pega as duas primeiras letras como inicial
        const initials = name.substring(0, 2).toUpperCase();
        const player = {
            id: Date.now() + Math.random(),
            name: name,
            initials: initials,
            score: 0,
            tieScore: 0,
            lastScore: 0,
            color: colors[players.length % colors.length],
            eliminated: false
        };
        players.push(player);
    });

    playerNameInput.value = '';
    updateUI();
}

function updateUI() {
    playerListEl.innerHTML = '';
    
    // Ordenar: Ativos primeiro, depois por pontuação
    const sortedPlayers = [...players].sort((a, b) => {
        if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
        return b.score - a.score;
    });

    sortedPlayers.forEach(p => {
        const li = document.createElement('li');
        li.className = `player-item ${p.eliminated ? 'eliminated' : ''}`;
        li.innerHTML = `
            <span style="color: ${p.color}">● ${p.name}</span>
            <span>${p.score} pts</span>
        `;
        playerListEl.appendChild(li);
    });

    roundInfoEl.innerText = `Rodada: ${currentRound}`;
}

function getActivePlayers() {
    return players.filter(p => !p.eliminated);
}

function startNextGroupDrop() {
    // Limpar bolas da rodada anterior
    const bodies = Composite.allBodies(world);
    const balls = bodies.filter(b => b.label.startsWith('ball'));
    Composite.remove(world, balls);

    let activePlayers = getActivePlayers();
    if (gameState === 'TIE_BREAKER') {
        activePlayers = playersInTie;
    }
    
    // Se não há mais jogadores para jogar nesta rodada
    if (currentGroupIndex * 5 >= activePlayers.length) {
        finishRound();
        return;
    }

    // Pegar grupo de 5 (ou menos se for o final)
    const group = activePlayers.slice(currentGroupIndex * 5, (currentGroupIndex + 1) * 5);
    
    // Resetar pontuação da rodada para exibição
    group.forEach(p => p.lastScore = 0);

    statusMessageEl.innerText = `Grupo ${currentGroupIndex + 1}: Soltando bolas...`;
    actionBtn.disabled = true;
    updateCurrentGroupUI();

    // Soltar bolas
    group.forEach((player, index) => {
        setTimeout(() => {
            spawnBall(player);
        }, index * 400); // Pequeno delay entre cada bola
    });

    activeBalls = group.length;
}

function updateCurrentGroupUI() {
    if (isFinalRound && gameState === 'GAME_OVER') return;

    let activePlayers = getActivePlayers();
    if (gameState === 'TIE_BREAKER') {
        activePlayers = playersInTie;
    }
    
    // Usa o índice atual para pegar o grupo que está jogando (ou acabou de jogar)
    const group = activePlayers.slice(currentGroupIndex * 5, (currentGroupIndex + 1) * 5);

    currentGroupListEl.innerHTML = '';
    group.forEach(p => {
        const li = document.createElement('li');
        li.className = 'player-item';
        // Mostra a pontuação ganha na vez, se houver
        const scoreDisplay = p.lastScore > 0 ? ` <span style="color: #fbbf24; font-weight: bold; margin-left: 5px;">+${p.lastScore}</span>` : '';
        
        li.innerHTML = `<span style="color: ${p.color}"><b>[${p.initials}]</b> ${p.name}</span>${scoreDisplay}`;
        currentGroupListEl.appendChild(li);
    });
}

function spawnBall(player) {
    // Posição aleatória no topo, mas centralizada
    const x = (largura / 2) + (Math.random() * 40 - 20);
    
    const bola = Bodies.circle(x, -20, 8, {
        restitution: 0.5,
        friction: 0.001,
        render: { fillStyle: player.color },
        label: `ball-${player.id}`, // Identifica de quem é a bola
        plugin: { initials: player.initials } // Guarda a inicial para renderizar
    });

    Composite.add(world, bola);
}

function finishRound() {
    gameState = 'ROUND_END';
    actionBtn.innerText = "Finalizar Rodada & Eliminar";
    actionBtn.disabled = false;
    statusMessageEl.innerText = "Todos os grupos jogaram. Clique para processar eliminações.";
    currentGroupListEl.innerHTML = ''; // Limpa a lista lateral
}

function processElimination() {
    if (processingTieBreaker) {
        resolveTieBreaker();
        return;
    }

    const activePlayers = getActivePlayers();
    
    if (isFinalRound) {
        activePlayers.sort((a, b) => b.score - a.score);
        
        // Exibir classificação final na área "Jogando Agora" (Direita)
        currentGroupListEl.innerHTML = '';
        
        const title = document.createElement('li');
        title.className = 'player-item';
        title.style.justifyContent = 'center';
        title.style.backgroundColor = '#333';
        title.innerHTML = '<strong>🏆 CLASSIFICAÇÃO FINAL</strong>';
        currentGroupListEl.appendChild(title);

        const medals = ['🥇', '🥈', '🥉'];
        activePlayers.slice(0, 3).forEach((p, i) => {
            const li = document.createElement('li');
            li.className = 'player-item';
            if (i === 0) li.style.border = '2px solid #fbbf24'; // Destaque campeão
            li.innerHTML = `<span>${medals[i]} ${p.name}</span><span>${p.score} pts</span>`;
            currentGroupListEl.appendChild(li);
        });

        statusMessageEl.innerText = "FIM DE JOGO!";
        actionBtn.innerText = "Reiniciar Jogo";
        gameState = 'GAME_OVER';
        return;
    }

    activePlayers.sort((a, b) => b.score - a.score);

    // 20% do total INICIAL de jogadores (Arredondado para baixo)
    let numToEliminate = Math.floor(initialPlayerCount * 0.20);
    
    // Garantir que restem pelo menos 3 para a final (se tivermos mais que 3)
    if (activePlayers.length > 3) {
        if (activePlayers.length - numToEliminate < 3) {
            numToEliminate = activePlayers.length - 3;
        }
    } else {
        numToEliminate = 0; // Já estamos no top 3 ou menos, vai pra final
    }

    if (numToEliminate === 0) {
        startFinalRound();
        return;
    }

    const cutoffIndex = activePlayers.length - numToEliminate;
    const cutoffScore = activePlayers[cutoffIndex].score;

    const playerSafe = activePlayers[cutoffIndex - 1];
    const playerCut = activePlayers[cutoffIndex];

    if (playerSafe && playerCut && playerSafe.score === playerCut.score) {
        playersInTie = activePlayers.filter(p => p.score === cutoffScore);
        targetSurvivors = cutoffIndex; // Salva quantos devem sobrar no total para respeitar a regra
        
        // Eliminar IMEDIATAMENTE quem tem pontuação MENOR que o corte
        activePlayers.forEach(p => {
            if (p.score < cutoffScore) {
                p.eliminated = true;
            }
        });

        // Regra Especial: Se o número de empatados for igual ao número que precisa ser eliminado (deste grupo),
        // e não há ninguém salvo neste grupo (o que é impossível se playerSafe.score == playerCut.score),
        // mas vamos garantir que se por acaso todos tiverem que sair, saiam.
        // Na prática, o desempate decide quem fica.
        
        playersInTie.forEach(p => p.tieScore = 0);
        
        processingTieBreaker = true;
        gameState = 'TIE_BREAKER';
        statusMessageEl.innerText = "Empate! Rodada de desempate (sem pontos extras).";
        actionBtn.innerText = "Iniciar Desempate";
        currentGroupIndex = 0;
        updateUI();
        return;
    }

    for (let i = cutoffIndex; i < activePlayers.length; i++) {
        activePlayers[i].eliminated = true;
    }

    prepareNextRound();
}

function resolveTieBreaker() {
    // Ordena pelos pontos da rodada de desempate
    playersInTie.sort((a, b) => b.tieScore - a.tieScore);
    
    const activePlayers = getActivePlayers(); // Pega todos que ainda não foram eliminados (inclui os do empate)
    
    // Recalcula quantos slots seguros restam para o grupo empatado
    // targetSurvivors é o número total de jogadores que devem restar no jogo
    const cutoffScore = playersInTie[0].score; // Pontuação original do empate
    const playersAbove = activePlayers.filter(p => p.score > cutoffScore).length; // Jogadores já salvos (pontuação maior)
    const safeSlotsForTied = targetSurvivors - playersAbove;

    // Elimina o excedente baseado na pontuação do desempate
    for (let i = safeSlotsForTied; i < playersInTie.length; i++) {
        playersInTie[i].eliminated = true;
    }

    processingTieBreaker = false;
    playersInTie = [];
    statusMessageEl.innerText = "Desempate concluído!";
    prepareNextRound();
}

function prepareNextRound() {
    const active = getActivePlayers();
    if (active.length <= 3) {
        startFinalRound();
        return;
    }
    currentRound++;
    currentGroupIndex = 0;
    setupWorld(); // Novos valores nos copos
    updateUI();
    statusMessageEl.innerText = `Eliminações concluídas. Iniciando Rodada ${currentRound}.`;
    actionBtn.innerText = "Soltar Bolas";
    gameState = 'PLAYING';
}

function startFinalRound() {
    isFinalRound = true;
    currentRound++;
    currentGroupIndex = 0;
    setupWorld();
    updateUI();
    roundInfoEl.innerText = "GRANDE FINAL";
    statusMessageEl.innerText = "GRANDE FINAL! Top 3.";
    actionBtn.innerText = "Soltar Bolas (Final)";
    gameState = 'PLAYING';
}

// --- Eventos ---

addPlayerBtn.addEventListener('click', addPlayer);

actionBtn.addEventListener('click', () => {
    if (gameState === 'REGISTRATION') {
        if (players.length < 2) {
            alert("Adicione pelo menos 2 jogadores!");
            return;
        }
        initialPlayerCount = players.length;
        gameState = 'PLAYING';
        setupWorld();
        actionBtn.innerText = "Soltar Bolas";
        statusMessageEl.innerText = "Jogo Iniciado!";
        addPlayerBtn.disabled = true;
        playerNameInput.disabled = true;
    } else if (gameState === 'PLAYING' || gameState === 'TIE_BREAKER') {
        startNextGroupDrop();
    } else if (gameState === 'ROUND_END') {
        processElimination();
    } else if (gameState === 'GAME_OVER') {
        location.reload();
    }
});

// Detecção de Colisão (Pontuação)
Events.on(engine, 'collisionStart', (event) => {
    const pairs = event.pairs;

    pairs.forEach(pair => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;

        // Identificar se é bola e sensor
        let ball = bodyA.label.startsWith('ball') ? bodyA : bodyB.label.startsWith('ball') ? bodyB : null;
        let sensor = bodyA.label.startsWith('sensor') ? bodyA : bodyB.label.startsWith('sensor') ? bodyB : null;

        if (ball && sensor) {
            // Se a bola já pontuou, ignora (para não contar múltiplas vezes enquanto ela quica/repousa)
            if (ball.plugin.hasScored) return;

            const playerId = parseFloat(ball.label.split('-')[1]);
            const points = parseInt(sensor.label.split('-')[1]);

            const player = players.find(p => p.id === playerId);
            if (player) {
                if (gameState === 'TIE_BREAKER') {
                    player.tieScore += points; // Soma apenas no placar de desempate
                } else {
                    player.score += points; // Soma no placar geral
                }
                player.lastScore = points;
                updateUI();
                updateCurrentGroupUI(); // Atualiza a lista da direita com os pontos ganhos
            }

            // Marca a bola como pontuada para não somar de novo, mas NÃO remove do mundo
            ball.plugin.hasScored = true;
            
            activeBalls--;

            if (activeBalls === 0) {
                actionBtn.disabled = false;
                currentGroupIndex++;
                statusMessageEl.innerText = "Grupo finalizado. Próximo?";
                
                // Verificar se acabou a rodada automaticamente
                let activeCount = getActivePlayers().length;
                if (gameState === 'TIE_BREAKER') {
                    activeCount = playersInTie.length;
                }
                
                if (currentGroupIndex * 5 >= activeCount) {
                    finishRound();
                }
            }
        }
    });
});

// Lógica das Barras (Timer e Rotação)
Events.on(engine, 'collisionActive', (event) => {
    const pairs = event.pairs;
    const timestamp = event.timestamp;

    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        let bar = null;
        
        if (bodyA.label === 'barra' && bodyB.label.startsWith('ball')) {
            bar = bodyA;
        } else if (bodyB.label === 'barra' && bodyA.label.startsWith('ball')) {
            bar = bodyB;
        }

        if (bar) {
            if (bar.plugin.isRotating) return;

            if (!ballBarTimers.has(pair.id)) {
                ballBarTimers.set(pair.id, timestamp);
            } else {
                const startTime = ballBarTimers.get(pair.id);
                // 3 segundos (3000ms) para acionar o giro
                if (timestamp - startTime > 3000) {
                    bar.plugin.isRotating = true;
                    bar.plugin.targetAngle = bar.angle + Math.PI; // Giro de 180 graus
                    ballBarTimers.delete(pair.id);
                }
            }
        }
    });
});

Events.on(engine, 'collisionEnd', (event) => {
    const pairs = event.pairs;
    pairs.forEach(pair => {
        if (ballBarTimers.has(pair.id)) {
            ballBarTimers.delete(pair.id);
        }
    });
});

// Atualização por frame (Movimento dos pinos e Rotação das barras)
Events.on(engine, 'beforeUpdate', (event) => {
    const time = event.timestamp;
    const bodies = Composite.allBodies(engine.world);
    
    bodies.forEach(body => {
        // Pinos que se mexem
        if (body.plugin && body.plugin.isMoving) {
            const dx = Math.sin(time * body.plugin.speed + body.plugin.offset) * body.plugin.range;
            Body.setPosition(body, {
                x: body.plugin.initialX + dx,
                y: body.position.y
            });
        }
        
        // Barras girando
        if (body.label === 'barra' && body.plugin && body.plugin.isRotating) {
            const rotationSpeed = 0.15;
            if (body.angle < body.plugin.targetAngle) {
                Body.setAngle(body, body.angle + rotationSpeed);
            } else {
                Body.setAngle(body, body.plugin.targetAngle);
                body.plugin.isRotating = false;
            }
        }

        // Regra: Bola presa por 3 segundos é relançada
        if (body.label.startsWith('ball') && !body.plugin.hasScored) {
            // Verifica se a velocidade é muito baixa (bola parada)
            if (body.speed < 0.15 && body.angularSpeed < 0.15) {
                if (!ballStuckTimers.has(body.id)) {
                    ballStuckTimers.set(body.id, time);
                } else {
                    if (time - ballStuckTimers.get(body.id) > 3000) {
                        // Presa por mais de 3 segundos
                        const playerId = parseFloat(body.label.split('-')[1]);
                        const player = players.find(p => p.id === playerId);
                        if (player) {
                            Composite.remove(world, body);
                            ballStuckTimers.delete(body.id);
                            spawnBall(player); // Relança a bola
                        }
                    }
                }
            } else {
                // Se a bola voltar a se mover, reseta o timer
                if (ballStuckTimers.has(body.id)) ballStuckTimers.delete(body.id);
            }
        }
    });
});

// Inicialização
Render.run(render);
Runner.run(Runner.create(), engine);
setupWorld();
