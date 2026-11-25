export type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'VICTORY';

export type CarTier =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'
  | 'secret';

export interface CarCatalogItem {
  id: string;
  name: string;
  tier: CarTier;
  tierLabel: string;
  image: string;
  basePrice: number;
  baseIncome: number;
  spawnWeight: number;
  accentHex: string;
  fallbackGradient: string;
  specs: string;
}

export interface ConveyorCar {
  uid: string;
  catalogId: string;
  serialNumber: number;
  price: number;
  incomePerSec: number;
  editionBonus: boolean; // Special mint edition (+25% income)
  x: number; // Position in pixels from left edge of belt
}

export interface OwnedCar {
  uid: string;
  catalogId: string;
  serialNumber: number;
  level: number;
  slotIndex: number;
  baseIncome: number;
  editionBonus: boolean;
  totalInvested: number;
}

export type UpgradeId =
  | 'garage_slots'
  | 'belt_speed'
  | 'income_mult'
  | 'rare_luck'
  | 'catch_zone';

export interface UpgradeLevels {
  garage_slots: number;
  belt_speed: number;
  income_mult: number;
  rare_luck: number;
  catch_zone: number;
}

export interface ActiveCatchChallenge {
  conveyorCar: ConveyorCar;
  targetSlotIndex: number;
  originRect: { left: number; top: number } | null;
}

export interface FloatingPopup {
  id: string;
  slotIndex: number;
  amount: number;
  label?: string;
}

export interface FlyingCardEffect {
  id: string;
  image: string;
  name: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface DragPayload {
  source: 'conveyor' | 'inventory';
  uid: string;
  catalogId: string;
  serialNumber: number;
  image: string;
  name: string;
  price?: number;
  incomePerSec: number;
  level?: number;
  fromSlotIndex?: number;
  pointerX: number;
  pointerY: number;
  offsetX: number;
  offsetY: number;
}

import { LanguageCode } from '../i18n/translations';

export interface SaveData {
  money: number;
  totalEarned: number;
  carsBoughtCount: number;
  mergesCount: number;
  inventory: OwnedCar[];
  upgrades: UpgradeLevels;
  milestoneClaimed: boolean;
  muted: boolean;
  language?: LanguageCode;
}
