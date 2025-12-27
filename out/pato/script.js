const track = document.getElementById('track');
const namesInput = document.getElementById('namesInput');
const timerDisplay = document.getElementById('timer');
const rulesOverlay = document.getElementById('rules-overlay');

let ducks = [];
let finishers = [];
let gameState = 'idle';
let startTime = 0;
let trackX = 0;
const SPEEDS = { 1: 0.9, 2: 1.5, 3: 2.2, 4: 3.8, 5: 7.8 };
const FINISH_X = 350 + (50 * 250);

document.getElementById('btnHelp').onclick = () => rulesOverlay.style.display = 'flex';
document.getElementById('btnCloseRules').onclick = () => rulesOverlay.style.display = 'none';

function createDuckSVG(color) {
    return `
    <div class="duck-shadow" style="position:absolute; bottom:-5px; width:70px; height:15px; background:rgba(0,0,0,0.2); border-radius:50%; filter:blur(2px);"></div>
    <svg width="80" height="80" viewBox="0 0 100 100">
        <path d="M80 70 C80 45 60 40 40 40 C15 40 5 55 5 70 C5 85 20 90 45 90 C70 90 80 85 80 70 Z" fill="${color}" stroke="black" stroke-width="3"/>
        <circle cx="62" cy="35" r="18" fill="${color}" stroke="black" stroke-width="3"/>
        <circle cx="65" cy="30" r="3" fill="black"/>
        <path d="M75 35 Q95 35 90 45 Q75 45 75 35" fill="orange" stroke="black" stroke-width="2"/>
    </svg>`;
}

document.getElementById('btnPrepare').onclick = () => {
    const names = namesInput.value.split(/,|\n/).map(n => n.trim()).filter(n => n);
    if (!names.length) return;

    track.innerHTML = '';
    ducks = [];
    
    const mLane = document.createElement('div');
    mLane.className = 'measurement-lane';
    track.appendChild(mLane);

    for(let i=0; i<=10; i++){
        const line = document.createElement('div');
        line.className = 'meter-line';
        line.style.left = (350 + (i*5*250)) + 'px';
        line.innerHTML = `<div class="meter-text">${50 - (i*5)}m</div>`;
        track.appendChild(line);
    }

    names.forEach((name, i) => {
        const lane = document.createElement('div');
        lane.className = 'lane';
        const duckEl = document.createElement('div');
        duckEl.className = 'duck-sprite';
        duckEl.style.left = '350px';
        duckEl.style.zIndex = 10 + i; 
        
        duckEl.innerHTML = `
            <div class="player-label"><span class="speed-indicator">1</span><span>${name}</span><span class="status-dots"></span></div>
            ${createDuckSVG(`hsl(${Math.random()*360}, 85%, 65%)`)}
        `;
        lane.appendChild(duckEl);
        track.appendChild(lane);
        ducks.push({ 
            element: duckEl, name, pos: 350, speed: 1, finished: false, 
            countV1: 0, countV2: 0, countV3: 0, countV4: 0, countV5: 0,
            hasRed: false, hasOrange: false, hasYellow: false, hasGreen: false, hasSilver: false,
            resetCooldown: 0, fireV5Count: 0
        });
    });

    const fl = document.createElement('div');
    fl.className = 'finish-line';
    fl.style.left = FINISH_X + 'px';
    track.appendChild(fl);

    document.getElementById('setup-overlay').style.display = 'none';
    document.getElementById('game-container').classList.remove('hidden');
};

function updateDuckLogic(d) {
    if (d.resetCooldown > 0) {
        d.speed = SPEEDS[1];
        d.resetCooldown--;
        d.element.querySelector('.speed-indicator').textContent = '1';
        return;
    }

    const roll = Math.random() * 100;
    let s = 1;

    if (d.hasSilver) {
        s = roll > 70 ? 5 : 3;
    } else {
        let allowed = [1];
        if (!d.hasGreen) allowed.push(2);
        if (!d.hasYellow) allowed.push(3);
        if (!d.hasOrange) allowed.push(4);
        if (!d.hasRed && !d.hasOrange) allowed.push(5);

        if (roll > 90 && allowed.includes(5)) s = 5;
        else if (roll > 75 && allowed.includes(4)) s = 4;
        else if (roll > 55 && allowed.includes(3)) s = 3;
        else if (roll > 30 && allowed.includes(2)) s = 2;
        else s = 1;
    }

    if (s === 5) {
        if (d.hasSilver) {
            d.fireV5Count++;
            if (d.fireV5Count >= 3) {
                d.hasRed = d.hasOrange = d.hasYellow = d.hasGreen = d.hasSilver = false;
                d.countV1 = d.countV2 = d.countV3 = d.countV4 = d.countV5 = 0;
                d.fireV5Count = 0;
                d.resetCooldown = 2; 
                d.element.classList.remove('fire-glow');
            }
        } else {
            d.hasRed = true;
        }
    }

    if (s === 4) {
        d.countV4++;
        if (d.countV4 >= 2) d.hasOrange = true;
    }

    if (s === 3) {
        d.countV3++;
        if (d.countV3 >= 3) d.hasYellow = true;
    } else {
        if (!d.hasYellow) d.countV3 = 0;
    }

    if (s === 2) {
        d.countV2++;
        if (d.countV2 >= 4) d.hasGreen = true;
    }

    if (s === 1) {
        d.countV1++;
        if (d.countV1 >= 7 && !d.hasSilver) {
            d.hasSilver = true;
            d.element.classList.add('fire-glow');
        }
    } else {
        if (!d.hasSilver) d.countV1 = 0;
    }

    const dots = d.element.querySelector('.status-dots');
    dots.innerHTML = '';
    if (d.hasSilver) dots.innerHTML += '<span style="color:#cbd5e1">🥈🔥</span>';
    if (d.hasRed) dots.innerHTML += '<span style="color:#ef4444">🔴</span>';
    if (d.hasOrange) dots.innerHTML += '<span style="color:#f97316">🟠</span>';
    if (d.hasYellow) dots.innerHTML += '<span style="color:#facc15">🟡</span>';
    if (d.hasGreen) dots.innerHTML += '<span style="color:#22c55e">🟢</span>';

    d.speed = SPEEDS[s];
    d.element.querySelector('.speed-indicator').textContent = s;
}

document.getElementById('btnStart').onclick = () => {
    if(gameState === 'racing') return;
    gameState = 'racing';
    startTime = Date.now();
    document.getElementById('btnStart').style.display = 'none';
    ducks.forEach(d => d.element.classList.add('duck-swimming'));
    
    const logicInterval = setInterval(() => {
        if(gameState === 'racing') {
            ducks.forEach(d => { if(!d.finished) updateDuckLogic(d); });
        } else {
            clearInterval(logicInterval);
        }
    }, 1000);

    function loop() {
        let activeLeaderX = 0;
        ducks.forEach(d => {
            if(!d.finished) {
                d.pos += d.speed;
                d.element.style.left = d.pos + 'px';
                if(d.pos > activeLeaderX) activeLeaderX = d.pos;
                if(d.pos >= FINISH_X) {
                    d.finished = true;
                    d.time = (Date.now() - startTime) / 1000;
                    finishers.push(d);
                    d.element.classList.remove('duck-swimming', 'fire-glow');
                    d.element.querySelector('.speed-indicator').textContent = '🏁';
                }
            }
        });

        let targetX = activeLeaderX || FINISH_X;
        trackX += ((-targetX + (window.innerWidth * 0.25)) - trackX) * 0.1;
        track.style.transform = `rotateX(20deg) skewX(-15deg) translate3d(${trackX}px, 0, 0)`;
        
        const now = (Date.now() - startTime)/1000;
        timerDisplay.textContent = now.toFixed(2).replace('.', ':');

        if(finishers.length < ducks.length) {
            requestAnimationFrame(loop);
        } else {
            gameState = 'finished';
            setTimeout(() => {
                document.getElementById('ui-overlay').classList.remove('hidden');
                document.getElementById('podiumList').innerHTML = finishers.map((f, i) => `
                    <div class="flex items-center justify-between p-4 bg-slate-800 rounded-xl border-2 ${i === 0 ? 'border-yellow-500' : 'border-slate-700'}">
                        <span class="text-[10px]"><span class="text-yellow-500">#${i+1}</span> ${f.name}</span>
                        <span class="text-yellow-500 text-[10px]">${f.time.toFixed(2)}s</span>
                    </div>
                `).join('');
            }, 500);
        }
    }
    loop();
};