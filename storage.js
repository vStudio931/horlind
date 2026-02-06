const DB_NAME = 'MinerTycoonSupreme_v1';

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
            lastSaveTime: Date.now()
        };
        localStorage.setItem(DB_NAME, JSON.stringify(data));
        console.log("Прогресс успешно сохранен в БД браузера.");
    } catch (error) {
        console.error("Ошибка при сохранении игры:", error);
    }
}

function loadGame() {
    try {
        const data = localStorage.getItem(DB_NAME);
        if (!data) return null;

        const parsedData = JSON.parse(data);
        
        // Проверка на целостность данных
        if (typeof parsedData.money !== 'number') return null;

        console.log("Прогресс успешно загружен.");
        return parsedData;
    } catch (error) {
        console.error("Ошибка при загрузке сохранения:", error);
        return null;
    }
}

function resetProgress() {
    if (confirm("Вы уверены, что хотите полностью сбросить прогресс? Это действие необратимо!")) {
        localStorage.removeItem(DB_NAME);
        location.reload();
    }
}
