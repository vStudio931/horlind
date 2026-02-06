/**
 * UPGRADES - База данных всех предметов в магазине.
 * Расширена, чтобы прогресс шел плавно до самых высоких уровней.
 */
const UPGRADES = [
    // УЛУЧШЕНИЯ КЛИКА (Инструменты)
    { id: 'c1', name: 'Старая кирка', baseCost: 15, power: 1, type: 'click' },
    { id: 'c2', name: 'Стальной молот', baseCost: 150, power: 5, type: 'click' },
    { id: 'c3', name: 'Пневмо-дрель', baseCost: 1250, power: 22, type: 'click' },
    { id: 'c4', name: 'Лазерный резак', baseCost: 14000, power: 115, type: 'click' },
    { id: 'c5', name: 'Плазменный бур', baseCost: 165000, power: 950, type: 'click' },
    { id: 'c6', name: 'Молекулярный расщепитель', baseCost: 1800000, power: 6200, type: 'click' },
    { id: 'c7', name: 'Звуковой вибратор', baseCost: 25000000, power: 45000, type: 'click' },
    { id: 'c8', name: 'Перчатка бесконечности', baseCost: 500000000, power: 350000, type: 'click' },

    // АВТО-УЛУЧШЕНИЯ (Наемники и технологии)
    { id: 'a1', name: 'Младший гном', baseCost: 50, income: 1, type: 'auto' },
    { id: 'a2', name: 'Робот-копатель', baseCost: 750, income: 10, type: 'auto' },
    { id: 'a3', name: 'Глубинная шахта', baseCost: 5000, income: 55, type: 'auto' },
    { id: 'a4', name: 'Карьерный комбайн', baseCost: 30000, income: 240, type: 'auto' },
    { id: 'a5', name: 'Нано-фабрика', baseCost: 200000, income: 1400, type: 'auto' },
    { id: 'a6', name: 'Космический бур', baseCost: 1800000, income: 11000, type: 'auto' },
    { id: 'a7', name: 'Аннигилятор материи', baseCost: 15000000, income: 85000, type: 'auto' },
    { id: 'a8', name: 'Звезда смерти (мини)', baseCost: 200000000, income: 950000, type: 'auto' },
    { id: 'a9', name: 'Варп-генератор', baseCost: 2500000000, income: 8000000, type: 'auto' },
    { id: 'a10', name: 'Создатель реальностей', baseCost: 40000000000, income: 75000000, type: 'auto' }
];

/**
 * ORES - Массив из 50 объектов руды.
 * Прогресс от обычного камня до мистических и космических сущностей.
 */
const ORES = [
    '🪨', '🪵', '🧱', '🪙', '⛓️', '📎', '⚙️', '🔩', '🔨', '⛏️', // 1-10
    '💎', '💠', '🔹', '🔷', '🧿', '🔮', '💜', '🟣', '⚛️', '☸️', // 11-20
    '🟡', '🟠', '🔴', '🔥', '🧨', '💥', '⚡', '🔋', '🔌', '📡', // 21-30
    '🤖', '🦾', '🛸', '🚀', '🛰️', '🪐', '🌑', '🌓', '🌕', '🌟', // 31-40
    '✨', '🌌', '🌠', '☄️', '🌀', '🎭', '👑', '🔱', '🧿', '🕉️'  // 41-50
];

/**
 * ACHIEVEMENTS - Дополнительные цели.
 */
const ACHIEVEMENTS_DATA = [
    { id: 'click_100', name: 'Новичок', desc: 'Сделано 100 кликов', goal: 100, type: 'clicks', bonus: 1.1 },
    { id: 'click_1000', name: 'Мастер клика', desc: '1,000 кликов', goal: 1000, type: 'clicks', bonus: 1.2 },
    { id: 'click_10000', name: 'Палец-легенда', desc: '10,000 кликов', goal: 10000, type: 'clicks', bonus: 1.5 },
    { id: 'money_1m', name: 'Миллионер', desc: 'Накоплен 1,000,000 золота', goal: 1000000, type: 'money', bonus: 1.3 },
    { id: 'money_1b', name: 'Миллиардер', desc: 'Накоплен 1,000,000,000 золота', goal: 1000000000, type: 'money', bonus: 2.0 },
    { id: 'lvl_10', name: 'Горняк', desc: 'Достигнут 10 уровень', goal: 10, type: 'level', bonus: 1.1 },
    { id: 'lvl_50', name: 'Бог Шахты', desc: 'Достигнут 50 уровень', goal: 50, type: 'level', bonus: 5.0 }
];

/**
 * SKILLS_CONFIG - Характеристики веток развития для меню престижа.
 */
const SKILLS_UPGRADES = {
    activity: { 
        name: "Сила Клика", 
        icon: "⚔️", 
        desc: "+20% к мощности каждого нажатия", 
        baseBonus: 0.2 
    },
    automation: { 
        name: "Автоматизация", 
        icon: "🤖", 
        desc: "+15% к эффективности всех строений (GPS)", 
        baseBonus: 0.15 
    },
    luck: { 
        name: "Удача", 
        icon: "🍀", 
        desc: "+5% к шансу критического удара", 
        baseBonus: 0.05 
    }
};
