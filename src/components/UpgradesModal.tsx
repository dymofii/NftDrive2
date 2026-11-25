import { X } from 'lucide-react';
import { UPGRADE_CONFIGS } from '../data/cars';
import { Translations } from '../i18n/translations';
import { UpgradeId, UpgradeLevels } from '../types/game';
import { formatMoney } from '../utils/format';

interface UpgradesModalProps {
  t: Translations;
  money: number;
  upgrades: UpgradeLevels;
  onBuyUpgrade: (id: UpgradeId) => void;
  onClose: () => void;
}

export function UpgradesModal({
  t,
  money,
  upgrades,
  onBuyUpgrade,
  onClose,
}: UpgradesModalProps) {
  const getLocalizedEffect = (id: UpgradeId, lvl: number): string => {
    switch (id) {
      case 'garage_slots':
        return t.effectSlots(8 + lvl * 2);
      case 'income_mult':
        return `×${(1 + lvl * 0.2).toFixed(2)}`;
      case 'catch_zone':
        return t.effectZone(lvl * 3);
      case 'belt_speed':
        return t.effectSpeed(lvl * 20);
      case 'rare_luck':
        return t.effectLevel(lvl);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrades-title"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#141A26] border border-white/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div>
            <h2 id="upgrades-title" className="font-display font-bold text-base sm:text-lg text-slate-100">
              {t.upgradesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {t.availableBalance}{' '}
              <span className="font-mono-num font-bold text-amber-400">
                {formatMoney(money)}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-3.5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[75dvh] overflow-y-auto garage-scroll">
          {UPGRADE_CONFIGS.map((cfg) => {
            const level = upgrades[cfg.id];
            const isMax = level >= cfg.maxLevel;
            const nextCost = isMax ? 0 : cfg.costs[level];
            const canAfford = !isMax && money >= nextCost;
            const localized = t.upgradeNames[cfg.id];

            return (
              <div
                key={cfg.id}
                className="rounded-xl bg-[#0E131D] border border-white/10 p-3.5 sm:p-4 flex flex-col justify-between gap-3 sm:gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm sm:text-base text-slate-100">
                      {localized?.title ?? cfg.title}
                    </h3>
                    <span className="font-mono-num text-xs text-slate-400">
                      {level}/{cfg.maxLevel}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-2.5 sm:mb-3">
                    {localized?.desc ?? cfg.description}
                  </p>
                  <div className="text-xs text-slate-300 font-mono-num">
                    {t.currentEffect}{' '}
                    <span className="text-emerald-400">{getLocalizedEffect(cfg.id, level)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isMax || !canAfford}
                  onClick={() => onBuyUpgrade(cfg.id)}
                  className={`w-full py-2 sm:py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all duration-150 whitespace-nowrap ${
                    isMax
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : canAfford
                      ? 'bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 cursor-pointer'
                      : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isMax ? t.maxLevel : t.upgradeBtn(formatMoney(nextCost))}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
