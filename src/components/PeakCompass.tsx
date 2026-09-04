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
      // iOS webkitCompassHeading or standard alpha
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

  // Compute angular delta to peak (-180 to +180)
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

  // Find peak closest to current heading
  const alignedPeak = HIMALAYAN_PEAKS.find((p) => {
    const delta = Math.abs(getBearingDelta(p.bearingDeg, heading));
    return delta <= 18;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Compass HUD */}
      <div
        className={`p-5 rounded-2xl text-center transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border shadow-lg'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-himalaya-mist mb-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-himalaya-amber" />
            <span>Peak Orientation Compass</span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/30 border border-inherit">
            {isHardwareCompass ? "Device Sensors Active" : "Interactive Dial"}
          </span>
        </div>

        {/* Big Heading Display */}
        <div className="my-3">
          <div className="text-4xl font-extrabold tracking-tight text-himalaya-amber font-mono">
            {heading}°
            <span className="text-lg ml-1.5 font-sans text-inherit">
              {getCardinalDirection(heading)}
            </span>
          </div>

          {/* Active Peak Tag */}
          <div className="mt-1 h-6 flex items-center justify-center">
            {alignedPeak ? (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white animate-bounce flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>Facing: {alignedPeak.name} ({alignedPeak.elevationM}m)</span>
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400">
                Point phone towards snow peaks or slide compass below
              </span>
            )}
          </div>
        </div>

        {/* Visual Rotating Compass Dial */}
        <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center">
          {/* Compass outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-inherit border-dashed opacity-40" />

          {/* Rotating Compass Disc */}
          <div
            className="w-full h-full rounded-full border-2 border-inherit relative transition-transform duration-300 flex items-center justify-center"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* Cardinal marks */}
            <span className="absolute top-2 font-bold text-red-500 text-xs">N</span>
            <span className="absolute right-2 font-bold text-inherit text-xs">E</span>
            <span className="absolute bottom-2 font-bold text-inherit text-xs">S</span>
            <span className="absolute left-2 font-bold text-inherit text-xs">W</span>

            {/* Peak Markers on the rotating ring */}
            {HIMALAYAN_PEAKS.map((peak) => {
              const rad = ((peak.bearingDeg - 90) * Math.PI) / 180;
              const radius = 76; // px from center
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
                    className={`w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center ${
                      isThisAligned ? 'bg-amber-400 scale-125' : 'bg-emerald-600'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fixed center pointer needle */}
          <div className="absolute pointer-events-none flex flex-col items-center">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] border-b-red-500" />
            <div className="w-2 h-2 rounded-full bg-red-600 border border-white mt-0.5" />
          </div>
        </div>

        {/* Manual Heading Slider for Desktop or Testing */}
        <div className="pt-2 px-4">
          <div className="flex justify-between text-[10px] text-himalaya-mist font-mono mb-1">
            <span>0° North</span>
            <span>180° South</span>
            <span>360° North</span>
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
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Sacred Peaks Roster */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-himalaya-mist">
            Visible Himalayan Summits
          </h3>
          <span className="text-[11px] text-himalaya-mist">Tap to orient</span>
        </div>

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
              className={`p-4 rounded-2xl cursor-pointer transition-all ${
                isSunlight
                  ? 'card-sunlight'
                  : isLookingAtIt
                    ? 'bg-himalaya-forest/90 border-2 border-amber-400 shadow-md'
                    : isCurrentTarget
                      ? 'bg-himalaya-card border-2 border-himalaya-emerald'
                      : 'bg-himalaya-card border border-himalaya-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-himalaya-amber shrink-0" />
                    <h4 className="text-base font-bold text-inherit">{peak.name}</h4>
                  </div>
                  <div className="text-xs text-himalaya-mist mt-0.5 font-medium">
                    {peak.nepaliName} • {peak.distanceKmFromDarjeeling} km line of sight
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-mono font-bold text-himalaya-amber">
                    {peak.elevationM.toLocaleString()} m
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Bearing: {peak.bearingDeg}° ({getCardinalDirection(peak.bearingDeg)})
                  </div>
                </div>
              </div>

              <p className="text-xs mt-2.5 text-neutral-300 leading-relaxed">
                {peak.significance}
              </p>

              <div className="mt-3 pt-2 border-t border-inherit flex items-center justify-between text-[11px]">
                <span className="text-himalaya-mist flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-himalaya-emerald" />
                  <span>Best seen from: {peak.bestViewpoints.join(', ')}</span>
                </span>
                <span className="font-bold text-himalaya-amber flex items-center gap-0.5">
                  <span>Aim Compass</span>
                  <Navigation className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
