import { useEffect, useRef, useState } from 'react';
import { Car, Mouse, X } from 'lucide-react';
import { CAR_MAP } from '../data/cars';
import { RARITY_THEMES } from '../data/rarityStyles';
import { Translations } from '../i18n/translations';
import { ActiveCatchChallenge, CarTier } from '../types/game';
import { formatMoney } from '../utils/format';
import { CarPhoto } from './CarPhoto';
import { DifficultyStars } from './DifficultyStars';

interface CatchMinigameModalProps {
  t: Translations;
  challenge: ActiveCatchChallenge;
  catchZoneUpgradeLevel: number;
  onSuccess: () => void;
  onFail: () => void;
  onCancel: () => void;
}

const TIER_PARAMS: Record<
  CarTier,
  {
    zoneWidth: number;
    targetSpeed: number;
    retargetMin: number;
    retargetMax: number;
    fillRate: number;
    drainRate: number;
  }
> = {
  common: {
    zoneWidth: 0.34,
    targetSpeed: 0.25,
    retargetMin: 1.0,
    retargetMax: 1.9,
    fillRate: 0.40,
    drainRate: 0.09,
  },
  uncommon: {
    zoneWidth: 0.30,
    targetSpeed: 0.34,
    retargetMin: 0.85,
    retargetMax: 1.65,
    fillRate: 0.36,
    drainRate: 0.11,
  },
  rare: {
    zoneWidth: 0.26,
    targetSpeed: 0.44,
    retargetMin: 0.72,
    retargetMax: 1.4,
    fillRate: 0.32,
    drainRate: 0.13,
  },
  epic: {
    zoneWidth: 0.23,
    targetSpeed: 0.56,
    retargetMin: 0.55,
    retargetMax: 1.15,
    fillRate: 0.29,
    drainRate: 0.14,
  },
  legendary: {
    zoneWidth: 0.20,
    targetSpeed: 0.68,
    retargetMin: 0.48,
    retargetMax: 1.0,
    fillRate: 0.27,
    drainRate: 0.15,
  },
  mythic: {
    zoneWidth: 0.18,
    targetSpeed: 0.78,
    retargetMin: 0.4,
    retargetMax: 0.88,
    fillRate: 0.25,
    drainRate: 0.16,
  },
  secret: {
    zoneWidth: 0.17,
    targetSpeed: 0.86,
    retargetMin: 0.36,
    retargetMax: 0.82,
    fillRate: 0.24,
    drainRate: 0.16,
  },
};

export function CatchMinigameModal({
  t,
  challenge,
  catchZoneUpgradeLevel,
  onSuccess,
  onFail,
  onCancel,
}: CatchMinigameModalProps) {
  const { conveyorCar } = challenge;
  const catalog = CAR_MAP[conveyorCar.catalogId];
  const theme = RARITY_THEMES[catalog.tier];
  const params = TIER_PARAMS[catalog.tier];
  const effectiveZoneWidth = Math.min(0.45, params.zoneWidth + catchZoneUpgradeLevel * 0.03);

  const [isHoldingUi, setIsHoldingUi] = useState(false);
  const [isLockedUi, setIsLockedUi] = useState(true);

  const isHoldingRef = useRef(false);
  const resolvedRef = useRef(false);

  const zoneElRef = useRef<HTMLDivElement | null>(null);
  const targetIconWrapRef = useRef<HTMLDivElement | null>(null);
  const targetLineElRef = useRef<HTMLDivElement | null>(null);
  const progressBarElRef = useRef<HTMLDivElement | null>(null);

  const onSuccessRef = useRef(onSuccess);
  const onFailRef = useRef(onFail);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onFailRef.current = onFail;
  }, [onSuccess, onFail]);

  // Global hold listeners (click & hold anywhere, touch, or Spacebar)
  useEffect(() => {
    const setHold = (val: boolean) => {
      if (isHoldingRef.current !== val) {
        isHoldingRef.current = val;
        setIsHoldingUi(val);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowRight') {
        e.preventDefault();
        setHold(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (!resolvedRef.current) {
          resolvedRef.current = true;
          onCancel();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowRight') {
        e.preventDefault();
        setHold(false);
      }
    };

    const onWindowUp = () => setHold(false);
    const onBlur = () => setHold(false);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('pointerup', onWindowUp);
    window.addEventListener('pointercancel', onWindowUp);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('pointerup', onWindowUp);
      window.removeEventListener('pointercancel', onWindowUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [onCancel]);

  // 60fps Catch Bar Physics Loop
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    let zonePos = Math.max(0.05, 0.35 - effectiveZoneWidth / 2);
    let zoneVel = 0;
    let targetPos = 0.35;
    let targetGoal = 0.62;
    let targetVel = 0;
    let retargetTimer = 0.75;
    let progress = 0.38;
    let lastLocked = true;

    const tick = (now: number) => {
      if (resolvedRef.current) return;

      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(Math.max(rawDt, 0), 0.05);

      const accel = isHoldingRef.current ? 2.25 : -1.95;
      zoneVel += accel * dt;
      zoneVel *= Math.pow(0.24, dt);
      zonePos += zoneVel * dt;

      const maxZonePos = 1 - effectiveZoneWidth;
      if (zonePos <= 0) {
        zonePos = 0;
        if (zoneVel < 0) zoneVel = -zoneVel * 0.25;
      } else if (zonePos >= maxZonePos) {
        zonePos = maxZonePos;
        if (zoneVel > 0) zoneVel = -zoneVel * 0.25;
      }

      retargetTimer -= dt;
      if (retargetTimer <= 0) {
        retargetTimer =
          params.retargetMin + Math.random() * (params.retargetMax - params.retargetMin);
        const hop = 0.16 + Math.random() * 0.55;
        const dir = Math.random() < 0.5 ? -1 : 1;
        let candidate = targetPos + dir * hop;
        if (candidate < 0.06 || candidate > 0.94) {
          candidate = targetPos - dir * hop;
        }
        targetGoal = Math.min(0.94, Math.max(0.06, candidate));
      }

      const diff = targetGoal - targetPos;
      const desiredVel = Math.sign(diff) * Math.min(params.targetSpeed, Math.abs(diff) * 4.2);
      targetVel += (desiredVel - targetVel) * Math.min(1, dt * 6.5);
      targetPos = Math.min(0.95, Math.max(0.05, targetPos + targetVel * dt));

      const locked = targetPos >= zonePos && targetPos <= zonePos + effectiveZoneWidth;
      if (locked !== lastLocked) {
        lastLocked = locked;
        setIsLockedUi(locked);
      }

      if (locked) {
        progress = Math.min(1, progress + params.fillRate * dt);
      } else {
        progress = Math.max(0, progress - params.drainRate * dt);
      }

      if (zoneElRef.current) {
        zoneElRef.current.style.left = `${zonePos * 100}%`;
        zoneElRef.current.style.width = `${effectiveZoneWidth * 100}%`;
      }
      if (targetLineElRef.current) {
        targetLineElRef.current.style.left = `${targetPos * 100}%`;
      }
      if (targetIconWrapRef.current) {
        targetIconWrapRef.current.style.left = `${targetPos * 100}%`;
      }
      if (progressBarElRef.current) {
        progressBarElRef.current.style.transform = `scaleX(${progress})`;
      }

      if (progress >= 1) {
        resolvedRef.current = true;
        onSuccessRef.current();
        return;
      }
      if (progress <= 0) {
        resolvedRef.current = true;
        onFailRef.current();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [effectiveZoneWidth, params]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 select-none touch-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="catch-title"
      onPointerDown={() => {
        isHoldingRef.current = true;
        setIsHoldingUi(true);
      }}
    >
      <div
        className={`w-full max-w-xl rounded-2xl border overflow-hidden shadow-2xl ${theme.cardBgClass} ${theme.cardBorderClass}`}
      >
        <div className={`h-1 sm:h-1.5 w-full ${theme.stripColorClass}`} />
        <div className="p-4 sm:p-6">
          {/* Header with Target Car Preview */}
          <div className="flex items-center justify-between gap-3 mb-3.5 sm:mb-5">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <div className="w-14 h-10 sm:w-20 sm:h-14 rounded-lg overflow-hidden bg-slate-900 border border-white/15 shrink-0">
                <CarPhoto car={catalog} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h2
                    id="catch-title"
                    className="font-display font-bold text-sm sm:text-lg text-slate-100 truncate"
                  >
                    {t.catchTitle(catalog.name)}
                  </h2>
                  <span
                    className={`px-1.5 py-0.5 sm:px-2 rounded text-[10px] sm:text-[11px] font-bold ${theme.badgeBgClass}`}
                  >
                    {catalog.tierLabel}
                  </span>
                </div>
                <div className="text-[11px] sm:text-sm text-slate-400 flex items-center flex-wrap gap-x-1.5 gap-y-0.5 font-mono-num mt-0.5 sm:mt-1">
                  <span>#{String(conveyorCar.serialNumber).padStart(3, '0')}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {t.priceOnSuccess}:{' '}
                    <span className="text-amber-300 font-bold">
                      {formatMoney(conveyorCar.price)}
                    </span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1 font-sans">
                    <span className="text-slate-400 text-[11px] sm:text-xs">{t.difficultyLabel}:</span>
                    <DifficultyStars
                      stars={theme.difficultyStars}
                      size="sm"
                      label={t.difficultyLabel}
                    />
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (!resolvedRef.current) {
                  resolvedRef.current = true;
                  onCancel();
                }
              }}
              aria-label={t.cancelPurchase}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Minigame Track Area */}
          <div className="rounded-xl bg-[#0B0E14] border border-white/10 px-3.5 pt-6 pb-4 sm:px-5 sm:pt-9 sm:pb-5">
            {/* Upper Track for Grey Target Car Icon */}
            <div className="relative w-full h-6 sm:h-7 mb-1">
              <div
                ref={targetIconWrapRef}
                style={{ left: '35%' }}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center transition-colors duration-100 ${
                    isLockedUi
                      ? 'bg-slate-700/90 text-slate-100 border border-slate-300/60 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-600/40'
                  }`}
                >
                  <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Control Bar */}
            <div className="relative w-full h-9 sm:h-11 rounded-md bg-[#1C222D] border border-slate-700/80 overflow-hidden shadow-inner">
              <div
                aria-hidden="true"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] sm:border-y-[7px] border-y-transparent border-l-[8px] sm:border-l-[10px] border-l-red-500 z-20 pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] sm:border-y-[7px] border-y-transparent border-r-[8px] sm:border-r-[10px] border-r-red-500 z-20 pointer-events-none"
              />

              <div
                ref={zoneElRef}
                style={{
                  left: '22%',
                  width: `${effectiveZoneWidth * 100}%`,
                }}
                className={`absolute inset-y-1 rounded-[4px] flex items-center pl-1.5 sm:pl-2 transition-colors duration-100 ${
                  isLockedUi
                    ? 'bg-slate-100 shadow-[0_0_18px_rgba(255,255,255,0.35)]'
                    : 'bg-slate-300/85'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`text-[11px] sm:text-xs font-bold leading-none select-none transition-opacity duration-100 ${
                    isHoldingUi ? 'text-slate-500 opacity-40' : 'text-slate-700 opacity-90'
                  }`}
                >
                  ←
                </span>
              </div>

              <div
                ref={targetLineElRef}
                style={{ left: '35%' }}
                className="absolute inset-y-0 w-[4px] sm:w-[5px] -translate-x-1/2 bg-[#2B3240] border-x border-slate-950/60 z-10 pointer-events-none"
              />
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 sm:h-2.5 mt-2 sm:mt-2.5 rounded-full bg-[#1C222D] border border-white/10 overflow-hidden">
              <div
                ref={progressBarElRef}
                style={{ transform: 'scaleX(0.38)' }}
                className="w-full h-full bg-white origin-left will-change-transform"
              />
            </div>

            {/* Control Hint */}
            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-300">
              <Mouse
                className={`w-4 h-4 transition-transform duration-100 ${
                  isHoldingUi ? 'text-amber-400 scale-95' : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
              <span className="font-medium">{t.holdAnywhere}</span>
              <span className="text-slate-500 hidden sm:inline">{t.spaceHint}</span>
            </div>
          </div>

          <p className="mt-2.5 sm:mt-3 text-center text-[11px] sm:text-xs text-slate-300/80">
            {t.catchRules}
          </p>
        </div>
      </div>
    </div>
  );
}
