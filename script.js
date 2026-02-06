let state = {
    money: 0, gps: 0, clickPower: 1,
    inventory: {}, level: 1, exp: 0, nextLevelExp: 100
};

function init() {
    const saved = loadGame();
    if (saved) state = saved;
    updateDisplay();
    renderShop();
    startLoops();
    spawnBonus();
}

function handleMine(e) {
    const isCrit = Math.random() < 0.1;
    const amount = state.clickPower * (isCrit ? 5 : 1);
    state.money += amount;
    state.exp += amount;
    
    createPop(e.clientX, e.clientY, `+${amount}${isCrit ? '🔥' : ''}`, isCrit ? 'crit' : '');
    checkLvl();
    updateDisplay();
}

function createPop(x, y, txt, cls) {
    const p = document.createElement('div');
    p.className = 'pop ' + cls;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.innerText = txt;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
}

function checkLvl() {
    if (state.exp >= state.nextLevelExp) {
        state.level++;
        state.exp = 0;
        state.nextLevelExp *= 2;
        document.getElementById('ore').innerText = ORES[(state.level-1) % ORES.length];
        alert("Новый уровень: " + state.level);
    }
}

function buy(id) {
    const item = UPGRADES.find(u => u.id === id);
    const count = state.inventory[id] || 0;
    const cost = Math.floor(item.baseCost * Math.pow(1.15, count));

    if (state.money >= cost) {
        state.money -= cost;
        state.inventory[id] = count + 1;
        if (item.type === 'auto') state.gps += item.income;
        else state.clickPower += item.power;
        renderShop();
        updateDisplay();
        saveGame();
    }
}

function renderShop() {
    const list = document.getElementById('shop-list');
    list.innerHTML = UPGRADES.map(item => {
        const count = state.inventory[item.id] || 0;
        const cost = Math.floor(item.baseCost * Math.pow(1.15, count));
        return `<div class="item">
            <div><b>${item.name}</b> (${count})<br><small>${item.type=='click'?'+'+item.power:'+'+item.income+'/с'}</small></div>
            <button onclick="buy('${item.id}')" ${state.money < cost ? 'disabled' : ''}>${cost} 💰</button>
        </div>`;
    }).join('');
}

function updateDisplay() {
    document.getElementById('money').innerText = Math.floor(state.money).toLocaleString();
    document.getElementById('gps').innerText = state.gps.toLocaleString();
    document.getElementById('lvl-text').innerText = state.level;
    const p = (state.exp / state.nextLevelExp) * 100;
    document.getElementById('exp-bar').style.width = p + '%';
    document.querySelectorAll('.item button').forEach((btn, i) => {
        const item = UPGRADES[i];
        const cost = Math.floor(item.baseCost * Math.pow(1.15, state.inventory[item.id] || 0));
        btn.disabled = state.money < cost;
    });
}

function startLoops() {
    setInterval(() => { state.money += state.gps/10; updateDisplay(); }, 100);
    setInterval(saveGame, 5000);
}

function spawnBonus() {
    setTimeout(() => {
        const b = document.createElement('div');
        b.className = 'bonus'; b.innerText = '🎁';
        b.style.top = Math.random()*80 + '%';
        document.body.appendChild(b);
        b.onclick = () => { state.money += state.gps*30 + 50; b.remove(); updateDisplay(); };
        setTimeout(() => b.remove(), 4000);
        spawnBonus();
    }, 15000 + Math.random()*15000);
}

function changeScreen(s) {
    document.getElementById('screen-mine').classList.toggle('hidden', s !== 'mine');
    document.getElementById('screen-shop').classList.toggle('hidden', s !== 'shop');
}

init();
