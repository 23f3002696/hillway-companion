import React, { useState, useEffect } from 'react';
import { DHR_STATIONS } from '../data/dhrStations';
import { 
  BookOpen, 
  PenTool, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Trash2, 
  Stamp,
  Copy
} from 'lucide-react';

interface TraveloguePassportProps {
  currentStationIndex: number;
  isSunlight: boolean;
}

interface NoteItem {
  id: string;
  stationId: string;
  stationName: string;
  text: string;
  timestamp: string;
}

export const TraveloguePassport: React.FC<TraveloguePassportProps> = ({
  currentStationIndex,
  isSunlight
}) => {
  const currentStation = DHR_STATIONS[currentStationIndex] || DHR_STATIONS[0];
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('hillway_travelogue_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: "init-1",
          stationId: "sukna",
          stationName: "Sukna (163m)",
          text: "Train just entered the dense Sal forests of Mahananda Sanctuary. Mountain air feels crisp!",
          timestamp: "Departure + 45m"
        },
        {
          id: "init-2",
          stationId: "kurseong",
          stationName: "Kurseong (1,483m)",
          text: "Train is literally running right through the bazaar street. Steaming hot momos and cardamom tea on the platform!",
          timestamp: "Halfway Halt"
        }
      ];
    } catch {
      return [];
    }
  });

  const [newNote, setNewNote] = useState<string>('');
  const [generatedStory, setGeneratedStory] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSharing, setIsSharing] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('hillway_travelogue_notes', JSON.stringify(notes));
    } catch {
      // Ignore
    }
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteItem: NoteItem = {
      id: `note-${Date.now()}`,
      stationId: currentStation.id,
      stationName: `${currentStation.name} (${currentStation.elevationM}m)`,
      text: newNote.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotes([noteItem, ...notes]);
    setNewNote('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleGenerateStory = () => {
    const visitedCount = currentStationIndex + 1;
    const peakAltitude = Math.max(...DHR_STATIONS.slice(0, visitedCount).map(s => s.elevationM));

    let story = `🚂 My 88 km Himalayan Journey on the UNESCO Darjeeling Toy Train!\n\n`;
    story += `Traversed ${visitedCount} of 14 stations from the Bengal plains to ${peakAltitude}m altitude at the Himalayan summit.\n\n`;
    story += `🌟 Real-Time Journey Highlights:\n`;

    if (notes.length > 0) {
      notes.forEach((n) => {
        story += `• At ${n.stationName}: "${n.text}"\n`;
      });
    } else {
      story += `• Climbed 2,158 vertical meters through terraced tea slopes and cloud pine ridges.\n`;
      story += `• Completed the famous Batasia Loop 360-degree spiral with Mt. Kanchenjunga on the northern horizon.\n`;
      story += `• Experienced the iconic B-class steam whistle echoing through mountain valleys.\n`;
    }

    story += `\n📍 Current Station: ${currentStation.name} (${currentStation.elevationM} m / ${currentStation.elevationFt} ft)\n`;
    story += `🏔️ Logged 100% offline via Hillway Companion #DHR #ToyTrain #UNESCO`;

    setGeneratedStory(story);
  };

  const handleShare = async () => {
    if (!generatedStory) handleGenerateStory();
    const textToShare = generatedStory || "My DHR Himalayan Toy Train Journey with Hillway Companion";

    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: "My Darjeeling Himalayan Railway Travelogue",
          text: textToShare
        });
      } catch {
        // Dismissed
      } finally {
        setIsSharing(false);
      }
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Passport Heritage Stamp Collection */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex items-center justify-between border-b border-inherit/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-pine-deep/80 border border-rail-gold/40 flex items-center justify-center text-rail-gold shadow-sm">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif tracking-tight text-inherit">
                DHR Railway Travelogue & Passport
              </h2>
              <p className="text-xs text-himalaya-mist font-medium">
                Collect official postal cancellation stamps across 14 mountain stations
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-pine-deep text-amber-300 border border-rail-gold/40 shadow-sm">
            {currentStationIndex + 1} / 14 Stations
          </span>
        </div>

        {/* Stamps Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 max-h-80 overflow-y-auto pr-1">
          {DHR_STATIONS.map((st, idx) => {
            const isStamped = idx <= currentStationIndex;
            return (
              <div
                key={st.id}
                className={`p-3.5 rounded-2xl border text-center transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  isStamped
                    ? isSunlight
                      ? 'bg-neutral-100 border-2 border-black shadow-sm'
                      : 'bg-gradient-to-b from-pine-deep/60 via-[#0e2118] to-surface-container border-rail-gold/60 shadow-glow-amber/10'
                    : 'opacity-40 border-dashed border-neutral-700 bg-black/20'
                }`}
              >
                {isStamped && (
                  <div className="absolute top-1.5 right-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}
                <div className="text-[10px] font-mono font-bold text-himalaya-mist">
                  HALT #{idx + 1}
                </div>
                <div className="text-xs font-bold mt-1 text-inherit truncate font-serif">
                  {st.name.split(' ')[0]}
                </div>
                <div className="text-[11px] font-mono font-bold text-amber-glow mt-0.5">
                  {st.elevationM}m
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rough Notes Logger */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex items-center gap-2 mb-4 border-b border-inherit/20 pb-3">
          <PenTool className="w-4 h-4 text-rail-gold" />
          <h3 className="text-base font-bold text-inherit font-serif">
            Jot Window Notes & Passenger Memories
          </h3>
        </div>

        <form onSubmit={handleAddNote} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Logging note at ${currentStation.name} (${currentStation.elevationM}m)...`}
              className={`w-full py-3.5 pl-4 pr-24 rounded-2xl text-xs sm:text-sm outline-none transition-all duration-200 shadow-inner ${
                isSunlight
                  ? 'bg-neutral-100 text-black border-2 border-black placeholder:text-neutral-500 focus:bg-white'
                  : 'bg-[#08150f] text-parchment border border-rail-gold/30 focus:border-amber-glow placeholder:text-neutral-500'
              }`}
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-30 transition-all ${
                isSunlight
                  ? 'bg-black text-white'
                  : 'bg-rail-gold hover:bg-amber-glow text-black shadow-glow-amber'
              }`}
            >
              Add Note
            </button>
          </div>
        </form>

        {/* Existing Notes Feed */}
        <div className="mt-5 space-y-3 max-h-56 overflow-y-auto pr-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-2xl bg-black/30 border border-inherit/20 flex items-start justify-between gap-3 text-xs sm:text-sm shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] text-himalaya-mist font-semibold font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{note.stationName}</span>
                  <span>•</span>
                  <span>{note.timestamp}</span>
                </div>
                <p className="mt-1 text-inherit leading-relaxed font-serif italic text-neutral-200">"{note.text}"</p>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="p-1 text-neutral-500 hover:text-red-400 transition-all"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Action: Generate Stitched Travelogue */}
        <div className="mt-6 pt-4 border-t border-inherit/20">
          <button
            onClick={handleGenerateStory}
            className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
              isSunlight
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-rail-gold hover:bg-amber-glow text-black shadow-glow-amber'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate On-Device Travelogue Narrative</span>
          </button>
        </div>
      </div>

      {/* Generated Travelogue Story Card */}
      {generatedStory && (
        <div
          className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
            isSunlight
              ? 'card-sunlight'
              : 'glass-panel text-parchment'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3.5 border-inherit/20 text-xs">
            <span className="font-bold text-amber-glow flex items-center gap-1.5 font-serif text-base">
              <BookOpen className="w-4 h-4 text-rail-gold" />
              <span>Stitched Travelogue Card</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rail-gold text-black hover:bg-amber-glow disabled:opacity-50 transition-all shadow-sm"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isSharing ? "Sharing..." : isCopied ? "Copied!" : "Share / Copy"}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 p-5 rounded-2xl bg-black/30 border border-inherit/20 text-xs sm:text-sm whitespace-pre-wrap font-serif leading-relaxed text-inherit">
            {generatedStory}
          </div>
        </div>
      )}
    </div>
  );
};
