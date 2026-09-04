export interface PeakInfo {
  id: string;
  name: string;
  nepaliName: string;
  elevationM: number;
  elevationFt: number;
  bearingDeg: number; // approximate compass heading from Darjeeling/Ghum ridge
  significance: string;
  bestViewpoints: string[];
  distanceKmFromDarjeeling: number;
}

export const HIMALAYAN_PEAKS: PeakInfo[] = [
  {
    id: "kanchenjunga",
    name: "Mt. Kanchenjunga (Main Summit)",
    nepaliName: "कञ्चनजङ्घा",
    elevationM: 8586,
    elevationFt: 28169,
    bearingDeg: 350,
    significance: "3rd highest peak on Earth. Sacred guardian deity of Sikkim and Darjeeling ('Five Treasures of the Great Snows').",
    bestViewpoints: ["Batasia Loop", "Ghum Station", "Chowrasta Mall", "Tiger Hill"],
    distanceKmFromDarjeeling: 74
  },
  {
    id: "kabru",
    name: "Mt. Kabru",
    nepaliName: "काब्रु",
    elevationM: 7412,
    elevationFt: 24318,
    bearingDeg: 340,
    significance: "Dramatic ridge peak southwest of Kanchenjunga with a stunning snow dome.",
    bestViewpoints: ["Batasia Loop", "Sonada", "Chowrasta"],
    distanceKmFromDarjeeling: 72
  },
  {
    id: "pandim",
    name: "Mt. Pandim",
    nepaliName: "पन्दिम",
    elevationM: 6691,
    elevationFt: 21952,
    bearingDeg: 12,
    significance: "Distinctive sharp needle pyramid peak rising gracefully east of Kanchenjunga.",
    bestViewpoints: ["Ghum summit", "Tiger Hill", "Darjeeling Observatory Hill"],
    distanceKmFromDarjeeling: 65
  },
  {
    id: "siniolchu",
    name: "Mt. Siniolchu",
    nepaliName: "सिनियोलचु",
    elevationM: 6888,
    elevationFt: 22598,
    bearingDeg: 28,
    significance: "Described by Douglas Freshfield as 'the most beautiful snow mountain in the world'.",
    bestViewpoints: ["Tiger Hill", "Ghum on clear winter mornings"],
    distanceKmFromDarjeeling: 88
  },
  {
    id: "tiger-hill",
    name: "Tiger Hill (Observation Summit)",
    nepaliName: "टाइगर हिल",
    elevationM: 2590,
    elevationFt: 8497,
    bearingDeg: 135,
    significance: "Famous summit overlooking sunrise over the Eastern Himalayas; on exceptionally clear mornings, Mt. Everest (8,848m) and Makalu are visible.",
    bestViewpoints: ["Visible from Ghum and Senchal forest"],
    distanceKmFromDarjeeling: 11
  },
  {
    id: "sandakphu",
    name: "Sandakphu (Singalila Ridge)",
    nepaliName: "सन्दकफू",
    elevationM: 3636,
    elevationFt: 11930,
    bearingDeg: 280,
    significance: "Highest point in the state of West Bengal, offering the famous 'Sleeping Buddha' panoramic view of Kanchenjunga.",
    bestViewpoints: ["Look west from Kurseong and Sonada ridges"],
    distanceKmFromDarjeeling: 32
  }
];

