// 1. ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЯ (добавлены новые поля для обновления)
let state = {
    money: 0,
    gps: 0,
    clickPower: 1,
    inventory: {},
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    lastSaveTime: Date.now(),
    totalClicks: 0,
    unlockedAchievements: [],
    lastWheelSpin: 0,
    frenzyActive: false,
    // --- НОВЫЕ ПОЛЯ ОБНОВЛЕНИЯ ---
    prestigeCrystals: 0,
    prestigeMultiplier: 1,
    skills: { activity: 0, automation: 0, luck: 0 },
    currentPet: null,
    unlockedPets: [],
    currentLocationIndex: 0
};

// Конфигурация достижений
const ACHIEVEMENTS = [
    { id: 'click_100', name: 'Новичок', desc: '100 кликов', goal: 100, type: 'clicks', bonus: 1.1 },
    { id: 'click_1000', name: 'Работяга', desc: '1,000 кликов', goal: 1000, type: 'clicks', bonus: 1.2 },
    { id: 'money_100k', name: 'Миллионер?', desc: 'Накопить 100,000', goal: 100000, type: 'money', bonus: 1.5 }
];

// Конфигурация навыков
const SKILLS_CONFIG = {
    activity: { name: "Сила Клика", icon: "⚔️", desc: "+20% к клику" },
    automation: { name: "Авто-Шахтеры", icon: "🤖", desc: "+15% к GPS" },
    luck: { name: "Удача", icon: "🍀", desc: "+10% шанс крита" }
};

// 2. ЗАПУСК
function init() {
    const saved = loadGame();
    if (saved) {
        state = { ...state, ...saved };
        calculateOfflineProgress();
    }
    
    updateBackground();
    updateOreVisual();
    updateDisplay();
    renderShop();
    renderAchievements();
    renderSkills(); // Рендерим навыки
    updatePetVisual(); // Показываем питомца
    startLoops();
    spawnBonus();
    checkWheelStatus();
}

// 3. СИСТЕМА ЧАСТИЦ (Particles)
function createParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        const size = Math.random() * 6 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

// 4. ЛИХОРАДКА (Frenzy Mode)
function startFrenzy() {
    state.frenzyActive = true;
    document.getElementById('frenzy-container').classList.add('hidden');
    document.body.classList.add('frenzy-mode');
    
    createPop(window.innerWidth/2, window.innerHeight/2, "X10 МОЩНОСТЬ!", "crit");
    
    setTimeout(() => {
        state.frenzyActive = false;
        document.body.classList.remove('frenzy-mode');
    }, 10000); 
}

// 5. КЛИК ПО РУДЕ
function handleMine(e) {
    state.totalClicks++;
    createParticles(e.clientX, e.clientY);

    // Учет навыка Удачи для крита
    const critChance = 0.1 + (state.skills.luck * 0.05);
    const isCrit = Math.random() < critChance;
    
    let multiplier = isCrit ? 5 : 1;
    if (state.frenzyActive) multiplier *= 10; 

    // Учет бонусов от достижений и ПРЕСТИЖА
    let totalMultiplier = state.prestigeMultiplier;
    ACHIEVEMENTS.forEach(ach => {
        if (state.unlockedAchievements.includes(ach.id)) totalMultiplier *= ach.bonus;
    });

    // Учет навыка активности
    const activityBonus = 1 + (state.skills.activity * 0.2);
    
    const amount = state.clickPower * multiplier * totalMultiplier * activityBonus;

    state.money += amount;
    state.exp += amount;

    if (isCrit || state.frenzyActive) {
        document.body.classList.add('shake');
        setTimeout(() => document.body.classList.remove('shake'), 200);
    }

    createPop(e.clientX, e.clientY, `+${Math.floor(amount)}${isCrit ? '🔥' : ''}`, isCrit ? 'crit' : '');
    checkLevelUp();
    checkAchievements();
    updateDisplay();
}

// 6. ДОСТИЖЕНИЯ
function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (!state.unlockedAchievements.includes(ach.id)) {
            const val = ach.type === 'clicks' ? state.totalClicks : state.money;
            if (val >= ach.goal) {
                state.unlockedAchievements.push(ach.id);
                createPop(window.innerWidth / 2, 80, `🏆 Открыто: ${ach.name}`, 'crit');
                renderAchievements();
                saveGame();
            }
        }
    });
}

function renderAchievements() {
    const list = document.getElementById('achievements-list');
    if (!list) return;
    list.innerHTML = ACHIEVEMENTS.map(ach => {
        const isUnlocked = state.unlockedAchievements.includes(ach.id);
        return `
            <div class="item ${isUnlocked ? '' : 'locked'}">
                <div class="info">
                    <b>${isUnlocked ? ach.name : '???'}</b><br>
                    <small>${ach.desc} (Бонус: x${ach.bonus})</small>
                </div>
                <span>${isUnlocked ? '✅' : '🔒'}</span>
            </div>
        `;
    }).join('');
}

// 7. КОЛЕСО ФОРТУНЫ (Обновлено: шанс выбить питомца)
function spinWheel() {
    const now = Date.now();
    if (now - state.lastWheelSpin < 86400000) return;

    state.lastWheelSpin = now;
    const visual = document.getElementById('wheel-visual');
    visual.style.transition = "transform 3s cubic-bezier(0.15, 0, 0.15, 1)";
    visual.style.transform = `rotate(${1800 + Math.random() * 360}deg)`;

    document.getElementById('spin-btn').disabled = true;

    setTimeout(() => {
        const rand = Math.random();
        if (rand < 0.1 && !state.unlockedPets.includes('bat')) { // 10% шанс на питомца
            state.unlockedPets.push('bat');
            state.currentPet = 'bat';
            alert("✨ НЕВЕРОЯТНО! Вы выбили питомца: Летучая мышь! ✨");
            updatePetVisual();
        } else {
            const win = state.gps * 600 + 500;
            state.money += win;
            alert(`Выигрыш: ${Math.floor(win).toLocaleString()} 💰`);
        }
        
        visual.style.transform = `rotate(0deg)`;
        visual.style.transition = "none";
        checkWheelStatus();
        updateDisplay();
        saveGame();
    }, 3500);
}

function checkWheelStatus() {
    const timer = document.getElementById('wheel-timer');
    const btn = document.getElementById('spin-btn');
    const now = Date.now();
    const wait = 86400000 - (now - state.lastWheelSpin);

    if (wait > 0) {
        btn.disabled = true;
        timer.innerText = `Доступно через: ${Math.floor(wait / 3600000)}ч`;
    } else {
        btn.disabled = false;
        timer.innerText = "Доступно!";
    }
}

// 8. ЛОКАЦИИ (Обновлено: БИОМЫ)
function updateBackground() {
    const lvl = state.level;
    let color = "#0f0f0f"; 
    if (lvl >= 10) color = "#b8860b"; // Золотой прииск
    if (lvl >= 20) color = "#4b0082"; // Кристальная пещера
    if (lvl >= 50) color = "#8b0000"; // Марсианское ядро
    document.body.style.background = color;
}

// --- НОВАЯ СИСТЕМА ПРЕСТИЖА И НАВЫКОВ ---

function doPrestige() {
    if (state.level < 100) {
        alert("Престиж доступен только с 100 уровня!");
        return;
    }
    const crystals = Math.floor(state.level / 10);
    if (confirm(`Перерождение даст вам ${crystals} 🔮 Кристаллов Тьмы, но обнулит золото и шахтеров. Уверены?`)) {
        state.prestigeCrystals += crystals;
        state.prestigeMultiplier = 1 + (state.prestigeCrystals * 0.1);
        
        // Сброс прогресса
        state.money = 0;
        state.gps = 0;
        state.level = 1;
        state.exp = 0;
        state.nextLevelExp = 100;
        state.inventory = {};
        state.clickPower = 1;
        
        saveGame();
        location.reload();
    }
}

function renderSkills() {
    const container = document.getElementById('skills-list');
    if (!container) return;
    
    container.innerHTML = Object.keys(SKILLS_CONFIG).map(key => {
        const skill = SKILLS_CONFIG[key];
        const level = state.skills[key];
        const cost = (level + 1) * 2;
        return `
            <div class="item" style="border-left-color: #bc13fe">
                <div class="info">
                    <b>${skill.icon} ${skill.name}</b> [Ур. ${level}]<br>
                    <small>${skill.desc}</small>
                </div>
                <button onclick="upgradeSkill('${key}')" ${state.prestigeCrystals < cost ? 'disabled' : ''}>
                    ${cost} 🔮
                </button>
            </div>
        `;
    }).join('');
    
    const crystalDisplay = document.getElementById('crystals-count');
    if (crystalDisplay) crystalDisplay.innerText = state.prestigeCrystals;
    const bonusDisplay = document.getElementById('prestige-bonus');
    if (bonusDisplay) bonusDisplay.innerText = Math.round((state.prestigeMultiplier - 1) * 100);
}

function upgradeSkill(key) {
    const cost = (state.skills[key] + 1) * 2;
    if (state.prestigeCrystals >= cost) {
        state.prestigeCrystals -= cost;
        state.skills[key]++;
        renderSkills();
        saveGame();
        updateDisplay();
    }
}

// --- СЛУЧАЙНЫЕ СОБЫТИЯ (Гоблин) ---

function spawnGoblin() {
    const layer = document.getElementById('event-layer');
    if (!layer) return;
    
    const goblin = document.createElement('div');
    goblin.innerHTML = "👺";
    goblin.style.cssText = `
        position: absolute; font-size: 60px; left: -100px; 
        top: ${Math.random() * 60 + 20}%; transition: left 4s linear; 
        cursor: pointer; pointer-events: auto; z-index: 2600;
    `;
    layer.appendChild(goblin);
    
    let clicks = 0;
    goblin.onclick = () => {
        clicks++;
        createPop(parseInt(goblin.style.left) + 50, parseInt(goblin.style.top), "УДАР!", "crit");
        if (clicks >= 3) {
            const reward = (state.gps * 60) + 1000;
            state.money += reward;
            createPop(window.innerWidth/2, window.innerHeight/2, `Гоблин побежден! +${Math.floor(reward)}💰`, "crit");
            goblin.remove();
        }
    };
    
    setTimeout(() => { goblin.style.left = "110%"; }, 100);
    setTimeout(() => { if (goblin.parentNode) goblin.remove(); }, 4100);
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function updatePetVisual() {
    const slot = document.getElementById('pet-slot');
    if (!slot) return;
    if (state.currentPet === 'bat') slot.innerText = "🦇";
    else if (state.currentPet === 'mole') slot.innerText = "🐹";
}

function calculateOfflineProgress() {
    const now = Date.now();
    const diff = Math.floor((now - state.lastSaveTime) / 1000);
    if (diff > 10 && state.gps > 0) {
        let petBonus = (state.currentPet === 'bat') ? 0.1 : 0; // Питомец дает +10% к офлайну
        const gained = diff * state.gps * (0.5 + petBonus);
        state.money += gained;
        setTimeout(() => alert(`Офлайн доход: ${Math.floor(gained).toLocaleString()} 💰`), 1000);
    }
}

function checkLevelUp() {
    if (state.exp >= state.nextLevelExp) {
        state.level++;
        state.exp = 0;
        state.nextLevelExp = Math.floor(state.nextLevelExp * 2.5);
        updateOreVisual();
        updateBackground();
        createPop(window.innerWidth/2, window.innerHeight/2, "LEVEL UP! ⭐", "crit");
        saveGame();
    }
}

function updateOreVisual() {
    const ore = document.getElementById('ore');
    const ores = ["🪨", "🪙", "💎", "☄️", "💠"];
    if (ore) ore.innerText = ores[(state.level - 1) % ores.length];
}

function buy(id) {
    const item = UPGRADES.find(u => u.id === id);
    const count = state.inventory[id] || 0;
    const cost = Math.floor(item.baseCost * Math.pow(1.15, count));
    if (state.money >= cost) {
        state.money -= cost;
        state.inventory[id] = count + 1;
        
        // Автоматизация (Навык)
        const autoBonus = 1 + (state.skills.automation * 0.15);
        if (item.type === 'auto') state.gps += (item.income * autoBonus);
        else state.clickPower += item.power;
        
        renderShop();
        updateDisplay();
        saveGame();
    }
}

function renderShop() {
    const list = document.getElementById('shop-list');
    if (!list) return;
    list.innerHTML = UPGRADES.map(item => {
        const count = state.inventory[item.id] || 0;
        const cost = Math.floor(item.baseCost * Math.pow(1.15, count));
        return `
            <div class="item">
                <div class="info"><b>${item.name}</b> (${count})<br><small>${item.type==='click'?'+'+item.power:'+'+item.income+'/с'}</small></div>
                <button onclick="buy('${item.id}')" ${state.money < cost ? 'disabled' : ''}>${cost.toLocaleString()}</button>
            </div>`;
    }).join('');
}

function updateDisplay() {
    document.getElementById('money').innerText = Math.floor(state.money).toLocaleString();
    document.getElementById('gps').innerText = state.gps.toFixed(1);
    document.getElementById('lvl-text').innerText = state.level;
    document.getElementById('exp-bar').style.width = (state.exp / state.nextLevelExp * 100) + '%';
    
    const btns = document.querySelectorAll('#shop-list button');
    UPGRADES.forEach((item, i) => {
        const cost = Math.floor(item.baseCost * Math.pow(1.15, state.inventory[item.id] || 0));
        if (btns[i]) btns[i].disabled = state.money < cost;
    });
}

function startLoops() {
    setInterval(() => { state.money += state.gps / 10; updateDisplay(); }, 100);
    setInterval(() => { state.lastSaveTime = Date.now(); saveGame(); }, 5000);
    
    // Случайные события
    setInterval(() => { 
        if (Math.random() < 0.2) document.getElementById('frenzy-container').classList.remove('hidden'); 
        if (Math.random() < 0.1) spawnGoblin(); 
    }, 30000);
}

function createPop(x, y, txt, cls) {
    const p = document.createElement('div');
    p.className = 'pop ' + cls;
    p.style.left = x + 'px'; p.style.top = y + 'px';
    p.innerText = txt;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
}

function spawnBonus() {
    setTimeout(() => {
        const b = document.createElement('div');
        b.className = 'bonus'; b.innerText = '🎁';
        b.style.top = Math.random() * 70 + 10 + '%';
        document.body.appendChild(b);
        b.onclick = () => { 
            const g = Math.floor(state.gps * 100 + 50); 
            state.money += g; 
            createPop(window.innerWidth/2, window.innerHeight/2, `+${g} 💰`, 'crit'); 
            b.remove(); 
        };
        setTimeout(() => b.remove(), 4000);
        spawnBonus();
    }, 20000 + Math.random() * 20000);
}

function changeScreen(s) {
    const screens = ['screen-mine', 'screen-shop', 'screen-achievements', 'screen-wheel', 'screen-prestige'];
    screens.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', id !== `screen-${s}`);
    });
    if (s === 'prestige') renderSkills();
}

init();
