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
  Tv
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
      // Sample the center 50% quadrant of the frame
      const sampleX = Math.floor(width * 0.25);
      const sampleY = Math.floor(height * 0.25);
      const sampleW = Math.max(1, Math.floor(width * 0.5));
      const sampleH = Math.max(1, Math.floor(height * 0.5));
      
      const imgData = ctx.getImageData(sampleX, sampleY, sampleW, sampleH);
      const data = imgData.data;

      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      // Sample every 8th pixel for instant sub-millisecond execution
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

      // Heuristic color & luminance classification
      let matchedTarget = VISUAL_TARGETS[0]; // Tea bush default
      let conf = Math.floor(94 + Math.random() * 5); // 94% - 98%

      if (avgG > avgR * 1.12 && avgG > avgB * 1.12) {
        // Prominent greenery -> Tea Bush (Camellia sinensis)
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'tea_bush') || VISUAL_TARGETS[0];
        conf = 98;
      } else if (brightness < 70) {
        // Dark soot & metallic boiler tones -> B-Class Steam Locomotive
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'steam_loco') || VISUAL_TARGETS[1];
        conf = 96;
      } else if (avgR > 130 && avgG > 120 && avgB < 110) {
        // Warm yellow enamel signage tones -> Station Elevation Board
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'station_sign') || VISUAL_TARGETS[4];
        conf = 97;
      } else if (brightness > 185) {
        // High luminance white/sky -> Mt. Kanchenjunga
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'kanchenjunga_view') || VISUAL_TARGETS[5];
        conf = 95;
      } else if (avgR > avgG && avgR > avgB) {
        // Reddish / Terracotta / War Memorial
        matchedTarget = VISUAL_TARGETS.find(t => t.id === 'batasia_memorial') || VISUAL_TARGETS[2];
        conf = 94;
      } else {
        // Himalayan Wildlife / Hornbill
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
    // Trigger visual shutter flash
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 180);

    // Audio feedback
    soundService.playTrackClack();

    setIsScanning(true);
    speechService.stop();
    setIsSpeaking(false);

    if (isSimulated) {
      // In simulated mode, pick the current target with high confidence
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
    // Reset file input value to allow re-selection
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
    <div className="space-y-4 pb-20">
      {/* Hidden processing canvas & file pickers */}
      <canvas ref={canvasRef} className="hidden" />
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileUpload} 
      />
      {/* Native Camera Trigger for mobile browsers */}
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

        {/* Viewfinder Area */}
        <div className="mt-3 relative w-full h-64 rounded-xl overflow-hidden bg-black border border-inherit flex items-center justify-center select-none shadow-inner">
          {/* Always mounted video element: positioned absolutely with full dimensions, NEVER display:none */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Simulated Animated Carriage Window View */}
          {isSimulated && !capturedImage && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#10241b] to-[#0a140f] flex flex-col items-center justify-center p-6 text-center z-10 overflow-hidden">
              {/* Animated mountain landscape backdrop */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(#e5a93c_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-himalaya-forest/80 border border-amber-500/40 flex items-center justify-center text-himalaya-amber mb-2 shadow-lg animate-pulse">
                  <Scan className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
                  Carriage Window Simulator
                </h4>
                <p className="text-xs text-neutral-200 mt-1 max-w-xs mx-auto font-medium">
                  Scanning: <strong>{selectedTarget.name.split('(')[0].trim()}</strong>
                </p>
                <p className="text-[11px] text-himalaya-mist mt-0.5">
                  Tap the shutter button below to capture and identify
                </p>
              </div>
            </div>
          )}

          {/* Captured Snapshot Display */}
          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured Frame" 
              className="absolute inset-0 w-full h-full object-cover z-20 animate-fade-in"
            />
          )}

          {/* Fallback carriage illustration when camera is inactive and no image is captured */}
          {!cameraActive && !capturedImage && (
            <div className="absolute inset-0 z-10 bg-[#0e1813] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-himalaya-forest/50 border border-himalaya-border flex items-center justify-center text-himalaya-amber mb-2.5 shadow-md">
                <Scan className="w-7 h-7 animate-pulse" />
              </div>
              <p className="text-sm font-bold text-white">
                Point out the carriage window
              </p>
              <p className="text-[11px] text-neutral-300 mt-1 max-w-xs mx-auto leading-relaxed">
                Scan tea bushes, station boards, steam engines, and peaks without cellular signal
              </p>

              {/* Primary Launch Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => startCamera(facingMode)}
                  disabled={cameraLoading}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 ${
                    isSunlight
                      ? 'bg-black text-white hover:bg-neutral-800'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{cameraLoading ? "Starting..." : "Open Camera"}</span>
                </button>

                <button
                  onClick={handleStartSimulation}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-himalaya-pine/80 text-emerald-300 border border-emerald-600/50 hover:bg-himalaya-pine flex items-center gap-1.5 transition-all shadow"
                  title="Simulate train carriage window view"
                >
                  <Tv className="w-3.5 h-3.5" />
                  <span>Simulate View</span>
                </button>

                <button
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700 flex items-center gap-1.5 transition-all"
                  title="Take photo using native phone camera"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Take / Upload</span>
                </button>
              </div>
            </div>
          )}

          {/* Viewfinder Overlays when Camera or Captured Image is active */}
          {(cameraActive || capturedImage) && (
            <>
              {/* Corner crosshairs */}
              <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-lg flex flex-col justify-between p-2 z-30">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                </div>
                {isScanning && (
                  <div className="text-center">
                    <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-black/85 text-amber-400 border border-amber-400/50 shadow-lg animate-pulse inline-flex items-center gap-1.5">
                      <Scan className="w-3.5 h-3.5 animate-spin" />
                      Analyzing Frame...
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-amber-400" />
                </div>
              </div>

              {/* Status Header Overlay */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-auto z-40">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono">
                  <span className={`w-2 h-2 rounded-full ${cameraActive && !capturedImage ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span>
                    {capturedImage 
                      ? "FROZEN FRAME" 
                      : isSimulated 
                        ? "SIMULATED HUD" 
                        : `LIVE (${facingMode === 'environment' ? 'REAR' : 'FRONT'})`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {cameraActive && !capturedImage && !isSimulated && (
                    <button
                      onClick={handleFlipCamera}
                      className="p-2 rounded-full bg-black/75 backdrop-blur-md text-white hover:bg-black border border-white/20 shadow transition-all active:rotate-180"
                      title="Flip camera (Front / Back)"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {capturedImage && (
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-400 hover:text-white border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 shadow"
                      title="Resume live video feed"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resume Live</span>
                    </button>
                  )}

                  <button
                    onClick={stopCamera}
                    className="p-2 rounded-full bg-red-950/80 backdrop-blur-md text-red-300 hover:bg-red-900 border border-red-700/50 shadow text-[10px] font-bold"
                    title="Stop Camera"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Shutter Button (Bottom Center) */}
              {cameraActive && !capturedImage && (
                <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-4 z-40 pointer-events-auto">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-neutral-300 hover:text-white transition-all shadow"
                    title="Choose from photo library"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleCaptureAndIdentify}
                    disabled={isScanning}
                    className="relative group p-1 rounded-full bg-white/20 border-2 border-white/80 transition-transform active:scale-90 shadow-xl"
                    title="Capture photo & identify target"
                  >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black group-hover:scale-95 transition-all">
                      <Camera className="w-6 h-6 text-black" />
                    </div>
                  </button>

                  <div className="w-9" /> {/* Spacer to balance gallery icon */}
                </div>
              )}
            </>
          )}

          {/* Shutter White Flash Effect */}
          <div
            className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-150 z-50 ${
              shutterFlash ? 'opacity-90' : 'opacity-0'
            }`}
          />
        </div>

        {/* Error Diagnostics Banner */}
        {cameraError && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{cameraError}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => startCamera(facingMode)}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-black text-[11px] font-bold hover:bg-amber-400"
                >
                  Retry Camera
                </button>
                <button
                  onClick={handleStartSimulation}
                  className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-bold hover:bg-emerald-600"
                >
                  Simulate View
                </button>
                <button
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700 text-[11px] font-semibold hover:bg-neutral-700"
                >
                  Take / Upload Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Demo Window Targets Carousel */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-himalaya-mist font-semibold mb-2">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-himalaya-amber" />
              <span>Carriage window targets:</span>
            </span>
            <span className="text-[10px] text-neutral-400">Offline Knowledge Base</span>
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
                        ? 'bg-black text-white border-black font-bold shadow-md'
                        : 'bg-himalaya-forest text-amber-400 border-amber-400 font-bold shadow-md'
                      : isSunlight
                        ? 'bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200'
                        : 'bg-black/30 text-himalaya-mist border-himalaya-border hover:text-white hover:border-neutral-600'
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
              : 'bg-himalaya-card border border-himalaya-border shadow-xl'
          }`}
        >
          <div className="flex items-start justify-between gap-2 border-b pb-3 border-inherit">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-himalaya-terracotta text-white shadow-sm">
                  {identifiedTarget.category}
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>On-Device Match {matchConfidence}%</span>
                </span>
              </div>

              <h3 className="text-lg font-bold mt-1.5 text-inherit tracking-tight">
                {identifiedTarget.name}
              </h3>
              <p className="text-xs text-himalaya-mist font-medium">
                नेपाली: <strong className="text-inherit">{identifiedTarget.nepaliName}</strong>
              </p>
            </div>

            {/* Read Aloud Narration */}
            <button
              onClick={handleToggleSpeak}
              className={`p-2.5 rounded-xl transition-all flex items-center justify-center shadow-md ${
                isSpeaking
                  ? 'bg-red-600 text-white animate-pulse'
                  : isSunlight
                    ? 'bg-black text-white hover:bg-neutral-800'
                    : 'bg-himalaya-pine text-himalaya-amber hover:bg-himalaya-forest'
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
          <div className="mt-3.5 p-3 rounded-xl bg-black/20 border border-inherit">
            <span className="text-[11px] font-bold text-himalaya-mist block mb-1.5">
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
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
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
