import React, { useState } from 'react';
import { Navigation, TabType } from './components/Navigation';
import { JourneyTracker } from './components/JourneyTracker';
import { HeritageGuide } from './components/HeritageGuide';
import { Phrasebook } from './components/Phrasebook';
import { PeakCompass } from './components/PeakCompass';
import { CameraScanner } from './components/CameraScanner';
import { TraveloguePassport } from './components/TraveloguePassport';
import { AboutDHR } from './components/AboutDHR';
import { OfflineStatusBadge } from './components/OfflineStatusBadge';
import { SunlightToggle } from './components/SunlightToggle';
import { soundService } from './services/soundService';
import { DHR_STATIONS } from './data/dhrStations';
import { Train, Award, Bell } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('journey');
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(12); // Default to Batasia Loop (Station 13)
  const [isSunlight, setIsSunlight] = useState<boolean>(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>('');
  const [isWhistling, setIsWhistling] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const currentStation = DHR_STATIONS[currentStationIndex] || DHR_STATIONS[0];

  // Handle Sunlight mode toggle on body tag
  const handleToggleSunlight = () => {
    setIsSunlight((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('sunlight-mode');
      } else {
        document.body.classList.remove('sunlight-mode');
      }
      return next;
    });
  };

  const handleBlowWhistle = () => {
    soundService.playSteamWhistle();
    setIsWhistling(true);
    setTimeout(() => setIsWhistling(false), 1600);
  };

  const handleAskAI = (query: string) => {
    setAiInitialQuery(query);
    setActiveTab('heritage');
  };

  const handleNavigateToJourney = (stationIndex: number) => {
    setCurrentStationIndex(stationIndex);
    setActiveTab('journey');
  };

  return (
    <div className="min-h-screen bg-inherit text-inherit flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Application Bar */}
      <header
        className={`sticky top-0 z-40 pt-safe transition-all duration-300 ${
          isSunlight
            ? 'bg-white border-b-2 border-black shadow-sm'
            : 'bg-[#08120c]/90 backdrop-blur-2xl border-b border-amber-600/20 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo & Brand Identity */}
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 relative group ${
                  isSunlight
                    ? 'bg-black text-white border-2 border-black'
                    : 'bg-gradient-to-br from-pine-deep via-[#0d2319] to-surface-container text-rail-gold border border-rail-gold/30 shadow-glow-amber/20'
                }`}
              >
                <Train className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {!isSunlight && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 glowing-indicator" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-wide font-serif text-parchment uppercase">
                    Hillway Companion
                  </h1>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-rail-gold/15 text-rail-gold border border-rail-gold/40 tracking-wider">
                    DHR 1881
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-himalaya-mist font-medium">
                  <span className="text-emerald-400/90 font-medium">UNESCO World Heritage #944</span>
                  <span className="text-neutral-600">•</span>
                  <span className="text-amber-glow font-mono text-[11px] font-semibold">
                    {currentStation.name} ({currentStation.elevationM}m)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-2">
              {/* Steam Whistle Sound Trigger */}
              <button
                onClick={handleBlowWhistle}
                className={`px-3.5 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 text-xs font-bold shadow-sm active:scale-95 relative overflow-hidden ${
                  isWhistling
                    ? 'bg-amber-500 text-black scale-105 shadow-glow-amber'
                    : isSunlight
                      ? 'bg-neutral-100 text-black border-2 border-black hover:bg-neutral-200'
                      : 'bg-surface-container/90 text-rail-gold border border-rail-gold/25 hover:border-rail-gold/50 hover:bg-pine-deep/40'
                }`}
                title="Blow B-Class Steam Locomotive Whistle (Synthesized Offline Audio)"
              >
                <Bell className={`w-3.5 h-3.5 ${isWhistling ? 'animate-bounce text-black' : 'text-amber-glow'}`} />
                <span className="hidden sm:inline font-mono tracking-tight">Whistle</span>
                {isWhistling && (
                  <span className="absolute inset-0 bg-white/20 animate-ping rounded-xl pointer-events-none" />
                )}
              </button>

              {/* Sunlight Mode Toggle */}
              <SunlightToggle isSunlight={isSunlight} onToggle={handleToggleSunlight} />
            </div>
          </div>

          {/* Sub-header: Proactive Offline Telemetry & Archive link */}
          <div className="mt-2.5 pt-2 border-t border-inherit/25 flex items-center justify-between text-xs">
            <OfflineStatusBadge isSunlight={isSunlight} />
            
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="text-[11px] text-himalaya-mist hover:text-parchment font-medium flex items-center gap-1.5 transition-colors group"
              title="Official UNESCO World Heritage Archive & Engineering Blueprints"
            >
              <Award className="w-3.5 h-3.5 text-rail-gold group-hover:scale-110 transition-transform" />
              <span className="underline decoration-rail-gold/40 hover:decoration-rail-gold underline-offset-4 font-mono">
                {showAbout ? "← Return to Guide" : "UNESCO Archive"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {showAbout ? (
          <AboutDHR isSunlight={isSunlight} />
        ) : (
          <>
            {activeTab === 'journey' && (
              <JourneyTracker
                currentStationIndex={currentStationIndex}
                onSelectStation={setCurrentStationIndex}
                onAskAI={handleAskAI}
                isSunlight={isSunlight}
              />
            )}

            {activeTab === 'heritage' && (
              <HeritageGuide
                currentStationIndex={currentStationIndex}
                initialQuery={aiInitialQuery}
                isSunlight={isSunlight}
                onNavigateToJourney={handleNavigateToJourney}
              />
            )}

            {activeTab === 'scanner' && (
              <CameraScanner
                isSunlight={isSunlight}
                onAskAI={handleAskAI}
              />
            )}

            {activeTab === 'phrasebook' && (
              <Phrasebook isSunlight={isSunlight} />
            )}

            {activeTab === 'compass' && (
              <PeakCompass isSunlight={isSunlight} />
            )}

            {activeTab === 'passport' && (
              <TraveloguePassport
                currentStationIndex={currentStationIndex}
                isSunlight={isSunlight}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Floating Navigation Dock */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setShowAbout(false);
          setActiveTab(tab);
        }}
        isSunlight={isSunlight}
      />
    </div>
  );
};

export default App;
