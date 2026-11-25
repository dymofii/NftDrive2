import { useEffect, useState } from 'react';
import { CAR_MAP } from '../data/cars';
import { RARITY_THEMES } from '../data/rarityStyles';
import { Translations } from '../i18n/translations';
import { DragPayload, FlyingCardEffect } from '../types/game';
import { formatIncomeRate, formatMoney } from '../utils/format';
import { CarPhoto } from './CarPhoto';

interface DragAndFlyLayerProps {
  t: Translations;
  activeDrag: DragPayload | null;
  flyingCards: FlyingCardEffect[];
}

function FlyingCard({ t, effect }: { t: Translations; effect: FlyingCardEffect }) {
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setLaunched(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const dx = effect.toX - effect.fromX;
  const dy = effect.toY - effect.fromY;

  return (
    <div
      aria-hidden="true"
      style={{
        left: effect.fromX,
        top: effect.fromY,
        transform: launched
          ? `translate3d(${dx}px, ${dy}px, 0) scale(0.86) rotate(-2deg)`
          : 'translate3d(0px, 0px, 0) scale(1.04) rotate(0deg)',
        opacity: launched ? 0.15 : 1,
        transition:
          'transform 340ms cubic-bezier(0.16, 1, 0.3, 1), opacity 340ms ease-out',
      }}
      className="fixed z-50 w-[138px] sm:w-[180px] h-[108px] sm:h-[140px] rounded-xl bg-[#182030] border-2 border-amber-400 shadow-2xl overflow-hidden pointer-events-none"
    >
      <img
        src={effect.image}
        alt={effect.name}
        referrerPolicy="no-referrer"
        className="w-full h-[70px] sm:h-[96px] object-cover"
      />
      <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-amber-300 truncate">
        {t.flyToGarage(effect.name)}
      </div>
    </div>
  );
}

export function DragAndFlyLayer({ t, activeDrag, flyingCards }: DragAndFlyLayerProps) {
  const catalog = activeDrag ? CAR_MAP[activeDrag.catalogId] : null;
  const theme = catalog ? RARITY_THEMES[catalog.tier] : null;

  return (
    <>
      {flyingCards.map((effect) => (
        <FlyingCard key={effect.id} t={t} effect={effect} />
      ))}

      {activeDrag && catalog && theme && (
        <div
          aria-hidden="true"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${activeDrag.pointerX - activeDrag.offsetX}px, ${
              activeDrag.pointerY - activeDrag.offsetY
            }px, 0) scale(1.04) rotate(1.5deg)`,
          }}
          className={`fixed z-50 w-[142px] sm:w-[188px] rounded-xl border-2 shadow-2xl shadow-black/70 overflow-hidden pointer-events-none ${theme.cardBgClass} ${theme.cardBorderClass}`}
        >
          <div className={`h-1 sm:h-1.5 w-full ${theme.stripColorClass}`} />
          <div className="relative h-[70px] sm:h-[100px] w-full bg-slate-900">
            <CarPhoto car={catalog} />
            <div className="absolute top-1 left-2 right-1.5 sm:top-1.5 sm:left-2.5 sm:right-2 flex items-center justify-between font-mono-num text-[10px] sm:text-[11px] font-bold text-slate-100 drop-shadow">
              <span>
                #{String(activeDrag.serialNumber).padStart(3, '0')}
                {activeDrag.level ? ` · ${t.lvlShort}${activeDrag.level}` : ''}
              </span>
              <span className={`px-1 py-0.5 sm:px-1.5 rounded text-[8px] sm:text-[10px] ${theme.badgeBgClass}`}>
                {catalog.tierLabel}
              </span>
            </div>
          </div>
          <div className="px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between gap-1.5">
            <span className="font-semibold text-[11px] sm:text-xs text-slate-100 truncate">
              {activeDrag.name}
            </span>
            <span className="font-mono-num font-bold text-[11px] sm:text-xs text-amber-300 shrink-0">
              {activeDrag.price !== undefined
                ? formatMoney(activeDrag.price)
                : formatIncomeRate(activeDrag.incomePerSec, t.perSec)}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
