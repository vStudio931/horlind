const DB_NAME = 'MinerTycoonSupreme_v1';

/**
 * Сохраняет текущее состояние игры в LocalStorage.
 */
function saveGame() {
    try {
        const data = {
            // Базовые ресурсы
            money: state.money,
            gps: state.gps,
            clickPower: state.clickPower,
            inventory: state.inventory,
            
            // Прогресс уровней
            level: state.level,
            exp: state.exp,
            nextLevelExp: state.nextLevelExp,
            
            // НОВАЯ СТАТИСТИКА И ФИШКИ
            totalClicks: state.totalClicks,
            unlockedAchievements: state.unlockedAchievements,
            lastWheelSpin: state.lastWheelSpin,
            
            // --- ДОПОЛНЕНИЯ ДЛЯ ОБНОВЛЕНИЯ ---
            
            // Престиж и Кристаллы
            prestigeCrystals: state.prestigeCrystals || 0,
            prestigeMultiplier: state.prestigeMultiplier || 1,
            
            // Навыки (Skills)
            skills: state.skills || {
                activity: 0,    // Ветка Активности
                automation: 0,  // Ветка Автоматизации
                luck: 0         // Ветка Удачи
            },
            
            // Питомцы
            currentPet: state.currentPet || null, // ID активного питомца
            unlockedPets: state.unlockedPets || [], // Список открытых питомцев
            
            // Локации
            currentLocationIndex: state.currentLocationIndex || 0,
            
            // Время для офлайн-дохода
            lastSaveTime: Date.now() 
        };
        
        localStorage.setItem(DB_NAME, JSON.stringify(data));
        console.log("Прогресс сохранен успешно.");
    } catch (e) {
        console.error("Ошибка сохранения:", e);
    }
}

/**
 * Загружает данные при старте.
 */
function loadGame() {
    try {
        const data = localStorage.getItem(DB_NAME);
        if (!data) return null;

        const parsed = JSON.parse(data);
        
        // Базовая валидация, чтобы не загрузить пустой файл
        if (parsed && typeof parsed.money === 'number') {
            console.log("Данные успешно загружены.");
            return parsed;
        }
        return null;
    } catch (e) {
        console.error("Ошибка загрузки данных:", e);
        return null;
    }
}

/**
 * Полный сброс игры.
 */
function resetProgress() {
    if (confirm("Внимание! Весь ваш прогресс, достижения и золото будут удалены безвозвратно. Продолжить?")) {
        localStorage.removeItem(DB_NAME);
        location.reload(); 
    }
}

/**
 * Специальная функция для сохранения ТОЛЬКО после Престижа 
 * (чтобы сбросить ресурсы, но оставить кристаллы и навыки)
 */
function savePrestigeData(crystalsGained) {
    const currentData = loadGame();
    if (currentData) {
        currentData.prestigeCrystals = (currentData.prestigeCrystals || 0) + crystalsGained;
        currentData.money = 0;
        currentData.level = 1;
        currentData.exp = 0;
        currentData.inventory = []; // Сброс купленных шахтеров
        currentData.gps = 0;
        
        localStorage.setItem(DB_NAME, JSON.stringify(currentData));
    }
}
