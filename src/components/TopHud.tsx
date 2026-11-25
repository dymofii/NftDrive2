import { Pause, SlidersHorizontal, Volume2, VolumeX } from 'lucide-react';
import { LanguageCode, LANGUAGES, Translations } from '../i18n/translations';
import { formatIncomeRate, formatMoney } from '../utils/format';

interface TopHudProps {
  t: Translations;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  money: number;
  totalIncomePerSec: number;
  usedSlots: number;
  maxSlots: number;
  totalEarned: number;
  goalAmount: number;
  muted: boolean;
  onToggleMute: () => void;
  onOpenUpgrades: () => void;
  onOpenPause: () => void;
}

export function TopHud({
  t,
  language,
  onChangeLanguage,
  money,
  totalIncomePerSec,
  usedSlots,
  maxSlots,
  totalEarned,
  goalAmount,
  muted,
  onToggleMute,
  onOpenUpgrades,
  onOpenPause,
}: TopHudProps) {
  const progressPct = Math.min(100, Math.round((totalEarned / goalAmount) * 100));

  return (
    <header className="w-full px-3 sm:px-6 py-2 sm:py-3 bg-[#10151F] border-b border-white/10 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
      {/* Left: Brand & Key Telemetry */}
      <div className="flex items-center gap-3 sm:gap-6 min-w-0">
        <span className="font-display font-bold text-sm sm:text-lg tracking-tight text-slate-100 whitespace-nowrap shrink-0 hidden sm:inline">
          NFT <span className="text-amber-400">DRIVE</span>
        </span>

        <div className="h-5 w-px bg-white/10 hidden sm:block" aria-hidden="true" />

        {/* Tabular Money & Income Readouts */}
        <div className="flex items-center gap-3.5 sm:gap-7">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none mb-0.5 sm:mb-1">
              {t.balance}
            </span>
            <span className="font-mono-num font-bold text-sm sm:text-xl text-slate-50 leading-none">
              {formatMoney(money)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none mb-0.5 sm:mb-1">
              {t.income}
            </span>
            <span className="font-mono-num font-bold text-xs sm:text-lg text-emerald-400 leading-none">
              {formatIncomeRate(totalIncomePerSec, t.perSec)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none mb-0.5 sm:mb-1">
              {t.garage}
            </span>
            <span className="font-mono-num font-semibold text-xs sm:text-base text-slate-200 leading-none">
              {usedSlots}/{maxSlots}
            </span>
          </div>

          <div className="hidden lg:flex flex-col min-w-[130px]">
            <div className="flex items-center justify-between text-[11px] text-slate-400 leading-none mb-1.5">
              <span>{t.goal}</span>
              <span className="font-mono-num text-slate-300">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-transform duration-200 origin-left"
                style={{ transform: `scaleX(${progressPct / 100})` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Functional Controls + Language Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-0.5 p-1 rounded-lg bg-slate-800/80 border border-white/10 mr-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onChangeLanguage(lang.code)}
              title={lang.name}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                language === lang.code
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {lang.shortLabel}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenUpgrades}
          aria-label={t.upgrades}
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-[11px] sm:text-sm transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          <span>{t.upgrades}</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? t.muteOn : t.muteOff}
          title={muted ? t.muteOn : t.muteOff}
          className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 transition-colors duration-150 cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
        >
          {muted ? (
            <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-100" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={onOpenPause}
          aria-label={t.pause}
          title={`${t.pause} (Esc)`}
          className="inline-flex items-center justify-center sm:gap-1.5 w-8 h-8 sm:w-auto sm:px-3.5 sm:h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
        >
          <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t.pause}</span>
        </button>
      </div>
    </header>
  );
}
