import { Trophy } from 'lucide-react';
import { Translations } from '../i18n/translations';
import { formatIncomeRate, formatMoney } from '../utils/format';

interface MilestoneModalProps {
  t: Translations;
  goalAmount: number;
  totalEarned: number;
  totalIncomePerSec: number;
  carsBoughtCount: number;
  mergesCount: number;
  onContinueEndless: () => void;
  onPlayAgain: () => void;
}

export function MilestoneModal({
  t,
  goalAmount,
  totalEarned,
  totalIncomePerSec,
  carsBoughtCount,
  mergesCount,
  onContinueEndless,
  onPlayAgain,
}: MilestoneModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#141A26] border border-amber-400/35 p-4 sm:p-6 shadow-2xl">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center mb-3 sm:mb-4">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" aria-hidden="true" />
        </div>

        <h2 id="victory-title" className="font-display font-bold text-lg sm:text-xl text-slate-100 mb-1 sm:mb-1.5">
          {t.victoryTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 sm:mb-5">
          {t.victoryDesc(formatMoney(goalAmount))}
        </p>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-[#0E131D] border border-white/10 text-xs sm:text-sm">
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">{t.totalEarnedLabel}</div>
            <div className="font-mono-num font-bold text-amber-400 mt-0.5">
              {formatMoney(totalEarned)}
            </div>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">{t.incomeSpeedLabel}</div>
            <div className="font-mono-num font-bold text-emerald-400 mt-0.5">
              {formatIncomeRate(totalIncomePerSec, t.perSec)}
            </div>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">{t.carsBoughtLabel}</div>
            <div className="font-mono-num font-semibold text-slate-200 mt-0.5">
              {carsBoughtCount}
            </div>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">{t.mergesLabel}</div>
            <div className="font-mono-num font-semibold text-slate-200 mt-0.5">
              {mergesCount}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onContinueEndless}
            className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.continueBtn}
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="py-2.5 sm:py-3 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            {t.playAgainBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
