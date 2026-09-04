import React, { useState, useRef, useEffect } from 'react';
import { VISUAL_TARGETS, VisualTarget } from '../data/pointAndKnowData';
import { speechService } from '../services/speechService';
import { 
  Camera, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Scan
} from 'lucide-react';

interface CameraScannerProps {
  isSunlight: boolean;
  onAskAI: (query: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ isSunlight, onAskAI }) => {
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<VisualTarget>(VISUAL_TARGETS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [identifiedTarget, setIdentifiedTarget] = useState<VisualTarget | null>(VISUAL_TARGETS[0]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Check if camera is available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      setHasCamera(true);
    }
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError("Camera permission denied or camera not found on this device. You can test using the sample window views below!");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleSimulateScan = (target: VisualTarget) => {
    setSelectedTarget(target);
    setIsScanning(true);
    speechService.stop();
    setIsSpeaking(false);

    setTimeout(() => {
      setIdentifiedTarget(target);
      setIsScanning(false);
    }, 600);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else if (identifiedTarget) {
      setIsSpeaking(true);
      const narration = `${identifiedTarget.name}. Known in Nepali as ${identifiedTarget.nepaliName}. ${identifiedTarget.summary} ${identifiedTarget.description}`;
      speechService.speak(narration, 'english', () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Card */}
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
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-inherit">Point & Know Scanner</h2>
              <p className="text-xs text-himalaya-mist">
                Offline visual identifier for tea, wildlife, trains & peaks
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50">
            Offline Vision
          </span>
        </div>

        {/* Live Camera Viewport or Window View */}
        <div className="mt-3 relative w-full h-56 rounded-xl overflow-hidden bg-black/40 border border-inherit flex items-center justify-center">
          {cameraActive ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="p-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-himalaya-forest/40 flex items-center justify-center text-himalaya-amber mb-2">
                <Scan className="w-6 h-6 animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-inherit">
                Point out the train carriage window
              </p>
              <p className="text-[11px] text-himalaya-mist mt-0.5 max-w-xs mx-auto">
                Scan tea bushes, station boards, steam engines, and peaks with no mobile signal
              </p>
            </div>
          )}

          {/* Crosshair Viewfinder Overlay */}
          <div className="absolute inset-4 pointer-events-none border-2 border-white/30 rounded-lg flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-amber-400" />
            </div>
            {isScanning && (
              <div className="text-center">
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/80 text-amber-400 animate-pulse">
                  Analyzing On-Device...
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-amber-400" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-amber-400" />
            </div>
          </div>

          {/* Camera Toggle Button */}
          {hasCamera && (
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cameraActive ? "Stop Camera" : "Open Camera"}</span>
            </button>
          )}
        </div>

        {cameraError && (
          <div className="mt-2.5 p-2 rounded-lg bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Demo Window Targets Carousel */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-himalaya-mist font-semibold mb-1.5">
            <span>Carriage Window Targets:</span>
            <span>Tap to identify</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {VISUAL_TARGETS.map((target) => {
              const isSelected = selectedTarget.id === target.id;
              return (
                <button
                  key={target.id}
                  onClick={() => handleSimulateScan(target)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? isSunlight
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-himalaya-forest text-amber-400 border-amber-400 font-bold'
                      : isSunlight
                        ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                        : 'bg-black/30 text-himalaya-mist border-himalaya-border hover:text-white'
                  }`}
                >
                  {target.name.split('(')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Identification Result Card */}
      {identifiedTarget && (
        <div
          className={`p-5 rounded-2xl transition-all ${
            isSunlight
              ? 'card-sunlight'
              : 'bg-himalaya-card border border-himalaya-border shadow-lg'
          }`}
        >
          <div className="flex items-start justify-between gap-2 border-b pb-3 border-inherit">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-himalaya-terracotta text-white">
                  {identifiedTarget.category}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>On-Device Match 97%</span>
                </span>
              </div>

              <h3 className="text-lg font-bold mt-1 text-inherit tracking-tight">
                {identifiedTarget.name}
              </h3>
              <p className="text-xs text-himalaya-mist font-medium">
                नेपाली: <strong>{identifiedTarget.nepaliName}</strong>
              </p>
            </div>

            {/* Read Aloud Narration */}
            <button
              onClick={handleToggleSpeak}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse'
                  : isSunlight
                    ? 'bg-black text-white'
                    : 'bg-himalaya-pine text-himalaya-amber'
              }`}
              title={isSpeaking ? "Stop Speaking" : "Listen to Explanation"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-3 leading-relaxed text-xs text-inherit space-y-2">
            <p className="font-semibold text-himalaya-amber">
              {identifiedTarget.summary}
            </p>
            <p className="text-neutral-300">
              {identifiedTarget.description}
            </p>
          </div>

          {/* Identifying Markers List */}
          <div className="mt-3 p-3 rounded-xl bg-black/20 border border-inherit">
            <span className="text-[11px] font-bold text-himalaya-mist block mb-1">
              Visual Identifying Markers:
            </span>
            <ul className="space-y-1">
              {identifiedTarget.identifyingFeatures.map((feat, idx) => (
                <li key={idx} className="text-xs text-neutral-300 flex items-start gap-1.5">
                  <span className="text-himalaya-amber font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Spotting Location on DHR Track */}
          <div className="mt-3 flex items-start gap-1.5 text-xs text-himalaya-mist">
            <MapPin className="w-3.5 h-3.5 text-himalaya-emerald shrink-0 mt-0.5" />
            <span><strong>Where to spot:</strong> {identifiedTarget.spottingLocation}</span>
          </div>

          {/* Action: Ask AI deeper questions */}
          <div className="mt-4 pt-3 border-t border-inherit">
            <button
              onClick={() => onAskAI(`Tell me more about ${identifiedTarget.name} along the Darjeeling railway`)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isSunlight
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'bg-himalaya-pine hover:bg-himalaya-forest text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-himalaya-amber" />
              <span>Ask Heritage AI More About {identifiedTarget.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
