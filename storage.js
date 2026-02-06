const DB_NAME = 'MinerTycoonDB';

function saveGame() {
    const data = {
        money: state.money,
        gps: state.gps,
        clickPower: state.clickPower,
        inventory: state.inventory,
        level: state.level,
        exp: state.exp,
        nextLevelExp: state.nextLevelExp
    };
    localStorage.setItem(DB_NAME, JSON.stringify(data));
    console.log("Игра сохранена");
}

function loadGame() {
    const data = localStorage.getItem(DB_NAME);
    return data ? JSON.parse(data) : null;
}
