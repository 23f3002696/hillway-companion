import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

interface AboutDHRProps {
  isSunlight: boolean;
}

export const AboutDHR: React.FC<AboutDHRProps> = ({ isSunlight }) => {
  return (
    <div className="space-y-4 pb-20">
      {/* UNESCO Heritage Hero Card */}
      <div
        className={`p-5 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border shadow-md'
        }`}
      >
        <div className="flex items-center gap-2 text-himalaya-amber text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>UNESCO World Heritage Site (Inscribed 1999)</span>
        </div>

        <h2 className="text-xl font-bold mt-1 text-inherit">
          Darjeeling Himalayan Railway
        </h2>
        <p className="text-xs text-himalaya-mist mt-0.5">
          Opened 1881 • 88 km (55 miles) • 2 ft (610 mm) Gauge • 2,258 m Summit
        </p>

        <p className="text-xs mt-3 leading-relaxed text-neutral-300">
          "The Darjeeling Himalayan Railway is the first, and is still the most outstanding, example of a hill passenger railway. Opened in 1881, its design applies bold and ingenious engineering solutions to the problem of establishing an effective rail link across a mountainous terrain of great beauty."
        </p>
        <p className="text-[11px] mt-1 text-himalaya-mist italic">
          — UNESCO World Heritage Committee Citation, Marrakesh, 1999
        </p>
      </div>

      {/* The 4 Engineering Feats */}
      <div
        className={`p-5 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border'
        }`}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-himalaya-mist mb-3">
          The 4 Engineering Marvels of the DHR
        </h3>

        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-black/20 border border-inherit">
            <h4 className="text-xs font-bold text-himalaya-amber flex items-center gap-1.5">
              <span>1. The 2-Foot (610 mm) Narrow Gauge</span>
            </h4>
            <p className="text-xs mt-1 text-neutral-300 leading-relaxed">
              Standard trains need wide turning radiuses that would have required dozens of costly tunnels. Adopting the 2ft Festiniog gauge allowed the track to follow the hill contours with razor-sharp 43-foot (13m) curve radiuses.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/20 border border-inherit">
            <h4 className="text-xs font-bold text-himalaya-emerald flex items-center gap-1.5">
              <span>2. The Spirals & Batasia Loop (1919)</span>
            </h4>
            <p className="text-xs mt-1 text-neutral-300 leading-relaxed">
              To conquer sudden steep cliff faces without exceeding the engine's 1-in-20 traction limit, engineers built complete 360° spiral loops where the track crosses over itself on a viaduct.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/20 border border-inherit">
            <h4 className="text-xs font-bold text-himalaya-terracotta flex items-center gap-1.5">
              <span>3. Six Z-Reverse Switchbacks</span>
            </h4>
            <p className="text-xs mt-1 text-neutral-300 leading-relaxed">
              Where even loops could not fit against sheer rock faces, trains pull into dead-end spurs, flip switch points, and reverse backwards up the mountain slope to gain 30-50 vertical feet in minutes.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/20 border border-inherit">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>4. Glasgow B-Class Steam Locomotives</span>
            </h4>
            <p className="text-xs mt-1 text-neutral-300 leading-relaxed">
              Built between 1889 and 1925 by Sharp Stewart and North British Locomotive Co, these 0-4-0ST engines are kept in steam to this day by master craftsmen at the Tindharia railway workshop.
            </p>
          </div>
        </div>
      </div>

      {/* Practical Zero-Signal Tips */}
      <div
        className={`p-5 rounded-2xl transition-all ${
          isSunlight
            ? 'card-sunlight'
            : 'bg-himalaya-card border border-himalaya-border'
        }`}
      >
        <h3 className="text-xs font-bold uppercase tracking-wider text-himalaya-mist mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Himalayan Passenger Survival Guide</span>
        </h3>

        <ul className="space-y-2 text-xs text-neutral-300">
          <li className="flex items-start gap-2">
            <span className="text-himalaya-amber font-bold">•</span>
            <span><strong>Always carry cash:</strong> With zero cellular bars between Sukna and Sonada, UPI digital payments will fail at platforms and tea stalls.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-himalaya-amber font-bold">•</span>
            <span><strong>Altitude adjustment:</strong> Ghum is at 2,258 m (7,408 ft). Drink plenty of warm water or ginger tea to prevent mild mountain headache.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-himalaya-amber font-bold">•</span>
            <span><strong>Warm layers:</strong> While Siliguri at 100 m may be humid and hot (28–34°C), Ghum and Darjeeling can drop to 5–12°C with thick mountain fog.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-himalaya-amber font-bold">•</span>
            <span><strong>Respect local communities:</strong> Greet shopkeepers with <em>"Namaste"</em> and address elders as <em>"Daaju"</em> (brother) or <em>"Didi"</em> (sister).</span>
          </li>
        </ul>
      </div>

      {/* Hackathon Specs & Offline AI Attribution */}
      <div
        className={`p-4 rounded-2xl border transition-all text-xs ${
          isSunlight
            ? 'bg-neutral-100 border-neutral-300 text-black'
            : 'bg-black/30 border-himalaya-border text-himalaya-mist'
        }`}
      >
        <div className="flex items-center justify-between font-mono text-[10px] text-himalaya-mist mb-1">
          <span>GDG Siliguri · Code for Communities</span>
          <span className="text-emerald-400 font-bold">100% Client-Side PWA</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Hillway Companion is engineered to run completely offline on airplane mode with zero external server dependencies, featuring client-side RAG search, local speech synthesis, and sunlight-optimized typography.
        </p>
      </div>
    </div>
  );
};
