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
