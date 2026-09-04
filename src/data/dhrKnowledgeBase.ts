export interface KnowledgeChunk {
  id: string;
  title: string;
  category: 'engineering' | 'history' | 'unesco' | 'locomotives' | 'nature' | 'culture';
  keywords: string[];
  summary: string;
  content: string;
  relatedStations: string[];
  quickQuestions: string[];
}

export const DHR_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "batasia-loop",
    title: "The Batasia Loop: Engineering Marvel",
    category: "engineering",
    keywords: ["batasia", "loop", "spiral", "gradient", "turn", "circle", "kanchenjunga", "memorial", "engineering"],
    summary: "Batasia Loop allows the train to lower itself by 1,000 feet of gradient in a sweeping 360-degree spiral with panoramic views of Mt. Kanchenjunga.",
    content: "Constructed in 1919 just 5 km outside Darjeeling, Batasia Loop is one of the most celebrated civil engineering feats in the world. As the train descends from Ghum (2,258 m) towards Darjeeling (2,073 m), the hill drops precipitously. To conquer this steep cliff without exceeding the locomotive's maximum allowable 1-in-20 gradient, engineers looped the railway line in a complete 360-degree circle around a landscaped hillock. At the center of the loop stands the Gorkha War Memorial with a cenotaph honoring brave Gorkha soldiers. On clear mornings, passengers enjoy a majestic view of the Kanchenjunga snow peaks.",
    relatedStations: ["ghum", "batasia", "darjeeling"],
    quickQuestions: [
      "Why does the train loop around at Batasia?",
      "What is the memorial inside Batasia Loop?",
      "Which mountain peak is visible from Batasia?"
    ]
  },
  {
    id: "z-reverses",
    title: "The Z-Reverses (Zig-Zags) Switchbacks",
    category: "engineering",
    keywords: ["reverse", "zig zag", "switchback", "points", "backing up", "gradient", "steep", "cliff", "zigzag"],
    summary: "When mountain slopes were too steep even for loops, engineers built Z-reverses where the train changes direction to zigzag up the mountainside.",
    content: "Along the 88 km route, the DHR negotiates six famous 'Z-reverses' (zig-zags). When the mountain terrain becomes a near-vertical cliff face where even a spiral loop would not fit, the train pulls into a dead-end spur carved into the cliff. The pointsman or guard throws the ground switch, the whistle blows twice, and the train reverses direction backwards up the next ramp. At the second dead-end spur, the switch is thrown once more and the engine pushes forward again, having gained 30 to 50 feet of vertical elevation in just minutes.",
    relatedStations: ["rangtong", "chunbatti", "tindharia", "gayabari", "sonada"],
    quickQuestions: [
      "Why is the train moving backwards?",
      "How do the Z-reverses work on the DHR?",
      "How many zig-zag reverses are on the line?"
    ]
  },
  {
    id: "b-class-locomotives",
    title: "The Iconic B-Class Steam Locomotives",
    category: "locomotives",
    keywords: ["steam", "engine", "locomotive", "b-class", "coal", "boiler", "tender", "whistle", "tindharia", "b class"],
    summary: "Built between 1889 and 1925, the DHR B-Class 0-4-0ST engines are among the world's most famous surviving narrow-gauge steam locomotives.",
    content: "The iconic DHR steam engines belong to the 'B-Class', designed specifically for the sharp 43-foot curves and punishing 1-in-25 mountain grades of the Himalayas. They feature an 0-4-0ST wheel arrangement (four coupled driving wheels, no leading or trailing unpowered axles, with a saddle tank over the boiler and a well tank between the frames). Built originally by Sharp Stewart & Co and the North British Locomotive Company in Glasgow, they burn coal and carry manual sanders: brave crew members ('sand boys') sit on the front cowcatcher to sprinkle dry sand directly onto the rails for traction on damp mountain slopes.",
    relatedStations: ["sgu", "tindharia", "kurseong", "ghum", "darjeeling"],
    quickQuestions: [
      "What type of steam engine pulls the toy train?",
      "Where are the steam locomotives repaired?",
      "Why does a crew member sit on the front of the engine?"
    ]
  },
  {
    id: "narrow-gauge-explanation",
    title: "Why 2-Foot Narrow Gauge (610 mm)?",
    category: "engineering",
    keywords: ["gauge", "width", "2 foot", "610 mm", "narrow gauge", "track", "curve", "radius", "sharp"],
    summary: "A tiny 2-foot track width was chosen because it permitted an extraordinary 43-foot minimum curve radius, hugging the mountain contours.",
    content: "Standard broad-gauge (5 ft 6 in) and meter-gauge trains require wide turning curves that would have necessitated blasting hundreds of expensive tunnels through fragile Himalayan rock. In 1879, Franklin Prestage, an agent of the Eastern Bengal Railway, realized that adopting the tiny 2-foot (610 mm) Festiniog narrow-gauge standard would allow the railway to follow the natural contour of the existing Cart Road. The DHR has virtually no major tunnels: instead, it twists through 500+ tight curves, with minimum curve radii as sharp as 43 feet (13 meters)!",
    relatedStations: ["sgu", "sukna", "rangtong", "chunbatti", "kurseong"],
    quickQuestions: [
      "Why is the track gauge so narrow?",
      "Are there any tunnels on the Toy Train route?",
      "What is the minimum curve radius of the track?"
    ]
  },
  {
    id: "unesco-world-heritage",
    title: "UNESCO World Heritage Inscription (1999)",
    category: "unesco",
    keywords: ["unesco", "heritage", "world heritage", "1999", "international", "preservation", "monument"],
    summary: "The DHR was inscribed as a UNESCO World Heritage site in 1999, hailed as an outstanding example of innovative transport engineering.",
    content: "In 1999, UNESCO declared the Darjeeling Himalayan Railway a World Heritage Site under criteria (ii) and (iv). The citation commended the railway as 'the first, and still the most outstanding, example of a hill passenger railway... an innovative transportation system that established a model for technical development across the globe.' It was only the second railway in the world to receive UNESCO status (after Austria's Semmering Railway). Today, it forms the premier site of the Mountain Railways of India group, along with the Nilgiri Mountain Railway and Kalka-Shimla Railway.",
    relatedStations: ["ghum", "darjeeling", "kurseong", "tindharia"],
    quickQuestions: [
      "When did DHR become a UNESCO World Heritage Site?",
      "Why was DHR given UNESCO status?",
      "What other mountain railways in India are UNESCO sites?"
    ]
  },
  {
    id: "franklin-prestage",
    title: "Franklin Prestage: The Visionary Founder",
    category: "history",
    keywords: ["franklin prestage", "founder", "history", "1879", "1881", "ashley eden", "creation", "builder"],
    summary: "Franklin Prestage conceived and built the railway between 1879 and 1881 to replace bullock carts on the grueling trek to Darjeeling.",
    content: "In the 1870s, the journey from Siliguri to Darjeeling by horse-drawn cart took several grueling days over rutted dirt roads prone to washouts. Franklin Prestage, an agent of the Eastern Bengal Railway, submitted a groundbreaking proposal to Sir Ashley Eden, Lieutenant Governor of Bengal, in 1878: build a light steam tramway along the cart road. Construction began in 1879. The Siliguri to Kurseong section opened in August 1880, and the line reached Darjeeling on July 4, 1881, permanently transforming tea commerce, tourism, and mountain transit.",
    relatedStations: ["sgu", "sukna", "kurseong", "darjeeling"],
    quickQuestions: [
      "Who built the Darjeeling Himalayan Railway?",
      "When did the toy train first start running?",
      "How did people travel to Darjeeling before the train?"
    ]
  },
  {
    id: "ghum-highest-station",
    title: "Ghum: India's Highest Railway Station",
    category: "history",
    keywords: ["ghum", "ghoom", "highest", "altitude", "elevation", "summit", "museum", "7408 ft", "2258 m"],
    summary: "At 2,258 meters (7,408 ft), Ghum is the highest altitude railway station in India and the 14th highest in the world.",
    content: "Ghum (spelled Ghoom in older documents) sits at the mountain summit of the DHR route at an elevation of 2,258 meters (7,408 feet). When the train reaches Ghum, it has ascended more than 2,150 vertical meters from the humid plains of Siliguri. The station boasts the charming DHR Railway Museum, exhibiting historical photographs, telegraph instruments, and the tiny 1881 'Baby Sivok' engine. From Ghum, the tracks descend 185 meters over the final 10 kilometers into Darjeeling.",
    relatedStations: ["ghum", "batasia", "sonada"],
    quickQuestions: [
      "What is the elevation of Ghum station?",
      "Is Ghum the highest station in India?",
      "What can I see at Ghum railway station?"
    ]
  },
  {
    id: "darjeeling-tea",
    title: "Darjeeling Tea & The 'Champagne of Teas'",
    category: "nature",
    keywords: ["tea", "garden", "estate", "makaibari", "castleton", "camellia", "first flush", "second flush", "orthodox"],
    summary: "The hills alongside the track are blanketed by historic tea gardens producing world-renowned Darjeeling Orthodox Black Tea.",
    content: "The slopes traversed by the DHR are the birthplace of Darjeeling Tea, awarded India's first Geographical Indication (GI) tag in 2004. As the train winds past Mahanadi, Kurseong, and Tung, you will pass world-famous estates like Castleton, Makaibari (the world's first biodynamic tea estate, founded in 1859), and Ambootia. The unique high altitude, acidic soil, intermittent mountain mist, and Himalayan sunshine give Darjeeling tea its prized floral aroma, light amber liquor, and distinctive 'muscatel' grape flavor notes. Spring 'First Flush' (harvested March-April) and summer 'Second Flush' (May-June) are considered the world's most exquisite teas.",
    relatedStations: ["mahanadi", "kurseong", "tung", "darjeeling"],
    quickQuestions: [
      "What makes Darjeeling tea so famous?",
      "Which tea gardens can you see from the train?",
      "What is the difference between first flush and second flush?"
    ]
  },
  {
    id: "kurseong-street-running",
    title: "Kurseong Bazaar: Living with the Train",
    category: "culture",
    keywords: ["kurseong", "bazaar", "market", "street", "shops", "vendors", "life", "orchids", "kharsang"],
    summary: "At Kurseong, the railway runs straight down the crowded bazaar street, mere inches from market stalls and pedestrian shoppers.",
    content: "One of the most unforgettable spectacles on the DHR occurs at Kurseong ('The Land of White Orchids'). Rather than running in an isolated corridor, the narrow-gauge tracks run directly down the center of the Hill Cart Road bazaar. When the steam engine's brass whistle sounds, vegetable vendors deftly tuck in their produce baskets, school children step onto doorsteps, and shopkeepers smile as the train chugs past just inches from their shop displays. It is an extraordinary example of community and heritage living in seamless harmony.",
    relatedStations: ["kurseong"],
    quickQuestions: [
      "Does the train really run through a crowded bazaar?",
      "What does the name Kurseong mean?",
      "Where does the train stop in Kurseong?"
    ]
  },
  {
    id: "mahananda-wildlife",
    title: "Ecology of the Lower Hills & Mahananda",
    category: "nature",
    keywords: ["wildlife", "mahananda", "sanctuary", "elephants", "sal", "forest", "birds", "ecology", "nature"],
    summary: "Between Sukna and Rangtong, the railway traverses the protected Mahananda Wildlife Sanctuary.",
    content: "Departing Sukna, the train enters the dense sub-Himalayan tropical evergreen and moist deciduous forests of the Mahananda Wildlife Sanctuary. Dominated by towering Sal trees (Shorea robusta), riverine grasslands, and thick bamboo brakes, the sanctuary is an important corridor for Asian wild elephants, Indian leopards, Himalayan black bears, and over 300 species of Himalayan birds including the Great Indian Hornbill and Rufous-necked Hornbill. Train speeds in this sector are carefully restricted to 10 km/h to prevent wildlife collisions.",
    relatedStations: ["sukna", "rangtong"],
    quickQuestions: [
      "Are there wild elephants near the train tracks?",
      "What forest does the toy train go through?",
      "What birds can you spot from the train?"
    ]
  },
  {
    id: "kanchenjunga-peaks",
    title: "Mount Kanchenjunga & The Sacred Massif",
    category: "nature",
    keywords: ["kanchenjunga", "mountain", "peak", "snow", "himalayas", "sacred", "third highest", "view", "panoramic"],
    summary: "At 8,586 meters (28,169 ft), Kanchenjunga is the third highest peak on Earth and the sacred guardian deity of Sikkim and Darjeeling.",
    content: "Mount Kanchenjunga (8,586 m / 28,169 ft) dominates the northern horizon from Sonada, Ghum, Batasia Loop, and Darjeeling. In Tibetan and Lepcha tradition, 'Kang-chen-zod-nga' translates to 'The Five Treasures of the Great Snows', referring to the five summits representing God's storehouses: Gold, Silver, Gems, Grain, and Sacred Books. Out of reverence for local religious beliefs, early British climbers agreed never to set foot directly on the physical summit, stopping a few feet short—a sacred tradition still honored today.",
    relatedStations: ["sonada", "ghum", "batasia", "darjeeling"],
    quickQuestions: [
      "How tall is Mount Kanchenjunga?",
      "Why is Kanchenjunga considered sacred?",
      "Where is the best view of Kanchenjunga from the train?"
    ]
  },
  {
    id: "monsoon-maintenance",
    title: "Monsoon Challenges & The Track Gangmen",
    category: "engineering",
    keywords: ["monsoon", "landslide", "gangman", "maintenance", "paglajhora", "rain", "safety", "slip", "repair"],
    summary: "During the torrential Himalayan monsoon, dedicated gangmen walk the 88 km track on foot daily to clear rockfalls and ensure track safety.",
    content: "The Darjeeling hills receive an astonishing 3,000 mm of monsoon rainfall between June and September. Torrential runoff can trigger slope failures, washouts, and mudslides—especially at notorious geological fault lines like Pagla Jhora ('Mad Torrent'). The safety of the DHR rests on the shoulders of the permanent-way 'gangmen'. Working in pairs with umbrellas and crowbars, gangmen walk their designated 4-kilometer track beat every morning, checking rail alignment, clearing drainage culverts, testing sleeper fastenings, and sounding the alarm if fresh slope cracks appear.",
    relatedStations: ["chunbatti", "tindharia", "gayabari", "mahanadi"],
    quickQuestions: [
      "What happens to the toy train during the monsoon?",
      "Who are the track gangmen on the DHR?",
      "Where is Pagla Jhora and why is it dangerous?"
    ]
  }
];

