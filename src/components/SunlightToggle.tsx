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
      className={`p-2 rounded-xl transition-all flex items-center justify-center ${
        isSunlight
          ? 'bg-black text-white hover:bg-neutral-800'
          : 'bg-himalaya-card/80 hover:bg-himalaya-card text-himalaya-amber border border-himalaya-border'
      }`}
      aria-label={isSunlight ? "Switch to Normal Himalayan Theme" : "Switch to Harsh Sunlight High-Contrast Mode"}
      title={isSunlight ? "Sunlight Mode Active (Click for Normal Mode)" : "Turn on High-Contrast Sunlight Mode"}
    >
      {isSunlight ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400" />
      )}
    </button>
  );
};

