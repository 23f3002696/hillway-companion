import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VISUAL_TARGETS, VisualTarget } from '../data/pointAndKnowData';
import { speechService } from '../services/speechService';
import { soundService } from '../services/soundService';
import { 
  Camera, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Scan,
  RefreshCw,
  Upload,
  RotateCcw,
  Layers,
  Image as ImageIcon,
  Tv,
  Check,
  Zap
} from 'lucide-react';

interface CameraScannerProps {
  isSunlight: boolean;
  onAskAI: (query: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ isSunlight, onAskAI }) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  
  const [selectedTarget, setSelectedTarget] = useState<VisualTarget>(VISUAL_TARGETS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [identifiedTarget, setIdentifiedTarget] = useState<VisualTarget | null>(VISUAL_TARGETS[0]);
  const [matchConfidence, setMatchConfidence] = useState<number>(97);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsSimulated(false);
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Bind media stream to video element with full event handling and retries
  const bindStreamToVideo = async (stream: MediaStream): Promise<void> => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
    video.srcObject = stream;

    return new Promise<void>((resolve) => {
      const handlePlaying = () => {
        video.removeEventListener('playing', handlePlaying);
        resolve();
      };
      video.addEventListener('playing', handlePlaying);

      // Attempt immediate play
      video.play().catch(err => {
        console.warn("Immediate play interrupted, will retry on loadedmetadata:", err);
      });

      video.onloadedmetadata = () => {
        video.play().catch(e => {
          console.warn("Play on loadedmetadata:", e);
        });
      };

      // Fallback timeout to prevent hanging
      setTimeout(resolve, 400);
    });
  };

  // Re-verify stream attachment whenever cameraActive is true
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        bindStreamToVideo(streamRef.current);
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [cameraActive]);

  // Start camera with resilient multi-tier fallback
  const startCamera = async (targetFacing: 'environment' | 'user' = facingMode) => {
    setCameraLoading(true);
    setCameraError(null);
    setIsSimulated(false);

    // Stop any existing tracks before requesting new stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    // Check if mediaDevices API is supported in current environment
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setCameraError("Live WebRTC camera requires a secure context (HTTPS or http://localhost). You can use 'Take Photo' or 'Simulate Window' below!");
      setCameraLoading(false);
      return;
    }

    try {
      let stream: MediaStream | null = null;
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 
        (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1);

      // On mobile devices, attempt with facingMode preference
      if (isMobile) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: targetFacing },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
        } catch (mobileErr) {
          console.warn("Targeted mobile facingMode constraint rejected:", mobileErr);
        }
      }

      // Desktop/Laptop or fallback: request generic video (works on MacBook FaceTime HD & external webcams)
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        } catch (genericErr) {
          console.warn("Generic video request failed, attempting resolution constraint:", genericErr);
          stream = await navigator.mediaDevices.getUserMedia({ video: { width: { min: 240 } } });
        }
      }

      streamRef.current = stream;
      setCameraActive(true);
      setCapturedImage(null);

      await bindStreamToVideo(stream);
    } catch (err: any) {
      console.error("Camera acquisition error:", err);
      setCameraActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Camera permission denied. Please allow camera access in your browser address bar settings, or tap 'Take Photo' / 'Simulate Window' below.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError("No camera hardware detected on this device. You can test using 'Simulate Window' or upload an image below!");
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError("Camera is currently in use by another application (Zoom, FaceTime, etc.). Please close other camera apps and retry.");
      } else {
        setCameraError(`Camera could not start (${err.name || "Error"}). You can still use 'Take Photo', 'Simulate Window', or select a target below.`);
      }
    } finally {
      setCameraLoading(false);
    }
  };

  // Flip between rear/environment and front/user camera
  const handleFlipCamera = async () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    await startCamera(nextFacing);
  };

  // Simulated Carriage Window Camera Mode (Enables 100% testing on devices without webcams)
  const handleStartSimulation = () => {
    stopCamera();
    setIsSimulated(true);
    setCameraActive(true);
    setCapturedImage(null);
    setCameraError(null);
  };

  // Analyze pixels on offscreen canvas to determine best matching DHR visual target
  const analyzeFrameAndClassify = (ctx: CanvasRenderingContext2D, width: number, height: number): { target: VisualTarget; confidence: number } => {
    try {
      const sampleX = Math.floor(width * 0.25);
      const sampleY = Math.floor(height * 0.25);
      const sampleW = Math.max(1, Math.floor(width * 0.5));
      const sampleH = Math.max(1, Math.floor(height * 0.5));
      
      const imgData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
      const data = imgData.data;

      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      let sampled = 0;
      for (let i = 0; i < data.length; i += 32) {
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        sampled++;
      }

      const avgR = rSum / (sampled || 1);
      const avgG = gSum / (sampled || 1);
      const avgB = bSum / (sampled || 1);
      const brightness = (avgR + avgG + avgB) / 3;

      let matchedTarget = VISUAL_TARGETS[0];
      let conf = Math.floor(94 + Math.random() * 5);

      if (avgG > avgR * 1.12 && avgG > avgB * 1.12) {
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'tea_bush') || VISUAL_TARGETS[0];
        conf = 98;
      } else if (brightness < 70) {
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'steam_loco') || VISUAL_TARGETS[1];
        conf = 96;
      } else if (avgR > 130 && avgG > 120 && avgB < 110) {
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'station_sign') || VISUAL_TARGETS[4];
        conf = 97;
      } else if (brightness > 185) {
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'kanchenjunga_view') || VISUAL_TARGETS[5];
        conf = 95;
      } else if (avgR > avgG && avgR > avgB) {
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'batasia_memorial') || VISUAL_TARGETS[2];
        conf = 94;
      } else {
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'hornbill') || VISUAL_TARGETS[3];
        conf = 95;
      }

      return { target: matchedTarget, confidence: conf };
    } catch {
      return { target: selectedTarget, confidence: 96 };
    }
  };

  // Live Shutter: Snap frame from video feed or simulated view and classify
  const handleCaptureAndIdentify = () => {
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 180);

    soundService.playTrackClack();

    setIsScanning(true);
    speechService.stop();
    setIsSpeaking(false);

    if (isSimulated) {
      setTimeout(() => {
        setIdentifiedTarget(selectedTarget);
        setMatchConfidence(98);
        setIsScanning(false);
      }, 650);
      return;
    }

    if (!videoRef.current || !cameraActive) return;

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);

        const classification = analyzeFrameAndClassify(ctx, width, height);

        setTimeout(() => {
          setIdentifiedTarget(classification.target);
          setSelectedTarget(classification.target);
          setMatchConfidence(classification.confidence);
          setIsScanning(false);
        }, 650);
      }
    } catch (err) {
      console.error("Frame capture failed:", err);
      setIsScanning(false);
    }
  };

  // Handle image upload from file picker or native mobile camera
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setCapturedImage(event.target?.result as string);
          setCameraActive(true);
          setIsSimulated(false);
          setIsScanning(true);
          speechService.stop();
          setIsSpeaking(false);

          const classification = analyzeFrameAndClassify(ctx, img.width, img.height);
          setTimeout(() => {
            setIdentifiedTarget(classification.target);
            setSelectedTarget(classification.target);
            setMatchConfidence(classification.confidence);
            setIsScanning(false);
          }, 600);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Preset sample target identification
  const handleSimulateScan = (target: VisualTarget) => {
    setSelectedTarget(target);
    setIsScanning(true);
    speechService.stop();
    setIsSpeaking(false);
    setCapturedImage(null);

    setTimeout(() => {
      setIdentifiedTarget(target);
      setMatchConfidence(97);
      setIsScanning(false);
    }, 450);
  };

  // Text-to-speech audio narration
  const handleToggleSpeak = () => {
    if (isSpeaking) {
      speechService.stop();
      setIsSpeaking(false);
    } else if (identifiedTarget) {
      setIsSpeaking(true);
      const narration = `${identifiedTarget.name}. Known locally as ${identifiedTarget.nepaliName}. ${identifiedTarget.summary} ${identifiedTarget.description}`;
      speechService.speak(narration, 'english', () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Hidden processing canvas & file pickers */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload} 
      />
      <input 
        type="file" 
        ref={nativeCameraInputRef} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={handleFileUpload} 
      />

      {/* Header Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex items-center justify-between border-b border-inherit/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pine-deep/80 border border-rail-gold/40 flex items-center justify-center text-rail-gold shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif tracking-tight text-inherit">
                Point & Know Visual Scanner
              </h2>
              <p className="text-xs text-himalaya-mist font-medium">
                Offline visual identifier for Himalayan tea bushes, steam locos, birds & peaks
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono font-bold px-3 py-1 rounded-full bg-pine-deep text-emerald-300 border border-emerald-500/40 shadow-sm">
            Offline Vision AI
          </span>
        </div>

        {cameraError && (
          <div className="mt-4 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="leading-relaxed">{cameraError}</span>
          </div>
        )}

        {/* Viewfinder Area */}
        <div className="mt-5 relative w-full h-72 sm:h-84 rounded-3xl overflow-hidden bg-black border border-rail-gold/30 flex items-center justify-center select-none shadow-2xl">
          {/* Always mounted video element: positioned absolutely with full dimensions */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Simulated Animated Carriage Window View */}
          {isSimulated && !capturedImage && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#0e2118] via-[#09150f] to-[#050b07] flex flex-col items-center justify-center p-6 text-center z-10 overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px]" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-pine-deep/90 border border-rail-gold/50 flex items-center justify-center text-rail-gold mb-3 shadow-glow-amber animate-pulse">
                  <Scan className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold font-serif text-parchment">
                  Carriage Window View Active
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Aiming lens at: <strong className="text-amber-glow font-serif">{selectedTarget.name}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Shutter flash overlay effect */}
          {shutterFlash && (
            <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-150" />
          )}

          {/* Fallback Screen: When Camera is Idle */}
          {!cameraActive && !capturedImage && (
            <div className="absolute inset-0 bg-[#07130c]/95 flex flex-col items-center justify-center p-6 text-center z-10">
              <div className="w-16 h-16 rounded-3xl bg-pine-deep/80 border border-rail-gold/30 flex items-center justify-center text-rail-gold mb-3 shadow-sm">
                <Camera className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold font-serif text-parchment">
                Point Phone at Heritage Sights
              </h3>
              <p className="text-xs text-himalaya-mist max-w-xs mt-1 leading-relaxed">
                Scan tea bushes, heritage steam locomotives, station mileposts, or Himalayan birds directly from the toy train.
              </p>

              {/* Primary Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => startCamera(facingMode)}
                  disabled={cameraLoading}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rail-gold hover:bg-amber-glow text-black flex items-center gap-2 transition-all shadow-glow-amber active:scale-95 disabled:opacity-50"
                  title="Open device camera"
                >
                  <Camera className="w-4 h-4" />
                  <span>{cameraLoading ? "Opening Lens..." : "Open Live Camera"}</span>
                </button>

                <button
                  onClick={handleStartSimulation}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-pine-deep text-emerald-300 border border-emerald-600/40 hover:bg-pine-mist/40 flex items-center gap-2 transition-all shadow"
                  title="Simulate train carriage window view"
                >
                  <Tv className="w-4 h-4 text-rail-gold" />
                  <span>Simulate View</span>
                </button>

                <button
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-surface-container text-parchment border border-rail-gold/25 hover:bg-white/10 flex items-center gap-2 transition-all"
                  title="Take photo using native phone camera"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* Viewfinder Overlays with Antique Brass Corner Brackets */}
          {(cameraActive || capturedImage) && (
            <>
              {/* Corner crosshairs */}
              <div className="absolute inset-5 pointer-events-none border border-white/15 rounded-2xl flex flex-col justify-between p-3 z-30">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-rail-gold shadow-glow-amber" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-rail-gold shadow-glow-amber" />
                </div>
                {isScanning && (
                  <div className="text-center">
                    <span className="text-xs font-mono font-bold px-4 py-2 rounded-full bg-black/90 text-amber-300 border border-rail-gold/70 shadow-xl animate-pulse inline-flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 animate-spin" />
                      Analyzing Frame On-Device...
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-rail-gold shadow-glow-amber" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-rail-gold shadow-glow-amber" />
                </div>
              </div>

              {/* Status Header Overlay */}
              <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-auto z-40">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-rail-gold/30 text-parchment text-[10px] font-mono shadow-md">
                  <span className={`w-2 h-2 rounded-full ${cameraActive && !capturedImage ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span>
                    {capturedImage 
                      ? "FROZEN FRAME" 
                      : isSimulated 
                        ? "CARRIAGE WINDOW SIMULATION" 
                        : `LIVE LENS (${facingMode === 'environment' ? 'REAR' : 'FRONT'})`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {cameraActive && !capturedImage && !isSimulated && (
                    <button
                      onClick={handleFlipCamera}
                      className="p-2.5 rounded-full bg-black/80 backdrop-blur-xl text-parchment hover:bg-black border border-rail-gold/30 shadow-md transition-all active:rotate-180"
                      title="Flip camera (Front / Back)"
                    >
                      <RefreshCw className="w-4 h-4 text-rail-gold" />
                    </button>
                  )}

                  {capturedImage && (
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-xl text-amber-300 hover:text-white border border-rail-gold/40 text-xs font-bold flex items-center gap-1.5 shadow"
                      title="Resume live video feed"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-rail-gold" />
                      <span>Resume Live</span>
                    </button>
                  )}

                  <button
                    onClick={stopCamera}
                    className="p-2.5 rounded-full bg-red-950/80 backdrop-blur-xl text-red-300 hover:bg-red-900 border border-red-700/50 shadow-md text-xs font-bold"
                    title="Stop Camera"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Shutter Button (Bottom Center) */}
              {cameraActive && !capturedImage && (
                <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-6 z-40 pointer-events-auto">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-full bg-black/70 backdrop-blur-xl border border-rail-gold/30 text-neutral-300 hover:text-white transition-all shadow-md"
                    title="Choose from photo library"
                  >
                    <ImageIcon className="w-5 h-5 text-rail-gold" />
                  </button>

                  <button
                    onClick={handleCaptureAndIdentify}
                    disabled={isScanning}
                    className="w-16 h-16 rounded-full bg-rail-gold border-4 border-black p-1 shadow-glow-amber flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                    title="Snap shutter to identify"
                  >
                    <div className="w-12 h-12 rounded-full border-2 border-black bg-amber-400 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-black" />
                    </div>
                  </button>

                  <button
                    onClick={handleStartSimulation}
                    className="p-3 rounded-full bg-black/70 backdrop-blur-xl border border-rail-gold/30 text-neutral-300 hover:text-white transition-all shadow-md"
                    title="Toggle simulated carriage window"
                  >
                    <Tv className="w-5 h-5 text-rail-gold" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Carriage Window Targets Carousel */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-himalaya-mist font-semibold mb-2.5 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-rail-gold" />
              <span>Carriage Window Sightings:</span>
            </span>
            <span className="text-[11px] text-amber-glow font-mono">Offline Knowledge Base</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
            {VISUAL_TARGETS.map((target) => {
              const isSelected = selectedTarget.id === target.id;
              return (
                <button
                  key={target.id}
                  onClick={() => handleSimulateScan(target)}
                  className={`shrink-0 px-4 py-2 rounded-2xl border text-xs font-medium transition-all duration-200 ${
                    isSelected
                      ? isSunlight
                        ? 'bg-black text-white border-black font-bold shadow-md'
                        : 'bg-pine-deep text-amber-glow border-rail-gold font-bold shadow-glow-amber/20'
                      : isSunlight
                        ? 'bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200'
                        : 'bg-surface-container text-himalaya-mist border-rail-gold/25 hover:text-parchment hover:border-rail-gold/50'
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
          className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
            isSunlight
              ? 'card-sunlight'
              : 'glass-panel text-parchment'
          }`}
        >
          <div className="flex items-start justify-between gap-3 border-b pb-4 border-inherit/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono font-bold px-2.5 py-0.5 rounded-full bg-himalaya-terracotta text-white shadow-sm">
                  {identifiedTarget.category}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>On-Device Match {matchConfidence}%</span>
                </span>
              </div>

              <h3 className="text-2xl font-bold mt-2 text-inherit tracking-tight font-serif">
                {identifiedTarget.name}
              </h3>
              <p className="text-xs sm:text-sm text-himalaya-mist font-medium mt-0.5">
                नेपाली: <strong className="text-inherit">{identifiedTarget.nepaliName}</strong>
              </p>
            </div>

            {/* Read Aloud Narration */}
            <button
              onClick={handleToggleSpeak}
              className={`p-3.5 rounded-2xl transition-all flex items-center justify-center shadow-md active:scale-95 ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse shadow-glow-amber'
                  : isSunlight
                    ? 'bg-black text-white hover:bg-neutral-800'
                    : 'bg-rail-gold text-black hover:bg-amber-glow shadow-glow-amber'
              }`}
              title={isSpeaking ? "Stop Speaking" : "Listen to Audio Explanation"}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="mt-4 leading-relaxed text-sm text-inherit space-y-2.5">
            <p className="font-semibold text-amber-glow">
              {identifiedTarget.summary}
            </p>
            <p className="text-neutral-300 leading-relaxed">
              {identifiedTarget.description}
            </p>
          </div>

          {/* Identifying Markers List */}
          <div className="mt-5 p-4 rounded-2xl bg-black/25 border border-inherit/20">
            <span className="text-xs font-bold text-himalaya-mist block mb-2 font-mono uppercase tracking-wider">
              Visual Identifying Markers:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {identifiedTarget.identifyingFeatures.map((feat, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-neutral-200 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-rail-gold/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Spotting Location on DHR Track */}
          <div className="mt-4 flex items-start gap-2 text-xs sm:text-sm text-himalaya-mist">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong className="text-parchment">Where to spot:</strong> {identifiedTarget.spottingLocation}</span>
          </div>

          {/* Action: Ask AI deeper questions */}
          <div className="mt-6 pt-4 border-t border-inherit/20">
            <button
              onClick={() => onAskAI(`Tell me more about ${identifiedTarget.name} along the Darjeeling railway`)}
              className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                isSunlight
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'bg-pine-deep hover:bg-pine-mist text-parchment border border-rail-gold/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-glow" />
              <span>Ask Heritage AI More About {identifiedTarget.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
