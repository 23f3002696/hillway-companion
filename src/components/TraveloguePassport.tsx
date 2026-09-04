import React, { useState, useEffect } from 'react';
import { DHR_STATIONS } from '../data/dhrStations';
import { 
  BookOpen, 
  PenTool, 
  Share2, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Trash2, 
  Stamp 
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
  const currentStation = DHR_STATIONS[currentStationIndex];
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

  // Save notes to localStorage
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
      id: Date.now().toString(),
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

  // On-Device Travelogue Synthesizer (Stitches notes, elevation, and stations into a narrative)
  const handleGenerateStory = () => {
    const visitedCount = currentStationIndex + 1;
    const peakAltitude = Math.max(...DHR_STATIONS.slice(0, visitedCount).map(s => s.elevationM));

    let story = `🚂 My 88 km Himalayan Journey on the UNESCO Darjeeling Toy Train!\n\n`;
    story += `Traversed ${visitedCount} stations from the plains to ${peakAltitude}m altitude at the summit.\n\n`;
    story += `🌟 Journey Highlights:\n`;

    if (notes.length > 0) {
      notes.forEach((n) => {
        story += `• At ${n.stationName}: "${n.text}"\n`;
      });
    } else {
      story += `• Climbed 2,158 vertical meters through tea slopes and pine ridges.\n`;
      story += `• Completed the famous Batasia Loop 360-degree spiral with Mt. Kanchenjunga on the horizon.\n`;
      story += `• Experienced the iconic B-class steam whistle echoing through mountain valleys.\n`;
    }

    story += `\n📍 Current Station: ${currentStation.name} (${currentStation.elevationM} m / ${currentStation.elevationFt} ft)\n`;
    story += `🏔️ Recorded 100% offline via Hillway Companion PWA #DHR #ToyTrain #DarjeelingHimalayanRailway`;

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
    <div className="space-y-4 pb-20">
      {/* Passport Heritage Stamp Collection */}
      <div
        className={`p-4 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-himalaya-forest/60 text-himalaya-amber">
              <Stamp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-inherit">DHR Heritage Passport</h2>
              <p className="text-xs text-himalaya-mist">
                Collect official station stamps along the 88 km route
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-himalaya-terracotta text-white">
            {currentStationIndex + 1} / 14 Stamps
          </span>
        </div>

        {/* Stamps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
          {DHR_STATIONS.map((st, idx) => {
            const isStamped = idx <= currentStationIndex;
            return (
              <div
                key={st.id}
                className={`p-2.5 rounded-xl border text-center transition-all relative overflow-hidden ${
                  isStamped
                    ? isSunlight
                      ? 'bg-neutral-100 border-2 border-black'
                      : 'bg-himalaya-forest/40 border-amber-500/60 shadow-sm'
                    : 'opacity-40 border-dashed border-inherit'
                }`}
              >
                {isStamped && (
                  <div className="absolute top-1 right-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                )}
                <div className="text-[10px] font-mono font-bold text-himalaya-mist">
                  STAMP #{idx + 1}
                </div>
                <div className="text-xs font-bold mt-0.5 text-inherit truncate">
                  {st.name.split(' ')[0]}
                </div>
                <div className="text-[10px] font-mono text-himalaya-amber">
                  {st.elevationM}m
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rough Notes Logger */}
      <div
        className={`p-4 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <PenTool className="w-4 h-4 text-himalaya-amber" />
          <h3 className="text-sm font-bold text-inherit">
            Jot Window Notes & Moments
          </h3>
        </div>

        <form onSubmit={handleAddNote} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Logging note at ${currentStation.name} (${currentStation.elevationM}m)...`}
              className={`w-full py-2 pl-3 pr-16 rounded-xl text-xs outline-none transition-all ${
                isSunlight
                  ? 'bg-neutral-100 text-black border-2 border-black placeholder:text-neutral-500'
                  : 'bg-[#0a120e] text-white border border-himalaya-border placeholder:text-neutral-500'
              }`}
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 px-2.5 py-1 rounded-lg text-xs font-bold disabled:opacity-30 ${
                isSunlight
                  ? 'bg-black text-white'
                  : 'bg-himalaya-pine text-white hover:bg-himalaya-forest'
              }`}
            >
              Add
            </button>
          </div>
        </form>

        {/* Existing Notes Feed */}
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-2.5 rounded-xl bg-black/20 border border-inherit flex items-start justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-1.5 text-[10px] text-himalaya-mist font-semibold">
                  <MapPin className="w-3 h-3 text-himalaya-emerald" />
                  <span>{note.stationName}</span>
                  <span>•</span>
                  <span>{note.timestamp}</span>
                </div>
                <p className="mt-1 text-inherit">{note.text}</p>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="p-1 text-neutral-500 hover:text-red-400 transition-all"
                title="Delete note"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Action: Generate Stitched Travelogue */}
        <div className="mt-4 pt-3 border-t border-inherit flex gap-2">
          <button
            onClick={handleGenerateStory}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isSunlight
                ? 'bg-black text-white hover:bg-neutral-800'
                : 'bg-himalaya-pine hover:bg-himalaya-forest text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-himalaya-amber" />
            <span>Generate On-Device Travelogue</span>
          </button>
        </div>
      </div>

      {/* Generated Travelogue Story Card */}
      {generatedStory && (
        <div
          className={`p-4 rounded-2xl transition-all ${
            isSunlight
              ? 'card-sunlight'
              : 'bg-himalaya-card border border-himalaya-border shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-2 border-inherit text-xs">
            <span className="font-bold text-himalaya-amber flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>Stitched Travelogue Card</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-himalaya-forest/50 text-himalaya-amber hover:bg-himalaya-forest disabled:opacity-50"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{isSharing ? "Sharing..." : isCopied ? "Copied!" : "Share Story"}</span>
              </button>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-black/20 border border-inherit text-xs whitespace-pre-wrap font-sans leading-relaxed text-inherit">
            {generatedStory}
          </div>
        </div>
      )}
    </div>
  );
};
