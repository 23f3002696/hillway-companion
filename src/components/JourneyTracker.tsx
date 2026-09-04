import React, { useState, useEffect } from 'react';
import { DHR_STATIONS } from '../data/dhrStations';
import { 
  MapPin, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  Sparkles, 
  Train
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
  const currentStation = DHR_STATIONS[currentStationIndex];

  // Auto-play simulation effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentStationIndex >= DHR_STATIONS.length - 1) {
          setIsPlaying(false);
        } else {
          onSelectStation(currentStationIndex + 1);
        }
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStationIndex, onSelectStation]);

  const progressPercent = ((currentStation.distanceKm / 88.0) * 100).toFixed(0);

  return (
    <div className="space-y-4 pb-20">
      {/* Top Altitude & Route HUD */}
      <div
        className={`p-4 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-3 border-inherit">
          <div>
            <span className="text-xs uppercase tracking-wider text-himalaya-mist font-semibold">
              Current Elevation
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold tracking-tight text-himalaya-amber">
                {currentStation.elevationM.toLocaleString()}
              </span>
              <span className="text-sm font-semibold text-himalaya-mist">meters</span>
              <span className="text-xs text-neutral-400">
                ({currentStation.elevationFt.toLocaleString()} ft)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase tracking-wider text-himalaya-mist font-semibold">
              Route Progress
            </span>
            <div className="flex items-baseline justify-end gap-1 mt-0.5">
              <span className="text-2xl font-bold text-himalaya-emerald">
                {currentStation.distanceKm}
              </span>
              <span className="text-xs text-himalaya-mist">/ 88 km</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-himalaya-forest/40 text-himalaya-emerald ml-1">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Elevation Profile Visual SVG */}
        <div className="relative pt-2">
          <div className="flex justify-between text-[10px] text-himalaya-mist font-mono mb-1">
            <span>NJP (100m)</span>
            <span className="font-bold text-himalaya-amber">Ghum Summit (2,258m)</span>
            <span>Darjeeling (2,073m)</span>
          </div>

          <div className="h-16 w-full relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="elevationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e5a93c" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1f4832" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Route Area Fill */}
              <polygon
                points="0,38 9,37 19,36 27,33 33,29 39,26 44,22 50,19 58,15 66,11 74,6 79,2 89,2 100,5 100,40 0,40"
                fill="url(#elevationGradient)"
              />
              {/* Mountain Line */}
              <polyline
                points="0,38 9,37 19,36 27,33 33,29 39,26 44,22 50,19 58,15 66,11 74,6 79,2 89,2 100,5"
                fill="none"
                stroke={isSunlight ? "#000000" : "#e5a93c"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Current Position Pin on Profile */}
            <div
              className="absolute -top-1 transform -translate-x-1/2 transition-all duration-500 pointer-events-none"
              style={{ left: `${Math.max(4, Math.min(96, (currentStation.distanceKm / 88) * 100))}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping absolute" />
                <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-white relative z-10 shadow-sm" />
                <span className="text-[9px] font-bold mt-0.5 bg-black/80 text-white px-1 rounded whitespace-nowrap">
                  {currentStation.id.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Scrubbing Controls */}
        <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between gap-2">
          <button
            onClick={() => onSelectStation(Math.max(0, currentStationIndex - 1))}
            disabled={currentStationIndex === 0}
            className="p-1.5 rounded-lg border border-inherit disabled:opacity-30 hover:bg-black/10 text-xs flex items-center gap-1 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isSunlight
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-himalaya-pine hover:bg-himalaya-forest text-white border border-himalaya-border'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Ride</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Ride</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelectStation(Math.min(DHR_STATIONS.length - 1, currentStationIndex + 1))}
            disabled={currentStationIndex === DHR_STATIONS.length - 1}
            className="p-1.5 rounded-lg border border-inherit disabled:opacity-30 hover:bg-black/10 text-xs flex items-center gap-1 font-medium"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Station Deep Dive Card */}
      <div
        className={`p-5 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border shadow-md'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-himalaya-terracotta text-white">
                Station #{currentStationIndex + 1} of 14
              </span>
              {currentStation.id === 'ghum' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse">
                  SUMMIT 2,258m
                </span>
              )}
              {currentStation.id === 'batasia' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-black">
                  SPIRAL LOOP
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold mt-1 text-inherit tracking-tight">
              {currentStation.name}
            </h2>

            {/* Multilingual Name Strip (Nepali, Bengali, Hindi) */}
            <div className="flex flex-wrap gap-2 text-xs mt-1 text-himalaya-mist font-medium">
              <span>नेपाली: <strong className="text-inherit">{currentStation.nepaliName}</strong></span>
              <span>•</span>
              <span>বাংলা: <strong className="text-inherit">{currentStation.bengaliName}</strong></span>
              <span>•</span>
              <span>हिन्दी: <strong className="text-inherit">{currentStation.hindiName}</strong></span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-himalaya-mist font-mono">Halt Time</div>
            <div className="text-sm font-bold text-himalaya-tea flex items-center justify-end gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentStation.haltDurationMins} mins</span>
            </div>
          </div>
        </div>

        <div className="mt-3 p-2.5 rounded-xl bg-black/20 border border-inherit">
          <p className="text-xs font-semibold text-himalaya-amber">
            ★ {currentStation.highlight}
          </p>
          <p className="text-xs mt-1 text-himalaya-snow/90 leading-relaxed">
            {currentStation.description}
          </p>
        </div>

        {/* Engineering Feat Callout */}
        {currentStation.engineeringFeature && (
          <div className="mt-3 flex items-start gap-2 text-xs text-neutral-300">
            <Train className="w-4 h-4 text-himalaya-emerald shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-himalaya-emerald">Engineering Feature: </span>
              <span>{currentStation.engineeringFeature}</span>
            </div>
          </div>
        )}

        {/* Special Local Tips */}
        <div className="mt-2.5 flex items-start gap-2 text-xs text-neutral-300">
          <MapPin className="w-4 h-4 text-himalaya-terracotta shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-himalaya-terracotta">Passenger Tip: </span>
            <span>{currentStation.specialTips}</span>
          </div>
        </div>

        {/* Action Button: Ask AI about this station */}
        <div className="mt-4 pt-3 border-t border-inherit flex gap-2">
          <button
            onClick={() => onAskAI(`Tell me about the history and engineering of ${currentStation.name}`)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isSunlight
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-himalaya-pine hover:bg-himalaya-forest text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-himalaya-amber" />
            <span>Ask Offline AI About {currentStation.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Complete Station Route Timeline */}
      <div
        className={`p-4 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-himalaya-mist">
            88 km Station Alignment
          </h3>
          <span className="text-xs text-himalaya-mist font-mono">Tap any to view</span>
        </div>

        <div className="space-y-2">
          {DHR_STATIONS.map((station, index) => {
            const isCurrent = index === currentStationIndex;
            const isPassed = index < currentStationIndex;

            return (
              <div
                key={station.id}
                onClick={() => onSelectStation(index)}
                className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                  isCurrent
                    ? isSunlight
                      ? 'bg-black text-white font-bold'
                      : 'bg-himalaya-forest/80 border border-himalaya-emerald text-white'
                    : isPassed
                      ? 'opacity-60 hover:opacity-100 hover:bg-black/10'
                      : 'hover:bg-black/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-amber-400 text-black'
                        : isPassed
                          ? 'bg-emerald-900 text-emerald-300'
                          : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-xs font-semibold flex items-center gap-1.5">
                      <span>{station.name}</span>
                      {station.id === 'ghum' && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-red-700 text-white">SUMMIT</span>
                      )}
                      {station.id === 'batasia' && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-600 text-white">LOOP</span>
                      )}
                    </div>
                    <div className="text-[10px] text-himalaya-mist">
                      {station.distanceKm} km • {station.elevationM} m ({station.nepaliName})
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-himalaya-amber">
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
