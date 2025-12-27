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

// ATIVOS DOS PATOS (Chapéus, Padrões, etc)
const duckAssets = {
    colors: ['#facc15', '#fde047', '#fbbf24', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#ffffff', '#4ade80'],
    patterns: [
        { id: 'none', svg: '' },
        { id: 'dots', svg: `<pattern id="patDots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2.5" fill="rgba(0,0,0,0.15)"/></pattern>` },
        { id: 'zebra', svg: `<pattern id="patZebra" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 0 Q 5 10 10 5 Q 15 0 20 10 L 20 15 Q 15 5 10 10 Q 5 15 0 5 Z" fill="rgba(0,0,0,0.4)"/></pattern>` },
        { id: 'stripes', svg: `<pattern id="patStripes" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="8" fill="rgba(255,255,255,0.3)"/></pattern>` }
    ],
    hats: [
        null,
        `<g transform="translate(0, -5)"><path d="M45 25 Q 62 10 80 25 L 85 30 Q 62 35 40 30 Z" fill="#78350f" stroke="black" stroke-width="2"/><rect x="52" y="15" width="20" height="15" fill="#78350f" stroke="black" stroke-width="2"/></g>`,
        `<g transform="translate(0, -8)"><rect x="48" y="5" width="28" height="25" fill="#1e293b" stroke="black" stroke-width="2"/><rect x="40" y="28" width="44" height="5" fill="#1e293b" stroke="black" stroke-width="2"/><rect x="48" y="23" width="28" height="5" fill="#ef4444"/></g>`,
        `<g transform="translate(0, -5)"><path d="M45 30 C 45 15, 80 15, 80 30" fill="#94a3b8" stroke="black" stroke-width="2"/><path d="M45 20 L 35 5 L 48 22" fill="#f8fafc" stroke="black"/><path d="M80 20 L 90 5 L 77 22" fill="#f8fafc" stroke="black"/></g>`,
        `<g transform="translate(0, -5)"><path d="M50 30 L 50 15 L 58 25 L 62 10 L 66 25 L 74 15 L 74 30 Z" fill="#fbbf24" stroke="black" stroke-width="2"/></g>`
    ],
    accessories: [
        null,
        `<path d="M50 45 Q 62 55 75 45 L 62 65 Z" fill="#ef4444" stroke="black" stroke-width="2"/>`,
        `<path d="M52 48 Q 62 60 72 48" fill="none" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 4"/><circle cx="62" cy="54" r="5" fill="#fbbf24" stroke="black" stroke-width="1"/>`,
        `<g><rect x="50" y="30" width="10" height="6" rx="2" fill="black"/><rect x="64" y="30" width="10" height="6" rx="2" fill="black"/><line x1="60" y1="33" x2="64" y2="33" stroke="black" stroke-width="2"/></g>`
    ]
};

function generateDuckSVG() {
    const baseColor = duckAssets.colors[Math.floor(Math.random() * duckAssets.colors.length)];
    const pattern = duckAssets.patterns[Math.floor(Math.random() * duckAssets.patterns.length)];
    const hat = duckAssets.hats[Math.floor(Math.random() * duckAssets.hats.length)];
    const acc = duckAssets.accessories[Math.floor(Math.random() * duckAssets.accessories.length)];
    const uid = Math.random().toString(36).substr(2, 9);

    return `
    <div style="position:absolute; bottom:5px; width:70px; height:12px; background:rgba(0,0,0,0.15); border-radius:50%; filter:blur(2px);"></div>
    <svg width="90" height="100" viewBox="0 -10 100 110">
        <defs>
            ${pattern.svg}
            <mask id="m_${uid}"><path d="M80 70 C80 45 60 40 40 40 C15 40 5 55 5 70 C5 85 20 90 45 90 C70 90 80 85 80 70 Z" fill="white"/><circle cx="62" cy="35" r="18" fill="white"/></mask>
        </defs>
        <g stroke="black" stroke-width="2.5">
            <path d="M80 70 C80 45 60 40 40 40 C15 40 5 55 5 70 C5 85 20 90 45 90 C70 90 80 85 80 70 Z" fill="${baseColor}"/>
            <circle cx="62" cy="35" r="18" fill="${baseColor}"/>
        </g>
        <g mask="url(#m_${uid})">
            <rect width="100" height="100" fill="url(#pat${pattern.id.charAt(0).toUpperCase() + pattern.id.slice(1)})" opacity="0.7"/>
        </g>
        <circle cx="65" cy="30" r="3.5" fill="black"/>
        <circle cx="66.5" cy="28.5" r="1.2" fill="white"/>
        <path d="M75 35 Q95 35 90 45 Q75 45 75 35" fill="#f97316" stroke="black" stroke-width="2"/>
        ${acc || ''} ${hat || ''}
    </svg>`;
}

document.getElementById('btnHelp').onclick = () => rulesOverlay.style.display = 'flex';
document.getElementById('btnCloseRules').onclick = () => rulesOverlay.style.display = 'none';

document.getElementById('btnPrepare').onclick = () => {
    const names = namesInput.value.split(/,|\n/).map(n => n.trim()).filter(n => n);
    if (!names.length) return;
    track.innerHTML = ''; ducks = []; finishers = [];
    
    const mLane = document.createElement('div'); mLane.className = 'measurement-lane'; track.appendChild(mLane);
    for(let i=0; i<=10; i++){
        const line = document.createElement('div'); line.className = 'meter-line'; line.style.left = (350 + (i*5*250)) + 'px';
        line.innerHTML = `<div class="meter-text">${50 - (i*5)}m</div>`; track.appendChild(line);
    }

    names.forEach((name, i) => {
        const lane = document.createElement('div'); lane.className = 'lane';
        const duckEl = document.createElement('div'); duckEl.className = 'duck-sprite'; duckEl.style.left = '350px'; duckEl.style.zIndex = 10 + i;
        duckEl.innerHTML = `<div class="player-label"><span class="speed-indicator">1</span><span>${name}</span><span class="status-dots"></span></div>${generateDuckSVG()}`;
        lane.appendChild(duckEl); track.appendChild(lane);
        ducks.push({ element: duckEl, name, pos: 350, speed: 1, finished: false, countV1: 0, countV2: 0, countV3: 0, countV4: 0, countV5: 0, hasRed: false, hasOrange: false, hasYellow: false, hasGreen: false, hasSilver: false, resetCooldown: 0, fireV5Count: 0, speedHistory: [1] });
    });

    const fl = document.createElement('div'); fl.className = 'finish-line'; fl.style.left = FINISH_X + 'px'; track.appendChild(fl);
    document.getElementById('setup-overlay').style.display = 'none'; document.getElementById('game-container').classList.remove('hidden');
};

function updateDuckLogic(d) {
    if (d.resetCooldown > 0) { 
        d.speed = SPEEDS[1]; d.resetCooldown--; 
        d.element.querySelector('.speed-indicator').textContent = '1'; 
        d.speedHistory.push(1);
        return; 
    }
    const roll = Math.random() * 100; let s = 1;
    if (d.hasSilver) { s = roll > 70 ? 5 : 3; } else {
        let allowed = [1]; if (!d.hasGreen) allowed.push(2); if (!d.hasYellow) allowed.push(3); if (!d.hasOrange) allowed.push(4); if (!d.hasRed && !d.hasOrange) allowed.push(5);
        if (roll > 90 && allowed.includes(5)) s = 5; else if (roll > 75 && allowed.includes(4)) s = 4; else if (roll > 55 && allowed.includes(3)) s = 3; else if (roll > 30 && allowed.includes(2)) s = 2; else s = 1;
    }
    
    d.speedHistory.push(s);

    if (s === 5) { if (d.hasSilver) { d.fireV5Count++; if (d.fireV5Count >= 3) { d.hasRed = d.hasOrange = d.hasYellow = d.hasGreen = d.hasSilver = false; d.countV1 = d.countV2 = d.countV3 = d.countV4 = d.countV5 = 0; d.fireV5Count = 0; d.resetCooldown = 2; d.element.classList.remove('fire-glow'); } } else { d.hasRed = true; } }
    if (s === 4) { d.countV4++; if (d.countV4 >= 2) d.hasOrange = true; }
    if (s === 3) { d.countV3++; if (d.countV3 >= 3) d.hasYellow = true; } else { if (!d.hasYellow) d.countV3 = 0; }
    if (s === 2) { d.countV2++; if (d.countV2 >= 4) d.hasGreen = true; }
    if (s === 1) { d.countV1++; if (d.countV1 >= 7 && !d.hasSilver) { d.hasSilver = true; d.element.classList.add('fire-glow'); } } else { if (!d.hasSilver) d.countV1 = 0; }
    
    const dots = d.element.querySelector('.status-dots'); dots.innerHTML = '';
    if (d.hasSilver) dots.innerHTML += '🥈🔥'; if (d.hasRed) dots.innerHTML += '🔴'; if (d.hasOrange) dots.innerHTML += '🟠'; if (d.hasYellow) dots.innerHTML += '🟡'; if (d.hasGreen) dots.innerHTML += '🟢';
    d.speed = SPEEDS[s]; d.element.querySelector('.speed-indicator').textContent = s;
}

document.getElementById('btnStart').onclick = () => {
    if(gameState === 'racing') return; gameState = 'racing'; startTime = Date.now();
    document.getElementById('btnStart').style.display = 'none';
    ducks.forEach(d => d.element.classList.add('duck-swimming'));
    const logicInterval = setInterval(() => { if(gameState === 'racing') ducks.forEach(d => { if(!d.finished) updateDuckLogic(d); }); else clearInterval(logicInterval); }, 1000);
    
    function loop() {
        let activeLeaderX = 0;
        ducks.forEach(d => {
            if(!d.finished) {
                d.pos += d.speed; d.element.style.left = d.pos + 'px';
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
        timerDisplay.textContent = ((Date.now() - startTime)/1000).toFixed(2).replace('.', ':');
        if(finishers.length < ducks.length) requestAnimationFrame(loop);
        else {
            gameState = 'finished';
            // DESEMPATE POR HISTÓRICO
            finishers.sort((a, b) => {
                if (a.time !== b.time) return a.time - b.time;
                const lenA = a.speedHistory.length;
                const lenB = b.speedHistory.length;
                const maxLen = Math.max(lenA, lenB);
                for (let i = 1; i <= maxLen; i++) {
                    const valA = a.speedHistory[lenA - i] || 0;
                    const valB = b.speedHistory[lenB - i] || 0;
                    if (valA !== valB) {
                        a.tieBreakerWin = valA > valB;
                        b.tieBreakerWin = valB > valA;
                        return valB - valA;
                    }
                }
                return 0;
            });

            setTimeout(() => {
                document.getElementById('ui-overlay').classList.remove('hidden');
                document.getElementById('podiumList').innerHTML = finishers.map((f, i) => `
                    <div class="flex items-center justify-between p-4 bg-slate-800 rounded-xl border-2 ${i === 0 ? 'border-yellow-500' : 'border-slate-700'}">
                        <span class="text-[10px] text-green-300">
                            <span class="text-yellow-500">#${i+1}</span> ${f.name} 
                            ${f.tieBreakerWin ? '<span title="Vencedor por desempate técnico">⚖️</span>' : ''}
                        </span>
                        <span class="text-yellow-500 text-[10px]">${f.time.toFixed(2)}s</span>
                    </div>`).join('');
            }, 500);
        }
    }
    loop();
};