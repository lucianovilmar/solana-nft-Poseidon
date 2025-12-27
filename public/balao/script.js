function toggleModal(show) { document.getElementById('modalRegras').style.display = show ? 'block' : 'none'; }
window.onclick = function(event) { if (event.target == document.getElementById('modalRegras')) toggleModal(false); }

let grupos = [];
let indexGrupoAtual = 0;
let classificadosDiretos = [];
let historicoResultados = [];
let vencedoresDestaBateria = [];
let todosEstouraramDestaBateria = [];
let emJogo = false;
let metaVencedoresPorGrupo = 1;
let metaRepescagemPorGrupo = 0;
let faseAtual = "BATERIAS";
let modoFinal = "campeao";
let haveraRepescagem = false;

function distribuirNomes(nomes, limitePorGrupo = 10) {
    const total = nomes.length;
    if (total <= limitePorGrupo) return [nomes];
    const numGrupos = Math.ceil(total / limitePorGrupo);
    const resultado = [];
    const nomesPorGrupo = Math.floor(total / numGrupos);
    const gruposComUmAMais = total % numGrupos;
    let pointer = 0;
    for (let i = 0; i < numGrupos; i++) {
        const tamanhoAtual = nomesPorGrupo + (i < gruposComUmAMais ? 1 : 0);
        resultado.push(nomes.slice(pointer, pointer + tamanhoAtual));
        pointer += tamanhoAtual;
    }
    return resultado;
}

function iniciarJogo() {
    const texto = document.getElementById('nameList').value;
    const nomes = texto.split(/,|\n/).map(n => n.trim()).filter(n => n !== "");
    if (nomes.length < 2) return;
    modoFinal = document.querySelector('input[name="finalMode"]:checked').value;
    classificadosDiretos = [];
    historicoResultados = [];
    indexGrupoAtual = 0;
    const nomesEmbaralhados = [...nomes].sort(() => Math.random() - 0.5);

    if (nomes.length <= 10) {
        faseAtual = "FINAL"; grupos = [nomesEmbaralhados]; haveraRepescagem = false;
    } else {
        faseAtual = "BATERIAS";
        grupos = distribuirNomes(nomesEmbaralhados, 10);
        metaVencedoresPorGrupo = Math.floor(10 / grupos.length);
        const totalVagasDiretas = metaVencedoresPorGrupo * grupos.length;
        haveraRepescagem = (10 - totalVagasDiretas) > 0;
        metaRepescagemPorGrupo = haveraRepescagem ? Math.floor(10 / grupos.length) : 0;
    }
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    montarRodada();
}

function montarRodada() {
    const arena = document.getElementById('arena');
    arena.innerHTML = '';
    document.getElementById('winner-text').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    vencedoresDestaBateria = [];
    todosEstouraramDestaBateria = [];
    emJogo = true;
    const participantes = grupos[indexGrupoAtual];

    document.getElementById('round-title').innerText = faseAtual === "FINAL" ? "Grande Final" : (faseAtual === "REPESCAGEM" ? "Bateria de Repescagem" : `Bateria ${indexGrupoAtual + 1} de ${grupos.length}`);

    participantes.forEach((nome, i) => {
        const div = document.createElement('div');
        div.className = 'balloon-wrapper';
        const hue = Math.floor(Math.random() * 360);
        div.innerHTML = `
            <div class="balloon" id="balao-${i}" style="background-color: hsl(${hue}, 80%, 60%)"><span class="perc-display" id="perc-${i}">0%</span></div>
            <div class="info-card">
                <div class="rank-badge" id="rank-${i}">0º</div>
                <div class="card-top"><span class="name-txt">${nome}</span><span class="speed-badge" id="speed-${i}">1</span></div>
                <div class="effect-label" id="effect-${i}"></div>
                <div class="status-badge" id="vaga-${i}">VAGA</div>
            </div>`;
        arena.appendChild(div);
    });
    setTimeout(() => loopDeCrescimento(participantes), 800);
}

function loopDeCrescimento(participantes) {
    let dadosBaloes = participantes.map((nome, i) => ({ id: i, nome, w: 20, h: 28, estourou: false, posicaoFinal: null, revesRestante: 0, pausaAte: 0, esvaziandoAte: 0, countVel4: 0, countVel5: 0, ultimaVel: null }));
    const limiteW = 100;
    const intervalo = setInterval(() => {
        if (!emJogo) { clearInterval(intervalo); return; }
        const agora = Date.now();
        dadosBaloes.forEach((p, i) => {
            if (p.estourou) return;
            const el = document.getElementById(`balao-${i}`);
            const spdEl = document.getElementById(`speed-${i}`);
            const effectEl = document.getElementById(`effect-${i}`);
            const percEl = document.getElementById(`perc-${i}`);

            if (agora < p.pausaAte) {
                spdEl.innerText = "⏸"; effectEl.innerText = "PAUSA (2s)"; effectEl.className = "effect-label pausa";
                return;
            }

            if (agora < p.esvaziandoAte) {
                p.w = Math.max(10, p.w - 0.5); p.h = Math.max(14, p.h - 0.7);
                spdEl.innerText = "▼2"; effectEl.innerText = "ESVAZIANDO"; effectEl.className = "effect-label esvaziando";
            } else {
                const roll = Math.random();
                let incW, incH, level;
                if (roll > 0.97) { level = 5; incW = 2.0; incH = 2.8; }
                else if (roll > 0.88) { level = 4; incW = 1.2; incH = 1.7; }
                else if (roll > 0.70) { level = 3; incW = 0.6; incH = 0.9; }
                else if (roll > 0.40) { level = 2; incW = 0.25; incH = 0.4; }
                else { level = 1; incW = 0.08; incH = 0.15; }

                if (level === 4) { p.countVel4++; if (p.countVel4 >= 4) { p.pausaAte = agora + 2000; p.countVel4 = 0; } }
                if (level === 5) { 
                    p.countVel5++; if (p.countVel5 >= 3) { p.revesRestante = 5; p.countVel5 = 0; }
                    if (p.ultimaVel === 4) p.esvaziandoAte = agora + 3000;
                }
                p.ultimaVel = level;

                if (p.revesRestante > 0) {
                    p.w = Math.max(10, p.w - incW); p.h = Math.max(14, p.h - incH);
                    p.revesRestante--; spdEl.innerText = "↺";
                    effectEl.innerText = `REVÉS (${p.revesRestante + 1})`; effectEl.className = "effect-label reves";
                } else {
                    p.w += incW; p.h += incH; spdEl.innerText = level;
                    effectEl.innerText = ""; effectEl.className = "effect-label";
                }
            }

            if (el) {
                el.style.width = p.w + 'px'; el.style.height = p.h + 'px';
                
                const porcentagem = Math.floor((p.w / limiteW) * 100);
                if (porcentagem >= 60 && porcentagem < 100) {
                    percEl.innerText = porcentagem + "%";
                    percEl.style.opacity = "1";
                    percEl.style.fontSize = (p.w * 0.4) + "px";
                } else {
                    percEl.style.opacity = "0";
                }

                if (p.w >= limiteW) {
                    p.estourou = true; el.style.opacity = '0'; el.style.transform = 'scale(2.5)';
                    percEl.style.opacity = "0";
                    todosEstouraramDestaBateria.push(p.nome);
                    p.posicaoFinal = todosEstouraramDestaBateria.length;
                    const vaga = document.getElementById(`vaga-${i}`);
                    vaga.style.display = 'block'; effectEl.style.display = 'none';

                    let encerrarAgora = false;
                    const metaCorte = haveraRepescagem ? (metaVencedoresPorGrupo + metaRepescagemPorGrupo) : metaVencedoresPorGrupo;

                    if (faseAtual === "FINAL") {
                        if (modoFinal === "campeao" && p.posicaoFinal === 1) encerrarAgora = true;
                        else if (modoFinal === "top3" && p.posicaoFinal === 3) encerrarAgora = true;
                        else if (todosEstouraramDestaBateria.length === participantes.length) encerrarAgora = true;
                    } else {
                        if (p.posicaoFinal <= metaVencedoresPorGrupo) {
                            vaga.innerText = "VAGA DIRETA"; vencedoresDestaBateria.push(p.nome);
                        } else if (haveraRepescagem && p.posicaoFinal <= metaCorte) {
                            vaga.innerText = "REPESCAGEM"; vaga.style.background = "#3498db";
                        } else {
                            vaga.innerText = "ELIMINADO"; vaga.style.background = "#95a5a6";
                        }
                        if (p.posicaoFinal === metaCorte || todosEstouraramDestaBateria.length === participantes.length) encerrarAgora = true;
                    }

                    if (encerrarAgora) {
                        emJogo = false; clearInterval(intervalo);
                        const competindoResto = dadosBaloes.filter(b => !b.estourou).sort((a, b) => b.w - a.w);
                        competindoResto.forEach((restante, idx) => {
                            restante.estourou = true;
                            restante.posicaoFinal = todosEstouraramDestaBateria.length + idx + 1;
                            const rBalao = document.getElementById(`balao-${restante.id}`);
                            if (rBalao) rBalao.style.opacity = '0.5';
                            const rVaga = document.getElementById(`vaga-${restante.id}`);
                            if (rVaga) {
                                rVaga.style.display = 'block';
                                rVaga.innerText = (faseAtual === "FINAL") ? `${restante.posicaoFinal}º LUGAR` : "ELIMINADO";
                                rVaga.style.background = "#bdc3c7";
                            }
                        });
                        finalizarBateria();
                    }
                }
            }
        });

        const competindo = dadosBaloes.filter(b => !b.estourou).sort((a, b) => b.w - a.w);
        dadosBaloes.forEach(b => {
            const badge = document.getElementById(`rank-${b.id}`);
            if (!badge) return;
            badge.classList.remove('rank-1', 'rank-2', 'rank-3');
            if (b.estourou) {
                badge.style.display = 'block'; badge.innerText = `${b.posicaoFinal}º`;
                if (b.posicaoFinal <= 3) badge.classList.add(`rank-${b.posicaoFinal}`);
            } else if (b.w > 30) {
                badge.style.display = 'block';
                let pos = todosEstouraramDestaBateria.length + competindo.findIndex(c => c.id === b.id) + 1;
                badge.innerText = `${pos}º`;
                if (pos === 1) badge.classList.add('rank-1');
            }
        });
    }, 100);
}

function finalizarBateria() {
    const winnerText = document.getElementById('winner-text');
    const nextBtn = document.getElementById('next-btn');
    if (faseAtual === "FINAL") {
        winnerText.innerHTML = `🏆 Campeão: ${todosEstouraramDestaBateria[0]}`;
        nextBtn.innerText = "Jogar novamente"; nextBtn.onclick = () => location.reload();
    } else {
        classificadosDiretos.push(...vencedoresDestaBateria);
        historicoResultados.push([...todosEstouraramDestaBateria]);
        winnerText.innerHTML = `Classificados: ${vencedoresDestaBateria.join(", ")}`;
        nextBtn.innerText = (indexGrupoAtual + 1 < grupos.length) ? "Próxima Bateria" : (haveraRepescagem ? "Ir para Repescagem" : "Ver Finalistas");
        nextBtn.onclick = proximaRodada;
    }
    winnerText.style.display = 'block'; nextBtn.style.display = 'inline-block';
}

function proximaRodada() {
    if (faseAtual === "BATERIAS") {
        indexGrupoAtual++;
        if (indexGrupoAtual < grupos.length) montarRodada();
        else (haveraRepescagem && classificadosDiretos.length < 10) ? prepararRepescagem() : prepararFinal();
    } else if (faseAtual === "REPESCAGEM") prepararFinal();
}

function prepararRepescagem() {
    faseAtual = "REPESCAGEM"; indexGrupoAtual = 0;
    let listaRepescagem = [];
    historicoResultados.forEach(rankingGrupo => {
        let count = 0;
        for(let nome of rankingGrupo) {
            if (!classificadosDiretos.includes(nome)) {
                listaRepescagem.push(nome); count++;
                if (count >= metaRepescagemPorGrupo) break;
            }
        }
    });
    grupos = [ listaRepescagem.slice(0, 10) ];
    (grupos[0].length === 0) ? prepararFinal() : montarRodada();
}

function prepararFinal() {
    faseAtual = "FINAL"; indexGrupoAtual = 0;
    grupos = [ classificadosDiretos.slice(0, 10) ];
    montarRodada();
}