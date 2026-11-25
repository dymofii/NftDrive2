import { CarTier } from '../types/game';

export interface RarityTheme {
  cardBgClass: string;
  cardBorderClass: string;
  cardGlowClass: string;
  badgeBgClass: string;
  stripColorClass: string;
  photoOverlayTint: string;
  hasShimmer: boolean;
  sparkColor: string;
  difficultyStars: 1 | 2 | 3 | 4 | 5 | 6;
}

export const RARITY_THEMES: Record<CarTier, RarityTheme> = {
  common: {
    cardBgClass: 'bg-[#171E2B]',
    cardBorderClass: 'border-slate-500/35 hover:border-slate-300/60',
    cardGlowClass: 'shadow-lg shadow-black/40',
    badgeBgClass: 'bg-slate-600/45 border border-slate-400/35 text-slate-100',
    stripColorClass: 'bg-slate-400',
    photoOverlayTint: 'from-[#171E2B] via-slate-900/10 to-slate-950/35',
    hasShimmer: false,
    sparkColor: '#94A3B8',
    difficultyStars: 1,
  },
  uncommon: {
    cardBgClass: 'bg-[#112222]',
    cardBorderClass: 'border-emerald-400/45 hover:border-emerald-300/80',
    cardGlowClass: 'shadow-lg shadow-emerald-950/40',
    badgeBgClass: 'bg-emerald-600/45 border border-emerald-400/50 text-emerald-100',
    stripColorClass: 'bg-emerald-400',
    photoOverlayTint: 'from-[#112222] via-emerald-950/15 to-black/30',
    hasShimmer: false,
    sparkColor: '#34D399',
    difficultyStars: 2,
  },
  rare: {
    cardBgClass: 'bg-[#111E30]',
    cardBorderClass: 'border-sky-400/50 hover:border-sky-300/85',
    cardGlowClass: 'shadow-lg shadow-sky-950/45',
    badgeBgClass: 'bg-sky-600/45 border border-sky-400/55 text-sky-100',
    stripColorClass: 'bg-sky-400',
    photoOverlayTint: 'from-[#111E30] via-sky-950/15 to-black/30',
    hasShimmer: false,
    sparkColor: '#38BDF8',
    difficultyStars: 3,
  },
  epic: {
    cardBgClass: 'bg-[#1D1530]',
    cardBorderClass: 'border-purple-400/60 hover:border-purple-300',
    cardGlowClass: 'shadow-[0_0_20px_rgba(168,85,247,0.20)]',
    badgeBgClass: 'bg-purple-600/50 border border-purple-400/65 text-purple-100',
    stripColorClass: 'bg-purple-400',
    photoOverlayTint: 'from-[#1D1530] via-purple-950/20 to-black/30',
    hasShimmer: true,
    sparkColor: '#C084FC',
    difficultyStars: 4,
  },
  legendary: {
    cardBgClass: 'bg-[#241B10]',
    cardBorderClass: 'border-amber-400/70 hover:border-amber-300',
    cardGlowClass: 'shadow-[0_0_22px_rgba(245,158,11,0.24)]',
    badgeBgClass: 'bg-amber-500/45 border border-amber-300/70 text-amber-100',
    stripColorClass: 'bg-amber-400',
    photoOverlayTint: 'from-[#241B10] via-amber-950/20 to-black/30',
    hasShimmer: true,
    sparkColor: '#FBBF24',
    difficultyStars: 5,
  },
  mythic: {
    cardBgClass: 'bg-[#27121C]',
    cardBorderClass: 'border-rose-400/75 hover:border-rose-300',
    cardGlowClass: 'shadow-[0_0_24px_rgba(244,63,94,0.28)]',
    badgeBgClass: 'bg-rose-600/55 border border-rose-300/75 text-rose-100',
    stripColorClass: 'bg-rose-400',
    photoOverlayTint: 'from-[#27121C] via-rose-950/20 to-black/30',
    hasShimmer: true,
    sparkColor: '#FB7185',
    difficultyStars: 6,
  },
  secret: {
    cardBgClass: 'bg-gradient-to-b from-[#2A220D] via-[#261914] to-[#1D1424]',
    cardBorderClass: 'border-yellow-300 hover:border-yellow-200 ring-1 ring-yellow-300/45',
    cardGlowClass: 'shadow-[0_0_28px_rgba(253,224,71,0.32)]',
    badgeBgClass:
      'bg-gradient-to-r from-yellow-400/55 via-amber-500/55 to-rose-500/55 border border-yellow-200/80 text-yellow-50',
    stripColorClass: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-rose-400',
    photoOverlayTint: 'from-[#261914] via-yellow-950/15 to-black/25',
    hasShimmer: true,
    sparkColor: '#FDE047',
    difficultyStars: 6,
  },
};
