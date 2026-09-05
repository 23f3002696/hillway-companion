import React, { useState } from 'react';
import { PHRASEBOOK_DATA, PHRASE_CATEGORIES, PhraseItem } from '../data/phrasebookData';
import { speechService, SupportedLang } from '../services/speechService';
import { 
  Languages, 
  Volume2, 
  VolumeX, 
  Search, 
  Info, 
  Check, 
  Copy
} from 'lucide-react';

interface PhrasebookProps {
  isSunlight: boolean;
}

export const Phrasebook: React.FC<PhrasebookProps> = ({ isSunlight }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLang>('nepali');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPhrases = PHRASEBOOK_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      item.english.toLowerCase().includes(query) ||
      item.nepali.toLowerCase().includes(query) ||
      item.nepaliPhonetic.toLowerCase().includes(query) ||
      item.hindi.toLowerCase().includes(query) ||
      item.bengali.toLowerCase().includes(query) ||
      item.bengaliPhonetic.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (item: PhraseItem) => {
    let textToSpeak = item.nepali;
    if (selectedLang === 'hindi') textToSpeak = item.hindi;
    if (selectedLang === 'bengali') textToSpeak = item.bengali;
    if (selectedLang === 'english') textToSpeak = item.english;

    setPlayingId(item.id);
    speechService.speak(textToSpeak, selectedLang, () => {
      setPlayingId(null);
    });
  };

  const handleCopy = (item: PhraseItem) => {
    let text = item.nepali;
    if (selectedLang === 'hindi') text = item.hindi;
    if (selectedLang === 'bengali') text = item.bengali;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text} (${item.english})`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header Panel */}
      <div
        className={`p-4 sm:p-6 md:p-8 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-inherit/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pine-deep/80 border border-rail-gold/40 flex items-center justify-center text-rail-gold shadow-sm">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif tracking-tight text-inherit">
                Zero-Bars Hill Phrasebook
              </h2>
              <p className="text-xs text-himalaya-mist font-medium">
                Offline voice pronunciation for Darjeeling Tea Stalls, Toy Train Halts & Bazaars
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full bg-pine-deep text-emerald-300 border border-emerald-500/40 shadow-sm shrink-0 self-start sm:self-auto">
            4 Languages
          </span>
        </div>

        {/* Target Language Switcher */}
        <div className="mt-4 sm:mt-5 flex rounded-2xl p-1 sm:p-1.5 bg-[#08150f] border border-rail-gold/30 gap-1 sm:gap-1.5">
          <button
            onClick={() => setSelectedLang('nepali')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              selectedLang === 'nepali'
                ? isSunlight
                  ? 'bg-black text-white shadow'
                  : 'bg-rail-gold text-black shadow-glow-amber'
                : 'text-neutral-400 hover:text-parchment'
            }`}
          >
            नेपाली (Nepali)
          </button>
          <button
            onClick={() => setSelectedLang('bengali')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              selectedLang === 'bengali'
                ? isSunlight
                  ? 'bg-black text-white shadow'
                  : 'bg-rail-gold text-black shadow-glow-amber'
                : 'text-neutral-400 hover:text-parchment'
            }`}
          >
            বাংলা (Bengali)
          </button>
          <button
            onClick={() => setSelectedLang('hindi')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              selectedLang === 'hindi'
                ? isSunlight
                  ? 'bg-black text-white shadow'
                  : 'bg-rail-gold text-black shadow-glow-amber'
                : 'text-neutral-400 hover:text-parchment'
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phrases: chia, ticket, momo, price, medicine, direction..."
            className={`w-full py-3.5 pl-4 pr-10 rounded-2xl text-xs sm:text-sm outline-none transition-all duration-200 shadow-inner ${
              isSunlight
                ? 'bg-neutral-100 text-black border-2 border-black placeholder:text-neutral-500 focus:bg-white'
                : 'bg-[#08150f] text-parchment border border-rail-gold/30 focus:border-amber-glow focus:ring-2 focus:ring-amber-glow/20 placeholder:text-neutral-500'
            }`}
          />
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        </div>

        {/* Category Pills Carousel */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {PHRASE_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                  isCatActive
                    ? isSunlight
                      ? 'bg-black text-white border-black font-bold shadow-sm'
                      : 'bg-pine-deep text-amber-glow border-rail-gold font-bold shadow-glow-amber/20'
                    : isSunlight
                      ? 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
                      : 'bg-surface-container text-himalaya-mist border-rail-gold/25 hover:text-parchment hover:border-rail-gold/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Phrases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredPhrases.length === 0 ? (
          <div className="col-span-full text-center py-12 text-neutral-400 text-xs sm:text-sm bg-black/20 rounded-3xl p-6 border border-inherit/20">
            No phrases found matching "{searchQuery}". Try searching for tea, price, or stop.
          </div>
        ) : (
          filteredPhrases.map((item) => {
            const isPlaying = playingId === item.id;
            const isCopied = copiedId === item.id;

            let vernacularText = item.nepali;
            let phoneticText = item.nepaliPhonetic;
            if (selectedLang === 'bengali') {
              vernacularText = item.bengali;
              phoneticText = item.bengaliPhonetic;
            } else if (selectedLang === 'hindi') {
              vernacularText = item.hindi;
              phoneticText = item.nepaliPhonetic;
            }

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 md:p-6 rounded-3xl transition-all duration-200 flex flex-col justify-between ${
                  isSunlight
                    ? 'card-sunlight'
                    : 'glass-panel text-parchment hover:border-rail-gold/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {/* English Meaning */}
                      <span className="text-xs font-semibold text-himalaya-mist tracking-wide uppercase font-mono">
                        {item.english}
                      </span>

                      {/* Vernacular Large Text */}
                      <div className="text-xl font-bold mt-1 text-inherit tracking-wide leading-snug font-serif">
                        {vernacularText}
                      </div>

                      {/* Phonetic Pronunciation Guide */}
                      {phoneticText && (
                        <div className="text-xs sm:text-sm mt-1.5 text-amber-glow font-mono font-medium">
                          "{phoneticText}"
                        </div>
                      )}
                    </div>

                    {/* Audio & Copy Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(item)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-parchment bg-white/5 hover:bg-white/10 transition-all text-xs"
                        title="Copy phrase"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleSpeak(item)}
                        className={`p-2.5 rounded-xl transition-all flex items-center justify-center shadow-md active:scale-95 ${
                          isPlaying
                            ? 'bg-red-600 text-white animate-pulse shadow-glow-amber'
                            : isSunlight
                              ? 'bg-black text-white hover:bg-neutral-800'
                              : 'bg-rail-gold hover:bg-amber-glow text-black font-bold'
                        }`}
                        aria-label="Speak phrase aloud"
                        title="Speak phrase aloud"
                      >
                        {isPlaying ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cultural / Context Tip */}
                {item.culturalNote && (
                  <div className="mt-4 pt-3 border-t border-inherit/20 flex items-start gap-2 text-xs text-neutral-300">
                    <Info className="w-3.5 h-3.5 text-rail-gold shrink-0 mt-0.5" />
                    <span>{item.culturalNote}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
