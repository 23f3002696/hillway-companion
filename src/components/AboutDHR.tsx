import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

interface AboutDHRProps {
  isSunlight: boolean;
}

export const AboutDHR: React.FC<AboutDHRProps> = ({ isSunlight }) => {
  return (
    <div className="space-y-6 pb-24">
      {/* UNESCO Heritage Hero Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex items-center gap-2 text-rail-gold text-xs font-bold uppercase tracking-widest font-mono">
          <Award className="w-4 h-4" />
          <span>UNESCO World Heritage Site (Inscribed 1999)</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-inherit tracking-tight font-serif">
          Darjeeling Himalayan Railway
        </h2>
        <p className="text-xs sm:text-sm text-himalaya-mist mt-1 font-mono">
          Opened 1881 • 88 km (55 miles) • 2 ft (610 mm) Narrow Gauge • 2,258m Summit at Ghum
        </p>

        <div className="mt-5 p-5 rounded-2xl bg-black/30 border border-rail-gold/30 font-serif italic text-sm sm:text-base leading-relaxed text-neutral-200">
          "The Darjeeling Himalayan Railway is the first, and is still the most outstanding, example of a hill passenger railway. Opened in 1881, its design applies bold and ingenious engineering solutions to the problem of establishing an effective rail link across a mountainous terrain of great beauty."
        </div>
        <p className="text-xs mt-2.5 text-amber-glow font-mono text-right">
          — UNESCO World Heritage Committee Citation, 1999
        </p>
      </div>

      {/* The 4 Engineering Feats */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <div className="flex items-center gap-2 mb-4 border-b border-inherit/20 pb-3">
          <Award className="w-4 h-4 text-rail-gold" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-himalaya-mist font-serif">
            The 4 Revolutionary Engineering Marvels of the DHR
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/30 border border-inherit/20 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-amber-glow font-serif">
                1. 2-Foot (610 mm) Narrow Gauge
              </h4>
              <p className="text-xs mt-2 text-neutral-300 leading-relaxed">
                Standard trains require vast turning curves that would demand dozens of cost-prohibitive tunnels. Adopting the 2ft gauge allowed tracks to wrap around razor-sharp 43-foot (13m) curve radiuses along cliffs.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-inherit/20 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-emerald-400 font-serif">
                2. Spirals & Batasia Loop (1919)
              </h4>
              <p className="text-xs mt-2 text-neutral-300 leading-relaxed">
                To conquer sudden steep cliff faces without exceeding the engine's 1-in-20 adhesion limit, engineers created complete 360° spiral loops where the track crosses over itself on a viaduct.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-inherit/20 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-rail-gold font-serif">
                3. Six Z-Reverse Switchbacks
              </h4>
              <p className="text-xs mt-2 text-neutral-300 leading-relaxed">
                Where even loops could not fit against vertical rock, trains pull into dead-end spurs, flip switch points, and reverse backwards up the mountain slope to gain 30-50 vertical feet in minutes.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/30 border border-inherit/20 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-amber-300 font-serif">
                4. Glasgow B-Class Locomotives
              </h4>
              <p className="text-xs mt-2 text-neutral-300 leading-relaxed">
                Built between 1889 and 1925 in Glasgow, Scotland, these iconic 0-4-0ST saddle-tank engines are kept in steam to this day by master craftsmen at the Tindharia railway workshop.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Zero-Signal Tips */}
      <div
        className={`p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
          isSunlight
            ? 'card-sunlight'
            : 'glass-panel text-parchment'
        }`}
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-himalaya-mist mb-4 flex items-center gap-2 font-serif border-b border-inherit/20 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Himalayan Passenger Zero-Signal Guidance</span>
        </h3>

        <ul className="space-y-3 text-xs sm:text-sm text-neutral-200">
          <li className="flex items-start gap-2.5">
            <span className="text-rail-gold font-bold text-base leading-none">•</span>
            <span><strong>Always carry cash:</strong> Zero mobile signal between Sukna and Sonada means UPI and digital QR payments fail on platforms and tea stalls.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-rail-gold font-bold text-base leading-none">•</span>
            <span><strong>Altitude adjustment:</strong> Ghum summit stands at 2,258 m (7,408 ft). Sip warm water or cardamom ginger tea to avoid mild altitude headaches.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-rail-gold font-bold text-base leading-none">•</span>
            <span><strong>Warm layers ready:</strong> Siliguri plains can be 32°C and humid, whereas Ghum and Darjeeling frequently drop to 5–12°C with dense mountain mist.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-rail-gold font-bold text-base leading-none">•</span>
            <span><strong>Respect local communities:</strong> Greet stall owners with <em>"Namaste"</em> and address mountain elders respectfully as <em>"Daaju"</em> (brother) or <em>"Didi"</em> (sister).</span>
          </li>
        </ul>
      </div>

      {/* Hackathon Specs & Offline AI Attribution */}
      <div
        className={`p-6 rounded-3xl border transition-all text-xs ${
          isSunlight
            ? 'bg-neutral-100 border-neutral-300 text-black'
            : 'bg-surface-container/60 border-rail-gold/25 text-himalaya-mist'
        }`}
      >
        <div className="flex items-center justify-between font-mono text-xs text-himalaya-mist mb-2">
          <span className="font-bold text-parchment font-serif text-sm">GDG Siliguri · Code for Communities</span>
          <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-pine-deep/80 border border-emerald-500/30">100% Client-Side PWA</span>
        </div>
        <p className="text-xs leading-relaxed text-neutral-400">
          Hillway Companion is engineered to run completely offline on airplane mode with zero external server calls, featuring client-side BM25 vector search, Web Speech synthesis, and sunlight-optimized mountain typography.
        </p>
      </div>
    </div>
  );
};
