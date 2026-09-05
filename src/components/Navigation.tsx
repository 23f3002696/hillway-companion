import React from 'react';
import { Train, Sparkles, MessageSquareQuote, Compass, BookOpen } from 'lucide-react';

export type TabType = 'journey' | 'heritage' | 'phrasebook' | 'compass' | 'passport';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isSunlight: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isSunlight }) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'journey', label: 'Journey', icon: Train },
    { id: 'heritage', label: 'AI Guide', icon: Sparkles },
    { id: 'phrasebook', label: 'Phrases', icon: MessageSquareQuote },
    { id: 'compass', label: 'Peaks', icon: Compass },
    { id: 'passport', label: 'Passport', icon: BookOpen },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 pointer-events-none pb-safe px-3 sm:px-6 mb-2 sm:mb-3"
      aria-label="Main Navigation"
    >
      <div
        className={`max-w-2xl mx-auto rounded-2xl p-1.5 pointer-events-auto transition-all duration-300 ${
          isSunlight
            ? 'bg-white border-2 border-black shadow-[4px_4px_0px_#000]'
            : 'bg-[#0d1e15]/90 backdrop-blur-2xl border border-rail-gold/30 shadow-[0_12px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(217,119,6,0.25)]'
        }`}
      >
        <div className="flex items-center justify-between gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 group ${
                  isSunlight
                    ? isActive
                      ? 'bg-black text-white font-extrabold shadow'
                      : 'text-neutral-700 hover:bg-neutral-100 font-medium'
                    : isActive
                      ? 'bg-gradient-to-b from-pine-deep/80 via-[#0d2319] to-surface-container text-amber-glow border border-rail-gold/45 shadow-sm'
                      : 'text-himalaya-mist hover:text-parchment hover:bg-white/5'
                }`}
              >
                {/* Active Indicator Top Dot (Non-sunlight) */}
                {isActive && !isSunlight && (
                  <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-amber-glow glowing-indicator" />
                )}

                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? (isSunlight ? 'text-white' : 'text-amber-glow') : 'text-inherit'}`} />
                </div>
                
                <span className={`text-[10px] sm:text-[11px] mt-1 tracking-tight font-sans ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
