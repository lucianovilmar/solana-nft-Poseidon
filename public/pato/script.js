const track = document.getElementById('track');
const viewport = document.getElementById('viewport');
const setupOverlay = document.getElementById('setup-overlay');
const gameContainer = document.getElementById('game-container');
const namesInput = document.getElementById('namesInput');
const timerDisplay = document.getElementById('timer');
const podiumList = document.getElementById('podiumList');
const uiOverlay = document.getElementById('ui-overlay');

let ducks = [];
let finishers = [];
let gameState = 'idle';
let startTime = 0;
let animationId;
let speedInterval;
let trackX = 0;

const SPEEDS = {
    1: 0.9,
    2: 1.5,
    3: 2.2,
    4: 3.8,
    5: 7.8 
};

function createDuckSVG(color) {
    return `
    <div class="duck-shadow"></div>
    <svg width="85" height="85" viewBox="0 0 100 100" style="filter: drop-shadow(0px 4px 1px rgba(0,0,0,0.3));">
        <ellipse cx="42" cy="72" rx="30" ry="15" fill="rgba(0,0,0,0.1)" />
        <path d="M80 70 C80 45 60 40 40 40 C15 40 5 55 5 70 C5 85 20 90 45 90 C70 90 80 85 80 70 Z" fill="${color}" stroke="#000" stroke-width="3"/>
        <path d="M50 60 C25 55 15 65 18 75 C25 82 45 82 50 72 Z" fill="rgba(255,255,255,0.3)" stroke="rgba(0,0,0,0.4)" stroke-width="2"/>
        <path d="M78 65 L80 45 C82 35 70 30 60 35 L58 55 Z" fill="${color}" stroke="#000" stroke-width="3"/>
        <circle cx="62" cy="35" r="18" fill="${color}" stroke="#000" stroke-width="3"/>
        <circle cx="64" cy="30" r="4" fill="black"/>
        <circle cx="62" cy="28" r="1.5" fill="white"/>
        <path d="M75 35 C90 32 95 38 92 42 C88 46 75 45 75 42 Z" fill="#ff9900" stroke="#000" stroke-width="2.5"/>
        <path d="M75 42 C88 42 90 48 85 50 C80 52 75 48 75 42 Z" fill="#ff7700" stroke="#000" stroke-width="2"/>
    </svg>`;
}

function getRandomHSL() {
    const hues = [50, 60, 195, 275, 15, 140]; 
    const hue = hues[Math.floor(Math.random() * hues.length)];
    return `hsl(${hue}, 95%, 60%)`;
}

function updateIndicators(duck) {
    const dotsContainer = duck.element.querySelector('.status-dots');
    dotsContainer.innerHTML = '';
    
    if (duck.speed4Count >= 2) {
        const orangeDot = document.createElement('span');
        orangeDot.className = 'dot';
        orangeDot.textContent = '🟠';
        dotsContainer.appendChild(orangeDot);
    }
    if (duck.speed2Count >= 5) {
        const greenDot = document.createElement('span');
        greenDot.className = 'dot';
        greenDot.textContent = '🟢';
        dotsContainer.appendChild(greenDot);
    }
    if (duck.boostUsed) {
        const redDot = document.createElement('span');
        redDot.className = 'dot';
        redDot.textContent = '🔴';
        dotsContainer.appendChild(redDot);
    }
}

function setSpeedLabel(duck, speedNum) {
    const label = duck.element.querySelector('.speed-indicator');
    if (label) label.textContent = speedNum;
}

function updateDuckSpeed(duck) {
    const canUseSpeed5 = (duck.speed4Count < 2) && !duck.boostUsed;
    const canUseSpeed2 = (duck.speed2Count < 5);
    const canUseSpeed3 = !(duck.boostUsed && duck.speed4Count >= 2);

    const roll = Math.random() * 100;
    
    if (roll > 92 && canUseSpeed5) {
        duck.boostUsed = true;
        updateIndicators(duck);
        setSpeedLabel(duck, 5);
        return SPEEDS[5];
    }
    
    if (roll > 80 && roll <= 92) {
        if (duck.speed4Count < 2) {
            duck.speed4Count++;
            updateIndicators(duck);
            setSpeedLabel(duck, 4);
            return SPEEDS[4];
        }
        if (canUseSpeed3) {
            setSpeedLabel(duck, 3);
            return SPEEDS[3];
        } else {
            let s = Math.random() > 0.5 ? 1 : 2;
            if (s === 2 && !canUseSpeed2) s = 1;
            setSpeedLabel(duck, s);
            return SPEEDS[s];
        }
    }

    if (roll <= 30) {
        setSpeedLabel(duck, 1);
        return SPEEDS[1];
    }
    
    if (roll <= 60) {
        if (canUseSpeed2) {
            duck.speed2Count++;
            if (duck.speed2Count === 5) updateIndicators(duck);
            setSpeedLabel(duck, 2);
            return SPEEDS[2];
        }
        if (canUseSpeed3) {
            setSpeedLabel(duck, 3);
            return SPEEDS[3];
        }
        setSpeedLabel(duck, 1);
        return SPEEDS[1];
    }
    
    if (canUseSpeed3) {
        setSpeedLabel(duck, 3);
        return SPEEDS[3];
    } else {
        let s = Math.random() > 0.5 ? 1 : 2;
        if (s === 2 && !canUseSpeed2) s = 1;
        setSpeedLabel(duck, s);
        return SPEEDS[s];
    }
}

function initRace() {
    const names = namesInput.value.split(/,|\n/).map(n => n.trim()).filter(n => n);
    if (!names.length) return;

    track.innerHTML = '<div class="finish-line"></div>';
    ducks = [];
    finishers = [];
    
    trackX = 250; 
    track.style.transform = `rotateX(20deg) skewX(-15deg) translate3d(${trackX}px, 0, 0)`;

    names.forEach((name, i) => {
        const lane = document.createElement('div');
        lane.className = 'lane';
        
        const duckEl = document.createElement('div');
        duckEl.className = 'duck-sprite';
        
        const startPos = 350; 
        duckEl.style.left = startPos + 'px';
        duckEl.style.zIndex = 10 + i; 
        
        duckEl.innerHTML = `
            <div class="player-label">
                <span class="speed-indicator">1</span>
                <span>${name}</span>
                <span class="status-dots"></span>
            </div>
            ${createDuckSVG(getRandomHSL())}
        `;
        
        lane.appendChild(duckEl);
        track.appendChild(lane);

        ducks.push({
            element: duckEl,
            name: name,
            pos: startPos,
            speed: SPEEDS[1],
            boostUsed: false,
            speed4Count: 0,
            speed2Count: 0,
            finished: false,
            laneIndex: i
        });
    });

    setupOverlay.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameState = 'idle';
    document.getElementById('btnStart').style.display = 'block';
    timerDisplay.textContent = "00:00";
}

function gameLoop() {
    if (gameState !== 'racing') return;

    let leadX = 0;
    const finishPos = track.offsetWidth - 600;

    ducks.forEach(duck => {
        if (duck.finished) return;
        
        duck.pos += duck.speed;
        duck.element.style.left = duck.pos + 'px';

        if (duck.pos > leadX) leadX = duck.pos;

        if (duck.pos >= finishPos) {
            duck.finished = true;
            duck.element.classList.remove('duck-swimming');
            duck.finishTime = Date.now() - startTime;
            finishers.push(duck);
            const si = duck.element.querySelector('.speed-indicator');
            if (si) si.textContent = "🏁";
        }
    });

    const targetX = -Math.max(-250, leadX - (viewport.offsetWidth * 0.25));
    trackX += (targetX - trackX) * 0.1;

    track.style.transform = `rotateX(20deg) skewX(-15deg) translate3d(${trackX}px, 0, 0)`;

    const now = Date.now() - startTime;
    const s = Math.floor(now/1000);
    const m = Math.floor((now%1000)/10);
    timerDisplay.textContent = `${s.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;

    if (finishers.length === ducks.length) {
        endRace();
    } else {
        animationId = requestAnimationFrame(gameLoop);
    }
}

function endRace() {
    gameState = 'finished';
    clearInterval(speedInterval);
    uiOverlay.classList.remove('hidden');
    uiOverlay.classList.add('flex');

    podiumList.innerHTML = finishers.map((d, i) => `
        <div class="flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-yellow-500 text-blue-900 scale-105 border-2 border-white font-bold' : 'bg-slate-800 text-white border border-slate-700'}">
            <span class="text-[10px] flex items-center gap-2">
                #${i + 1} ${d.name} 
                <span class="flex gap-1">
                    ${d.speed4Count >= 2 ? '🟠' : ''}
                    ${d.speed2Count >= 5 ? '🟢' : ''}
                    ${d.boostUsed ? '🔴' : ''}
                </span>
            </span>
            <span class="font-mono text-sm">${(d.finishTime/1000).toFixed(2)}s</span>
        </div>
    `).join('');
}

document.getElementById('btnPrepare').onclick = initRace;

document.getElementById('btnStart').onclick = () => {
    if (gameState === 'racing') return;
    gameState = 'racing';
    startTime = Date.now();
    document.getElementById('btnStart').style.display = 'none';
    
    ducks.forEach(d => d.element.classList.add('duck-swimming'));

    speedInterval = setInterval(() => {
        ducks.forEach(d => {
            if (!d.finished) d.speed = updateDuckSpeed(d);
        });
    }, 1000);
    
    gameLoop();
};

document.getElementById('btnRestart').onclick = () => {
    uiOverlay.classList.add('hidden');
    initRace();
};

document.getElementById('btnNew').onclick = () => {
    uiOverlay.classList.add('hidden');
    gameContainer.classList.add('hidden');
    setupOverlay.classList.remove('hidden');
};

window.onresize = () => {
    if (gameState === 'idle' && ducks.length > 0) initRace();
};