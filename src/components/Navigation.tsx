import React from 'react';
import { Train, Sparkles, MessageSquareQuote, Compass, Camera, BookOpen } from 'lucide-react';

export type TabType = 'journey' | 'heritage' | 'scanner' | 'phrasebook' | 'compass' | 'passport';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isSunlight: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isSunlight }) => {
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'journey', label: 'Journey', icon: Train },
    { id: 'heritage', label: 'AI Guide', icon: Sparkles },
    { id: 'scanner', label: 'Scanner', icon: Camera },
    { id: 'phrasebook', label: 'Phrases', icon: MessageSquareQuote },
    { id: 'compass', label: 'Peaks', icon: Compass },
    { id: 'passport', label: 'Passport', icon: BookOpen },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 pb-safe transition-colors ${
        isSunlight
          ? 'bg-white border-t-2 border-black'
          : 'bg-[#0e1813]/95 backdrop-blur-md border-t border-himalaya-border'
      }`}
    >
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all ${
                isSunlight
                  ? isActive
                    ? 'text-black font-extrabold scale-105'
                    : 'text-neutral-500 font-medium hover:text-black'
                  : isActive
                    ? 'text-himalaya-amber font-semibold scale-105'
                    : 'text-himalaya-mist hover:text-himalaya-snow'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-all ${
                  isActive
                    ? isSunlight
                      ? 'bg-neutral-200'
                      : 'bg-himalaya-forest/50'
                    : ''
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive && !isSunlight ? 'text-himalaya-amber' : ''}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
