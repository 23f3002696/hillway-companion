import React, { useState, useEffect } from 'react';
import { HIMALAYAN_PEAKS, PeakInfo } from '../data/himalayanPeaks';
import { Compass, Mountain, Navigation, Eye, MapPin } from 'lucide-react';

interface PeakCompassProps {
  isSunlight: boolean;
}

export const PeakCompass: React.FC<PeakCompassProps> = ({ isSunlight }) => {
  const [heading, setHeading] = useState<number>(345); // Default facing Kanchenjunga
  const [isHardwareCompass, setIsHardwareCompass] = useState<boolean>(false);
  const [selectedPeak, setSelectedPeak] = useState<PeakInfo>(HIMALAYAN_PEAKS[0]);

  // Listen to DeviceOrientation if available
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const webkitHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      if (typeof webkitHeading === 'number') {
        setHeading(Math.round(webkitHeading));
        setIsHardwareCompass(true);
      } else if (e.alpha !== null) {
        setHeading(Math.round(360 - e.alpha));
        setIsHardwareCompass(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const getBearingDelta = (peakBearing: number, currentHeading: number) => {
    let diff = peakBearing - currentHeading;
    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;
    return diff;
  };

  const getCardinalDirection = (deg: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx];
  };

  const alignedPeak = HIMALAYAN_PEAKS.find((p) => {
    const delta = Math.abs(getBearingDelta(p.bearingDeg, heading));
    return delta <= 18;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Compass HUD Panel with Stitch Brass Surveyor Aesthetic */}
      <div
        className={`p-6 sm:p-8 rounded-3xl text-center transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-himalaya-mist mb-3 border-b border-inherit/20 pb-3">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider font-serif">
            <Compass className="w-4 h-4 text-rail-gold" />
            <span>Himalayan Peak Sightline Instrument</span>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-black/40 border border-rail-gold/30 shadow-sm text-amber-300">
            {isHardwareCompass ? "Gyro Compass Active" : "Interactive Dial"}
          </span>
        </div>

        {/* Big Heading Display */}
        <div className="my-2">
          <div className="text-4xl sm:text-6xl font-extrabold tracking-tight text-amber-glow font-mono text-glow">
            {heading}°
            <span className="text-xl sm:text-3xl ml-3 font-serif text-parchment font-bold">
              {getCardinalDirection(heading)}
            </span>
          </div>

          {/* Active Peak Tag */}
          <div className="mt-2 h-8 flex items-center justify-center">
            {alignedPeak ? (
              <span className="text-xs font-bold font-mono px-4 py-1.5 rounded-full bg-rail-gold text-black animate-bounce flex items-center gap-1.5 shadow-glow-amber">
                <Eye className="w-4 h-4" />
                <span>Locked Sightline: {alignedPeak.name} ({alignedPeak.elevationM}m)</span>
              </span>
            ) : (
              <span className="text-xs text-neutral-400 font-medium">
                Aim device towards horizon or slide dial below to lock peaks
              </span>
            )}
          </div>
        </div>

        {/* Visual Rotating Compass Dial */}
        <div className="relative w-56 h-56 mx-auto my-6 flex items-center justify-center">
          {/* Outer Brass Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-pine-deep/80 shadow-[inset_0_4px_18px_rgba(0,0,0,0.7)] bg-[#0a150e]" />
          <div className="absolute inset-2 rounded-full border border-dashed border-rail-gold/30" />
          
          {/* Subtle radar sweep glow */}
          <div className="absolute inset-4 rounded-full border border-amber-500/20 shadow-glow-amber/15" />

          {/* Rotating Compass Disc */}
          <div
            className="w-full h-full rounded-full relative transition-transform duration-300 flex items-center justify-center"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* Cardinal marks */}
            <span className="absolute top-3 font-serif font-extrabold text-red-500 text-xs tracking-wider">N</span>
            <span className="absolute right-3.5 font-serif font-bold text-parchment text-xs">E</span>
            <span className="absolute bottom-3 font-serif font-bold text-parchment text-xs">S</span>
            <span className="absolute left-3.5 font-serif font-bold text-parchment text-xs">W</span>

            {/* Peak Markers on the rotating ring */}
            {HIMALAYAN_PEAKS.map((peak) => {
              const rad = ((peak.bearingDeg - 90) * Math.PI) / 180;
              const radius = 88; // px from center
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;

              const isThisAligned = alignedPeak?.id === peak.id;

              return (
                <div
                  key={peak.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`
                  }}
                  title={`${peak.name} (${peak.bearingDeg}°)`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border border-white flex items-center justify-center transition-all ${
                      isThisAligned ? 'bg-amber-400 scale-125 shadow-glow-amber' : 'bg-emerald-600'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fixed center pointer needle */}
          <div className="absolute pointer-events-none flex flex-col items-center z-20">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[20px] border-b-red-500 filter drop-shadow(0 0 6px rgba(239,68,68,0.6))" />
            <div className="w-3.5 h-3.5 rounded-full bg-rail-gold border-2 border-black -mt-1 shadow-md" />
          </div>
        </div>

        {/* Manual Heading Slider */}
        <div className="pt-2 px-4 max-w-md mx-auto">
          <div className="flex justify-between text-[11px] text-himalaya-mist font-mono mb-2">
            <span>0° N</span>
            <span>90° E</span>
            <span>180° S</span>
            <span>270° W</span>
            <span>360° N</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={heading}
            onChange={(e) => {
              setHeading(parseInt(e.target.value, 10));
              setIsHardwareCompass(false);
            }}
            className="w-full accent-amber-500 cursor-pointer h-2.5 bg-neutral-800 rounded-lg"
          />
        </div>
      </div>

      {/* Sacred Peaks Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-rail-gold" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-himalaya-mist font-serif">
              Himalayan Summits in Sightline
            </h3>
          </div>
          <span className="text-xs text-himalaya-mist font-mono">Tap any peak to calibrate dial</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HIMALAYAN_PEAKS.map((peak) => {
            const delta = getBearingDelta(peak.bearingDeg, heading);
            const isCurrentTarget = selectedPeak.id === peak.id;
            const isLookingAtIt = Math.abs(delta) <= 15;

            return (
              <div
                key={peak.id}
                onClick={() => {
                  setSelectedPeak(peak);
                  setHeading(peak.bearingDeg);
                  setIsHardwareCompass(false);
                }}
                className={`p-5 rounded-3xl cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSunlight
                    ? 'card-sunlight'
                    : isLookingAtIt
                      ? 'glass-panel border-2 border-rail-gold text-parchment shadow-glow-amber/30'
                      : isCurrentTarget
                        ? 'glass-panel border-2 border-emerald-500/70 text-parchment'
                        : 'glass-panel text-parchment hover:border-rail-gold/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Mountain className="w-4 h-4 text-rail-gold shrink-0" />
                        <h4 className="text-base font-bold text-inherit font-serif">{peak.name}</h4>
                      </div>
                      <div className="text-xs text-himalaya-mist mt-0.5 font-medium">
                        {peak.nepaliName} • {peak.distanceKmFromDarjeeling} km line of sight
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-mono font-bold text-amber-glow">
                        {peak.elevationM.toLocaleString()} m
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        Bearing: {peak.bearingDeg}° ({getCardinalDirection(peak.bearingDeg)})
                      </div>
                    </div>
                  </div>

                  <p className="text-xs mt-3 text-neutral-300 leading-relaxed">
                    {peak.significance}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-inherit/20 flex items-center justify-between text-xs">
                  <span className="text-himalaya-mist flex items-center gap-1.5 truncate mr-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">View: {peak.bestViewpoints.join(', ')}</span>
                  </span>
                  <span className="font-bold text-amber-glow flex items-center gap-1 shrink-0 font-mono">
                    <span>Lock Bearing</span>
                    <Navigation className="w-3.5 h-3.5" />
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
