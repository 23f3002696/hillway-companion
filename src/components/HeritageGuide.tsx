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
  Train
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
  const currentStation = DHR_STATIONS[currentStationIndex];
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
      // Default welcome query
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
    <div className="space-y-4 pb-20">
      {/* Header & Local RAG Guarantee Badge */}
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-inherit">Offline Heritage AI</h2>
              <p className="text-xs text-himalaya-mist">
                Trained on verified DHR historical archives & UNESCO records
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>On-Device RAG</span>
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="mt-3 relative"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about the DHR, engines, loops..."
            className={`w-full py-2.5 pl-3.5 pr-10 rounded-xl text-xs font-medium outline-none transition-all ${
              isSunlight
                ? 'bg-neutral-100 text-black border-2 border-black placeholder:text-neutral-500 focus:bg-white'
                : 'bg-[#0a120e] text-white border border-himalaya-border focus:border-himalaya-amber placeholder:text-neutral-500'
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-all ${
              isSunlight
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-himalaya-pine hover:bg-himalaya-forest text-himalaya-amber'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Suggested Question Chips */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(q);
                handleSearch(q);
              }}
              className={`shrink-0 text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                isSunlight
                  ? 'bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-300 font-semibold'
                  : 'bg-himalaya-dark/60 hover:bg-himalaya-forest/40 text-himalaya-snow border-himalaya-border'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* AI Answer Card */}
      {response && (
        <div
          className={`p-5 rounded-2xl transition-all ${
            isSunlight
              ? 'card-sunlight'
              : 'bg-himalaya-card border border-himalaya-border shadow-lg'
          }`}
        >
          {/* Metadata bar */}
          <div className="flex items-center justify-between border-b pb-2.5 border-inherit text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-himalaya-amber flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{response.sourceTitle}</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-himalaya-forest/40 text-himalaya-emerald">
                {response.category}
              </span>
            </div>

            {/* Read Aloud Audio Toggle */}
            <button
              onClick={handleToggleSpeak}
              className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-bold transition-all ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse'
                  : isSunlight
                    ? 'bg-neutral-200 text-black hover:bg-neutral-300'
                    : 'bg-himalaya-forest/50 text-himalaya-amber hover:bg-himalaya-forest'
              }`}
              title={isSpeaking ? "Stop Speaking" : "Listen Aloud"}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Listen</span>
                </>
              )}
            </button>
          </div>

          {/* Answer Text */}
          <div className="mt-3.5 leading-relaxed text-xs sm:text-sm text-inherit font-normal space-y-2">
            <p>{response.answer}</p>
          </div>

          {/* Related Station Link */}
          {response.relatedStation && (
            <div className="mt-4 p-2.5 rounded-xl bg-black/20 border border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Train className="w-4 h-4 text-himalaya-amber" />
                <div>
                  <span className="font-semibold text-inherit">
                    Related Station: {response.relatedStation.name}
                  </span>
                  <span className="text-himalaya-mist text-[11px] block">
                    {response.relatedStation.distanceKm} km • {response.relatedStation.elevationM} m
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const idx = DHR_STATIONS.findIndex(s => s.id === response.relatedStation?.id);
                  if (idx !== -1) onNavigateToJourney(idx);
                }}
                className="text-xs font-bold text-himalaya-amber hover:underline flex items-center gap-0.5"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Follow-up Questions */}
          {response.followUpQuestions && response.followUpQuestions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-inherit">
              <span className="text-[11px] text-himalaya-mist font-semibold block mb-1.5">
                Related Questions:
              </span>
              <div className="space-y-1.5">
                {response.followUpQuestions.map((fq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(fq);
                      handleSearch(fq);
                    }}
                    className={`w-full text-left text-xs p-2 rounded-lg border transition-all flex items-center justify-between ${
                      isSunlight
                        ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-black font-medium'
                        : 'bg-black/20 hover:bg-black/40 border-himalaya-border/60 text-himalaya-snow'
                    }`}
                  >
                    <span>{fq}</span>
                    <ArrowRight className="w-3 h-3 text-himalaya-amber shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Execution Engine Footer */}
          <div className="mt-4 pt-2 border-t border-inherit flex items-center justify-between text-[10px] text-himalaya-mist font-mono">
            <span>Engine: {response.executionMode}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Offline Verified</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
