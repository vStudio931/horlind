/**
 * UPGRADES - База данных всех предметов в магазине.
 * click - увеличивает силу клика.
 * auto - увеличивает пассивный доход в секунду.
 */
const UPGRADES = [
    // УЛУЧШЕНИЯ КЛИКА (ИНСТРУМЕНТЫ)
    { id: 'c1', name: 'Старая кирка', baseCost: 15, power: 1, type: 'click' },
    { id: 'c2', name: 'Стальной молот', baseCost: 150, power: 5, type: 'click' },
    { id: 'c3', name: 'Пневмо-дрель', baseCost: 1200, power: 25, type: 'click' },
    { id: 'c4', name: 'Лазерный резак', baseCost: 15000, power: 150, type: 'click' },
    { id: 'c5', name: 'Плазменный бур', baseCost: 150000, power: 1200, type: 'click' },

    // АВТО-УЛУЧШЕНИЯ (НАЕМНИКИ И ШАХТЫ)
    { id: 'a1', name: 'Младший гном', baseCost: 50, income: 1, type: 'auto' },
    { id: 'a2', name: 'Робот-копатель', baseCost: 500, income: 10, type: 'auto' },
    { id: 'a3', name: 'Глубинная шахта', baseCost: 3500, income: 55, type: 'auto' },
    { id: 'a4', name: 'Карьерный комбайн', baseCost: 20000, income: 250, type: 'auto' },
    { id: 'a5', name: 'Нано-фабрика', baseCost: 125000, income: 1400, type: 'auto' },
    { id: 'a6', name: 'Космический бур', baseCost: 1000000, income: 12000, type: 'auto' }
];

/**
 * ORES - Массив эмодзи руды.
 * Каждый раз при повышении уровня (Level Up) берется следующий символ.
 */
const ORES = [
    '💎', // Уровень 1
    '🧱', // Уровень 2
    '🔘', // Уровень 3
    '🟡', // Уровень 4
    '🟠', // Уровень 5
    '🔴', // Уровень 6
    '🟣', // Уровень 7
    '🔮', // Уровень 8
    '⚛️', // Уровень 9
    '🌟'  // Уровень 10+
];
