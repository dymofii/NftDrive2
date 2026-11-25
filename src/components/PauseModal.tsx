import { LanguageCode, LANGUAGES, Translations } from '../i18n/translations';
import { formatIncomeRate, formatMoney } from '../utils/format';

interface PauseModalProps {
  t: Translations;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  money: number;
  totalEarned: number;
  totalIncomePerSec: number;
  carsBoughtCount: number;
  mergesCount: number;
  onResume: () => void;
  onRestart: () => void;
  onReturnTitle: () => void;
}

export function PauseModal({
  t,
  language,
  onChangeLanguage,
  money,
  totalEarned,
  totalIncomePerSec,
  carsBoughtCount,
  mergesCount,
  onResume,
  onRestart,
  onReturnTitle,
}: PauseModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#141A26] border border-white/15 p-4 sm:p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1">
          <h2 id="pause-title" className="font-display font-bold text-lg sm:text-xl text-slate-100">
            {t.pausedTitle}
          </h2>
          <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[#0E131D] border border-white/10 shrink-0">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => onChangeLanguage(lang.code)}
                title={lang.name}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer ${
                  language === lang.code
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {lang.shortLabel}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-5">{t.pausedSubtitle}</p>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-[#0E131D] border border-white/10 text-xs sm:text-sm">
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">{t.currentBalance}</div>
            <div className="font-mono-num font-bold text-slate-100 mt-0.5">
              {formatMoney(money)}
            </div>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">{t.passiveIncome}</div>
            <div className="font-mono-num font-bold text-emerald-400 mt-0.5">
              {formatIncomeRate(totalIncomePerSec, t.perSec)}
            </div>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">{t.totalEarned}</div>
            <div className="font-mono-num font-semibold text-slate-200 mt-0.5">
              {formatMoney(totalEarned)}
            </div>
          </div>
          <div>
            <div className="text-[11px] sm:text-xs text-slate-400">{t.boughtMerged}</div>
            <div className="font-mono-num font-semibold text-slate-200 mt-0.5">
              {carsBoughtCount} / {mergesCount}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t.resumeBtn}
          </button>
          <button
            type="button"
            onClick={onReturnTitle}
            className="w-full py-2 sm:py-2.5 px-4 sm:px-5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t.returnTitleBtn}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="w-full py-2 sm:py-2.5 px-4 sm:px-5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/25 text-rose-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t.resetProgressBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
