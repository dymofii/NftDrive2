import React, { useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { CAR_MAP, computeCarIncome } from '../data/cars';
import { RARITY_THEMES } from '../data/rarityStyles';
import { Translations } from '../i18n/translations';
import { ConveyorCar, UpgradeLevels } from '../types/game';
import { formatIncomeRate, formatMoney } from '../utils/format';
import { CarPhoto } from './CarPhoto';
import { DifficultyStars } from './DifficultyStars';

interface ConveyorBeltProps {
  t: Translations;
  cars: ConveyorCar[];
  money: number;
  upgrades: UpgradeLevels;
  isInventoryFull: boolean;
  draggedUid: string | null;
  rerollCooldownSec: number;
  beltContainerRef: React.RefObject<HTMLDivElement | null>;
  beltTrackRef: React.RefObject<HTMLDivElement | null>;
  cardRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  onCarPointerDown: (
    e: React.PointerEvent<HTMLDivElement>,
    car: ConveyorCar,
    cardEl: HTMLDivElement | null
  ) => void;
  onRerollBelt: () => void;
}

export function ConveyorBelt({
  t,
  cars,
  money,
  upgrades,
  isInventoryFull,
  draggedUid,
  rerollCooldownSec,
  beltContainerRef,
  beltTrackRef,
  cardRefs,
  onCarPointerDown,
  onRerollBelt,
}: ConveyorBeltProps) {
  const localRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  return (
    <section
      aria-label={t.conveyorTitle}
      className="w-full shrink-0 bg-[#121824] border-b border-white/10 pt-2 pb-2.5 px-3 sm:pt-3 sm:pb-4 sm:px-6"
    >
      {/* Conveyor Header Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 mb-2 sm:mb-2.5">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 min-w-0">
          <h2 className="font-semibold text-slate-100 truncate">{t.conveyorTitle}</h2>
          <span className="text-slate-500 hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-slate-400 hidden sm:inline truncate">
            {t.conveyorSubtitle}
          </span>
        </div>

        <button
          type="button"
          onClick={onRerollBelt}
          disabled={rerollCooldownSec > 0}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-[11px] sm:text-xs font-semibold text-slate-200 transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        >
          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
          <span>
            {rerollCooldownSec > 0
              ? t.rerollCooldown(rerollCooldownSec)
              : t.rerollBtn}
          </span>
        </button>
      </div>

      {/* Motorized Conveyor Track */}
      <div
        ref={beltContainerRef}
        className="max-w-7xl mx-auto relative h-[156px] sm:h-[232px] rounded-xl bg-[#090C12] border border-white/10 overflow-hidden shadow-inner"
      >
        {/* Moving Belt Ribbed Surface */}
        <div
          ref={beltTrackRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-[-96px] right-0 will-change-transform opacity-45"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 36px, transparent 36px, transparent 48px)',
          }}
        />

        {/* Top & Bottom Metal Rails */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 sm:h-2 bg-gradient-to-b from-slate-700/50 to-transparent pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1.5 sm:h-2 bg-gradient-to-t from-slate-700/50 to-transparent pointer-events-none"
        />

        {/* Left & Right Curtains */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-6 sm:w-10 bg-gradient-to-r from-[#090C12] to-transparent z-10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-6 sm:w-10 bg-gradient-to-l from-[#090C12] to-transparent z-10 pointer-events-none"
        />

        {/* Rolling Car Cards */}
        {cars.map((car) => {
          const catalog = CAR_MAP[car.catalogId];
          if (!catalog) return null;
          const theme = RARITY_THEMES[catalog.tier];
          const canAfford = money >= car.price;
          const projectedIncome = computeCarIncome(
            car.incomePerSec,
            1,
            car.editionBonus,
            upgrades
          );
          const isBeingDragged = draggedUid === car.uid;

          return (
            <div
              key={car.uid}
              ref={(el) => {
                if (el) {
                  cardRefs.current.set(car.uid, el);
                  localRefs.current.set(car.uid, el);
                } else {
                  cardRefs.current.delete(car.uid);
                  localRefs.current.delete(car.uid);
                }
              }}
              onPointerDown={(e) =>
                onCarPointerDown(e, car, localRefs.current.get(car.uid) ?? null)
              }
              style={{
                transform: `translate3d(${car.x}px, 0, 0)`,
              }}
              className={`group absolute top-2 sm:top-3 left-0 w-[138px] sm:w-[200px] h-[140px] sm:h-[204px] rounded-xl border transition-opacity duration-150 flex flex-col overflow-hidden select-none touch-none ${
                theme.cardBgClass
              } ${
                isBeingDragged
                  ? 'opacity-25 border-amber-400/50'
                  : canAfford && !isInventoryFull
                  ? `${theme.cardBorderClass} ${theme.cardGlowClass} cursor-grab active:cursor-grabbing`
                  : `${theme.cardBorderClass} opacity-85 cursor-not-allowed`
              }`}
            >
              {/* Colored Rarity Accent Strip at Top */}
              <div className={`h-1 sm:h-1.5 w-full shrink-0 ${theme.stripColorClass}`} />

              {/* Specular Shimmer Sweep for Epic+ */}
              {theme.hasShimmer && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 w-12 sm:w-16 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer-sweep z-20"
                />
              )}

              {/* Photo Container */}
              <div className="relative h-[64px] sm:h-[108px] w-full bg-slate-900 overflow-hidden shrink-0">
                <CarPhoto
                  car={catalog}
                  className="transition-transform duration-200 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-t ${theme.photoOverlayTint}`}
                />
                <div className="absolute top-1 left-2 right-2 sm:top-1.5 sm:left-2.5 sm:right-2.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono-num">
                  <span className="text-slate-100 font-bold drop-shadow">
                    #{String(car.serialNumber).padStart(3, '0')}
                  </span>
                  {car.editionBonus && (
                    <span className="px-1 py-0.2 rounded bg-amber-500/35 border border-amber-300/50 text-amber-200 font-semibold text-[9px] sm:text-[10px]">
                      +25%
                    </span>
                  )}
                </div>
              </div>

              {/* Metadata & Buy Footer */}
              <div className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-[11px] sm:text-sm text-slate-100 truncate">
                      {catalog.name}
                    </span>
                    <span
                      className={`px-1 py-0.5 sm:px-1.5 rounded text-[8px] sm:text-[10px] font-bold tracking-wide shrink-0 ${theme.badgeBgClass}`}
                    >
                      {catalog.tierLabel}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-300 flex items-center justify-between gap-1 mt-0.5 sm:mt-1">
                    <span className="font-mono-num text-emerald-300 font-bold truncate">
                      {formatIncomeRate(projectedIncome, t.perSec)}
                    </span>
                    <div className="scale-75 sm:scale-100 origin-right shrink-0">
                      <DifficultyStars
                        stars={theme.difficultyStars}
                        size="sm"
                        label={t.difficultyLabel}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 sm:pt-1.5 border-t border-white/10">
                  <span
                    className={`font-mono-num font-bold text-[11px] sm:text-sm ${
                      canAfford ? 'text-amber-300' : 'text-rose-400'
                    }`}
                  >
                    {formatMoney(car.price)}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-semibold ${
                      isInventoryFull
                        ? 'text-slate-400'
                        : canAfford
                        ? 'text-slate-100'
                        : 'text-slate-500'
                    }`}
                  >
                    {isInventoryFull
                      ? t.noSlots
                      : canAfford
                      ? t.buyBtn
                      : t.noFunds}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
