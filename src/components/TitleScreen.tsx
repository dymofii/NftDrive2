import { useEffect, useState } from 'react';
import { TITLE_BACKDROP_IMAGE } from '../data/cars';
import { LanguageCode, LANGUAGES, Translations } from '../i18n/translations';
import { formatMoney } from '../utils/format';

interface TitleScreenProps {
  t: Translations;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  hasSavedProgress: boolean;
  savedMoney: number;
  savedCarsCount: number;
  onStartNew: () => void;
  onContinue: () => void;
}

export function TitleScreen({
  t,
  language,
  onChangeLanguage,
  hasSavedProgress,
  savedMoney,
  savedCarsCount,
  onStartNew,
  onContinue,
}: TitleScreenProps) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (hasSavedProgress) {
          onContinue();
        } else {
          onStartNew();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasSavedProgress, onContinue, onStartNew]);

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#0B0E14] flex items-center">
      {/* Key-art backdrop */}
      {!imgFailed ? (
        <img
          src={TITLE_BACKDROP_IMAGE}
          alt="NFT Drive Showroom"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0B0E14] to-amber-950/30" />
      )}

      {/* Measured contrast scrim on the left negative space */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/88 to-[#0B0E14]/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-[#0B0E14]/40"
      />

      {/* Top-right Language Switcher */}
      <div className="absolute top-3 right-3 sm:top-7 sm:right-8 z-20 flex items-center gap-0.5 sm:gap-1 p-1 rounded-lg bg-[#10151F]/90 border border-white/10">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChangeLanguage(lang.code)}
            title={lang.name}
            className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md text-[11px] sm:text-xs font-bold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
              language === lang.code
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            {lang.shortLabel}
          </button>
        ))}
      </div>

      {/* Main Title Lockup over calm left negative space */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-12 py-6 sm:py-10">
        <div className="max-w-xl">
          {/* Bespoke inline SVG Title Lockup */}
          <div className="mb-4 sm:mb-6">
            <svg
              viewBox="0 0 460 110"
              className="w-full max-w-[275px] sm:max-w-[420px] h-auto overflow-visible"
              role="img"
              aria-label="NFT Drive"
            >
              <defs>
                <linearGradient id="amberBlade" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>
              <rect x="0" y="6" width="84" height="4" rx="2" fill="url(#amberBlade)" />
              <rect x="92" y="6" width="24" height="4" rx="2" fill="#475569" />
              <text
                x="0"
                y="62"
                fill="#F8FAFC"
                fontFamily="Unbounded, system-ui, sans-serif"
                fontWeight="800"
                fontSize="50"
                letterSpacing="-1.5"
              >
                NFT
                <tspan fill="#F59E0B"> DRIVE</tspan>
              </text>
              <text
                x="2"
                y="94"
                fill="#94A3B8"
                fontFamily="Manrope, system-ui, sans-serif"
                fontWeight="600"
                fontSize="14"
                letterSpacing="2.5"
              >
                {t.subtitle}
              </text>
            </svg>
          </div>

          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-lg mb-5 sm:mb-8 [text-wrap:balance]">
            {t.description}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
            {hasSavedProgress ? (
              <>
                <button
                  type="button"
                  onClick={onContinue}
                  className="px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-sm sm:text-base transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                >
                  {t.continueBtn}
                </button>
                <button
                  type="button"
                  onClick={onStartNew}
                  className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-100 font-semibold text-sm sm:text-base transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                >
                  {t.newGameBtn}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onStartNew}
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-bold text-sm sm:text-base transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                {t.startBtn}
              </button>
            )}
          </div>

          {hasSavedProgress && (
            <div className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6 font-mono-num">
              {t.savedGarageInfo(formatMoney(savedMoney), savedCarsCount)}
            </div>
          )}

          {/* Single flat control hint line */}
          <div className="text-[11px] sm:text-sm text-slate-400 border-t border-white/10 pt-3 sm:pt-4">
            {t.controlHintTitle}
          </div>
        </div>
      </main>
    </div>
  );
}
