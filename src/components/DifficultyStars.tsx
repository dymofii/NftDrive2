import { Star } from 'lucide-react';

interface DifficultyStarsProps {
  stars: number; // 1..6
  maxStars?: number;
  size?: 'sm' | 'md';
  label?: string;
}

export function DifficultyStars({
  stars,
  maxStars = 6,
  size = 'sm',
  label,
}: DifficultyStarsProps) {
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <div
      className="inline-flex items-center gap-0.5"
      aria-label={label ? `${label}: ${stars}/${maxStars}` : `${stars}/${maxStars}`}
      title={label ? `${label}: ${stars}/${maxStars}` : `${stars}/${maxStars}`}
    >
      {Array.from({ length: maxStars }, (_, idx) => {
        const filled = idx < stars;
        return (
          <Star
            key={idx}
            aria-hidden="true"
            className={`${iconClass} ${
              filled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-transparent text-slate-600'
            }`}
          />
        );
      })}
    </div>
  );
}
