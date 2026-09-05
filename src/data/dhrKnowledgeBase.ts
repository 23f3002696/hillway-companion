export interface QAPair {
  id: string;
  question: string;
  aliases?: string[];
  answer: string;
  sourceTitle: string;
  category: 'engineering' | 'history' | 'unesco' | 'locomotives' | 'nature' | 'culture';
  relatedStationId?: string;
  followUpQuestions: string[];
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  category: 'engineering' | 'history' | 'unesco' | 'locomotives' | 'nature' | 'culture';
  keywords: string[];
  summary: string;
  content: string;
  relatedStations: string[];
  quickQuestions: string[];
  qaPairs?: QAPair[];
}

export const DHR_DIRECT_QA: QAPair[] = [
  // UNESCO World Heritage
  {
    id: "unesco-when",
    question: "When did DHR become a UNESCO World Heritage Site?",
    aliases: [
      "when did dhr become a unesco site",
      "when did darjeeling railway get unesco status",
      "what year did dhr become unesco",
      "unesco date dhr"
    ],
    answer: "The Darjeeling Himalayan Railway was officially inscribed on the UNESCO World Heritage List on December 2, 1999 during the 23rd session of the World Heritage Committee in Marrakesh, Morocco. It was only the second railway system in the world to receive World Heritage status, preceded only by Austria's Semmering Railway in 1998.",
    sourceTitle: "UNESCO World Heritage Inscription (1999)",
    category: "unesco",
    relatedStationId: "darjeeling",
    followUpQuestions: [
      "Why was DHR given UNESCO status?",
      "What other mountain railways in India are UNESCO sites?",
      "Who built the Darjeeling Himalayan Railway?"
    ]
  },
  {
    id: "unesco-why",
    question: "Why was DHR given UNESCO status?",
    aliases: [
      "why did dhr get unesco",
      "unesco criteria for dhr",
      "why is toy train a world heritage site",
      "reasons for dhr unesco status"
    ],
    answer: "UNESCO awarded the DHR World Heritage status under cultural criteria (ii) and (iv):\n\n• Criterion (ii): It represents an outstanding example of the interchange of human values on developments in transportation technology, establishing a global model for mountain passenger railways.\n• Criterion (iv): It is an exceptional 19th-century technological ensemble that boldly conquered extreme Himalayan topography without tunnels, preserving original B-Class steam engines, loops, and zig-zags in active operation.",
    sourceTitle: "UNESCO Nomination Criteria (ii & iv)",
    category: "unesco",
    relatedStationId: "ghum",
    followUpQuestions: [
      "When did DHR become a UNESCO World Heritage Site?",
      "What other mountain railways in India are UNESCO sites?",
      "Why is the track gauge only 2 feet?"
    ]
  },
  {
    id: "unesco-other-railways",
    question: "What other mountain railways in India are UNESCO sites?",
    aliases: [
      "other unesco railways in india",
      "which indian railways are world heritage",
      "mountain railways of india unesco group",
      "nilgiri kalka shimla unesco"
    ],
    answer: "The UNESCO inscription forms the 'Mountain Railways of India' World Heritage collective, which encompasses three operational hill lines:\n\n1. Darjeeling Himalayan Railway (West Bengal, inscribed 1999) – 88 km 2-foot narrow gauge.\n2. Nilgiri Mountain Railway (Tamil Nadu, added 2005) – 46 km meter-gauge line climbing Ooty using the unique Abt rack-and-pinion cog system.\n3. Kalka–Shimla Railway (Himachal Pradesh, added 2008) – 96 km 2-foot-6-inch gauge featuring 102 tunnels and multi-tier stone viaducts.\n\n(The historic Matheran Hill Railway in Maharashtra is on the UNESCO tentative list).",
    sourceTitle: "Mountain Railways of India Collective",
    category: "unesco",
    relatedStationId: "tindharia",
    followUpQuestions: [
      "Why was DHR given UNESCO status?",
      "What type of steam engine pulls the toy train?",
      "How do the Z-reverses work on the DHR?"
    ]
  },

  // Batasia Loop
  {
    id: "batasia-why-loop",
    question: "Why does the train loop around at Batasia?",
    aliases: [
      "why does the train loop at batasia",
      "why is there a loop at batasia",
      "batasia loop purpose",
      "how does batasia loop work"
    ],
    answer: "Between Ghum (2,258 m) and Darjeeling (2,073 m), the elevation drops precipitously by nearly 1,000 feet over just 5 kilometers. If the tracks went straight down the ridge, the grade would be far too steep for train wheels to maintain braking control. In 1919, British engineers designed the Batasia Loop—a sweeping 360-degree spiral curve around a landscaped hilltop. As the train circles over itself, it safely lowers elevation by 30 vertical feet at a gentle 1-in-30 slope while giving passengers an amphitheater view of Mount Kanchenjunga.",
    sourceTitle: "Batasia Loop Engineering Spiral",
    category: "engineering",
    relatedStationId: "batasia",
    followUpQuestions: [
      "What is the memorial inside Batasia Loop?",
      "Which mountain peak is visible from Batasia?",
      "How do the Z-reverses (zig-zags) work?"
    ]
  },
  {
    id: "batasia-memorial",
    question: "What is the memorial inside Batasia Loop?",
    aliases: [
      "memorial inside batasia loop",
      "gorkha memorial batasia",
      "statue inside batasia loop",
      "cenotaph batasia"
    ],
    answer: "At the center of Batasia Loop stands the Gorkha War Memorial, consecrated in 1995 to honor the brave Gorkha soldiers from the Darjeeling hills who sacrificed their lives in wars and peacekeeping operations for independent India since 1947. The memorial features an impressive 9-foot bronze statue of a Gorkha soldier saluting with a drawn khukuri, positioned before a 30-foot triangular granite cenotaph inscribed with the names of decorated heroes.",
    sourceTitle: "Gorkha War Memorial (Batasia)",
    category: "culture",
    relatedStationId: "batasia",
    followUpQuestions: [
      "Which mountain peak is visible from Batasia?",
      "Why does the train loop around at Batasia?",
      "What can I see at Ghum railway station?"
    ]
  },
  {
    id: "batasia-peak",
    question: "Which mountain peak is visible from Batasia?",
    aliases: [
      "which mountain peak is visible from batasia",
      "can you see kanchenjunga from batasia",
      "mountains visible from batasia loop",
      "peaks seen from batasia"
    ],
    answer: "On clear mornings, Batasia Loop offers an unobstructed, breathtaking panorama of Mount Kanchenjunga (8,586 m / 28,169 ft)—the third highest peak on Earth and sacred deity of Darjeeling and Sikkim. You can also view adjacent Eastern Himalayan giants including Kabru (7,412 m), Kumbhakarna (Jannu, 7,710 m), and Mount Pandim (6,691 m) gleaming pink in the dawn sun.",
    sourceTitle: "Batasia Himalayan Panorama",
    category: "nature",
    relatedStationId: "batasia",
    followUpQuestions: [
      "How tall is Mount Kanchenjunga?",
      "Why is Kanchenjunga considered sacred?",
      "Why does the train loop around at Batasia?"
    ]
  },

  // Z-Reverses
  {
    id: "z-reverse-why-backwards",
    question: "Why is the train moving backwards?",
    aliases: [
      "why is the train moving backwards",
      "why did the toy train reverse",
      "train reversing on dhr",
      "why does the train back up"
    ],
    answer: "When you feel the Toy Train suddenly reversing backwards into the cliff, it is negotiating an ingenious Z-reverse (zig-zag)! In six locations where the mountain slope was too sheer and narrow for even a spiral loop, engineers created dead-end track spurs. The train drives into a spur, a pointsman throws the track switch, and the engine pushes the coaches backwards up the next incline. This allows the train to climb 30 to 50 vertical feet without requiring expensive tunnels.",
    sourceTitle: "Z-Reverse Switchback Mechanics",
    category: "engineering",
    relatedStationId: "chunbatti",
    followUpQuestions: [
      "How do the Z-reverses (zig-zags) work?",
      "How many zig-zag reverses are on the line?",
      "Why is the track gauge only 2 feet?"
    ]
  },
  {
    id: "z-reverse-how",
    question: "How do the Z-reverses work on the DHR?",
    aliases: [
      "how do z-reverses work",
      "how do the zig-zags work",
      "zig zag reverse operation",
      "switchback operation on dhr"
    ],
    answer: "The Z-reverses (switchbacks) work through a three-step directional reversal:\n\n1. The locomotive pulls the coaches forward into a dead-end track spur (the lower arm of the Z).\n2. The pointsman throws the ground switch, the whistle sounds two sharp blasts, and the engine shunts the train in reverse up a 1-in-20 incline along the diagonal central leg of the Z.\n3. At the upper spur, another switch is thrown and the locomotive pulls forward again along the top arm of the Z, gaining 30 to 50 vertical feet in minutes without tunnels.",
    sourceTitle: "Switchback Engineering Operation",
    category: "engineering",
    relatedStationId: "tindharia",
    followUpQuestions: [
      "How many zig-zag reverses are on the line?",
      "Why is the train moving backwards?",
      "What type of steam engine pulls the toy train?"
    ]
  },
  {
    id: "z-reverse-count",
    question: "How many zig-zag reverses are on the line?",
    aliases: [
      "how many zig zags on dhr",
      "how many z reverses are there",
      "number of reverses on dhr",
      "reverses count"
    ],
    answer: "There are six active Z-reverses (zig-zags) along the 88 km DHR route, located between Chunbatti (km 24) and Gayabari (km 37). The most celebrated are Reverse No. 1 above Chunbatti, the Tindharia switchbacks, and the dramatic Agony Point switchback, all carved into vertical mountain spurs where loops were physically impossible.",
    sourceTitle: "DHR Switchback Catalog",
    category: "engineering",
    relatedStationId: "gayabari",
    followUpQuestions: [
      "How do the Z-reverses (zig-zags) work?",
      "Why does the train loop around at Batasia?",
      "Where are the steam locomotives repaired?"
    ]
  },

  // B-Class Locomotives
  {
    id: "b-class-type",
    question: "What type of steam engine pulls the toy train?",
    aliases: [
      "what type of steam engine pulls the toy train",
      "what is a b-class steam locomotive",
      "dhr locomotive model",
      "toy train engine type"
    ],
    answer: "The Toy Train is hauled by legendary DHR B-Class 0-4-0ST steam locomotives, built between 1889 and 1925 by Sharp Stewart & Co and the North British Locomotive Company in Glasgow, Scotland. They weigh 16 tons and feature an 0-4-0 wheel arrangement: four coupled 26-inch driving wheels with no unpowered pony trucks. A curved saddle tank over the boiler and well tank between the frames concentrate maximum weight directly over the driving axles for optimal grip on steep 1-in-20 grades.",
    sourceTitle: "B-Class 0-4-0ST Locomotive Architecture",
    category: "locomotives",
    relatedStationId: "tindharia",
    followUpQuestions: [
      "Why does a crew member sit on the front of the engine?",
      "Where are the steam locomotives repaired?",
      "When did the toy train first start running?"
    ]
  },
  {
    id: "b-class-repair",
    question: "Where are the steam locomotives repaired?",
    aliases: [
      "where are the steam locomotives repaired",
      "dhr locomotive workshop",
      "tindharia workshop dhr",
      "where are toy train engines serviced"
    ],
    answer: "All DHR B-Class steam locomotives are maintained, overhauled, and rebuilt at the historic Tindharia Railway Workshop, established in 1915 at km 34. Tindharia is a functioning living heritage workshop where skilled master artisans hand-forge and machine custom replacement parts using vintage early 20th-century overhead belt-driven machinery, keeping 100+ year-old steam engines running smoothly.",
    sourceTitle: "Tindharia Heritage Railway Workshop (1915)",
    category: "locomotives",
    relatedStationId: "tindharia",
    followUpQuestions: [
      "What type of steam engine pulls the toy train?",
      "Why does a crew member sit on the front of the engine?",
      "Who are the track gangmen on the DHR?"
    ]
  },
  {
    id: "b-class-sandboy",
    question: "Why does a crew member sit on the front of the engine?",
    aliases: [
      "why does a crew member sit on the front of the engine",
      "why is someone sitting on the cowcatcher",
      "man sitting on front of steam train",
      "sand boy on dhr"
    ],
    answer: "The crew member sitting out in the open on the front cowcatcher is affectionately known as the 'Sand Boy' (or 'Sand Blower'). Because Himalayan mist, dew, drizzle, and fallen pine needles make the narrow iron rails slick, steel locomotive wheels can easily slip on steep 1-in-20 slopes. The sand boy manually scoops dry crushed sand from buckets and sprinkles it directly onto the rails in front of the driving wheels to create instant traction.",
    sourceTitle: "The Sand Boy: Vital Mountain Traction Crew",
    category: "locomotives",
    relatedStationId: "kurseong",
    followUpQuestions: [
      "What type of steam engine pulls the toy train?",
      "Where are the steam locomotives repaired?",
      "What happens during monsoon landslides?"
    ]
  },

  // Narrow Gauge
  {
    id: "gauge-why-2foot",
    question: "Why is the track gauge so narrow?",
    aliases: [
      "why is the track gauge only 2 feet",
      "why is track gauge 2 feet",
      "why 2 foot narrow gauge",
      "gauge width toy train"
    ],
    answer: "A tiny 2-foot (610 mm) narrow gauge was chosen because standard broad gauge (5 ft 6 in) requires wide turning curves that would have necessitated blasting hundreds of costly tunnels through fragile, landslide-prone Himalayan rock. The 2-foot gauge allowed British surveyor Franklin Prestage to design track curves with an extraordinary 43-foot (13-meter) radius, enabling the train to hug the natural contours of the Hill Cart Road without massive excavations.",
    sourceTitle: "2-Foot (610 mm) Narrow Gauge Selection",
    category: "engineering",
    relatedStationId: "sukna",
    followUpQuestions: [
      "Are there any tunnels on the Toy Train route?",
      "What is the minimum curve radius of the track?",
      "Who built the Darjeeling Himalayan Railway?"
    ]
  },
  {
    id: "gauge-tunnels",
    question: "Are there any tunnels on the Toy Train route?",
    aliases: [
      "are there any tunnels on the toy train route",
      "how many tunnels on dhr",
      "dhr tunnels count",
      "tunnels on darjeeling railway"
    ],
    answer: "Remarkably, across its entire 88-kilometer climb, the DHR has only one tiny tunnel! Tunnel No. 1, located near Sukna, measures just 160 feet (49 meters) in length. By relying on tight 43-foot curves, zig-zag switchbacks, and spiral loops, the engineers ascended over 2,150 vertical meters almost completely on the open mountainside, avoiding dangerous tunnel collapses in fragile Himalayan shale.",
    sourceTitle: "DHR Tunnels & Surface Mountain Engineering",
    category: "engineering",
    relatedStationId: "sukna",
    followUpQuestions: [
      "Why is the track gauge so narrow?",
      "What is the minimum curve radius of the track?",
      "Why does the train loop around at Batasia?"
    ]
  },
  {
    id: "gauge-radius",
    question: "What is the minimum curve radius of the track?",
    aliases: [
      "what is the minimum curve radius of the track",
      "minimum curve radius dhr",
      "how sharp are the curves on dhr",
      "sharpest curve on toy train"
    ],
    answer: "The minimum curve radius on the DHR is an astonishing 43 feet (13.1 meters)—one of the sharpest radii in international railway operation! In comparison, standard broad-gauge passenger trains require curve radii of 1,000 to 1,500 feet. This miniature turning radius enables the Toy Train to snake through market streets and hairpin mountain curves with effortless agility.",
    sourceTitle: "43-Foot Mountain Curve Radius",
    category: "engineering",
    relatedStationId: "chunbatti",
    followUpQuestions: [
      "Why is the track gauge so narrow?",
      "Are there any tunnels on the Toy Train route?",
      "Does the train really run through a crowded bazaar?"
    ]
  },

  // Franklin Prestage & History
  {
    id: "history-who-built",
    question: "Who built the Darjeeling Himalayan Railway?",
    aliases: [
      "who built the darjeeling himalayan railway",
      "who was franklin prestage",
      "founder of dhr",
      "architect of toy train"
    ],
    answer: "The railway was conceived and constructed by Franklin Prestage, an agent of the Eastern Bengal Railway. In 1878, Prestage realized that bullock cart transport to Darjeeling was slow, dangerous, and economically suffocating for tea commerce. He submitted a visionary proposal to Sir Ashley Eden, Lieutenant Governor of Bengal, who approved the construction of a light 2-foot steam tramway along the Hill Cart Road.",
    sourceTitle: "Franklin Prestage: The Visionary Founder",
    category: "history",
    relatedStationId: "sgu",
    followUpQuestions: [
      "When did the toy train first start running?",
      "How did people travel to Darjeeling before the train?",
      "Why is the track gauge so narrow?"
    ]
  },
  {
    id: "history-when-started",
    question: "When did the toy train first start running?",
    aliases: [
      "when did the toy train first start running",
      "when did dhr start operation",
      "opening date darjeeling railway",
      "first run of toy train"
    ],
    answer: "Commercial service began in August 1880 on the initial section from Siliguri to Kurseong. The full 88-kilometer route all the way to Darjeeling officially opened for passenger traffic on July 4, 1881, cutting what had been a grueling three-week trek into a scenic 8-hour mountain rail journey.",
    sourceTitle: "Inauguration of DHR (1880–1881)",
    category: "history",
    relatedStationId: "darjeeling",
    followUpQuestions: [
      "Who built the Darjeeling Himalayan Railway?",
      "How did people travel to Darjeeling before the train?",
      "What is the elevation of Ghum station?"
    ]
  },
  {
    id: "history-before-train",
    question: "How did people travel to Darjeeling before the train?",
    aliases: [
      "how did people travel to darjeeling before the train",
      "travel before toy train",
      "darjeeling trek before 1881",
      "how long did journey take before railway"
    ],
    answer: "Before 1881, travelers had to take a river steamer up the Ganges, followed by slow bullock carts or horse-drawn tongas across unpaved dirt roads from the plains. The journey from Kolkata took nearly three to four weeks, fraught with malaria, washed-out dirt tracks, and exhausting steep climbs where passengers often had to be carried on palanquins (dandies) or ponies.",
    sourceTitle: "Pre-Railway Travel to the Hill Station",
    category: "history",
    relatedStationId: "sgu",
    followUpQuestions: [
      "Who built the Darjeeling Himalayan Railway?",
      "When did the toy train first start running?",
      "What happens during monsoon landslides?"
    ]
  },

  // Ghum Station
  {
    id: "ghum-elevation",
    question: "What is the elevation of Ghum station?",
    aliases: [
      "what is the elevation of ghum station",
      "altitude of ghum",
      "how high is ghum station",
      "ghum station height"
    ],
    answer: "Ghum railway station sits at a dizzying elevation of 2,258 meters (7,408 feet) above sea level. From the tropical heat of Siliguri (122 m), the train climbs over 2,130 vertical meters through sub-tropical jungles and temperate cloud forests before reaching the misty mountain summit at Ghum.",
    sourceTitle: "Ghum Station Elevation (2,258 m / 7,408 ft)",
    category: "history",
    relatedStationId: "ghum",
    followUpQuestions: [
      "Is Ghum the highest station in India?",
      "What can I see at Ghum railway station?",
      "Why does the train loop around at Batasia?"
    ]
  },
  {
    id: "ghum-is-highest",
    question: "Is Ghum the highest station in India?",
    aliases: [
      "is ghum the highest station in india",
      "highest railway station in india",
      "is ghum highest in the world",
      "rank of ghum station altitude"
    ],
    answer: "Yes! Ghum is officially the highest railway station in India and the 14th highest railway station in the world. It is also the highest station anywhere on Earth operated by regular scheduled narrow-gauge steam locomotives.",
    sourceTitle: "Ghum: India's Highest Railway Station",
    category: "history",
    relatedStationId: "ghum",
    followUpQuestions: [
      "What is the elevation of Ghum station?",
      "What can I see at Ghum railway station?",
      "Which mountain peak is visible from Batasia?"
    ]
  },
  {
    id: "ghum-what-to-see",
    question: "What can I see at Ghum railway station?",
    aliases: [
      "what can i see at ghum railway station",
      "ghum museum highlights",
      "attractions at ghum station",
      "things to do at ghum"
    ],
    answer: "At Ghum, you can visit the renowned DHR Railway Museum right on the platform. It houses vintage telegraph instruments, colonial brass clocks, rare archival maps, and the venerable 'Baby Sivok'—the miniature 1881 steam locomotive that hauled the earliest trains. The station also offers tea stalls and panoramic viewpoints of mist rolling across the pine ridges.",
    sourceTitle: "Ghum Platform & DHR Museum",
    category: "history",
    relatedStationId: "ghum",
    followUpQuestions: [
      "What is the elevation of Ghum station?",
      "Is Ghum the highest station in India?",
      "What type of steam engine pulls the toy train?"
    ]
  },

  // Darjeeling Tea
  {
    id: "tea-why-famous",
    question: "What makes Darjeeling tea so famous?",
    aliases: [
      "what makes darjeeling tea so famous",
      "why is darjeeling tea special",
      "champagne of teas explanation",
      "darjeeling tea aroma"
    ],
    answer: "Darjeeling tea is celebrated worldwide as the 'Champagne of Teas' due to its incomparable floral aroma and distinctive 'muscatel' grape-like flavor notes. The unique terroir—elevations between 600 m and 2,000 m, acidic Himalayan soil, intermittent mountain mist, high humidity, and steep valley slopes—cannot be replicated anywhere else. In 2004, Darjeeling tea became India's very first Geographical Indication (GI) protected product.",
    sourceTitle: "Darjeeling Tea: The Champagne of Teas",
    category: "nature",
    relatedStationId: "kurseong",
    followUpQuestions: [
      "Which tea gardens can you see from the train?",
      "What is the difference between first flush and second flush?",
      "Does the train really run through a crowded bazaar?"
    ]
  },
  {
    id: "tea-gardens-visible",
    question: "Which tea gardens can you see from the train?",
    aliases: [
      "which tea gardens can you see from the train",
      "tea estates along dhr",
      "tea gardens seen from toy train",
      "makaibari castleton from train"
    ],
    answer: "From your carriage window between Tindharia, Mahanadi, Kurseong, and Sonada, you will look out over world-famous colonial-era tea estates including:\n\n• Makaibari (the world's first biodynamic and organic tea estate, founded in 1859)\n• Castleton (famous for setting global records at international tea auctions)\n• Ambootia, Margaret's Hope, and Goomtee\n\nPassengers can smell the fresh, sweet fragrance of green tea leaves wafting through the train windows during harvest seasons.",
    sourceTitle: "Historic Tea Estates Along the Tracks",
    category: "nature",
    relatedStationId: "mahanadi",
    followUpQuestions: [
      "What makes Darjeeling tea so famous?",
      "What is the difference between first flush and second flush?",
      "What forest does the toy train go through?"
    ]
  },
  {
    id: "tea-flushes-difference",
    question: "What is the difference between first flush and second flush?",
    aliases: [
      "what is the difference between first flush and second flush",
      "first flush vs second flush",
      "darjeeling tea harvest seasons",
      "tea flush explained"
    ],
    answer: "The flushes refer to distinct seasonal harvest periods:\n\n• First Flush (Spring: March–April): Harvested after winter dormancy. The leaves produce a pale, delicate amber liquor with vibrant floral and crisp vegetal notes. Highly prized by connoisseurs.\n• Second Flush (Summer: May–June): Harvested under intense Himalayan sunshine before monsoons. Yields a richer amber cup with the world-famous concentrated 'muscatel' grape sweetness.\n• Autumnal Flush (October–November): Smooth, mellow copper liquor with comforting earthy spice tones.",
    sourceTitle: "Darjeeling Tea Harvest Flushes",
    category: "nature",
    relatedStationId: "tung",
    followUpQuestions: [
      "What makes Darjeeling tea so famous?",
      "Which tea gardens can you see from the train?",
      "How tall is Mount Kanchenjunga?"
    ]
  },

  // Kurseong Bazaar
  {
    id: "kurseong-bazaar-running",
    question: "Does the train really run through a crowded bazaar?",
    aliases: [
      "does the train really run through a crowded bazaar",
      "train in kurseong market",
      "street running kurseong",
      "train through market stalls"
    ],
    answer: "Yes, absolutely! At Kurseong (km 49), the Toy Train performs one of the most remarkable spectacles in global rail transport: it shares the middle of Hill Cart Road straight through the bustling town market. The narrow iron tracks run mere inches from wooden shopfronts, vegetable crates, and café verandas. When the train's steam whistle sounds, shoppers calmly step back and fruit sellers tuck in their awnings as the train chugs safely past.",
    sourceTitle: "Kurseong Bazaar: Living Heritage on the Tracks",
    category: "culture",
    relatedStationId: "kurseong",
    followUpQuestions: [
      "What does the name Kurseong mean?",
      "Where does the train stop in Kurseong?",
      "Why is the track gauge so narrow?"
    ]
  },
  {
    id: "kurseong-meaning",
    question: "What does the name Kurseong mean?",
    aliases: [
      "what does the name kurseong mean",
      "meaning of kurseong",
      "kharsang land of white orchids",
      "kurseong name origin"
    ],
    answer: "Kurseong is derived from the Lepcha word 'Kharsang', which translates poetically to 'The Land of White Orchids' (Coelogyne cristata). The town sits at an agreeable elevation of 1,483 meters (4,864 feet) where temperatures remain pleasant year-round, surrounded by wild orchid blooms, mossy cryptomeria groves, and tea plantations.",
    sourceTitle: "Kurseong: Land of White Orchids",
    category: "culture",
    relatedStationId: "kurseong",
    followUpQuestions: [
      "Does the train really run through a crowded bazaar?",
      "Where does the train stop in Kurseong?",
      "What makes Darjeeling tea so famous?"
    ]
  },
  {
    id: "kurseong-station-stop",
    question: "Where does the train stop in Kurseong?",
    aliases: [
      "where does the train stop in kurseong",
      "kurseong station halt duration",
      "what is at kurseong station",
      "kurseong halt"
    ],
    answer: "The train halts for 10–15 minutes at Kurseong Station (km 49, elevation 1,483 m). The historic station includes a charming DHR Archive building, fresh local tea and snack stalls, and watering facilities for steam locomotives. It serves as a major operational midpoint between the plains section and the high-altitude alpine run.",
    sourceTitle: "Kurseong Station & Heritage Archive",
    category: "culture",
    relatedStationId: "kurseong",
    followUpQuestions: [
      "Does the train really run through a crowded bazaar?",
      "What does the name Kurseong mean?",
      "Where are the steam locomotives repaired?"
    ]
  },

  // Mahananda Wildlife
  {
    id: "wildlife-elephants",
    question: "Are there wild elephants near the train tracks?",
    aliases: [
      "are there wild elephants near the train tracks",
      "elephants on dhr route",
      "wild elephants sukna mahananda",
      "elephant corridor toy train"
    ],
    answer: "Yes! Between Sukna (km 17) and Rangtong (km 24), the DHR enters the Mahananda Wildlife Sanctuary, an important migratory corridor for Asian wild elephants (Elephas maximus). Herds regularly cross the tracks heading between the Teesta and Mechi rivers. To protect these gentle giants, train speeds are strictly limited to 10–15 km/h, and drivers maintain constant lookout with loud horn warnings.",
    sourceTitle: "Mahananda Sanctuary Elephant Corridor",
    category: "nature",
    relatedStationId: "sukna",
    followUpQuestions: [
      "What forest does the toy train go through?",
      "What birds can you spot from the train?",
      "Who are the track gangmen on the DHR?"
    ]
  },
  {
    id: "wildlife-forest",
    question: "What forest does the toy train go through?",
    aliases: [
      "what forest does the toy train go through",
      "forest around toy train",
      "sukna forest type",
      "mahananda sanctuary jungle"
    ],
    answer: "The Toy Train cuts through the tropical moist deciduous and sub-Himalayan evergreen forests of Mahananda Wildlife Sanctuary. The landscape is dominated by towering Sal trees (Shorea robusta), dense clumps of giant bamboo, riverine ferns, and fragrant champak trees before rising into subtropical oaks and rhododendrons.",
    sourceTitle: "Sub-Himalayan Tropical Sal Forests",
    category: "nature",
    relatedStationId: "sukna",
    followUpQuestions: [
      "Are there wild elephants near the train tracks?",
      "What birds can you spot from the train?",
      "What makes Darjeeling tea so famous?"
    ]
  },
  {
    id: "wildlife-birds",
    question: "What birds can you spot from the train?",
    aliases: [
      "what birds can you spot from the train",
      "birds in mahananda",
      "birdwatching dhr",
      "hornbills along toy train"
    ],
    answer: "Mahananda and the lower foothills are a birdwatcher's paradise with over 300 avian species. From the train window, keen passengers can spot the majestic Great Indian Hornbill, Rufous-necked Hornbill, Emerald Dove, Fairy Bluebird, White-rumped Shama, and brightly colored Himalayan Sunbirds darting among forest blossoms.",
    sourceTitle: "Himalayan Avian Biodiversity",
    category: "nature",
    relatedStationId: "rangtong",
    followUpQuestions: [
      "What forest does the toy train go through?",
      "Are there wild elephants near the train tracks?",
      "How tall is Mount Kanchenjunga?"
    ]
  },

  // Kanchenjunga
  {
    id: "kanchenjunga-height",
    question: "How tall is Mount Kanchenjunga?",
    aliases: [
      "how tall is mount kanchenjunga",
      "elevation of kanchenjunga",
      "kanchenjunga height in meters and feet",
      "how high is mount kanchenjunga"
    ],
    answer: "Mount Kanchenjunga stands at an elevation of 8,586 meters (28,169 feet) above sea level, making it the third highest mountain on Earth (surpassed only by Mount Everest and K2). The massif consists of five distinct summits, four of which exceed 8,400 meters.",
    sourceTitle: "Mount Kanchenjunga (8,586 m / 28,169 ft)",
    category: "nature",
    relatedStationId: "darjeeling",
    followUpQuestions: [
      "Why is Kanchenjunga considered sacred?",
      "Where is the best view of Kanchenjunga from the train?",
      "Which mountain peak is visible from Batasia?"
    ]
  },
  {
    id: "kanchenjunga-sacred",
    question: "Why is Kanchenjunga considered sacred?",
    aliases: [
      "why is kanchenjunga considered sacred",
      "kanchenjunga religious significance",
      "sacred mountain darjeeling sikkim",
      "five treasures of the snow"
    ],
    answer: "In local Lepcha and Sikkimese Buddhist belief, 'Kang-chen-zod-nga' means 'The Five Treasures of the Great Snow', representing the divine repositories of Gold, Silver, Gems, Grain, and Holy Scriptures. Believed to be the physical home of the guardian deity Dzo-nga, British mountaineers in 1955 promised the Chogyal (King) of Sikkim that they would never step on the sacred summit itself—a pact honored by climbers to this day by stopping short of the top.",
    sourceTitle: "The Sacred Massif: Five Treasures of the Snow",
    category: "culture",
    relatedStationId: "sonada",
    followUpQuestions: [
      "How tall is Mount Kanchenjunga?",
      "Where is the best view of Kanchenjunga from the train?",
      "What is the memorial inside Batasia Loop?"
    ]
  },
  {
    id: "kanchenjunga-best-view",
    question: "Where is the best view of Kanchenjunga from the train?",
    aliases: [
      "where is the best view of kanchenjunga from the train",
      "best place to see kanchenjunga from toy train",
      "viewpoints kanchenjunga dhr",
      "when to see kanchenjunga"
    ],
    answer: "The most spectacular views of Kanchenjunga are seen from:\n\n1. Batasia Loop (km 83) – A magnificent 360-degree amphitheater of snow peaks across the valley.\n2. Ghum to Darjeeling ridge – Morning dawn reveals the five summits glowing golden-pink.\n3. Sonada (km 67) – Looking northward across terraced valleys on crisp autumn mornings.",
    sourceTitle: "Best Viewpoints of Mount Kanchenjunga",
    category: "nature",
    relatedStationId: "batasia",
    followUpQuestions: [
      "How tall is Mount Kanchenjunga?",
      "Why is Kanchenjunga considered sacred?",
      "Why does the train loop around at Batasia?"
    ]
  },

  // Monsoon Maintenance
  {
    id: "monsoon-what-happens",
    question: "What happens to the toy train during the monsoon?",
    aliases: [
      "what happens to the toy train during the monsoon",
      "monsoon landslides dhr",
      "what happens during monsoon landslides",
      "does toy train run in rain"
    ],
    answer: "Between June and September, the Darjeeling hills receive over 3,000 mm of torrential monsoon rain. Heavy downpours often trigger landslides, debris flows, and track washouts along steep shale cuttings. When heavy slides occur, train services are paused on affected sections while emergency restoration crews and track gangmen work tirelessly to clear rocks and stabilize embankment slopes.",
    sourceTitle: "Monsoon Challenges on Himalayan Slopes",
    category: "engineering",
    relatedStationId: "chunbatti",
    followUpQuestions: [
      "Who are the track gangmen on the DHR?",
      "Where is Pagla Jhora and why is it dangerous?",
      "How do the Z-reverses (zig-zags) work?"
    ]
  },
  {
    id: "monsoon-gangmen",
    question: "Who are the track gangmen on the DHR?",
    aliases: [
      "who are the track gangmen on the dhr",
      "gangmen role dhr",
      "track patrolmen dhr",
      "railway safety patrol"
    ],
    answer: "The track gangmen are the unsung guardians of the DHR. Operating in pairs equipped with crowbars, spanners, and heavy umbrellas, they patrol designated 4 km track beats on foot twice daily. They inspect rail joints, test fishplates, clear drainage channels blocked by silt, and alert station masters immediately if fresh slope fractures or boulder movements appear.",
    sourceTitle: "The Gangmen: Unsung Guardians of the Track",
    category: "engineering",
    relatedStationId: "tindharia",
    followUpQuestions: [
      "What happens to the toy train during the monsoon?",
      "Where is Pagla Jhora and why is it dangerous?",
      "Where are the steam locomotives repaired?"
    ]
  },
  {
    id: "monsoon-paglajhora",
    question: "Where is Pagla Jhora and why is it dangerous?",
    aliases: [
      "where is pagla jhora and why is it dangerous",
      "pagla jhora landslide",
      "mad torrent dhr",
      "paglajhora fault line"
    ],
    answer: "Pagla Jhora (literally meaning 'The Mad Torrent' in Bengali/Nepali) is a notorious geological fault line located near km 40 between Tindharia and Gayabari. During monsoons, subterranean water channels swell into violent waterfalls cascading down the sheer cliff face, carrying boulders that have repeatedly washed away sections of the Hill Cart Road and DHR railway tracks over the past century.",
    sourceTitle: "Pagla Jhora: The Mad Torrent Fault Line",
    category: "engineering",
    relatedStationId: "gayabari",
    followUpQuestions: [
      "What happens to the toy train during the monsoon?",
      "Who are the track gangmen on the DHR?",
      "How do the Z-reverses (zig-zags) work?"
    ]
  },

  // General Inquiries
  {
    id: "general-joyride",
    question: "What is the Joy Ride service?",
    aliases: [
      "what is the joy ride",
      "joyride darjeeling to ghum",
      "darjeeling toy train joy ride",
      "tourist train darjeeling ghum"
    ],
    answer: "The DHR Joy Ride is a world-famous tourist steam safari operating between Darjeeling and Ghum (round trip: ~14 km). The 2-hour excursion pauses for 10 minutes at the iconic Batasia Loop with views of Kanchenjunga, and 30 minutes at the Ghum Railway Museum, powered by authentic vintage B-Class steam engines or modern diesel locomotives.",
    sourceTitle: "DHR Joy Ride Safari Experience",
    category: "culture",
    relatedStationId: "darjeeling",
    followUpQuestions: [
      "What can I see at Ghum railway station?",
      "Why does the train loop around at Batasia?",
      "What type of steam engine pulls the toy train?"
    ]
  },
  {
    id: "general-journey-time",
    question: "How long does the entire journey take?",
    aliases: [
      "how long does the entire journey take",
      "journey duration njp to darjeeling",
      "how many hours from njp to darjeeling toy train",
      "total time for toy train"
    ],
    answer: "The full 88-kilometer journey from New Jalpaiguri (NJP) to Darjeeling takes approximately 7 to 8 hours by regular passenger train, traveling at an average speed of 10 to 12 km/h. This leisurely pace allows passengers to absorb the breathtaking mountain scenery, inhale fresh tea aromas, and watch local life unfold right alongside the tracks.",
    sourceTitle: "NJP to Darjeeling Journey Duration",
    category: "history",
    relatedStationId: "njp",
    followUpQuestions: [
      "Who built the Darjeeling Himalayan Railway?",
      "Why is the track gauge only 2 feet?",
      "What is the elevation of Ghum station?"
    ]
  }
];

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
