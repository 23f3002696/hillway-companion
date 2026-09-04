export interface PhraseItem {
  id: string;
  category: 'chai_food' | 'shopping_bargain' | 'train_journey' | 'directions' | 'emergency' | 'courtesy';
  english: string;
  nepali: string;
  nepaliPhonetic: string;
  hindi: string;
  bengali: string;
  bengaliPhonetic: string;
  culturalNote?: string;
}

export const PHRASE_CATEGORIES = [
  { id: 'all', label: 'All Phrases', nepali: 'सबै', bengali: 'সব', hindi: 'सभी' },
  { id: 'chai_food', label: 'Chai & Food', nepali: 'चिया र खाना', bengali: 'চা ও খাবার', hindi: 'चाय और खाना' },
  { id: 'train_journey', label: 'Train & Halts', nepali: 'रेल यात्रा', bengali: 'ট্রেন যাত্রা', hindi: 'ट्रेन यात्रा' },
  { id: 'shopping_bargain', label: 'Bargaining & Cash', nepali: 'किनमेल', bengali: 'কেনাকাটা', hindi: 'खरीदारी' },
  { id: 'directions', label: 'Directions', nepali: 'बाटो सोध्ने', bengali: 'দিকনির্দেশ', hindi: 'रास्ता' },
  { id: 'emergency', label: 'Emergency & Help', nepali: 'आपतकालीन', bengali: 'জরুরি সাহায্য', hindi: 'आपातकालीन' },
  { id: 'courtesy', label: 'Courtesy & Chat', nepali: 'शिष्टाचार', bengali: 'ভদ্রতা', hindi: 'शिष्टाचार' }
];

export const PHRASEBOOK_DATA: PhraseItem[] = [
  // CHAI & FOOD
  {
    id: "p1",
    category: "chai_food",
    english: "One cup of hot milk tea, please.",
    nepali: "एक कप तातो दुध चिया दिनुहोस् न।",
    nepaliPhonetic: "Ek cup taato doodh chia dinuhos na.",
    hindi: "एक कप गरम दूध वाली चाय दीजिए।",
    bengali: "এক কাপ গরম দুধ চা দিন তো।",
    bengaliPhonetic: "Ek cup gorom doodh cha din to.",
    culturalNote: "Adding 'na' at the end in Nepali makes the request warm and respectful."
  },
  {
    id: "p2",
    category: "chai_food",
    english: "Give me one plate of steamed chicken momos.",
    nepali: "एक प्लेट उसिनेको चिकेन मःम दिनुहोस्।",
    nepaliPhonetic: "Ek plate usineko chicken mo:mo dinuhos.",
    hindi: "एक प्लेट स्टीम चिकन मोमोज़ दीजिए।",
    bengali: "এক প্লেট স্টিম চিকেন মোমো দিন।",
    bengaliPhonetic: "Ek plate steam chicken momo din.",
    culturalNote: "Steamed momos with red dalle chili paste (dalle khursani) are the iconic hill comfort food."
  },
  {
    id: "p3",
    category: "chai_food",
    english: "Make it less spicy, please.",
    nepali: "पिरो अलि कम गरिदिनुस् न।",
    nepaliPhonetic: "Piro ali kam garidinus na.",
    hindi: "थोड़ा कम तीखा बनाइएगा।",
    bengali: "একটু কম ঝাল দেবেন প্লিজ।",
    bengaliPhonetic: "Ektu kom jhaal deben please.",
    culturalNote: "Hill dalle chilies are intensely hot (100,000+ SHU), so ask for less spicy if sensitive."
  },
  {
    id: "p4",
    category: "chai_food",
    english: "Do you have mineral water / boiled water?",
    nepali: "पिउने पानीको बोतल छ कि?",
    nepaliPhonetic: "Piune paaniko botal chha ki?",
    hindi: "क्या पीने के पानी की बोतल है?",
    bengali: "খাবার জলের বোতল আছে কি?",
    bengaliPhonetic: "Khabar joler botol aachhe ki?",
    culturalNote: "Always drink sealed bottled or boiled water in the hills."
  },

  // TRAIN & HALTS
  {
    id: "p5",
    category: "train_journey",
    english: "How long will the train stop here?",
    nepali: "रेल यहाँ कति बेर रोकिन्छ?",
    nepaliPhonetic: "Rail yahaa kati ber rokinchha?",
    hindi: "ट्रेन यहाँ कितनी देर रुकेगी?",
    bengali: "ট্রেন এখানে কতক্ষণ থামবে?",
    bengaliPhonetic: "Train ekhane kotokhhon thambe?",
    culturalNote: "Water stops for steam engines usually take 10 to 15 minutes."
  },
  {
    id: "p6",
    category: "train_journey",
    english: "Which side has the view of the valley and mountains?",
    nepali: "कुन पट्टिबाट हिमाल र उपत्यका राम्रो देखिन्छ?",
    nepaliPhonetic: "Kun pattibaata himaal ra upatyakaa raamro dekhinchha?",
    hindi: "किस तरफ से पहाड़ और घाटी का नज़ारा अच्छा दिखेगा?",
    bengali: "কোন দিক থেকে পাহাড় আর উপত্যকার দৃশ্য ভালো দেখা যাবে?",
    bengaliPhonetic: "Kon dik theke pahar aar upottyokar drissho bhalo dekha jabe?",
    culturalNote: "Climbing from Siliguri, sitting on the right gives views of valley; near Ghum/Batasia, left looks to Kanchenjunga."
  },
  {
    id: "p7",
    category: "train_journey",
    english: "Is this the train going to Darjeeling?",
    nepali: "यो रेल दार्जिलिङ जाने नै हो?",
    nepaliPhonetic: "Yo rail Darjeeling jaane nai ho?",
    hindi: "क्या यह ट्रेन दार्जिलिंग जा रही है?",
    bengali: "এই ট্রেনটি কি দার্জিলিং যাচ্ছে?",
    bengaliPhonetic: "Ei train-ti ki Darjeeling jaachhe?",
    culturalNote: "Double check at Kurseong or Ghum as joy-rides operate between Ghum and Darjeeling."
  },
  {
    id: "p8",
    category: "train_journey",
    english: "Can I take a photo with the steam locomotive?",
    nepali: "स्टीम इन्जिनसँग एउटा फोटो खिच्न मिल्छ?",
    nepaliPhonetic: "Steam engine-sanga euta photo khichna milchha?",
    hindi: "क्या मैं स्टीम इंजन के साथ एक फोटो ले सकता हूँ?",
    bengali: "স্টিম ইঞ্জিনের সাথে একটা ছবি তুলতে পারি কি?",
    bengaliPhonetic: "Steam engine-er saathe ekta chhobi tulte paari ki?",
    culturalNote: "Locomotive drivers and firemen are proud of their engines and happy to pose if polite."
  },

  // SHOPPING & CASH
  {
    id: "p9",
    category: "shopping_bargain",
    english: "How much is this?",
    nepali: "यसको कति हो?",
    nepaliPhonetic: "Yesko kati ho?",
    hindi: "यह कितने का है?",
    bengali: "এটার দাম কত?",
    bengaliPhonetic: "Etar daam koto?",
    culturalNote: "Short and universally understood in bazaars."
  },
  {
    id: "p10",
    category: "shopping_bargain",
    english: "There is no mobile signal. Can I pay with cash?",
    nepali: "नेटवर्क छैन, म नगद (क्यास) दिन सक्छु?",
    nepaliPhonetic: "Network chhaina, ma nagad (cash) dina sakchhu?",
    hindi: "यहाँ नेटवर्क नहीं है, क्या मैं कैश दे सकता हूँ?",
    bengali: "নেটওয়ার্ক নেই, আমি কি ক্যাশ দিতে পারি?",
    bengaliPhonetic: "Network nei, aami ki cash dite paari?",
    culturalNote: "UPI often fails on the toy train route due to zero bars. Keep 50, 100, and 200 rupee notes handy."
  },
  {
    id: "p11",
    category: "shopping_bargain",
    english: "Can you give a little discount, brother / sister?",
    nepali: "अलि मिलाएर दिनुस् न दाजु / दिदी!",
    nepaliPhonetic: "Ali milaayera dinus na daaju / didi!",
    hindi: "थोड़ा ठीक लगा लीजिए भैया / दीदी।",
    bengali: "একটু কম রাখুন না দাদা / দিদি!",
    bengaliPhonetic: "Ektu kom rakhun na daada / didi!",
    culturalNote: "Addressing vendors as 'Daaju' (brother) or 'Didi' (sister) creates instant mutual respect."
  },
  {
    id: "p12",
    category: "shopping_bargain",
    english: "Is this genuine Darjeeling first flush tea?",
    nepali: "यो असली दार्जिलिङ पहिलो टिपाइ (फर्स्ट फ्लश) चिया हो?",
    nepaliPhonetic: "Yo aasli Darjeeling pahilo tipaai (first flush) chia ho?",
    hindi: "क्या यह असली दार्जिलिंग फर्स्ट फ्लश चाय है?",
    bengali: "এটা কি আসল দার্জিলিং ফার্স্ট ফ্লাশ চা?",
    bengaliPhonetic: "Eta ki aashol Darjeeling first flush cha?",
    culturalNote: "Look for the green Darjeeling Tea Board logo with the woman holding tea leaves."
  },

  // DIRECTIONS
  {
    id: "p13",
    category: "directions",
    english: "Where is the shared taxi stand for Darjeeling / Siliguri?",
    nepali: "दार्जिलिङ / सिलिगुडी जाने साझा ट्याक्सी स्टेन्ड कता छ?",
    nepaliPhonetic: "Darjeeling / Siliguri jaane saajha taxi stand kata chha?",
    hindi: "दार्जिलिंग / सिलीगुड़ी की शेयर टैक्सी कहाँ मिलेगी?",
    bengali: "দার্জিলিং / শিলিগুড়ির শেয়ার ট্যাক্সি স্ট্যান্ড কোথায়?",
    bengaliPhonetic: "Darjeeling / Siliguri-r share taxi stand kothay?",
    culturalNote: "Shared sumos/jeeps are the lifeline of hill road transit."
  },
  {
    id: "p14",
    category: "directions",
    english: "Which road goes up to Chowrasta / Mall Road?",
    nepali: "चौरास्ता / मल जाने बाटो कुन हो?",
    nepaliPhonetic: "Chowrasta / Mall jaane baato kun ho?",
    hindi: "चौरास्ता / माल रोड जाने का रास्ता कौन सा है?",
    bengali: "চৌরাস্তা / ম্যাল যাওয়ার রাস্তা কোনটি?",
    bengaliPhonetic: "Chowrasta / Mall jaowar raasta konti?",
    culturalNote: "Chowrasta is the pedestrian-only historic heart of Darjeeling town."
  },
  {
    id: "p15",
    category: "directions",
    english: "Is the road ahead open or blocked by landslide?",
    nepali: "अगाडिको बाटो खुलेको छ कि पहिरोले रोकिएको छ?",
    nepaliPhonetic: "Agaadiko baato khuleko chha ki pahirole rokiyeko chha?",
    hindi: "आगे का रास्ता खुला है या भूस्खलन से बंद है?",
    bengali: "সামনের রাস্তা কি খোলা আছে নাকি ধসে বন্ধ?",
    bengaliPhonetic: "Saamner raasta ki khola aachhe naaki dhose bondho?",
    culturalNote: "Crucial monsoon question. 'Pahiro' in Nepali and 'Dhos' in Bengali mean landslide."
  },

  // EMERGENCY & HELP
  {
    id: "p16",
    category: "emergency",
    english: "I am feeling dizzy / mountain altitude sickness.",
    nepali: "मलाई रिंगटा लाग्यो, लेक लागेको जस्तो छ।",
    nepaliPhonetic: "Malaai ringataa laagyo, lek laageko jasto chha.",
    hindi: "मुझे चक्कर आ रहे हैं, ऊंचाई की समस्या लग रही है।",
    bengali: "আমার মাথা ঘুরছে, উচ্চতাজনিত সমস্যা হচ্ছে।",
    bengaliPhonetic: "Aamar maatha ghurchhe, uchhotajonito shomossha hochhe.",
    culturalNote: "Ghum is at 2,258m; rapid climb from Siliguri (100m) can cause mild altitude symptoms. Sit down and sip warm water."
  },
  {
    id: "p17",
    category: "emergency",
    english: "Where is the nearest medical dispensary / clinic?",
    nepali: "नजिकैको स्वास्थ्य चौकी वा क्लिनिक कता छ?",
    nepaliPhonetic: "Najikaiko swaasthya chauki waa clinic kata chha?",
    hindi: "पास का अस्पताल या क्लिनिक कहाँ है?",
    bengali: "কাছের হাসপাতাল বা ক্লিনিক কোথায়?",
    bengaliPhonetic: "Kachher haashpaataal baa clinic kothay?",
    culturalNote: "Kurseong and Darjeeling have civil hospitals; stations have railway first-aid boxes."
  },
  {
    id: "p18",
    category: "emergency",
    english: "Please help! I left my bag in the train.",
    nepali: "कृपया मद्दत गर्नुहोस्! मेरो झोला रेलमै छुट्यो।",
    nepaliPhonetic: "Kripayaa maddat garnuhos! Mero jholaa railmai chhulyo.",
    hindi: "कृपया मदद कीजिए! मेरा बैग ट्रेन में छूट गया है।",
    bengali: "দয়া করে সাহায্য করুন! আমার ব্যাগটি ট্রেনে ফেলে এসেছি।",
    bengaliPhonetic: "Doya kore shaahajjo korun! Aamar bag-ti train-e phele eshechhi.",
    culturalNote: "Report immediately to the Station Master (SM) office on the platform."
  },

  // COURTESY & CHAT
  {
    id: "p19",
    category: "courtesy",
    english: "Hello / Greetings (Peace be upon you).",
    nepali: "नमस्ते! / नमस्कार!",
    nepaliPhonetic: "Namaste! / Namaskaar!",
    hindi: "नमस्ते! / प्रणाम!",
    bengali: "নমস্কার! / সেলাম!",
    bengaliPhonetic: "Nomoshkar! / Salaam!",
    culturalNote: "Join both palms together near chest level when saying Namaste."
  },
  {
    id: "p20",
    category: "courtesy",
    english: "Thank you very much!",
    nepali: "धेरै धेरै धन्यवाद!",
    nepaliPhonetic: "Dherai dherai dhanyabaad!",
    hindi: "बहुत-बहुत धन्यवाद!",
    bengali: "অনেক অনেক ধন্যবাদ!",
    bengaliPhonetic: "Onek onek dhonnobaad!",
    culturalNote: "Spoken with a warm smile across all hill communities."
  },
  {
    id: "p21",
    category: "courtesy",
    english: "How are you? / I am doing well.",
    nepali: "तपाईंलाई कस्तो छ? / मलाई सञ्चै छ।",
    nepaliPhonetic: "Tapaailaai kasto chha? / Malaai sanchai chha.",
    hindi: "आप कैसे हैं? / मैं ठीक हूँ।",
    bengali: "আপনি কেমন আছেন? / আমি ভালো আছি।",
    bengaliPhonetic: "Aapni kemon aachhen? / Aami bhalo aachhi.",
    culturalNote: "Locals appreciate travelers who attempt greetings in Nepali."
  }
];

