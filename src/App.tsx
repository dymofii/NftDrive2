import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CatchMinigameModal } from './components/CatchMinigameModal';
import { ConveyorBelt } from './components/ConveyorBelt';
import { DragAndFlyLayer } from './components/DragAndFlyLayer';
import { GarageInventory, SlotBurstEffect } from './components/GarageInventory';
import { MilestoneModal } from './components/MilestoneModal';
import { PauseModal } from './components/PauseModal';
import { TitleScreen } from './components/TitleScreen';
import { TopHud } from './components/TopHud';
import { UpgradesModal } from './components/UpgradesModal';
import {
  CAR_MAP,
  computeCarIncome,
  getBeltSpeedPxPerSec,
  getMaxGarageSlots,
  INITIAL_MONEY,
  INITIAL_UPGRADES,
  pickWeightedCar,
  UPGRADE_CONFIGS,
  VICTORY_GOAL_EARNED,
} from './data/cars';
import { RARITY_THEMES } from './data/rarityStyles';
import { LanguageCode, TRANSLATIONS } from './i18n/translations';
import {
  ActiveCatchChallenge,
  ConveyorCar,
  DragPayload,
  FloatingPopup,
  FlyingCardEffect,
  GameState,
  OwnedCar,
  SaveData,
  UpgradeId,
  UpgradeLevels,
} from './types/game';
import { soundEngine } from './utils/audio';
import { formatMoney } from './utils/format';

const SAVE_STORAGE_KEY = 'nft_drive_save_v2';
const LANG_STORAGE_KEY = 'nft_drive_lang_v1';
const CARD_WIDTH_PX = 200;
const CARD_GAP_PX = 26;

function loadSavedLanguage(): LanguageCode {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode | null;
    if (raw && raw in TRANSLATIONS) return raw;
  } catch {
    // ignore
  }
  return 'en';
}

function createUid(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createConveyorCar(rareLuckLevel: number, startX: number): ConveyorCar {
  const catalog = pickWeightedCar(rareLuckLevel);
  const editionRoll = Math.random() < 0.08 + rareLuckLevel * 0.03;
  const priceVariance = 0.92 + Math.random() * 0.16;
  const basePrice = Math.round(catalog.basePrice * priceVariance * (editionRoll ? 1.15 : 1));
  const serialNumber = Math.floor(Math.random() * 899) + 100;

  return {
    uid: createUid(),
    catalogId: catalog.id,
    serialNumber,
    price: basePrice,
    incomePerSec: catalog.baseIncome,
    editionBonus: editionRoll,
    x: startX,
  };
}

function loadSavedData(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    if (typeof parsed.money !== 'number' || !Array.isArray(parsed.inventory)) {
      return null;
    }
    return {
      ...parsed,
      upgrades: { ...INITIAL_UPGRADES, ...(parsed.upgrades || {}) },
    };
  } catch {
    return null;
  }
}

export default function App() {
  const initialSave = useMemo(() => loadSavedData(), []);

  const [language, setLanguage] = useState<LanguageCode>(() => loadSavedLanguage());
  const handleChangeLanguage = useCallback((lang: LanguageCode) => {
    setLanguage(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);
  const t = TRANSLATIONS[language];
  const tRef = useRef(t);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [money, setMoney] = useState<number>(initialSave?.money ?? INITIAL_MONEY);
  const [totalEarned, setTotalEarned] = useState<number>(initialSave?.totalEarned ?? 0);
  const [carsBoughtCount, setCarsBoughtCount] = useState<number>(
    initialSave?.carsBoughtCount ?? 0
  );
  const [mergesCount, setMergesCount] = useState<number>(initialSave?.mergesCount ?? 0);
  const [inventory, setInventory] = useState<OwnedCar[]>(initialSave?.inventory ?? []);
  const [upgrades, setUpgrades] = useState<UpgradeLevels>(
    initialSave?.upgrades ?? INITIAL_UPGRADES
  );
  const [milestoneClaimed, setMilestoneClaimed] = useState<boolean>(
    initialSave?.milestoneClaimed ?? false
  );
  const [muted, setMuted] = useState<boolean>(initialSave?.muted ?? false);

  const [showUpgrades, setShowUpgrades] = useState(false);
  const [rerollCooldownSec, setRerollCooldownSec] = useState(0);
  const [toastText, setToastText] = useState<string | null>(null);

  const [conveyorCars, setConveyorCars] = useState<ConveyorCar[]>([]);
  const [activeDrag, setActiveDrag] = useState<DragPayload | null>(null);
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);
  const [popups, setPopups] = useState<FloatingPopup[]>([]);
  const [bursts, setBursts] = useState<SlotBurstEffect[]>([]);
  const [flyingCards, setFlyingCards] = useState<FlyingCardEffect[]>([]);
  const [pulsedSlotIndex, setPulsedSlotIndex] = useState<number | null>(null);
  const [shakenSlotIndex, setShakenSlotIndex] = useState<number | null>(null);
  const [activeCatch, setActiveCatch] = useState<ActiveCatchChallenge | null>(null);

  // Refs for 60fps simulation without per-frame React re-renders
  const moneyRef = useRef(money);
  const totalEarnedRef = useRef(totalEarned);
  const inventoryRef = useRef(inventory);
  const upgradesRef = useRef(upgrades);
  const milestoneClaimedRef = useRef(milestoneClaimed);
  const activeCatchRef = useRef<ActiveCatchChallenge | null>(null);
  const boostCooldownsRef = useRef<Map<string, number>>(new Map());
  const conveyorMutableRef = useRef<ConveyorCar[]>([]);
  const beltContainerRef = useRef<HTMLDivElement | null>(null);
  const beltTrackRef = useRef<HTMLDivElement | null>(null);
  const beltPhaseRef = useRef(0);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const slotRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const toastTimerRef = useRef<number | null>(null);

  const pointerStartRef = useRef<{
    source: 'conveyor' | 'inventory';
    car: ConveyorCar | OwnedCar;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
    rect: DOMRect | null;
    isDragging: boolean;
  } | null>(null);

  useEffect(() => {
    soundEngine.muted = muted;
  }, [muted]);

  useEffect(() => {
    moneyRef.current = money;
  }, [money]);

  useEffect(() => {
    totalEarnedRef.current = totalEarned;
  }, [totalEarned]);

  useEffect(() => {
    inventoryRef.current = inventory;
  }, [inventory]);

  useEffect(() => {
    upgradesRef.current = upgrades;
  }, [upgrades]);

  useEffect(() => {
    milestoneClaimedRef.current = milestoneClaimed;
  }, [milestoneClaimed]);

  useEffect(() => {
    activeCatchRef.current = activeCatch;
  }, [activeCatch]);

  const maxSlots = getMaxGarageSlots(upgrades);

  const totalIncomePerSec = useMemo(() => {
    return inventory.reduce((sum, car) => {
      return sum + computeCarIncome(car.baseIncome, car.level, car.editionBonus, upgrades);
    }, 0);
  }, [inventory, upgrades]);

  const totalIncomeRef = useRef(totalIncomePerSec);
  useEffect(() => {
    totalIncomeRef.current = totalIncomePerSec;
  }, [totalIncomePerSec]);

  const showToast = useCallback((msg: string) => {
    setToastText(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastText(null);
    }, 2400);
  }, []);

  const spawnPopup = useCallback((slotIndex: number, amount: number, label?: string) => {
    const id = createUid();
    setPopups((prev) => [...prev.slice(-14), { id, slotIndex, amount, label }]);
    window.setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 920);
  }, []);

  const spawnBurst = useCallback((slotIndex: number, color: string, isMerge: boolean) => {
    const id = createUid();
    setBursts((prev) => [...prev.slice(-8), { id, slotIndex, color, isMerge }]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 560);
  }, []);

  const triggerSlotShake = useCallback((slotIndex: number) => {
    setShakenSlotIndex(slotIndex);
    window.setTimeout(() => {
      setShakenSlotIndex((prev) => (prev === slotIndex ? null : prev));
    }, 300);
  }, []);

  const triggerSlotPulse = useCallback((slotIndex: number) => {
    setPulsedSlotIndex(slotIndex);
    window.setTimeout(() => {
      setPulsedSlotIndex((prev) => (prev === slotIndex ? null : prev));
    }, 240);
  }, []);

  // Save to localStorage whenever core progress changes
  useEffect(() => {
    if (gameState === 'TITLE_MENU' && !initialSave && carsBoughtCount === 0) return;
    const payload: SaveData = {
      money,
      totalEarned,
      carsBoughtCount,
      mergesCount,
      inventory,
      upgrades,
      milestoneClaimed,
      muted,
      language,
    };
    try {
      localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }, [
    gameState,
    money,
    totalEarned,
    carsBoughtCount,
    mergesCount,
    inventory,
    upgrades,
    milestoneClaimed,
    muted,
    language,
    initialSave,
  ]);

  // Seed initial conveyor cars when entering PLAYING
  const seedBeltCars = useCallback((rareLuck: number) => {
    const width = beltContainerRef.current?.clientWidth || 1000;
    const isMobile = width < 640;
    const cardW = isMobile ? 138 : CARD_WIDTH_PX;
    const gap = isMobile ? 16 : CARD_GAP_PX + 28;
    const initial: ConveyorCar[] = [];
    let x = isMobile ? 12 : 24;
    while (x < width - cardW * 0.75) {
      initial.push(createConveyorCar(rareLuck, x));
      x += cardW + gap;
    }
    conveyorMutableRef.current = initial;
    setConveyorCars(initial);
  }, []);

  const handleStartNew = useCallback(() => {
    moneyRef.current = INITIAL_MONEY;
    totalEarnedRef.current = 0;
    inventoryRef.current = [];
    upgradesRef.current = { ...INITIAL_UPGRADES };
    milestoneClaimedRef.current = false;
    activeCatchRef.current = null;
    pointerStartRef.current = null;

    setMoney(INITIAL_MONEY);
    setTotalEarned(0);
    setCarsBoughtCount(0);
    setMergesCount(0);
    setInventory([]);
    setUpgrades({ ...INITIAL_UPGRADES });
    setMilestoneClaimed(false);
    setShowUpgrades(false);
    setActiveCatch(null);
    setRerollCooldownSec(0);
    setGameState('PLAYING');

    requestAnimationFrame(() => {
      seedBeltCars(0);
    });
  }, [seedBeltCars]);

  const handleContinue = useCallback(() => {
    setShowUpgrades(false);
    setGameState('PLAYING');
    requestAnimationFrame(() => {
      if (conveyorMutableRef.current.length === 0) {
        seedBeltCars(upgradesRef.current.rare_luck);
      }
    });
  }, [seedBeltCars]);

  // Reroll cooldown timer
  useEffect(() => {
    if (rerollCooldownSec <= 0 || gameState !== 'PLAYING') return;
    const id = window.setInterval(() => {
      setRerollCooldownSec((c) => Math.max(0, c - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [rerollCooldownSec, gameState]);

  const handleRerollBelt = useCallback(() => {
    if (rerollCooldownSec > 0) return;
    soundEngine.playGrab();
    seedBeltCars(upgradesRef.current.rare_luck);
    setRerollCooldownSec(5);
  }, [rerollCooldownSec, seedBeltCars]);

  // Esc key to pause/resume or close modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeCatchRef.current) {
          return;
        }
        if (showUpgrades) {
          setShowUpgrades(false);
        } else if (gameState === 'PLAYING') {
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          setGameState('PLAYING');
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameState, showUpgrades]);

  // 60fps Game Loop (conveyor motion + passive income + periodic income popups)
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    let rafId = 0;
    let lastTime = performance.now();
    let uiSyncAccumulator = 0;
    let popupAccumulator = 0;

    const tick = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      // 1. Passive income accumulation
      const earnedThisFrame = totalIncomeRef.current * dt;
      if (earnedThisFrame > 0) {
        moneyRef.current += earnedThisFrame;
        totalEarnedRef.current += earnedThisFrame;
      }

      // 2. Conveyor motion (pauses cleanly while catching a car in minigame)
      if (!activeCatchRef.current) {
        const speed = getBeltSpeedPxPerSec(upgradesRef.current);
        const beltWidth = beltContainerRef.current?.clientWidth || 1000;

        beltPhaseRef.current = (beltPhaseRef.current + speed * dt) % 48;
        if (beltTrackRef.current) {
          beltTrackRef.current.style.transform = `translate3d(${beltPhaseRef.current}px, 0, 0)`;
        }

        const list = conveyorMutableRef.current;
        let listDirty = false;
        let minX = Infinity;

        for (let i = list.length - 1; i >= 0; i--) {
          const car = list[i];
          car.x += speed * dt;
          if (car.x < minX) minX = car.x;

          const el = cardRefs.current.get(car.uid);
          if (el) {
            el.style.transform = `translate3d(${car.x}px, 0, 0)`;
          }

          if (car.x > beltWidth + 30) {
            list.splice(i, 1);
            listDirty = true;
          }
        }

        // Spawn new car on the left when enough clearance exists
        const isMobileBelt = beltWidth < 640;
        const cardW = isMobileBelt ? 138 : CARD_WIDTH_PX;
        const cardGap = isMobileBelt ? 14 : CARD_GAP_PX;
        if (list.length === 0 || minX >= cardGap) {
          const spawnX = -cardW - 10;
          const nextCar = createConveyorCar(upgradesRef.current.rare_luck, spawnX);
          list.unshift(nextCar);
          listDirty = true;
        }

        if (listDirty) {
          setConveyorCars(list.map((c) => ({ ...c })));
        }
      }

      // 3. Sync money counter to UI at ~10Hz + check victory milestone
      uiSyncAccumulator += dt;
      if (uiSyncAccumulator >= 0.1) {
        uiSyncAccumulator = 0;
        setMoney(moneyRef.current);
        setTotalEarned(totalEarnedRef.current);

        if (!milestoneClaimedRef.current && totalEarnedRef.current >= VICTORY_GOAL_EARNED) {
          milestoneClaimedRef.current = true;
          setMilestoneClaimed(true);
          soundEngine.playMilestone();
          setGameState('VICTORY');
        }
      }

      // 4. Periodic passive income floating popup on a random garage car
      popupAccumulator += dt;
      if (popupAccumulator >= 1.35) {
        popupAccumulator = 0;
        const owned = inventoryRef.current;
        if (owned.length > 0) {
          const sample = owned[Math.floor(Math.random() * owned.length)];
          const perSec = computeCarIncome(
            sample.baseIncome,
            sample.level,
            sample.editionBonus,
            upgradesRef.current
          );
          spawnPopup(sample.slotIndex, Math.max(1, perSec * 1.35));
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [gameState, spawnPopup]);

  const findFirstFreeSlot = useCallback((): number | null => {
    const slotsLimit = getMaxGarageSlots(upgradesRef.current);
    const occupied = new Set(inventoryRef.current.map((c) => c.slotIndex));
    for (let i = 0; i < slotsLimit; i++) {
      if (!occupied.has(i)) return i;
    }
    return null;
  }, []);

  const finalizeCarPurchase = useCallback(
    (
      conveyorCar: ConveyorCar,
      targetSlotIndex: number,
      originRect: { left: number; top: number } | null
    ) => {
      const slot = !inventoryRef.current.some((c) => c.slotIndex === targetSlotIndex)
        ? targetSlotIndex
        : findFirstFreeSlot();

      if (slot === null) {
        soundEngine.playError();
        showToast(tRef.current.toastGarageFull);
        return false;
      }

      if (moneyRef.current < conveyorCar.price) {
        soundEngine.playError();
        showToast(tRef.current.toastNeedMore(formatMoney(conveyorCar.price - moneyRef.current)));
        return false;
      }

      // Deduct money ONLY on confirmed catch success
      moneyRef.current -= conveyorCar.price;
      setMoney(moneyRef.current);

      conveyorMutableRef.current = conveyorMutableRef.current.filter(
        (c) => c.uid !== conveyorCar.uid
      );
      setConveyorCars(conveyorMutableRef.current.map((c) => ({ ...c })));

      const newOwned: OwnedCar = {
        uid: createUid(),
        catalogId: conveyorCar.catalogId,
        serialNumber: conveyorCar.serialNumber,
        level: 1,
        slotIndex: slot,
        baseIncome: conveyorCar.incomePerSec,
        editionBonus: conveyorCar.editionBonus,
        totalInvested: conveyorCar.price,
      };

      const nextInventory = [...inventoryRef.current, newOwned];
      inventoryRef.current = nextInventory;
      setInventory(nextInventory);
      setCarsBoughtCount((c) => c + 1);

      const catalog = CAR_MAP[conveyorCar.catalogId];
      if (catalog?.tier === 'secret') {
        soundEngine.playMilestone();
        showToast(tRef.current.toastSecretCaught(catalog.name));
      } else {
        soundEngine.playBuy();
      }
      triggerSlotPulse(slot);
      if (catalog) {
        spawnBurst(slot, RARITY_THEMES[catalog.tier].sparkColor, catalog.tier === 'secret');
      }

      if (originRect && catalog) {
        const destEl = slotRefs.current.get(slot);
        if (destEl) {
          const destRect = destEl.getBoundingClientRect();
          const effectId = createUid();
          setFlyingCards((prev) => [
            ...prev,
            {
              id: effectId,
              image: catalog.image,
              name: catalog.name,
              fromX: originRect.left,
              fromY: originRect.top,
              toX: destRect.left + destRect.width / 2 - 90,
              toY: destRect.top + destRect.height / 2 - 70,
            },
          ]);
          window.setTimeout(() => {
            setFlyingCards((prev) => prev.filter((f) => f.id !== effectId));
          }, 360);
        }
      }

      return true;
    },
    [findFirstFreeSlot, showToast, spawnBurst, triggerSlotPulse]
  );

  const initiateCarCatch = useCallback(
    (
      conveyorCar: ConveyorCar,
      targetSlotIndex: number | null,
      originRect: DOMRect | null
    ) => {
      if (activeCatchRef.current) return;

      const slot = targetSlotIndex ?? findFirstFreeSlot();
      if (slot === null) {
        soundEngine.playError();
        showToast(tRef.current.toastGarageFull);
        return;
      }

      if (inventoryRef.current.some((c) => c.slotIndex === slot)) {
        soundEngine.playError();
        triggerSlotShake(slot);
        showToast(tRef.current.toastSlotOccupied);
        return;
      }

      if (moneyRef.current < conveyorCar.price) {
        soundEngine.playError();
        if (targetSlotIndex !== null) triggerSlotShake(targetSlotIndex);
        showToast(tRef.current.toastNeedMore(formatMoney(conveyorCar.price - moneyRef.current)));
        return;
      }

      soundEngine.playCatchStart();
      const challenge: ActiveCatchChallenge = {
        conveyorCar,
        targetSlotIndex: slot,
        originRect: originRect ? { left: originRect.left, top: originRect.top } : null,
      };
      activeCatchRef.current = challenge;
      setActiveCatch(challenge);
    },
    [findFirstFreeSlot, showToast, triggerSlotShake]
  );

  const handleCatchSuccess = useCallback(() => {
    const current = activeCatchRef.current;
    if (!current) return;
    activeCatchRef.current = null;
    setActiveCatch(null);
    finalizeCarPurchase(current.conveyorCar, current.targetSlotIndex, current.originRect);
  }, [finalizeCarPurchase]);

  const handleCatchFail = useCallback(() => {
    const current = activeCatchRef.current;
    if (!current) return;
    activeCatchRef.current = null;
    setActiveCatch(null);

    // Explicitly guarantee zero money deduction on fail
    setMoney(moneyRef.current);

    conveyorMutableRef.current = conveyorMutableRef.current.filter(
      (c) => c.uid !== current.conveyorCar.uid
    );
    setConveyorCars(conveyorMutableRef.current.map((c) => ({ ...c })));
    soundEngine.playCatchFail();
    showToast(tRef.current.toastEscaped);
  }, [showToast]);

  const handleCatchCancel = useCallback(() => {
    activeCatchRef.current = null;
    setActiveCatch(null);
  }, []);

  const handleInventoryDrop = useCallback(
    (draggedCar: OwnedCar, targetSlotIndex: number) => {
      if (draggedCar.slotIndex === targetSlotIndex) return;

      const list = [...inventoryRef.current];
      const targetCar = list.find((c) => c.slotIndex === targetSlotIndex);

      if (!targetCar) {
        const updated = list.map((c) =>
          c.uid === draggedCar.uid ? { ...c, slotIndex: targetSlotIndex } : c
        );
        inventoryRef.current = updated;
        setInventory(updated);
        soundEngine.playGrab();
        triggerSlotPulse(targetSlotIndex);
        return;
      }

      // Merge identical cars of the same level
      if (targetCar.catalogId === draggedCar.catalogId && targetCar.level === draggedCar.level) {
        const nextLevel = targetCar.level + 1;
        const mergedCar: OwnedCar = {
          ...targetCar,
          level: nextLevel,
          editionBonus: targetCar.editionBonus || draggedCar.editionBonus,
          totalInvested: targetCar.totalInvested + draggedCar.totalInvested,
        };
        const updated = list
          .filter((c) => c.uid !== draggedCar.uid)
          .map((c) => (c.uid === targetCar.uid ? mergedCar : c));

        inventoryRef.current = updated;
        setInventory(updated);
        setMergesCount((m) => m + 1);
        soundEngine.playMerge();
        triggerSlotPulse(targetSlotIndex);

        const catalog = CAR_MAP[mergedCar.catalogId];
        if (catalog) {
          spawnBurst(targetSlotIndex, RARITY_THEMES[catalog.tier].sparkColor, true);
          showToast(tRef.current.toastMerged(catalog.name, nextLevel));
        }
        return;
      }

      // Otherwise swap positions
      const updated = list.map((c) => {
        if (c.uid === draggedCar.uid) return { ...c, slotIndex: targetSlotIndex };
        if (c.uid === targetCar.uid) return { ...c, slotIndex: draggedCar.slotIndex };
        return c;
      });
      inventoryRef.current = updated;
      setInventory(updated);
      soundEngine.playGrab();
      triggerSlotPulse(targetSlotIndex);
    },
    [showToast, spawnBurst, triggerSlotPulse]
  );

  const handleSellCar = useCallback(
    (carUid: string) => {
      const target = inventoryRef.current.find((c) => c.uid === carUid);
      if (!target) return;

      const refund = Math.max(10, Math.round(target.totalInvested * 0.7));
      moneyRef.current += refund;
      setMoney(moneyRef.current);

      const updated = inventoryRef.current.filter((c) => c.uid !== carUid);
      inventoryRef.current = updated;
      setInventory(updated);

      soundEngine.playSell();
      showToast(tRef.current.toastSold(formatMoney(refund)));
    },
    [showToast]
  );

  const handleBoostCar = useCallback(
    (ownedCar: OwnedCar) => {
      const now = performance.now();
      const lastBoost = boostCooldownsRef.current.get(ownedCar.uid) ?? 0;
      if (now - lastBoost < 1200) {
        return;
      }
      boostCooldownsRef.current.set(ownedCar.uid, now);

      const perSec = computeCarIncome(
        ownedCar.baseIncome,
        ownedCar.level,
        ownedCar.editionBonus,
        upgradesRef.current
      );
      const bonus = Math.max(1, Math.round(perSec * 1.5));
      moneyRef.current += bonus;
      totalEarnedRef.current += bonus;
      setMoney(moneyRef.current);
      setTotalEarned(totalEarnedRef.current);

      soundEngine.playBoost();
      triggerSlotPulse(ownedCar.slotIndex);
      spawnPopup(ownedCar.slotIndex, bonus, tRef.current.boostWord);
      const catalog = CAR_MAP[ownedCar.catalogId];
      if (catalog) {
        spawnBurst(ownedCar.slotIndex, RARITY_THEMES[catalog.tier].sparkColor, false);
      }
    },
    [spawnBurst, spawnPopup, triggerSlotPulse]
  );

  const handleBuyUpgrade = useCallback(
    (id: UpgradeId) => {
      const cfg = UPGRADE_CONFIGS.find((u) => u.id === id);
      if (!cfg) return;
      const currentLevel = upgradesRef.current[id];
      if (currentLevel >= cfg.maxLevel) return;

      const cost = cfg.costs[currentLevel];
      if (moneyRef.current < cost) {
        soundEngine.playError();
        showToast(tRef.current.toastNoMoneyUpgrade);
        return;
      }

      moneyRef.current -= cost;
      setMoney(moneyRef.current);

      const nextUpgrades = {
        ...upgradesRef.current,
        [id]: currentLevel + 1,
      };
      upgradesRef.current = nextUpgrades;
      setUpgrades(nextUpgrades);
      soundEngine.playUpgrade();
      const localizedTitle = tRef.current.upgradeNames[id]?.title ?? cfg.title;
      showToast(tRef.current.toastUpgraded(localizedTitle, currentLevel + 1));
    },
    [showToast]
  );

  const handleConveyorPointerDown = useCallback(
    (
      e: React.PointerEvent<HTMLDivElement>,
      car: ConveyorCar,
      cardEl: HTMLDivElement | null
    ) => {
      if (activeCatchRef.current) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const rect = cardEl ? cardEl.getBoundingClientRect() : null;
      pointerStartRef.current = {
        source: 'conveyor',
        car,
        startX: e.clientX,
        startY: e.clientY,
        offsetX: rect ? e.clientX - rect.left : 90,
        offsetY: rect ? e.clientY - rect.top : 70,
        rect,
        isDragging: false,
      };
    },
    []
  );

  const handleInventoryPointerDown = useCallback(
    (
      e: React.PointerEvent<HTMLDivElement>,
      car: OwnedCar,
      slotEl: HTMLDivElement | null
    ) => {
      if (activeCatchRef.current) return;
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const rect = slotEl ? slotEl.getBoundingClientRect() : null;
      pointerStartRef.current = {
        source: 'inventory',
        car,
        startX: e.clientX,
        startY: e.clientY,
        offsetX: rect ? Math.min(94, e.clientX - rect.left) : 90,
        offsetY: rect ? Math.min(70, e.clientY - rect.top) : 70,
        rect,
        isDragging: false,
      };
    },
    []
  );

  // Global pointermove / pointerup / blur for smooth drag-and-drop across conveyor & inventory
  useEffect(() => {
    const findSlotAtPoint = (x: number, y: number): number | null => {
      for (const [idx, el] of slotRefs.current.entries()) {
        const r = el.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
          return idx;
        }
      }
      return null;
    };

    const onPointerMove = (e: PointerEvent) => {
      const start = pointerStartRef.current;
      if (!start) return;

      const dist = Math.hypot(e.clientX - start.startX, e.clientY - start.startY);
      if (!start.isDragging && dist > 6) {
        start.isDragging = true;
        soundEngine.playGrab();
      }

      if (start.isDragging) {
        const catalog = CAR_MAP[start.car.catalogId];
        if (!catalog) return;

        if (start.source === 'conveyor') {
          const c = start.car as ConveyorCar;
          setActiveDrag({
            source: 'conveyor',
            uid: c.uid,
            catalogId: c.catalogId,
            serialNumber: c.serialNumber,
            image: catalog.image,
            name: catalog.name,
            price: c.price,
            incomePerSec: computeCarIncome(
              c.incomePerSec,
              1,
              c.editionBonus,
              upgradesRef.current
            ),
            pointerX: e.clientX,
            pointerY: e.clientY,
            offsetX: start.offsetX,
            offsetY: start.offsetY,
          });
        } else {
          const o = start.car as OwnedCar;
          setActiveDrag({
            source: 'inventory',
            uid: o.uid,
            catalogId: o.catalogId,
            serialNumber: o.serialNumber,
            image: catalog.image,
            name: catalog.name,
            incomePerSec: computeCarIncome(
              o.baseIncome,
              o.level,
              o.editionBonus,
              upgradesRef.current
            ),
            level: o.level,
            fromSlotIndex: o.slotIndex,
            pointerX: e.clientX,
            pointerY: e.clientY,
            offsetX: start.offsetX,
            offsetY: start.offsetY,
          });
        }

        setHoveredSlotIndex(findSlotAtPoint(e.clientX, e.clientY));
      }
    };

    const finishPointer = (e: PointerEvent, cancelled: boolean) => {
      const start = pointerStartRef.current;
      pointerStartRef.current = null;
      setActiveDrag(null);
      setHoveredSlotIndex(null);

      if (!start || cancelled || activeCatchRef.current) return;

      if (!start.isDragging) {
        if (start.source === 'conveyor') {
          const c = start.car as ConveyorCar;
          const liveCar = conveyorMutableRef.current.find((item) => item.uid === c.uid);
          if (liveCar) {
            initiateCarCatch(liveCar, null, start.rect);
          }
        } else {
          const o = start.car as OwnedCar;
          const liveOwned = inventoryRef.current.find((item) => item.uid === o.uid);
          if (liveOwned) {
            handleBoostCar(liveOwned);
          }
        }
        return;
      }

      const dropSlot = findSlotAtPoint(e.clientX, e.clientY);
      if (dropSlot === null) return;

      if (start.source === 'conveyor') {
        const c = start.car as ConveyorCar;
        const liveCar = conveyorMutableRef.current.find((item) => item.uid === c.uid);
        if (liveCar) {
          initiateCarCatch(liveCar, dropSlot, start.rect);
        }
      } else {
        const o = start.car as OwnedCar;
        const liveOwned = inventoryRef.current.find((item) => item.uid === o.uid);
        if (liveOwned) {
          handleInventoryDrop(liveOwned, dropSlot);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => finishPointer(e, false);
    const onPointerCancel = (e: PointerEvent) => finishPointer(e, true);
    const onBlur = () => {
      pointerStartRef.current = null;
      setActiveDrag(null);
      setHoveredSlotIndex(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      window.removeEventListener('blur', onBlur);
    };
  }, [handleBoostCar, handleInventoryDrop, initiateCarCatch]);

  if (gameState === 'TITLE_MENU') {
    const hasProgress =
      carsBoughtCount > 0 || inventory.length > 0 || totalEarned > 0 || money !== INITIAL_MONEY;
    return (
      <TitleScreen
        t={t}
        language={language}
        onChangeLanguage={handleChangeLanguage}
        hasSavedProgress={hasProgress}
        savedMoney={money}
        savedCarsCount={inventory.length}
        onStartNew={handleStartNew}
        onContinue={handleContinue}
      />
    );
  }

  return (
    <div className="w-screen h-[100dvh] flex flex-col overflow-hidden bg-[#0B0E14] text-slate-100">
      <TopHud
        t={t}
        language={language}
        onChangeLanguage={handleChangeLanguage}
        money={money}
        totalIncomePerSec={totalIncomePerSec}
        usedSlots={inventory.length}
        maxSlots={maxSlots}
        totalEarned={totalEarned}
        goalAmount={VICTORY_GOAL_EARNED}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        onOpenUpgrades={() => setShowUpgrades(true)}
        onOpenPause={() => setGameState('PAUSED')}
      />

      <ConveyorBelt
        t={t}
        cars={conveyorCars}
        money={money}
        upgrades={upgrades}
        isInventoryFull={inventory.length >= maxSlots}
        draggedUid={activeDrag?.source === 'conveyor' ? activeDrag.uid : null}
        rerollCooldownSec={rerollCooldownSec}
        beltContainerRef={beltContainerRef}
        beltTrackRef={beltTrackRef}
        cardRefs={cardRefs}
        onCarPointerDown={handleConveyorPointerDown}
        onRerollBelt={handleRerollBelt}
      />

      <GarageInventory
        t={t}
        maxSlots={maxSlots}
        inventory={inventory}
        upgrades={upgrades}
        money={money}
        activeDrag={activeDrag}
        hoveredSlotIndex={hoveredSlotIndex}
        popups={popups}
        bursts={bursts}
        pulsedSlotIndex={pulsedSlotIndex}
        shakenSlotIndex={shakenSlotIndex}
        slotRefs={slotRefs}
        onCarPointerDown={handleInventoryPointerDown}
        onSellCar={handleSellCar}
      />

      <DragAndFlyLayer t={t} activeDrag={activeDrag} flyingCards={flyingCards} />

      {/* Transient Feedback Toast */}
      {toastText && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed bottom-5 left-1/2 z-40 px-4 py-2 rounded-lg bg-[#1A2232] border border-white/15 text-xs sm:text-sm font-semibold text-slate-100 shadow-xl animate-toast-pop"
        >
          {toastText}
        </div>
      )}

      {activeCatch && (
        <CatchMinigameModal
          t={t}
          challenge={activeCatch}
          catchZoneUpgradeLevel={upgrades.catch_zone}
          onSuccess={handleCatchSuccess}
          onFail={handleCatchFail}
          onCancel={handleCatchCancel}
        />
      )}

      {showUpgrades && (
        <UpgradesModal
          t={t}
          money={money}
          upgrades={upgrades}
          onBuyUpgrade={handleBuyUpgrade}
          onClose={() => setShowUpgrades(false)}
        />
      )}

      {gameState === 'PAUSED' && (
        <PauseModal
          t={t}
          language={language}
          onChangeLanguage={handleChangeLanguage}
          money={money}
          totalEarned={totalEarned}
          totalIncomePerSec={totalIncomePerSec}
          carsBoughtCount={carsBoughtCount}
          mergesCount={mergesCount}
          onResume={() => setGameState('PLAYING')}
          onRestart={handleStartNew}
          onReturnTitle={() => setGameState('TITLE_MENU')}
        />
      )}

      {gameState === 'VICTORY' && (
        <MilestoneModal
          t={t}
          goalAmount={VICTORY_GOAL_EARNED}
          totalEarned={totalEarned}
          totalIncomePerSec={totalIncomePerSec}
          carsBoughtCount={carsBoughtCount}
          mergesCount={mergesCount}
          onContinueEndless={() => setGameState('PLAYING')}
          onPlayAgain={handleStartNew}
        />
      )}
    </div>
  );
}
