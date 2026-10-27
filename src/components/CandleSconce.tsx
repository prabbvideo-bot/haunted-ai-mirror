import React from 'react';

interface CandleSconceProps {
  side: 'left' | 'right';
  isLit: boolean;
  onToggle: () => void;
}

export const CandleSconce: React.FC<CandleSconceProps> = ({ side, isLit, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`relative flex flex-col items-center cursor-pointer select-none group transition-opacity duration-700 ${
        side === 'left' ? 'items-end' : 'items-start'
      }`}
      title={isLit ? 'Click to snuff out flame' : 'Click to rekindle flame'}
    >
      {/* Warm Ambient Wall Projection */}
      {isLit && (
        <div
          className={`absolute -top-16 w-56 h-56 rounded-full pointer-events-none transition-opacity duration-1000 ${
            side === 'left' ? '-right-10' : '-left-10'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(180, 83, 9, 0.08) 45%, transparent 70%)',
          }}
        />
      )}

      {/* Candle Flame & Wick */}
      <div className="relative flex flex-col items-center z-10">
        {isLit ? (
          <div className="relative flex flex-col items-center animate-candle-flame">
            {/* Outer halo */}
            <div className="absolute -top-6 w-10 h-10 rounded-full bg-amber-500/20 blur-md" />
            {/* Flame Body */}
            <div
              className="w-3.5 h-7 rounded-full bg-gradient-to-t from-orange-600 via-amber-400 to-amber-100 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
              style={{
                borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
              }}
            />
            {/* Blue flame core */}
            <div className="w-1.5 h-2 -mt-1.5 rounded-full bg-blue-500/70 blur-[0.5px]" />
          </div>
        ) : (
          <div className="h-7 flex items-end">
            {/* Extinguished smoky wick */}
            <div className="w-0.5 h-2 bg-stone-700" />
          </div>
        )}

        {/* Black Wick Base */}
        <div className="w-0.5 h-1.5 bg-stone-900" />

        {/* Taper Candle Wax Pillar */}
        <div className="relative w-4 h-24 bg-gradient-to-b from-stone-200 via-stone-300 to-stone-400 rounded-t-sm shadow-md border-x border-stone-400/40">
          {/* Melted wax drip details */}
          <div className="absolute top-1 -left-0.5 w-1.5 h-4 bg-stone-200 rounded-full shadow-xs" />
          <div className="absolute top-2.5 -right-0.5 w-1.5 h-6 bg-stone-200 rounded-full shadow-xs" />
          <div className="absolute top-7 left-0.5 w-1 h-3 bg-stone-300/80 rounded-full" />
        </div>

        {/* Brass Candle Drip Pan & Bobeche */}
        <div className="w-8 h-2 bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 rounded-sm shadow-sm border-t border-yellow-500/50" />
      </div>

      {/* Victorian Cast Brass Sconce Arm */}
      <div className="relative w-12 h-14 flex items-center justify-center">
        <svg
          viewBox="0 0 60 70"
          className={`w-12 h-14 text-amber-700/80 drop-shadow-md ${
            side === 'left' ? 'scale-x-100' : '-scale-x-100'
          }`}
          fill="currentColor"
        >
          {/* Ornate S-curve bracket */}
          <path d="M10 65 Q 25 50 30 35 T 45 10 L 50 12 Q 38 32 32 48 T 15 68 Z" />
          {/* Decorative scrollwork leaf */}
          <path d="M22 42 C 15 38 12 45 18 50 C 22 53 26 48 22 42 Z" opacity="0.8" />
          {/* Wall rosette mount */}
          <circle cx="10" cy="65" r="5" fill="#451a03" stroke="#b45309" strokeWidth="1.5" />
        </svg>
      </div>

      <span className="text-[10px] font-garamond italic tracking-widest text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
        {isLit ? 'Snuff' : 'Kindle'}
      </span>
    </div>
  );
};
