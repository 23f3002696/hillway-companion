export interface VisualTarget {
  id: string;
  name: string;
  category: 'flora' | 'fauna' | 'locomotive' | 'signage' | 'monument' | 'peak';
  nepaliName: string;
  summary: string;
  description: string;
  identifyingFeatures: string[];
  spottingLocation: string;
  sampleSvg: string; // inline SVG vector illustration for window demo
}

export const VISUAL_TARGETS: VisualTarget[] = [
  {
    id: "tea_bush",
    name: "Darjeeling Tea Bush (Camellia sinensis)",
    category: "flora",
    nepaliName: "चियाको बोट",
    summary: "Hand-plucked 'two leaves and a bud' grown on misty hill slopes between 600m and 2,000m.",
    description: "The world-famous 'Champagne of Teas'. Bushes are pruned into flat tables called 'plucking tables'. Look for local women with woven bamboo baskets ('doko') strapped to their foreheads carefully picking tender spring flushes.",
    identifyingFeatures: ["Glossy serrated leaves", "Tender bright-green two leaves and a bud tip", "Terraced contour planting along steep hillsides"],
    spottingLocation: "Visible on both sides between Mahanadi, Kurseong, and Tung",
    sampleSvg: "tea"
  },
  {
    id: "steam_loco",
    name: "B-Class Steam Engine (0-4-0ST)",
    category: "locomotive",
    nepaliName: "स्टीम रेल इन्जिन",
    summary: "Iconic coal-fired steam engine built between 1889 and 1925 in Glasgow, Scotland.",
    description: "Engineered specifically for the DHR's sharp 43-foot curves. Notice the saddle tank draped over the boiler, the brass fittings, and the cowcatcher platform where crew members sit to scatter grip sand onto the rails.",
    identifyingFeatures: ["Black and silver boiler with red buffer beam", "No tender behind (tank engine)", "Twin brass steam dome and whistle on top"],
    spottingLocation: "Tindharia Loco Works, Kurseong station, Ghum, and Darjeeling yards",
    sampleSvg: "loco"
  },
  {
    id: "batasia_memorial",
    name: "Batasia Loop War Memorial",
    category: "monument",
    nepaliName: "बतासिया युद्ध स्मारक",
    summary: "Historic 360-degree spiral loop with the Gorkha soldier cenotaph at its center.",
    description: "Built in 1919 to conquer the steep gradient drop between Ghum and Darjeeling. In the center stands the memorial to brave Gorkha soldiers who sacrificed their lives for India post-1947, set against the backdrop of Kanchenjunga.",
    identifyingFeatures: ["Circular double-loop railway line", "Central stone cenotaph with bronze statue of Gorkha soldier", "Circular manicured floral gardens"],
    spottingLocation: "5 km before Darjeeling town at 2,150 m elevation",
    sampleSvg: "monument"
  },
  {
    id: "hornbill",
    name: "Great Himalayan Hornbill (Mahananda)",
    category: "fauna",
    nepaliName: "राज धनेश",
    summary: "Majestic bird with a prominent yellow-and-black casque flying across the sal forest canopy.",
    description: "Found in the dense sub-Himalayan forest of the Mahananda Wildlife Sanctuary. Their huge wings produce a loud rushing whooshing sound as they fly over the railway track between Sukna and Rangtong.",
    identifyingFeatures: ["Enormous yellow bill with a casque on top", "Black body with white wing bars", "White tail feathers with a broad black subterminal band"],
    spottingLocation: "Sukna to Rangtong forest canopy (Mahananda Sanctuary)",
    sampleSvg: "bird"
  },
  {
    id: "station_sign",
    name: "DHR Enamel Station Elevation Board",
    category: "signage",
    nepaliName: "स्टेशन उचाइ बोर्ड",
    summary: "Colonial-style station boards displaying elevation in meters and feet in four languages.",
    description: "Heritage railway signage showing the station name in English, Bengali, Hindi, and Nepali, with the official elevation above sea level. The Ghum board proudly displays 2,258 m (7,408 ft).",
    identifyingFeatures: ["Yellow background with bold black typography", "Four language scripts side-by-side", "Official elevation in meters and feet at the bottom"],
    spottingLocation: "Mounted on station platforms along the 88 km route",
    sampleSvg: "sign"
  },
  {
    id: "kanchenjunga_view",
    name: "Mount Kanchenjunga (8,586 m)",
    category: "peak",
    nepaliName: "कञ्चनजङ्घा हिमाल",
    summary: "Third highest peak on Earth and sacred guardian deity of the Eastern Himalayas.",
    description: "Visible towering over the northern horizon on clear mornings. The mountain has five distinct snow peaks representing the five sacred treasures: gold, silver, gems, grain, and sacred scriptures.",
    identifyingFeatures: ["Dominant snow-covered massif dominating the northern skyline", "Five majestic peaks with Kabru and Pandim flanking it", "Golden pink glow during sunrise and sunset"],
    spottingLocation: "Batasia Loop, Ghum, Sonada, and Darjeeling Chowrasta",
    sampleSvg: "peak"
  }
];

