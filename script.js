let state = {
    money: 0,
    gps: 0,
    clickPower: 1,
    inventory: {}
};

function init() {
    const saved = loadGame();
    if (saved) {
        state = { ...state, ...saved };
    }
    renderShop();
    updateDisplay();
    startAutoMine();
}

function handleMine() {
    state.money += state.clickPower;
    updateDisplay();
}

function changeScreen(name) {
    if (name === 'mine') {
        document.getElementById('screen-mine').classList.remove('hidden');
        document.getElementById('screen-shop').classList.add('hidden');
    } else {
        document.getElementById('screen-mine').classList.add('hidden');
        document.getElementById('screen-shop').classList.remove('hidden');
    }
}

function renderShop() {
    const list = document.getElementById('shop-list');
    list.innerHTML = UPGRADES.map(item => {
        const count = state.inventory[item.id] || 0;
        const currentCost = Math.floor(item.baseCost * Math.pow(1.15, count));
        return `
            <div class="item">
                <div class="info">
                    <div class="name">${item.name} [${count}]</div>
                    <div class="desc">${item.type === 'click' ? '+' + item.power + ' к клику' : '+' + item.income + ' в сек'}</div>
                </div>
                <button onclick="buy('${item.id}')" class="${state.money < currentCost ? 'locked' : ''}">
                    ${currentCost} 💰
                </button>
            </div>
        `;
    }).join('');
}

function buy(id) {
    const item = UPGRADES.find(u => u.id === id);
    const count = state.inventory[id] || 0;
    const currentCost = Math.floor(item.baseCost * Math.pow(1.15, count));

    if (state.money >= currentCost) {
        state.money -= currentCost;
        state.inventory[id] = count + 1;
        
        if (item.type === 'auto') {
            state.gps += item.income;
        } else {
            state.clickPower += item.power;
        }
        
        renderShop();
        updateDisplay();
        saveGame();
    }
}

function updateDisplay() {
    document.getElementById('money').innerText = Math.floor(state.money).toLocaleString();
    document.getElementById('gps').innerText = state.gps.toLocaleString();
    
    const buttons = document.querySelectorAll('.item button');
    UPGRADES.forEach((item, index) => {
        const count = state.inventory[item.id] || 0;
        const currentCost = Math.floor(item.baseCost * Math.pow(1.15, count));
        if (buttons[index]) {
            buttons[index].className = state.money < currentCost ? 'locked' : '';
        }
    });
}

function startAutoMine() {
    setInterval(() => {
        state.money += state.gps / 10;
        updateDisplay();
    }, 100);
    setInterval(saveGame, 10000);
}

init();
