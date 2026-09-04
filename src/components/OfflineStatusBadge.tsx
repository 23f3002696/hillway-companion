import React, { useState, useEffect } from 'react';
import { WifiOff, ShieldCheck, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const OfflineStatusBadge: React.FC<{ isSunlight: boolean }> = ({ isSunlight }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Offline Guarantee Pill */}
      <div 
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
          isSunlight 
            ? 'badge-sunlight border border-black' 
            : !isOnline
              ? 'bg-amber-900/40 text-amber-300 border border-amber-600/40'
              : 'bg-himalaya-forest/60 text-himalaya-snow border border-himalaya-border'
        }`}
        title="Works 100% offline in Airplane Mode with pre-cached local RAG and phrase audio"
      >
        {!isOnline ? (
          <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        ) : (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        )}
        <span>{!isOnline ? "Zero Bars (Airplane Mode)" : "100% Offline Ready"}</span>
      </div>

      {/* PWA Install Button */}
      {deferredPrompt && !installed && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-sm ${
            isSunlight
              ? 'bg-red-700 text-white hover:bg-red-800'
              : 'bg-himalaya-tea hover:bg-himalaya-amber text-himalaya-dark'
          }`}
        >
          <Download className="w-3 h-3" />
          <span>Install App</span>
        </button>
      )}
    </div>
  );
};

