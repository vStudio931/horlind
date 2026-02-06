// Инициализация базового состояния
let state = {
    money: 0,
    gps: 0,
    clickPower: 1,
    inventory: {},
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    lastSaveTime: Date.now()
};

// Запуск игры
function init() {
    const saved = loadGame();
    if (saved) {
        state = { ...state, ...saved };
        calculateOfflineProgress();
    }
    
    updateOreVisual();
    updateDisplay();
    renderShop();
    startLoops();
    spawnBonus();
}

// Расчет дохода за время отсутствия
function calculateOfflineProgress() {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - state.lastSaveTime) / 1000);
    
    // Если игрока не было больше 10 секунд и у него есть пассивный доход
    if (diffInSeconds > 10 && state.gps > 0) {
        const offlineRate = 0.5; // 50% от обычного дохода
        const gained = diffInSeconds * state.gps * offlineRate;
        state.money += gained;
        
        // Показываем уведомление (можно заменить на красивое модальное окно)
        setTimeout(() => {
            alert(`С возвращением! Пока тебя не было (${formatTime(diffInSeconds)}), твои рабочие добыли ${Math.floor(gained).toLocaleString()} 💰`);
        }, 500);
    }
}

function formatTime(s) {
    if (s < 60) return s + " сек.";
    if (s < 3600) return Math.floor(s / 60) + " мин.";
    return Math.floor(s / 3600) + " ч.";
}

// Клик по руде
function handleMine(e) {
    const isCrit = Math.random() < 0.1; // 10% шанс крита
    const multiplier = isCrit ? 5 : 1;
    const amount = state.clickPower * multiplier;

    state.money += amount;
    state.exp += amount;

    // Эффект тряски при крите
    if (isCrit) {
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 200);
    }

    createPop(e.clientX, e.clientY, `+${amount}${isCrit ? '🔥' : ''}`, isCrit ? 'crit' : '');
    checkLevelUp();
    updateDisplay();
}

// Всплывающие цифры
function createPop(x, y, txt, cls) {
    const p = document.createElement('div');
    p.className = 'pop ' + cls;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.innerText = txt;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
}

// Система уровней
function checkLevelUp() {
    if (state.exp >= state.nextLevelExp) {
        state.level++;
        state.exp = 0;
        state.nextLevelExp = Math.floor(state.nextLevelExp * 2.5);
        
        updateOreVisual();
        createPop(window.innerWidth / 2, window.innerHeight / 2, "LEVEL UP! ⭐", "crit");
        saveGame();
    }
}

function updateOreVisual() {
    const ore = document.getElementById('ore');
    if (ORES && ORES.length > 0) {
        ore.innerText = ORES[(state.level - 1) % ORES.length];
    }
}

// Магазин
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
        return `
            <div class="item">
                <div class="info">
                    <b>${item.name}</b> (${count})<br>
                    <small>${item.type === 'click' ? '+' + item.power : '+' + item.income + '/с'}</small>
                </div>
                <button onclick="buy('${item.id}')" ${state.money < cost ? 'disabled' : ''}>
                    ${cost.toLocaleString()} 💰
                </button>
            </div>
        `;
    }).join('');
}

// Обновление интерфейса
function updateDisplay() {
    document.getElementById('money').innerText = Math.floor(state.money).toLocaleString();
    document.getElementById('gps').innerText = state.gps.toFixed(1);
    document.getElementById('lvl-text').innerText = state.level;
    
    const progress = (state.exp / state.nextLevelExp) * 100;
    document.getElementById('exp-bar').style.width = progress + '%';

    // Обновляем доступность кнопок
    const buttons = document.querySelectorAll('.item button');
    UPGRADES.forEach((item, i) => {
        const count = state.inventory[item.id] || 0;
        const cost = Math.floor(item.baseCost * Math.pow(1.15, count));
        if (buttons[i]) buttons[i].disabled = state.money < cost;
    });
}

// Циклы игры
function startLoops() {
    // Начисление дохода
    setInterval(() => {
        if (state.gps > 0) {
            state.money += state.gps / 10;
            updateDisplay();
        }
    }, 100);

    // Автосохранение
    setInterval(() => {
        state.lastSaveTime = Date.now();
        saveGame();
    }, 5000);
}

// Бонусы
function spawnBonus() {
    setTimeout(() => {
        const b = document.createElement('div');
        b.className = 'bonus';
        b.innerText = '🎁';
        b.style.top = Math.random() * 70 + 10 + '%';
        document.body.appendChild(b);

        b.onclick = () => {
            const gift = Math.floor(state.gps * 60 + 50);
            state.money += gift;
            createPop(window.innerWidth / 2, window.innerHeight / 2, `+${gift} 💰`, 'crit');
            b.remove();
        };

        setTimeout(() => { if (b.parentNode) b.remove(); }, 4000);
        spawnBonus();
    }, 15000 + Math.random() * 20000);
}

function changeScreen(s) {
    document.getElementById('screen-mine').classList.toggle('hidden', s !== 'mine');
    document.getElementById('screen-shop').classList.toggle('hidden', s !== 'shop');
}

init();
