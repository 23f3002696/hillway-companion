import React, { useState, useEffect } from 'react';
import { askHillwayAI, AIResponse } from '../services/offlineRAG';
import { DHR_STATIONS } from '../data/dhrStations';
import { speechService } from '../services/speechService';
import { 
  Sparkles, 
  Search, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  CheckCircle2, 
  Cpu, 
  ArrowRight,
  Train,
  HelpCircle
} from 'lucide-react';

interface HeritageGuideProps {
  currentStationIndex: number;
  initialQuery?: string;
  isSunlight: boolean;
  onNavigateToJourney: (stationIndex: number) => void;
}

export const HeritageGuide: React.FC<HeritageGuideProps> = ({
  currentStationIndex,
  initialQuery = '',
  isSunlight,
  onNavigateToJourney
}) => {
  const currentStation = DHR_STATIONS[currentStationIndex] || DHR_STATIONS[0];
  const [query, setQuery] = useState<string>(initialQuery);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const suggestedQuestions = [
    `Tell me about ${currentStation.name}`,
    "Why does the train loop at Batasia?",
    "What is a B-class steam locomotive?",
    "Why is the track gauge only 2 feet?",
    "How do the Z-reverses (zig-zags) work?",
    "When did DHR become a UNESCO site?",
    "What makes Darjeeling tea so famous?",
    "What happens during monsoon landslides?"
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    speechService.stop();
    setIsSpeaking(false);

    try {
      const res = await askHillwayAI(searchQuery, currentStation.id);
      setResponse(res);
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    } else {
      handleSearch(`Tell me about ${currentStation.name}`);
    }
  }, [initialQuery, currentStation.name]);

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else if (response) {
      setIsSpeaking(true);
      speechService.speak(response.answer, 'english', () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Local RAG Search Panel */}
      <div
        className={`p-4 sm:p-6 md:p-8 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-inherit/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pine-deep/80 border border-rail-gold/40 flex items-center justify-center text-rail-gold shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif tracking-tight text-inherit">
                UNESCO Heritage AI Guide
              </h2>
              <p className="text-xs text-himalaya-mist font-medium">
                100% Client-Side Knowledge Base • UNESCO Official Historical Records
              </p>
            </div>
          </div>

          <span className="text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full bg-pine-deep text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm shrink-0 self-start sm:self-auto">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>On-Device RAG</span>
          </span>
        </div>

        {/* Input Form with Glass Styling */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="relative"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything: loops, B-class engines, tea flushes, UNESCO status..."
            className={`w-full py-4 pl-4 pr-12 rounded-2xl text-xs sm:text-sm font-medium outline-none transition-all duration-200 shadow-inner ${
              isSunlight
                ? 'bg-neutral-100 text-black border-2 border-black placeholder:text-neutral-500 focus:bg-white'
                : 'bg-[#08150f] text-parchment border border-rail-gold/30 focus:border-amber-glow focus:ring-2 focus:ring-amber-glow/20 placeholder:text-neutral-500'
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`absolute right-2.5 top-1/2 transform -translate-y-1/2 p-2.5 rounded-xl transition-all active:scale-95 shadow-sm ${
              isSunlight
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-rail-gold hover:bg-amber-glow text-black shadow-glow-amber'
            }`}
            title="Search knowledge base"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Suggested Question Chips */}
        <div className="mt-5">
          <div className="flex items-center gap-1.5 text-xs text-himalaya-mist font-semibold mb-2.5 font-mono uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-rail-gold" />
            <span>Curated Heritage Questions:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(q);
                  handleSearch(q);
                }}
                className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
                  isSunlight
                    ? 'bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-300 font-semibold'
                    : 'bg-surface-container hover:bg-pine-deep text-parchment border-rail-gold/25 hover:border-rail-gold/50 shadow-sm'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Answer Card with Parchment Heritage Styling */}
      {response && (
        <div
          className={`p-4 sm:p-6 md:p-8 rounded-3xl transition-all duration-300 ${
            isSunlight
              ? 'card-sunlight'
              : 'glass-panel text-parchment'
          }`}
        >
          {/* Metadata bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-inherit/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-glow flex items-center gap-1.5 font-serif text-sm sm:text-base">
                <BookOpen className="w-4 h-4 text-rail-gold" />
                <span>{response.sourceTitle}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold px-2 py-0.5 rounded-full bg-pine-deep text-emerald-300 border border-emerald-500/30">
                {response.category}
              </span>
            </div>

            {/* Read Aloud Audio Button */}
            <button
              onClick={handleToggleSpeak}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm active:scale-95 ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse shadow-glow-amber'
                  : isSunlight
                    ? 'bg-neutral-200 text-black hover:bg-neutral-300'
                    : 'bg-surface-container text-rail-gold hover:bg-pine-deep border border-rail-gold/30'
              }`}
              title={isSpeaking ? "Stop Speaking" : "Listen Aloud"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen</span>
                </>
              )}
            </button>
          </div>

          {/* Answer Text */}
          <div className="mt-5 leading-relaxed text-sm sm:text-base text-parchment font-normal space-y-3">
            <p className="leading-relaxed bg-black/20 p-4 rounded-2xl border border-inherit/20 font-serif italic text-neutral-200">
              "{response.answer}"
            </p>
          </div>

          {/* Related Station Link Card */}
          {response.relatedStation && (
            <div className="mt-5 p-4 rounded-2xl bg-black/30 border border-inherit/25 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="w-9 h-9 rounded-xl bg-pine-deep/90 flex items-center justify-center text-rail-gold border border-rail-gold/30">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-inherit font-serif block text-sm">
                    Featured Station: {response.relatedStation.name}
                  </span>
                  <span className="text-himalaya-mist text-xs font-mono">
                    {response.relatedStation.distanceKm} km • {response.relatedStation.elevationM}m elevation
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const idx = DHR_STATIONS.findIndex(s => s.id === response.relatedStation?.id);
                  if (idx !== -1) onNavigateToJourney(idx);
                }}
                className="px-3.5 py-2 rounded-xl bg-rail-gold hover:bg-amber-glow text-black text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Follow-up Questions */}
          {response.followUpQuestions && response.followUpQuestions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-inherit/20">
              <span className="text-xs text-himalaya-mist font-bold uppercase tracking-wider block mb-2.5 font-mono">
                Related Heritage Inquiries:
              </span>
              <div className="space-y-2">
                {response.followUpQuestions.map((fq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(fq);
                      handleSearch(fq);
                    }}
                    className={`w-full text-left text-xs sm:text-sm p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                      isSunlight
                        ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-black font-medium'
                        : 'bg-surface-container/60 hover:bg-white/10 border-rail-gold/20 text-neutral-200 hover:text-parchment'
                    }`}
                  >
                    <span>{fq}</span>
                    <ArrowRight className="w-4 h-4 text-amber-glow shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Execution Engine Footer */}
          <div className="mt-5 pt-3 border-t border-inherit/20 flex items-center justify-between text-[11px] text-himalaya-mist font-mono">
            <span>Retrieval: {response.executionMode}</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Offline Verified Local RAG</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
