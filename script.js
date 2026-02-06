// Инициализация базового состояния
let state = {
    money: 0,
    gps: 0,
    clickPower: 1,
    inventory: {},
    level: 1,
    exp: 0,
    nextLevelExp: 100
};

// Запуск игры при загрузке страницы
function init() {
    const saved = loadGame();
    if (saved) {
        state = { ...state, ...saved };
    }
    
    // Применяем внешний вид руды в зависимости от уровня
    updateOreVisual();
    updateDisplay();
    renderShop();
    startLoops();
    spawnBonus();
}

// Обработка клика по руде
function handleMine(e) {
    const isCrit = Math.random() < 0.1; // 10% шанс крита
    const multiplier = isCrit ? 5 : 1;
    const amount = state.clickPower * multiplier;

    state.money += amount;
    state.exp += amount;

    // Эффекты
    createPop(e.clientX, e.clientY, `+${amount}${isCrit ? '🔥' : ''}`, isCrit ? 'crit' : '');
    checkLevelUp();
    updateDisplay();
}

// Создание всплывающего текста
function createPop(x, y, txt, cls) {
    const p = document.createElement('div');
    p.className = 'pop ' + cls;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.innerText = txt;
    document.body.appendChild(p);
    
    // Удаляем элемент после завершения анимации
    setTimeout(() => p.remove(), 700);
}

// Проверка повышения уровня
function checkLevelUp() {
    if (state.exp >= state.nextLevelExp) {
        state.level++;
        state.exp = 0;
        state.nextLevelExp = Math.floor(state.nextLevelExp * 2.2); // Усложнение следующего уровня
        
        updateOreVisual();
        createPop(window.innerWidth / 2, window.innerHeight / 2, "УРОВЕНЬ UP! ⭐", "crit");
        saveGame();
    }
}

// Обновление картинки руды
function updateOreVisual() {
    const oreElement = document.getElementById('ore');
    if (ORES && ORES.length > 0) {
        const index = (state.level - 1) % ORES.length;
        oreElement.innerText = ORES[index];
    }
}

// Покупка в магазине
function buy(id) {
    const item = UPGRADES.find(u => u.id === id);
    const count = state.inventory[id] || 0;
    const cost = Math.floor(item.baseCost * Math.pow(1.15, count));

    if (state.money >= cost) {
        state.money -= cost;
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

// Отрисовка списка товаров
function renderShop() {
    const list = document.getElementById('shop-list');
    if (!list) return;

    list.innerHTML = UPGRADES.map(item => {
        const count = state.inventory[item.id] || 0;
        const cost = Math.floor(item.baseCost * Math.pow(1.15, count));
        const canAfford = state.money >= cost;

        return `
            <div class="item">
                <div class="info">
                    <b>${item.name}</b> <span style="color: #888;">(${count})</span>
                    <br>
                    <small>${item.type === 'click' ? 'Клик: +' + item.power : 'Доход: +' + item.income + '/с'}</small>
                </div>
                <button onclick="buy('${item.id}')" ${!canAfford ? 'disabled' : ''}>
                    ${cost.toLocaleString()} 💰
                </button>
            </div>
        `;
    }).join('');
}

// Обновление всех цифр на экране
function updateDisplay() {
    document.getElementById('money').innerText = Math.floor(state.money).toLocaleString();
    document.getElementById('gps').innerText = state.gps.toFixed(1);
    document.getElementById('lvl-text').innerText = state.level;

    // Полоска опыта
    const progress = (state.exp / state.nextLevelExp) * 100;
    document.getElementById('exp-bar').style.width = progress + '%';

    // Обновляем доступность кнопок в магазине без перерисовки всего списка
    const buttons = document.querySelectorAll('.item button');
    UPGRADES.forEach((item, i) => {
        const count = state.inventory[item.id] || 0;
        const cost = Math.floor(item.baseCost * Math.pow(1.15, count));
        if (buttons[i]) buttons[i].disabled = state.money < cost;
    });
}

// Игровые циклы (доход и автосохранение)
function startLoops() {
    // Начисление пассивного дохода 10 раз в секунду для плавности
    setInterval(() => {
        if (state.gps > 0) {
            const incomePerTick = state.gps / 10;
            state.money += incomePerTick;
            state.exp += incomePerTick / 2; // Опыт капает и от пассивки, но медленнее
            checkLevelUp();
            updateDisplay();
        }
    }, 100);

    // Автосохранение каждые 15 секунд
    setInterval(saveGame, 15000);
}

// Спавн случайного бонуса
function spawnBonus() {
    setTimeout(() => {
        const b = document.createElement('div');
        b.className = 'bonus';
        b.innerText = '🎁';
        b.style.top = (Math.random() * 60 + 20) + '%';
        document.body.appendChild(b);

        b.onclick = () => {
            const reward = Math.floor(state.gps * 60 + 100); // Подарок за 1 минуту работы или миним. 100
            state.money += reward;
            createPop(window.innerWidth / 2, window.innerHeight / 2, `ПОДАРОК: +${reward} 💰`, 'crit');
            b.remove();
            updateDisplay();
        };

        // Удалить, если не кликнули
        setTimeout(() => { if (b.parentNode) b.remove(); }, 4000);
        
        spawnBonus(); // Зацикливаем спавн
    }, 20000 + Math.random() * 20000);
}

// Переключение экранов
function changeScreen(s) {
    document.getElementById('screen-mine').classList.toggle('hidden', s !== 'mine');
    document.getElementById('screen-shop').classList.toggle('hidden', s !== 'shop');
    if (s === 'shop') renderShop();
}

// Старт
init();
