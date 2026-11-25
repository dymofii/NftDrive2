import { CarCatalogItem, CarTier, UpgradeId, UpgradeLevels } from '../types/game';

export const TITLE_BACKDROP_IMAGE =
  '/src/assets/images/nft_drive_title_bg_1795631604698.jpg';

export const CAR_CATALOG: CarCatalogItem[] = [
  // 1. Common
  {
    id: 'city_hatch',
    name: 'Briket Turbo',
    tier: 'common',
    tierLabel: 'Common',
    image: '/src/assets/images/car_city_hatch_1795632621275.jpg',
    basePrice: 65,
    baseIncome: 1.2,
    spawnWeight: 1,
    accentHex: '#94A3B8',
    fallbackGradient: 'from-slate-800 via-slate-900 to-slate-950',
    specs: '1.6L Turbo · Хетчбек 90-х',
  },
  {
    id: 'retro_coupe',
    name: 'Veloce 84',
    tier: 'common',
    tierLabel: 'Common',
    image: '/src/assets/images/car_retro_coupe_1795631605858.jpg',
    basePrice: 120,
    baseIncome: 2.2,
    spawnWeight: 1,
    accentHex: '#94A3B8',
    fallbackGradient: 'from-rose-950 via-slate-900 to-slate-950',
    specs: '3.2L V8 · Ретро купе',
  },

  // 2. Uncommon
  {
    id: 'rally_evo',
    name: 'Apex Rally',
    tier: 'uncommon',
    tierLabel: 'Uncommon',
    image: '/src/assets/images/car_rally_evo_1795632622824.jpg',
    basePrice: 380,
    baseIncome: 6,
    spawnWeight: 1,
    accentHex: '#10B981',
    fallbackGradient: 'from-emerald-950 via-slate-900 to-slate-950',
    specs: 'AWD · Ралійна серія',
  },
  {
    id: 'jdm_tuner',
    name: 'Kurogane R34',
    tier: 'uncommon',
    tierLabel: 'Uncommon',
    image: '/src/assets/images/car_jdm_tuner_1795631605183.jpg',
    basePrice: 560,
    baseIncome: 9,
    spawnWeight: 1,
    accentHex: '#10B981',
    fallbackGradient: 'from-blue-950 via-slate-900 to-slate-950',
    specs: 'Twin-Turbo · Стріт-спек',
  },

  // 3. Rare
  {
    id: 'muscle_gt',
    name: 'Ironworks V8',
    tier: 'rare',
    tierLabel: 'Rare',
    image: '/src/assets/images/car_muscle_gt_1795631605911.jpg',
    basePrice: 2100,
    baseIncome: 26,
    spawnWeight: 1,
    accentHex: '#38BDF8',
    fallbackGradient: 'from-sky-950 via-slate-900 to-slate-950',
    specs: '6.2L Supercharged · Вайдбоді',
  },
  {
    id: 'offroad_monster',
    name: 'Titan 6x6',
    tier: 'rare',
    tierLabel: 'Rare',
    image: '/src/assets/images/car_offroad_monster_1795632622877.jpg',
    basePrice: 3600,
    baseIncome: 44,
    spawnWeight: 1,
    accentHex: '#38BDF8',
    fallbackGradient: 'from-amber-950 via-slate-900 to-slate-950',
    specs: '6×6 Броньований · Позашляховик',
  },

  // 4. Epic
  {
    id: 'hyper_aero',
    name: 'Aether GT',
    tier: 'epic',
    tierLabel: 'Epic',
    image: '/src/assets/images/car_hyper_aero_1795631607007.jpg',
    basePrice: 15000,
    baseIncome: 135,
    spawnWeight: 1,
    accentHex: '#C084FC',
    fallbackGradient: 'from-purple-950 via-slate-900 to-slate-950',
    specs: 'Активна аеро · Карбон',
  },

  // 5. Legendary
  {
    id: 'prototype_gold',
    name: 'Solaris LM-01',
    tier: 'legendary',
    tierLabel: 'Legendary',
    image: '/src/assets/images/car_prototype_gold_1795631607841.jpg',
    basePrice: 78000,
    baseIncome: 580,
    spawnWeight: 1,
    accentHex: '#F59E0B',
    fallbackGradient: 'from-yellow-950 via-stone-900 to-slate-950',
    specs: 'Лімітований трековий прототип',
  },

  // 6. Mythic
  {
    id: 'cyber_concept',
    name: 'Chronos X',
    tier: 'mythic',
    tierLabel: 'Mythic',
    image: '/src/assets/images/car_cyber_concept_1795632622211.jpg',
    basePrice: 280000,
    baseIncome: 1950,
    spawnWeight: 1,
    accentHex: '#FB7185',
    fallbackGradient: 'from-rose-950 via-slate-900 to-slate-950',
    specs: 'Реактивна аеродинаміка · Концепт',
  },

  // 7. SECRET (2 угарні машини)
  {
    id: 'banana_mobile',
    name: 'Бананомобіль',
    tier: 'secret',
    tierLabel: 'SECRET',
    image: '/src/assets/images/car_banana_mobile_1795632623515.jpg',
    basePrice: 1100000,
    baseIncome: 8800,
    spawnWeight: 1,
    accentHex: '#FDE047',
    fallbackGradient: 'from-yellow-900 via-amber-950 to-slate-950',
    specs: 'Секретний · Стиглий слік-спорткар',
  },
  {
    id: 'toilet_kart',
    name: 'Турбо-Унітаз F1',
    tier: 'secret',
    tierLabel: 'SECRET',
    image: '/src/assets/images/car_toilet_kart_1795632625690.jpg',
    basePrice: 1650000,
    baseIncome: 14500,
    spawnWeight: 1,
    accentHex: '#FDE047',
    fallbackGradient: 'from-yellow-900 via-zinc-900 to-slate-950',
    specs: 'Секретний · V12 Фаянсовий болід',
  },
];

export const CAR_MAP: Record<string, CarCatalogItem> = Object.fromEntries(
  CAR_CATALOG.map((item) => [item.id, item])
);

export interface UpgradeConfig {
  id: UpgradeId;
  title: string;
  description: string;
  maxLevel: number;
  costs: number[];
  effectLabel: (level: number) => string;
}

export const UPGRADE_CONFIGS: UpgradeConfig[] = [
  {
    id: 'garage_slots',
    title: 'Розширення гаража',
    description: 'Додає +2 місця в інвентарі для зберігання та злиття машин.',
    maxLevel: 4,
    costs: [1200, 6500, 32000, 140000],
    effectLabel: (lvl) => `${8 + lvl * 2} місць`,
  },
  {
    id: 'income_mult',
    title: 'Дохідність колекції',
    description: 'Підвищує пасивний прибуток усіх машин у гаражі на +20% за рівень.',
    maxLevel: 6,
    costs: [850, 3600, 14500, 58000, 210000, 750000],
    effectLabel: (lvl) => `×${(1 + lvl * 0.2).toFixed(2)}`,
  },
  {
    id: 'catch_zone',
    title: 'Ширина захвату',
    description: 'Розширює світлий сегмент у міні-грі перехоплення авто.',
    maxLevel: 5,
    costs: [500, 2200, 9500, 38000, 150000],
    effectLabel: (lvl) => `+${lvl * 3}% зона`,
  },
  {
    id: 'belt_speed',
    title: 'Швидкість конвеєра',
    description: 'Прискорює рух стрічки та частоту появи нових фотографій авто.',
    maxLevel: 5,
    costs: [400, 1600, 6800, 28000, 110000],
    effectLabel: (lvl) => `+${lvl * 20}% темп`,
  },
  {
    id: 'rare_luck',
    title: 'Елітні поставки',
    description: 'Підвищує шанс появи Epic, Legendary, Mythic та SECRET машин.',
    maxLevel: 6,
    costs: [650, 2800, 12000, 48000, 180000, 620000],
    effectLabel: (lvl) => `Рівень ${lvl}`,
  },
];

export const INITIAL_UPGRADES: UpgradeLevels = {
  garage_slots: 0,
  belt_speed: 0,
  income_mult: 0,
  rare_luck: 0,
  catch_zone: 0,
};

export const INITIAL_MONEY = 110;
export const VICTORY_GOAL_EARNED = 2000000;

export function getMaxGarageSlots(upgrades: UpgradeLevels): number {
  return 8 + upgrades.garage_slots * 2;
}

export function getIncomeMultiplier(upgrades: UpgradeLevels): number {
  return 1 + upgrades.income_mult * 0.2;
}

export function getBeltSpeedPxPerSec(upgrades: UpgradeLevels): number {
  return 54 * (1 + upgrades.belt_speed * 0.2);
}

export function computeCarIncome(
  baseIncome: number,
  level: number,
  editionBonus: boolean,
  upgrades: UpgradeLevels
): number {
  const levelMult = Math.pow(2.15, level - 1);
  const editionMult = editionBonus ? 1.25 : 1;
  return baseIncome * levelMult * editionMult * getIncomeMultiplier(upgrades);
}

const TIER_ORDER: CarTier[] = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
  'mythic',
  'secret',
];

export function pickWeightedCar(rareLuckLevel: number): CarCatalogItem {
  const tierWeights: Record<CarTier, number> = {
    common: Math.max(18, 44 - rareLuckLevel * 4),
    uncommon: 26,
    rare: 15 + rareLuckLevel * 1.1,
    epic: 8 + rareLuckLevel * 1.3,
    legendary: 4 + rareLuckLevel * 1.2,
    mythic: 2 + rareLuckLevel * 0.9,
    secret: 0.9 + rareLuckLevel * 0.65,
  };

  const totalWeight = TIER_ORDER.reduce((sum, tier) => sum + tierWeights[tier], 0);
  let roll = Math.random() * totalWeight;
  let chosenTier: CarTier = 'common';

  for (const tier of TIER_ORDER) {
    roll -= tierWeights[tier];
    if (roll <= 0) {
      chosenTier = tier;
      break;
    }
  }

  const pool = CAR_CATALOG.filter((c) => c.tier === chosenTier);
  return pool[Math.floor(Math.random() * pool.length)] ?? CAR_CATALOG[0];
}
