let grid = [];
let players = [];
let gridSize = 12;

function setupGame() {
    const input = document.getElementById('namesInput');
    const text = input.value;
    
    // Separa por vírgula ou quebra de linha
    players = text.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
    
    if (players.length < 2) {
        alert("Por favor, adicione pelo menos 2 jogadores!");
        return;
    }

    // Atualiza a lista lateral
    updatePlayerList();

    // Configura o Grid
    // Calcula tamanho baseado na quantidade de jogadores para ter espaço suficiente
    // Cada par ocupa 2 espaços. Adicionamos espaço para água.
    const minCells = Math.max(100, players.length * 5); 
    gridSize = Math.ceil(Math.sqrt(minCells));

    createGrid(gridSize);
    placeShips();
    renderBoard();
}

function updatePlayerList() {
    const list = document.getElementById('participantsList');
    list.innerHTML = '';
    players.forEach(p => {
        const div = document.createElement('div');
        div.className = 'participant-item';
        // Cria um ID seguro para o elemento da lista
        div.id = `p-${btoa(unescape(encodeURIComponent(p))).replace(/[^a-zA-Z0-9]/g, '')}`;
        div.innerHTML = `<span>⚓ ${p}</span>`;
        list.appendChild(div);
    });
}

function createGrid(size) {
    grid = [];
    for(let y=0; y<size; y++) {
        let row = [];
        for(let x=0; x<size; x++) {
            row.push({ type: 'water', revealed: false });
        }
        grid.push(row);
    }
}

function placeShips() {
    // Embaralhar jogadores
    let availablePlayers = [...players].sort(() => Math.random() - 0.5);
    
    // Formar grupos e colocar navios
    while(availablePlayers.length > 0) {
        let size = 2; // Padrão Fragata
        
        // Se tiver 3 ou mais, decide aleatoriamente entre Fragata (2) ou Destroyer (3)
        if (availablePlayers.length >= 3) {
            size = Math.random() > 0.5 ? 3 : 2;
        } 
        // Se sobrar 1 ou 2, força tamanho 2 (adiciona bot se for 1)
        else {
            size = 2;
        }

        let group = [];
        for(let i=0; i<size; i++) {
            if (availablePlayers.length > 0) {
                group.push(availablePlayers.pop());
            } else {
                group.push("Tripulante Bot");
            }
        }
        
        placeShipOnGrid(group);
    }
}

function placeShipOnGrid(group) {
    let placed = false;
    let attempts = 0;
    const size = group.length;
    
    while(!placed && attempts < 1000) {
        attempts++;
        const horizontal = Math.random() > 0.5;
        
        // Limites do grid baseados no tamanho do navio
        const maxX = horizontal ? gridSize - size : gridSize - 1;
        const maxY = horizontal ? gridSize - 1 : gridSize - size;

        const x = Math.floor(Math.random() * (maxX + 1));
        const y = Math.floor(Math.random() * (maxY + 1));
        
        // Verifica se as posições estão livres (Água)
        let clear = true;
        for(let i=0; i<size; i++) {
            let cx = horizontal ? x + i : x;
            let cy = horizontal ? y : y + i;
            if (grid[cy][cx].type !== 'water') {
                clear = false;
                break;
            }
        }

        if (clear) {
            // Coloca o navio
            const orientation = horizontal ? 'h' : 'v';
            
            for(let i=0; i<size; i++) {
                let cx = horizontal ? x + i : x;
                let cy = horizontal ? y : y + i;
                
                let part = 'mid';
                if (i === 0) part = 'prow';
                else if (i === size - 1) part = 'stern';
                
                grid[cy][cx] = { 
                    type: 'ship', 
                    player: group[i], 
                    orientation: orientation, 
                    part: part, 
                    revealed: false 
                };
            }
            placed = true;
        }
    }
}

function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    board.style.pointerEvents = 'auto'; // Reabilita cliques ao reiniciar
    
    for(let y=0; y<gridSize; y++) {
        for(let x=0; x<gridSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.onclick = () => revealCell(x, y, cell);
            board.appendChild(cell);
        }
    }
}

function revealCell(x, y, element) {
    const cellData = grid[y][x];
    if (cellData.revealed) return;
    
    cellData.revealed = true;
    element.classList.add('revealed');
    
    if (cellData.type === 'water') {
        element.classList.add('water');
        element.innerText = "🌊";
    } else {
        // É um navio/jogador
        element.classList.add('hit', 'ship-hull');
        
        // Adiciona classes para desenhar o formato do navio (arredondado)
        if (cellData.orientation && cellData.part) {
            element.classList.add(`ship-${cellData.orientation}-${cellData.part}`);
        }

        // Usa innerHTML com span e z-index para ficar acima do desenho do navio
        element.innerHTML = `<span style="position:relative; z-index:10; text-shadow: 1px 1px 2px black;">${cellData.player}</span>`;
        
        // Marca eliminado na lista lateral
        const safeId = `p-${btoa(unescape(encodeURIComponent(cellData.player))).replace(/[^a-zA-Z0-9]/g, '')}`;
        const listItem = document.getElementById(safeId);
        if(listItem) {
            listItem.classList.add('eliminated');
            checkWinner();
        }
    }
}

function checkWinner() {
    const listItems = document.querySelectorAll('.participant-item');
    const activeItems = Array.from(listItems).filter(item => !item.classList.contains('eliminated'));
    
    if (activeItems.length === 1) {
        const championName = activeItems[0].innerText.replace('⚓ ', '');
        
        // Destaca o campeão na lista
        activeItems[0].style.color = '#fbbf24';
        activeItems[0].style.fontWeight = 'bold';
        activeItems[0].innerHTML = `🏆 ${championName} (CAMPEÃO)`;

        // Desabilita o tabuleiro para impedir mais cliques
        document.getElementById('board').style.pointerEvents = 'none';

        // Mostra mensagem de vitória
        setTimeout(() => {
            alert(`🏆 FIM DE JOGO! 🏆\n\nO Campeão é: ${championName}\n\nClique em "PREPARAR FROTAS" para iniciar uma nova partida.`);
        }, 200);
    }
}