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
  Share2 
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
    <div className="space-y-4 pb-20">
      {/* Header card */}
      <div
        className={`p-4 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-himalaya-forest/60 text-himalaya-amber">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-inherit">Zero-Bars Phrasebook</h2>
              <p className="text-xs text-himalaya-mist">
                Bilingual travel phrases with offline audio pronunciation
              </p>
            </div>
          </div>
        </div>

        {/* Target Language Switcher */}
        <div className="mt-3 flex rounded-xl p-1 bg-black/30 border border-inherit">
          <button
            onClick={() => setSelectedLang('nepali')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'nepali'
                ? isSunlight
                  ? 'bg-black text-white'
                  : 'bg-himalaya-terracotta text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            नेपाली (Nepali)
          </button>
          <button
            onClick={() => setSelectedLang('bengali')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'bengali'
                ? isSunlight
                  ? 'bg-black text-white'
                  : 'bg-himalaya-pine text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            বাংলা (Bengali)
          </button>
          <button
            onClick={() => setSelectedLang('hindi')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedLang === 'hindi'
                ? isSunlight
                  ? 'bg-black text-white'
                  : 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>

        {/* Search bar */}
        <div className="mt-3 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phrases (momo, tea, price, train, doctor)..."
            className={`w-full py-2 pl-3 pr-8 rounded-xl text-xs outline-none transition-all ${
              isSunlight
                ? 'bg-neutral-100 text-black border-2 border-black placeholder:text-neutral-500'
                : 'bg-[#0a120e] text-white border border-himalaya-border placeholder:text-neutral-500'
            }`}
          />
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        </div>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {PHRASE_CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  isCatActive
                    ? isSunlight
                      ? 'bg-black text-white border-black font-bold'
                      : 'bg-himalaya-forest text-himalaya-amber border-himalaya-amber font-semibold'
                    : isSunlight
                      ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
                      : 'bg-himalaya-dark/60 text-himalaya-mist border-himalaya-border hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Phrases List */}
      <div className="space-y-3">
        {filteredPhrases.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-xs">
            No phrases found matching "{searchQuery}". Try searching for tea, water, price, or stop.
          </div>
        ) : (
          filteredPhrases.map((item) => {
            const isPlaying = playingId === item.id;
            const isCopied = copiedId === item.id;

            // Target language translation text & phonetic
            let vernacularText = item.nepali;
            let phoneticText = item.nepaliPhonetic;
            if (selectedLang === 'bengali') {
              vernacularText = item.bengali;
              phoneticText = item.bengaliPhonetic;
            } else if (selectedLang === 'hindi') {
              vernacularText = item.hindi;
              phoneticText = item.nepaliPhonetic; // Similar Devanagari pronunciation
            }

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl transition-all ${
                  isSunlight
                    ? 'card-sunlight'
                    : 'bg-himalaya-card border border-himalaya-border shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    {/* English phrase */}
                    <div className="text-xs font-semibold text-himalaya-mist">
                      {item.english}
                    </div>

                    {/* Vernacular large text */}
                    <div className="text-lg font-bold mt-1 text-inherit tracking-wide leading-snug">
                      {vernacularText}
                    </div>

                    {/* Phonetic Pronunciation Guide */}
                    {phoneticText && (
                      <div className="text-xs mt-1 text-himalaya-amber font-mono font-medium">
                        "{phoneticText}"
                      </div>
                    )}
                  </div>

                  {/* Audio speak aloud button */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => handleSpeak(item)}
                      className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                        isPlaying
                          ? 'bg-red-600 text-white animate-pulse'
                          : isSunlight
                            ? 'bg-black text-white hover:bg-neutral-800'
                            : 'bg-himalaya-pine hover:bg-himalaya-forest text-himalaya-amber'
                      }`}
                      aria-label="Speak phrase aloud"
                      title="Speak phrase aloud with offline speech"
                    >
                      {isPlaying ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-white transition-all flex items-center justify-center text-[10px]"
                      title="Copy phrase"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Cultural / Context Tip */}
                {item.culturalNote && (
                  <div className="mt-2.5 pt-2 border-t border-inherit flex items-start gap-1.5 text-[11px] text-neutral-400">
                    <Info className="w-3.5 h-3.5 text-himalaya-mist shrink-0 mt-0.5" />
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
