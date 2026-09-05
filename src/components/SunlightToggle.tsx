import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface SunlightToggleProps {
  isSunlight: boolean;
  onToggle: () => void;
}

export const SunlightToggle: React.FC<SunlightToggleProps> = ({ isSunlight, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`px-2.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-bold shadow-sm active:scale-95 ${
        isSunlight
          ? 'bg-black text-white hover:bg-neutral-800 border-2 border-black'
          : 'bg-himalaya-card/90 hover:bg-himalaya-forest/40 text-himalaya-amber border border-himalaya-border hover:border-amber-500/50'
      }`}
      aria-label={isSunlight ? "Switch to Alpine Dark Mode" : "Switch to Sunlight High-Contrast Mode"}
      title={isSunlight ? "Sunlight Mode Active (Tap for Alpine Dark Mode)" : "Switch to High-Contrast Sunlight Mode for Mountain Glare"}
    >
      {isSunlight ? (
        <Moon className="w-3.5 h-3.5 text-white" />
      ) : (
        <Sun className="w-3.5 h-3.5 text-amber-400" />
      )}
      <span className="hidden sm:inline">
        {isSunlight ? "Dark Mode" : "Sunlight"}
      </span>
    </button>
  );
};
