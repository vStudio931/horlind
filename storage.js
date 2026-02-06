const DB_NAME = 'MinerTycoonSupreme_v1';

/**
 * Сохраняет текущее состояние игры в LocalStorage.
 * Вызывается автоматически каждые 5 секунд или при покупках.
 */
function saveGame() {
    try {
        const data = {
            money: state.money,
            gps: state.gps,
            clickPower: state.clickPower,
            inventory: state.inventory,
            level: state.level,
            exp: state.exp,
            nextLevelExp: state.nextLevelExp,
            // Сохраняем точное время выхода для расчета офлайн-добычи
            lastSaveTime: Date.now() 
        };
        
        localStorage.setItem(DB_NAME, JSON.stringify(data));
        console.log("Игра сохранена: " + new Date().toLocaleTimeString());
    } catch (e) {
        console.error("Не удалось сохранить игру:", e);
    }
}

/**
 * Загружает данные из LocalStorage при старте игры.
 * Возвращает объект с данными или null, если сохранения нет.
 */
function loadGame() {
    try {
        const data = localStorage.getItem(DB_NAME);
        if (!data) return null;

        const parsed = JSON.parse(data);
        
        // Проверка на корректность данных
        if (typeof parsed.money !== 'number') return null;

        return parsed;
    } catch (e) {
        console.error("Ошибка загрузки данных:", e);
        return null;
    }
}

/**
 * Функция для полной очистки прогресса (если игрок захочет начать заново).
 */
function resetProgress() {
    if (confirm("Вы уверены? Весь ваш прогресс будет безвозвратно удален!")) {
        localStorage.removeItem(DB_NAME);
        location.reload(); // Перезагружаем страницу для обнуления всех переменных
    }
}
