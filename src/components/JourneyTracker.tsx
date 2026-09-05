import React, { useState, useEffect } from 'react';
import { DHR_STATIONS } from '../data/dhrStations';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';
import { 
  MapPin, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Sparkles, 
  Train,
  TrendingUp,
  Flame,
  Volume2,
  VolumeX,
  Gauge,
  Award
} from 'lucide-react';

interface JourneyTrackerProps {
  currentStationIndex: number;
  onSelectStation: (index: number) => void;
  onAskAI: (query: string) => void;
  isSunlight: boolean;
}

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({
  currentStationIndex,
  onSelectStation,
  onAskAI,
  isSunlight
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const currentStation = DHR_STATIONS[currentStationIndex] || DHR_STATIONS[0];

  // Auto-play simulation effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      soundService.playTrackClack();
      interval = setInterval(() => {
        soundService.playTrackClack();
        if (currentStationIndex >= DHR_STATIONS.length - 1) {
          setIsPlaying(false);
        } else {
          onSelectStation(currentStationIndex + 1);
        }
      }, 3800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStationIndex, onSelectStation]);

  const progressPercent = ((currentStation.distanceKm / 88.0) * 100).toFixed(0);

  // Dynamic telemetry calculations for vintage dials
  const currentSpeed = isPlaying ? (currentStationIndex === 12 ? 11 : 14) : 0;
  const boilerPressure = isPlaying ? 138 : 124; // PSI (normal 120-140)

  // Needle angles for SVG/CSS gauges:
  // Speed: 0 to 40 km/h mapped to -120deg to +120deg
  const speedNeedleDeg = -120 + (currentSpeed / 40) * 240;
  // Pressure: 0 to 180 PSI mapped to -120deg to +120deg
  const pressureNeedleDeg = -120 + (boilerPressure / 180) * 240;

  const handleToggleAudioGuide = () => {
    if (isPlayingAudio) {
      speechService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = `${currentStation.name} Station. Elevation: ${currentStation.elevationM} meters. ${currentStation.highlight}. ${currentStation.description}`;
      speechService.speak(textToSpeak, 'english', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const nextStation = DHR_STATIONS[currentStationIndex + 1];
  const distToNext = nextStation 
    ? (nextStation.distanceKm - currentStation.distanceKm).toFixed(1) 
    : '0.0';

  return (
    <div className="space-y-6 pb-24">
      {/* Top Altitude & Route HUD with Stitch Glassmorphism */}
      <div
        className={`p-4 sm:p-5 md:p-7 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b pb-4 mb-4 border-inherit/25">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-himalaya-mist font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-amber-glow" />
              <span>Current Mountain Elevation</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-amber-glow font-mono text-glow">
                {currentStation.elevationM.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-himalaya-mist">m</span>
              <span className="text-xs sm:text-sm font-mono text-neutral-400 ml-1">
                ({currentStation.elevationFt.toLocaleString()} ft ASL)
              </span>
            </div>
          </div>

          <div className="sm:text-right">
            <div className="flex items-center sm:justify-end gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 glowing-indicator" />
              <span className="text-xs uppercase tracking-widest text-himalaya-mist font-semibold font-mono">
                {isPlaying ? "En Route · Steam Chuffing" : "Station Halt"}
              </span>
            </div>
            <div className="flex items-baseline sm:justify-end gap-1.5 mt-1 flex-wrap">
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">
                {currentStation.distanceKm}
              </span>
              <span className="text-xs text-himalaya-mist font-mono">/ 88 km</span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-pine-deep text-emerald-300 border border-emerald-500/30 ml-1 shadow-sm">
                {progressPercent}% Traversed
              </span>
            </div>
          </div>
        </div>

        {/* Elevation Profile Visual SVG Graph */}
        <div className="relative pt-2">
          <div className="flex justify-between text-[10px] sm:text-[11px] text-himalaya-mist font-mono mb-2">
            <span>Siliguri (100m)</span>
            <span className="font-bold text-amber-glow flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400 inline" />
              Ghum Summit (2,258m)
            </span>
            <span>Darjeeling (2,073m)</span>
          </div>

          <div className="h-20 sm:h-24 md:h-28 w-full relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="stitchElevationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.75" />
                  <stop offset="65%" stopColor="#064e3b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#08120c" stopOpacity="0.0" />
                </linearGradient>
                <filter id="stitchGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Route Area Fill */}
              <polygon
                points="0,38 9,37 19,36 27,33 33,29 39,26 44,22 50,19 58,15 66,11 74,6 79,2 89,2 100,5 100,40 0,40"
                fill="url(#stitchElevationGrad)"
              />
              {/* Mountain Profile Line */}
              <polyline
                points="0,38 9,37 19,36 27,33 33,29 39,26 44,22 50,19 58,15 66,11 74,6 79,2 89,2 100,5"
                fill="none"
                stroke={isSunlight ? "#000000" : "#f59e0b"}
                strokeWidth={isSunlight ? "2.5" : "2"}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter={isSunlight ? undefined : "url(#stitchGlow)"}
              />
            </svg>

            {/* Current Position Train Waypoint Indicator with Stitch Lantern Glow */}
            <div
              className="absolute -top-3 transform -translate-x-1/2 transition-all duration-500 pointer-events-none z-20"
              style={{ left: `${Math.max(4, Math.min(96, (currentStation.distanceKm / 88) * 100))}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-ping absolute" />
                <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white relative z-10 shadow-md flex items-center justify-center glowing-indicator">
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <span className="text-[10px] font-mono font-bold mt-1 bg-surface-container/95 text-amber-300 px-2 py-0.5 rounded-md border border-rail-gold/50 shadow-md whitespace-nowrap">
                  {currentStation.name.split(' ')[0]} ({currentStation.elevationM}m)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Ride Scrubber Controls */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-inherit/25 flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={() => onSelectStation(Math.max(0, currentStationIndex - 1))}
            disabled={currentStationIndex === 0}
            className="px-2.5 sm:px-3.5 py-2 rounded-xl border border-inherit disabled:opacity-30 hover:bg-white/5 text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm"
            title="Previous Station"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Halt</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
              isSunlight
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-gradient-to-r from-rail-gold to-amber-glow text-black hover:brightness-110 shadow-glow-amber'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Pause Ride Simulation</span>
                <span className="sm:hidden">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Simulate 88 km Mountain Ride</span>
                <span className="sm:hidden">Simulate Ride</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelectStation(Math.min(DHR_STATIONS.length - 1, currentStationIndex + 1))}
            disabled={currentStationIndex === DHR_STATIONS.length - 1}
            className="px-2.5 sm:px-3.5 py-2 rounded-xl border border-inherit disabled:opacity-30 hover:bg-white/5 text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all shadow-sm"
            title="Next Station"
          >
            <span className="hidden sm:inline">Next Halt</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stitch Dual Vintage Telemetry Gauges Section */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        {/* Speedometer Gauge */}
        <div
          className={`p-4 sm:p-5 md:p-6 rounded-3xl transition-all duration-300 flex flex-col items-center justify-between relative overflow-hidden ${
            isSunlight ? 'card-sunlight' : 'glass-panel text-parchment'
          }`}
        >
          <div className="w-full flex items-center justify-between border-b border-inherit/20 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-rail-gold" />
              <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Speedometer</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pine-deep text-emerald-300 border border-emerald-600/30">
              {isPlaying ? 'CRUISING' : 'HALTED'}
            </span>
          </div>

          {/* Dial Graphic */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 my-2 sm:my-3 flex items-center justify-center">
            {/* Outer Brass Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-pine-deep/80 shadow-[inset_0_4px_16px_rgba(0,0,0,0.7)] bg-[#0a150e]" />
            <div className="absolute inset-1.5 rounded-full border border-rail-gold/30" />
            
            {/* Speed Gauge Ticks (SVG) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {/* Green operating track arc: 5 to 20 km/h */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(16, 185, 129, 0.25)"
                strokeWidth="4"
                strokeDasharray="167 251"
                strokeDashoffset="125"
                transform="rotate(-150 50 50)"
              />
            </svg>

            {/* Dial Labels */}
            <div className="absolute top-7 text-[10px] font-mono text-neutral-400">20</div>
            <div className="absolute bottom-10 left-8 text-[10px] font-mono text-neutral-400">0</div>
            <div className="absolute bottom-10 right-8 text-[10px] font-mono text-neutral-400">40</div>

            {/* Needle */}
            <div
              className="absolute w-0.5 sm:w-1 h-12 sm:h-16 md:h-20 bg-gradient-to-t from-red-600 via-amber-400 to-amber-200 rounded-full transition-transform duration-700 ease-out origin-bottom z-10 glowing-indicator"
              style={{
                bottom: '50%',
                transform: `rotate(${speedNeedleDeg}deg)`
              }}
            />
            {/* Center Pivot Cap */}
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rail-gold border-2 border-black z-20 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>

            {/* Current speed readout */}
            <div className="absolute bottom-4 flex flex-col items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold font-mono text-amber-glow text-glow">
                {currentSpeed}
              </span>
              <span className="text-[10px] font-mono uppercase text-himalaya-mist tracking-widest">
                km / h
              </span>
            </div>
          </div>

          <div className="w-full text-center text-[10px] sm:text-xs text-himalaya-mist font-medium">
            <span className="hidden sm:inline">Standard 2ft Narrow Gauge Speed Limit: 16 km/h on Batasia loop curves</span>
            <span className="sm:hidden">2ft Gauge Limit: 16 km/h</span>
          </div>
        </div>

        {/* B-Class Steam Boiler Pressure Gauge */}
        <div
          className={`p-4 sm:p-5 md:p-6 rounded-3xl transition-all duration-300 flex flex-col items-center justify-between relative overflow-hidden ${
            isSunlight ? 'card-sunlight' : 'glass-panel text-parchment'
          }`}
        >
          <div className="w-full flex items-center justify-between border-b border-inherit/20 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">Boiler Steam</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/40">
              1881 SPEC
            </span>
          </div>

          {/* Dial Graphic */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 my-2 sm:my-3 flex items-center justify-center">
            {/* Outer Brass Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-pine-deep/80 shadow-[inset_0_4px_16px_rgba(0,0,0,0.7)] bg-[#0a150e]" />
            <div className="absolute inset-1.5 rounded-full border border-rail-gold/30" />
            
            {/* Pressure Ticks (SVG) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {/* Green safe operating zone arc: 120-140 PSI */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(245, 158, 11, 0.35)"
                strokeWidth="4"
                strokeDasharray="90 251"
                strokeDashoffset="60"
                transform="rotate(-90 50 50)"
              />
              {/* Redline danger zone arc: 160-180 PSI */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(239, 68, 68, 0.5)"
                strokeWidth="4"
                strokeDasharray="40 251"
                strokeDashoffset="0"
                transform="rotate(-30 50 50)"
              />
            </svg>

            {/* Dial Labels */}
            <div className="absolute top-7 text-[10px] font-mono text-neutral-400">90</div>
            <div className="absolute bottom-10 left-8 text-[10px] font-mono text-neutral-400">0</div>
            <div className="absolute bottom-10 right-8 text-[10px] font-mono text-red-400 font-bold">180</div>

            {/* Needle */}
            <div
              className="absolute w-0.5 sm:w-1 h-12 sm:h-16 md:h-20 bg-gradient-to-t from-red-600 via-amber-400 to-amber-200 rounded-full transition-transform duration-700 ease-out origin-bottom z-10 glowing-indicator"
              style={{
                bottom: '50%',
                transform: `rotate(${pressureNeedleDeg}deg)`
              }}
            />
            {/* Center Pivot Cap */}
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rail-gold border-2 border-black z-20 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>

            {/* Current pressure readout */}
            <div className="absolute bottom-4 flex flex-col items-center">
              <span className="text-lg sm:text-xl md:text-2xl font-extrabold font-mono text-amber-glow text-glow">
                {boilerPressure}
              </span>
              <span className="text-[10px] font-mono uppercase text-himalaya-mist tracking-widest">
                PSI
              </span>
            </div>
          </div>

          <div className="w-full text-center text-[10px] sm:text-xs text-himalaya-mist font-medium">
            <span className="hidden sm:inline">B-Class Locomotive Working Boiler Pressure: 120 – 140 PSI (Coal & Water)</span>
            <span className="sm:hidden">Boiler Pressure: 120–140 PSI</span>
          </div>
        </div>
      </div>

      {/* Hero Station Feature Card (Batasia Loop & Key Halts) */}
      <div
        className={`rounded-3xl overflow-hidden transition-all duration-300 ${
          isSunlight ? 'card-sunlight' : 'glass-panel text-parchment'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-12">
          {/* Scenic Heritage Visual from Stitch */}
          <div className="sm:col-span-5 h-48 sm:h-64 md:h-auto relative bg-[#07130c] overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRzz0ANVI1Fx_lCTA2y6wasK4aV8hWiI1AJ_1uTulvXXKBdlmA5et5DYiOYwfUGtjB3CpZ5fY8ESs0NEF-WLM7An1x8k4ZW2fi-lIq5KWmomOxEoAIimmCo0CXda6jheMDsKHCcduDnGP2N4vSa9XTqwpQeYx8OBPzafCP7MCvK9RiP_PO7xl1kM6OaMfkKxqrRyHAJVMOiZngoOGKWjIEUSgJnnHpyh6J93fZQcsc1un9O7fSw3KlqyYZLKxrExrj9ZNYRw_OgJzE')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-black/75 text-amber-300 border border-rail-gold/40 backdrop-blur-md">
                UNESCO MONUMENT
              </span>
              <span className="text-[10px] font-mono text-neutral-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                Batasia 360° Spiral
              </span>
            </div>
          </div>

          {/* Station Narrative & Audio Guide Trigger */}
          <div className="sm:col-span-7 p-4 sm:p-6 md:p-7 flex flex-col justify-between space-y-3 sm:space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rail-gold text-black shadow-sm">
                    HALT #{currentStationIndex + 1} OF 14
                  </span>
                  {currentStation.id === 'ghum' && (
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-red-600 text-white animate-pulse shadow-sm">
                      ★ SUMMIT 2,258m
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-himalaya-mist flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rail-gold" />
                  <span>{currentStation.haltDurationMins} min halt</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-parchment tracking-tight">
                {currentStation.name}
              </h2>

              {/* Multilingual Station Name Banner */}
              <div className="flex flex-wrap items-center gap-2 text-xs mt-1 text-himalaya-mist font-medium">
                <span>नेपाली: <strong className="text-inherit">{currentStation.nepaliName}</strong></span>
                <span>•</span>
                <span>বাংলা: <strong className="text-inherit">{currentStation.bengaliName}</strong></span>
                <span>•</span>
                <span>हिन्दी: <strong className="text-inherit">{currentStation.hindiName}</strong></span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed mt-3">
                {currentStation.description}
              </p>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 border-t border-inherit/20">
                <div className="p-2 sm:p-2.5 rounded-xl bg-black/30 border border-inherit/20">
                  <span className="block text-[10px] uppercase font-mono text-himalaya-mist">Next Stop</span>
                  <span className="font-serif font-bold text-parchment text-xs sm:text-sm truncate block">
                    {nextStation ? nextStation.name : 'Terminal Point'}
                  </span>
                  <span className="text-[11px] font-mono text-amber-glow block">
                    {distToNext} km ahead
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-black/30 border border-inherit/20">
                  <span className="block text-[10px] uppercase font-mono text-himalaya-mist">Peak Altitude</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {currentStation.elevationM} m
                  </span>
                  <span className="text-[11px] font-mono text-himalaya-mist block">
                    {currentStation.elevationFt} ft ASL
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Audio Guide & Ask AI */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleToggleAudioGuide}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-black shadow-glow-amber animate-pulse'
                    : isSunlight
                      ? 'bg-black text-white hover:bg-neutral-800'
                      : 'bg-rail-gold hover:bg-amber-glow text-black font-semibold'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Audio Guide</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Play Offline Audio Guide</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onAskAI(`Tell me about the engineering marvel, history, and sights at ${currentStation.name}`)}
                className="py-3 px-4 rounded-xl text-xs font-semibold bg-surface-container hover:bg-white/10 text-parchment border border-rail-gold/30 flex items-center gap-1.5 transition-colors"
                title="Ask AI about this station"
              >
                <Sparkles className="w-4 h-4 text-amber-glow" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Feat & Passenger Advice Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentStation.engineeringFeature && (
          <div
            className={`p-4 rounded-2xl transition-all duration-300 border flex items-start gap-3 ${
              isSunlight
                ? 'card-sunlight'
                : 'bg-pine-deep/30 border-emerald-700/40 text-neutral-200 backdrop-blur-md'
            }`}
          >
            <Train className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-xs font-bold text-emerald-400 uppercase font-mono mb-1">
                Colonial Engineering Feat
              </strong>
              <p className="text-xs sm:text-sm leading-relaxed">
                {currentStation.engineeringFeature}
              </p>
            </div>
          </div>
        )}

        <div
          className={`p-4 rounded-2xl transition-all duration-300 border flex items-start gap-3 ${
            isSunlight
              ? 'card-sunlight'
              : 'bg-amber-950/20 border-rail-gold/30 text-neutral-200 backdrop-blur-md'
          }`}
        >
          <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-xs font-bold text-amber-400 uppercase font-mono mb-1">
              Mountain Passenger Tip
            </strong>
            <p className="text-xs sm:text-sm leading-relaxed">
              {currentStation.specialTips}
            </p>
          </div>
        </div>
      </div>

      {/* Complete Station Alignment Grid with Ticket Stubs */}
      <div
        className={`p-4 sm:p-5 md:p-7 rounded-3xl transition-all duration-300 ${
          isSunlight ? 'card-sunlight' : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex items-center justify-between mb-4 border-b border-inherit/20 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-rail-gold" />
            <h3 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider">
              88 km Station Alignment (14 Halts)
            </h3>
          </div>
          <span className="text-xs text-himalaya-mist font-mono">Select any station</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DHR_STATIONS.map((station, index) => {
            const isCurrent = index === currentStationIndex;
            const isPassed = index < currentStationIndex;

            return (
              <div
                key={station.id}
                onClick={() => onSelectStation(index)}
                className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 ${
                  isCurrent
                    ? isSunlight
                      ? 'bg-black text-white font-bold shadow-md'
                      : 'bg-gradient-to-r from-pine-deep via-[#0d2a1f] to-surface-container border border-rail-gold text-parchment shadow-glow-amber/20'
                    : isPassed
                      ? 'opacity-75 hover:opacity-100 hover:bg-white/5 border border-transparent'
                      : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono shadow-sm ${
                      isCurrent
                        ? 'bg-amber-400 text-black shadow-glow-amber'
                        : isPassed
                          ? 'bg-pine-deep text-emerald-300 border border-emerald-600/40'
                          : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
                      <span className="font-serif">{station.name}</span>
                      {station.id === 'ghum' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-700 text-white font-bold font-mono">
                          SUMMIT
                        </span>
                      )}
                      {station.id === 'batasia' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-600 text-black font-bold font-mono">
                          LOOP
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-himalaya-mist font-mono mt-0.5 truncate">
                      {station.distanceKm} km • {station.elevationM}m
                      <span className="hidden sm:inline"> ({station.nepaliName})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-glow">
                    {station.elevationM}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
