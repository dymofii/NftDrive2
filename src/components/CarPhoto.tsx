import { useState } from 'react';
import { Car } from 'lucide-react';
import { CarCatalogItem } from '../types/game';

interface CarPhotoProps {
  car: CarCatalogItem;
  className?: string;
}

export function CarPhoto({ car, className = '' }: CarPhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${car.fallbackGradient} flex flex-col items-center justify-center gap-1.5 p-3 text-center ${className}`}
      >
        <Car className="w-7 h-7 text-slate-300/80" aria-hidden="true" />
        <span className="text-xs font-semibold text-slate-200 leading-tight">{car.name}</span>
      </div>
    );
  }

  return (
    <img
      src={car.image}
      alt={car.name}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover select-none pointer-events-none ${className}`}
    />
  );
}
