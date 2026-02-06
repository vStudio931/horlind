function saveGame() {
    const saveData = {
        money: state.money,
        inventory: state.inventory,
        gps: state.gps,
        clickPower: state.clickPower
    };
    localStorage.setItem('miner_ultimate_save', JSON.stringify(saveData));
}

function loadGame() {
    const data = localStorage.getItem('miner_ultimate_save');
    return data ? JSON.parse(data) : null;
}
