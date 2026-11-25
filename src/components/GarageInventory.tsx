import React, { useRef } from 'react';
import { ArrowUpRight, Sparkles, Trash2 } from 'lucide-react';
import { CAR_MAP, computeCarIncome } from '../data/cars';
import { RARITY_THEMES } from '../data/rarityStyles';
import { Translations } from '../i18n/translations';
import { DragPayload, FloatingPopup, OwnedCar, UpgradeLevels } from '../types/game';
import { formatIncomeRate, formatMoney } from '../utils/format';
import { CarPhoto } from './CarPhoto';

export interface SlotBurstEffect {
  id: string;
  slotIndex: number;
  color: string;
  isMerge: boolean;
}

interface GarageInventoryProps {
  t: Translations;
  maxSlots: number;
  inventory: OwnedCar[];
  upgrades: UpgradeLevels;
  money: number;
  activeDrag: DragPayload | null;
  hoveredSlotIndex: number | null;
  popups: FloatingPopup[];
  bursts: SlotBurstEffect[];
  pulsedSlotIndex: number | null;
  shakenSlotIndex: number | null;
  slotRefs: React.MutableRefObject<Map<number, HTMLDivElement>>;
  onCarPointerDown: (
    e: React.PointerEvent<HTMLDivElement>,
    car: OwnedCar,
    slotEl: HTMLDivElement | null
  ) => void;
  onSellCar: (carUid: string) => void;
}

const SPARK_VECTORS = [
  { tx: '-34px', ty: '-28px' },
  { tx: '34px', ty: '-28px' },
  { tx: '-40px', ty: '6px' },
  { tx: '40px', ty: '6px' },
  { tx: '-22px', ty: '-42px' },
  { tx: '22px', ty: '-42px' },
  { tx: '-26px', ty: '30px' },
  { tx: '26px', ty: '30px' },
];

export function GarageInventory({
  t,
  maxSlots,
  inventory,
  upgrades,
  money,
  activeDrag,
  hoveredSlotIndex,
  popups,
  bursts,
  pulsedSlotIndex,
  shakenSlotIndex,
  slotRefs,
  onCarPointerDown,
  onSellCar,
}: GarageInventoryProps) {
  const localSlotRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const slots = Array.from({ length: maxSlots }, (_, i) => i);
  const bySlot = new Map<number, OwnedCar>();
  inventory.forEach((car) => bySlot.set(car.slotIndex, car));

  return (
    <section
      aria-label={t.garageTitle}
      className="flex-1 min-h-0 overflow-y-auto garage-scroll px-3 sm:px-6 py-2.5 sm:py-4 bg-[#0B0E14]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="font-semibold text-xs sm:text-base text-slate-100 truncate">
              {t.garageTitle}
            </h2>
            <span className="text-slate-500 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-xs sm:text-sm text-slate-400 hidden sm:inline truncate">
              {t.garageSubtitle}
            </span>
          </div>

          <span className="font-mono-num text-[11px] sm:text-sm text-slate-300 shrink-0">
            {t.occupiedCount(inventory.length, maxSlots)}
          </span>
        </div>

        {/* Responsive Inventory Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 pb-4">
          {slots.map((slotIndex) => {
            const ownedCar = bySlot.get(slotIndex);
            const catalog = ownedCar ? CAR_MAP[ownedCar.catalogId] : null;
            const theme = catalog ? RARITY_THEMES[catalog.tier] : null;
            const isHovered = hoveredSlotIndex === slotIndex;
            const isDraggedSource =
              activeDrag?.source === 'inventory' && activeDrag.fromSlotIndex === slotIndex;

            let dropState: 'none' | 'place' | 'merge' | 'swap' | 'cant_afford' | 'occupied' =
              'none';
            if (activeDrag && isHovered) {
              if (activeDrag.source === 'conveyor') {
                if (ownedCar) {
                  dropState = 'occupied';
                } else if (money < (activeDrag.price ?? 0)) {
                  dropState = 'cant_afford';
                } else {
                  dropState = 'place';
                }
              } else if (activeDrag.source === 'inventory') {
                if (activeDrag.fromSlotIndex === slotIndex) {
                  dropState = 'none';
                } else if (!ownedCar) {
                  dropState = 'place';
                } else if (
                  ownedCar.catalogId === activeDrag.catalogId &&
                  ownedCar.level === activeDrag.level
                ) {
                  dropState = 'merge';
                } else {
                  dropState = 'swap';
                }
              }
            }

            const isMergeCandidate =
              activeDrag?.source === 'inventory' &&
              ownedCar &&
              activeDrag.fromSlotIndex !== slotIndex &&
              ownedCar.catalogId === activeDrag.catalogId &&
              ownedCar.level === activeDrag.level;

            const slotPopups = popups.filter((p) => p.slotIndex === slotIndex);
            const slotBursts = bursts.filter((b) => b.slotIndex === slotIndex);

            const containerClass =
              dropState === 'merge'
                ? 'border-emerald-400 ring-2 ring-emerald-400/35 bg-emerald-950/25'
                : dropState === 'place' || dropState === 'swap'
                ? 'border-amber-400 ring-2 ring-amber-400/35 bg-amber-950/20'
                : dropState === 'cant_afford' || dropState === 'occupied'
                ? 'border-rose-400 ring-2 ring-rose-400/35 bg-rose-950/20'
                : isMergeCandidate
                ? 'border-emerald-400/75 ring-1 ring-emerald-400/30 bg-[#141C2B]'
                : ownedCar && theme
                ? `${theme.cardBorderClass} ${theme.cardBgClass} ${theme.cardGlowClass}`
                : 'border-dashed border-white/12 bg-[#10151F]/65';

            const incomePerSec = ownedCar
              ? computeCarIncome(
                  ownedCar.baseIncome,
                  ownedCar.level,
                  ownedCar.editionBonus,
                  upgrades
                )
              : 0;

            const sellPrice = ownedCar
              ? Math.max(10, Math.round(ownedCar.totalInvested * 0.7))
              : 0;

            return (
              <div
                key={slotIndex}
                ref={(el) => {
                  if (el) {
                    slotRefs.current.set(slotIndex, el);
                    localSlotRefs.current.set(slotIndex, el);
                  } else {
                    slotRefs.current.delete(slotIndex);
                    localSlotRefs.current.delete(slotIndex);
                  }
                }}
                onPointerDown={(e) => {
                  if (ownedCar) {
                    onCarPointerDown(e, ownedCar, localSlotRefs.current.get(slotIndex) ?? null);
                  }
                }}
                className={`group relative rounded-xl border min-h-[132px] sm:min-h-[194px] flex flex-col overflow-hidden transition-colors duration-150 select-none ${containerClass} ${
                  pulsedSlotIndex === slotIndex ? 'animate-rev' : ''
                } ${shakenSlotIndex === slotIndex ? 'animate-shake' : ''} ${
                  ownedCar ? 'cursor-grab active:cursor-grabbing touch-none' : ''
                }`}
              >
                {/* Radial Sparkle & Shockwave Bursts */}
                {slotBursts.map((burst) => (
                  <div
                    key={burst.id}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
                  >
                    {burst.isMerge && (
                      <div
                        className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 animate-merge-ring"
                        style={{ borderColor: burst.color }}
                      />
                    )}
                    {SPARK_VECTORS.map((vec, i) => (
                      <span
                        key={i}
                        style={
                          {
                            backgroundColor: burst.color,
                            '--tx': vec.tx,
                            '--ty': vec.ty,
                          } as React.CSSProperties
                        }
                        className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-spark"
                      />
                    ))}
                  </div>
                ))}

                {/* Floating +$ Income Popups */}
                {slotPopups.map((popup) => (
                  <div
                    key={popup.id}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-6 sm:top-8 z-30 animate-float-up font-mono-num font-bold text-xs sm:text-sm text-emerald-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] whitespace-nowrap"
                  >
                    +{formatMoney(popup.amount)}
                    {popup.label ? ` ${popup.label}` : ''}
                  </div>
                ))}

                {ownedCar && catalog && theme ? (
                  <div
                    className={`flex-1 flex flex-col transition-opacity duration-150 ${
                      isDraggedSource ? 'opacity-25' : 'opacity-100'
                    }`}
                  >
                    {/* Colored Rarity Accent Strip at Top */}
                    <div className={`h-1 sm:h-1.5 w-full shrink-0 ${theme.stripColorClass}`} />

                    {/* Shimmer Sweep for Epic+ */}
                    {theme.hasShimmer && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 w-12 sm:w-16 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-shimmer-sweep z-20"
                      />
                    )}

                    {/* Car Photo */}
                    <div className="relative h-[62px] sm:h-[102px] w-full bg-slate-900 overflow-hidden shrink-0">
                      <CarPhoto
                        car={catalog}
                        className="transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 bg-gradient-to-t ${theme.photoOverlayTint}`}
                      />

                      <div className="absolute top-1 left-2 right-1.5 sm:top-1.5 sm:left-2.5 sm:right-2 flex items-center justify-between">
                        <span className="font-mono-num text-[10px] sm:text-[11px] font-bold text-slate-100 drop-shadow">
                          #{String(ownedCar.serialNumber).padStart(3, '0')} · {t.lvlShort}
                          {ownedCar.level}
                        </span>

                        <button
                          type="button"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSellCar(ownedCar.uid);
                          }}
                          title={t.sellTitle(formatMoney(sellPrice))}
                          aria-label={`${t.sellTitle(formatMoney(sellPrice))} - ${catalog.name}`}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-black/55 hover:bg-rose-600/90 text-slate-300 hover:text-white flex items-center justify-center transition-colors duration-150 cursor-pointer z-20"
                        >
                          <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Car Telemetry */}
                    <div className="flex-1 px-2 py-1.5 sm:px-3 sm:py-2 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-[11px] sm:text-sm text-slate-100 truncate">
                            {catalog.name}
                          </span>
                          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                            {ownedCar.editionBonus && (
                              <Sparkles
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300"
                                aria-label={t.limitedEdition}
                              />
                            )}
                            <span
                              className={`px-1 py-0.5 sm:px-1.5 rounded text-[8px] sm:text-[10px] font-bold tracking-wide ${theme.badgeBgClass}`}
                            >
                              {catalog.tierLabel}
                            </span>
                          </div>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-slate-300/80 truncate mt-0.5 hidden sm:block">
                          {t.carSpecs[catalog.id] ?? catalog.specs}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 sm:pt-1.5 border-t border-white/10 mt-1 sm:mt-0">
                        <span className="font-mono-num font-bold text-[11px] sm:text-sm text-emerald-300">
                          {formatIncomeRate(incomePerSec, t.perSec)}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-300 inline-flex items-center gap-0.5">
                          <span>{t.boostBtn}</span>
                          <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty Slot */
                  <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-3 text-center">
                    <span className="font-mono-num text-[11px] sm:text-xs text-slate-500 font-medium mb-0.5 sm:mb-1">
                      {t.slotLabel(slotIndex + 1)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 leading-tight">
                      {dropState === 'place'
                        ? t.dropHere
                        : dropState === 'cant_afford'
                        ? t.notEnoughFunds
                        : t.dragCarHere}
                    </span>
                  </div>
                )}

                {/* Merge / Swap Drop Overlay Label */}
                {dropState === 'merge' && (
                  <div className="absolute inset-0 bg-emerald-950/80 flex items-center justify-center p-2 text-center pointer-events-none z-20">
                    <span className="text-[11px] sm:text-sm font-bold text-emerald-200">
                      {t.mergeInto((ownedCar?.level ?? 1) + 1)}
                    </span>
                  </div>
                )}
                {dropState === 'swap' && (
                  <div className="absolute inset-0 bg-amber-950/70 flex items-center justify-center p-2 text-center pointer-events-none z-20">
                    <span className="text-[11px] sm:text-sm font-bold text-amber-200">
                      {t.swapSlots}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
