/**
 * UPGRADES - База данных всех предметов в магазине.
 * click - увеличивает силу клика (эффективность добычи вручную).
 * auto - увеличивает пассивный доход в секунду (GPS).
 */
const UPGRADES = [
    // УЛУЧШЕНИЯ КЛИКА (Инструменты)
    { id: 'c1', name: 'Старая кирка', baseCost: 15, power: 1, type: 'click' },
    { id: 'c2', name: 'Стальной молот', baseCost: 150, power: 5, type: 'click' },
    { id: 'c3', name: 'Пневмо-дрель', baseCost: 1250, power: 20, type: 'click' },
    { id: 'c4', name: 'Лазерный резак', baseCost: 12000, power: 100, type: 'click' },
    { id: 'c5', name: 'Плазменный бур', baseCost: 155000, power: 850, type: 'click' },
    { id: 'c6', name: 'Молекулярный расщепитель', baseCost: 1200000, power: 5000, type: 'click' },

    // АВТО-УЛУЧШЕНИЯ (Наемники, строения, технологии)
    { id: 'a1', name: 'Младший гном', baseCost: 50, income: 1, type: 'auto' },
    { id: 'a2', name: 'Робот-копатель', baseCost: 600, income: 8, type: 'auto' },
    { id: 'a3', name: 'Глубинная шахта', baseCost: 4500, income: 45, type: 'auto' },
    { id: 'a4', name: 'Карьерный комбайн', baseCost: 25000, income: 200, type: 'auto' },
    { id: 'a5', name: 'Нано-фабрика', baseCost: 180000, income: 1200, type: 'auto' },
    { id: 'a6', name: 'Космический бур', baseCost: 1500000, income: 9500, type: 'auto' },
    { id: 'a7', name: 'Аннигилятор материи', baseCost: 12000000, income: 75000, type: 'auto' },
    { id: 'a8', name: 'Звезда смерти (мини)', baseCost: 150000000, income: 850000, type: 'auto' }
];

/**
 * ORES - Массив эмодзи руды.
 * Визуальный прогресс: чем выше уровень, тем "дороже" выглядит объект.
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
    '🌟', // Уровень 10
    '🌀', // Уровень 11
    '💠', // Уровень 12
    '🔆', // Уровень 13
    '🪐', // Уровень 14
    '☄️', // Уровень 15
    '🌌'  // Уровень 16+
];

/**
 * ACHIEVEMENTS - Дополнительные данные (если решишь вынести их из script.js)
 */
const ACHIEVEMENTS_DATA = [
    { id: 'click_100', name: 'Новичок', desc: 'Сделано 100 кликов', goal: 100, type: 'clicks' },
    { id: 'money_1m', name: 'Магнат', desc: 'Накоплен 1,000,000 золота', goal: 1000000, type: 'money' }
];
