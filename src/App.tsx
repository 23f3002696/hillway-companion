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
import { Train, Award, Bell } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('journey');
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(12); // Default to Batasia Loop (Station 13)
  const [isSunlight, setIsSunlight] = useState<boolean>(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>('');
  const [isWhistling, setIsWhistling] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

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
        className={`sticky top-0 z-40 pt-safe px-4 py-3 transition-colors ${
          isSunlight
            ? 'bg-white border-b-2 border-black'
            : 'bg-[#0e1813]/90 backdrop-blur-md border-b border-himalaya-border'
        }`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl flex items-center justify-center ${
                isSunlight
                  ? 'bg-black text-white'
                  : 'bg-gradient-to-br from-himalaya-pine to-himalaya-forest text-himalaya-amber border border-himalaya-border'
              }`}
            >
              <Train className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold tracking-tight uppercase">
                  Hillway Companion
                </h1>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  DHR
                </span>
              </div>
              <p className="text-[11px] text-himalaya-mist tracking-tight">
                UNESCO Heritage · 88 km Offline Guide
              </p>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5">
            {/* Steam Whistle Sound Trigger */}
            <button
              onClick={handleBlowWhistle}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                isWhistling
                  ? 'bg-amber-500 text-black scale-110'
                  : isSunlight
                    ? 'bg-neutral-100 text-black border border-black hover:bg-neutral-200'
                    : 'bg-himalaya-card text-himalaya-tea border border-himalaya-border hover:text-white'
              }`}
              title="Blow B-Class Steam Locomotive Whistle (Synthesized Offline Audio)"
            >
              <Bell className={`w-4 h-4 ${isWhistling ? 'animate-bounce' : ''}`} />
            </button>

            {/* Sunlight Mode Toggle */}
            <SunlightToggle isSunlight={isSunlight} onToggle={handleToggleSunlight} />
          </div>
        </div>

        {/* Offline Status & Mode Ribbon */}
        <div className="max-w-md mx-auto mt-2 flex items-center justify-between">
          <OfflineStatusBadge isSunlight={isSunlight} />
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="text-[10px] text-himalaya-mist hover:text-white font-mono flex items-center gap-1 transition-all underline decoration-dotted"
            title="Read official UNESCO Heritage Archive & Engineering Notes"
          >
            <Award className="w-3 h-3 text-himalaya-amber" />
            <span>{showAbout ? "Back to Guide" : "UNESCO Site 944"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4">
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

      {/* Bottom Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSunlight={isSunlight}
      />
    </div>
  );
};
export default App;
