/**
 * UPGRADES - список всех товаров в магазине.
 * id: уникальный идентификатор
 * name: название товара
 * baseCost: начальная цена
 * power/income: на сколько увеличивает клик или авто-доход
 * type: 'click' (для кликов) или 'auto' (пассивный доход)
 */
const UPGRADES = [
    // Улучшения клика (Инструменты)
    { id: 'c1', name: 'Деревянная кирка', baseCost: 15, power: 1, type: 'click' },
    { id: 'c2', name: 'Каменный молот', baseCost: 100, power: 5, type: 'click' },
    { id: 'c3', name: 'Железный бур', baseCost: 1000, power: 25, type: 'click' },
    { id: 'c4', name: 'Алмазный резак', baseCost: 10000, power: 150, type: 'click' },
    { id: 'c5', name: 'Лазерный расщепитель', baseCost: 100000, power: 1000, type: 'click' },

    // Автоматические шахтеры (Здания)
    { id: 'a1', name: 'Рабочий-новичок', baseCost: 50, income: 1, type: 'auto' },
    { id: 'a2', name: 'Бригада шахтеров', baseCost: 500, income: 8, type: 'auto' },
    { id: 'a3', name: 'Автоматическая шахта', baseCost: 2500, income: 45, type: 'auto' },
    { id: 'a4', name: 'Карьерный экскаватор', baseCost: 15000, income: 200, type: 'auto' },
    { id: 'a5', name: 'Подземный завод', baseCost: 100000, income: 1200, type: 'auto' },
    { id: 'a6', name: 'Орбитальная станция', baseCost: 1000000, income: 10000, type: 'auto' }
];

/**
 * ORES - список эмодзи, которые будут меняться при повышении уровня.
 */
const ORES = [
    '💎', // 1 уровень
    '🧱', // 2 уровень
    '🟡', // 3 уровень
    '🔴', // 4 уровень
    '🟣', // 5 уровень
    '🔮', // 6 уровень
    '⚛️', // 7 уровень
    '🌟', // 8 уровень
    '☄️', // 9 уровень
    '🔱'  // 10 уровень
];
