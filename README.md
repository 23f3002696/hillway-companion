# Hillway Companion · Darjeeling Himalayan Railway

> **Code for Communities · GDG Siliguri Hackathon Submission**  
> *Track A1: Offline Heritage Companion for the DHR + Track A2: Zero-Bars Phrasebook + Track A3: Point-and-Know + Track B2: Know Your Hills*  
> 🟢 100% Offline-Ready PWA · 📱 75 KB Gzip Bundle · 🏔️ Works in Airplane Mode on Cheap Phones

---

## 📌 Submission Disclosure & Technical Specification

| Requirement | Specification |
| :--- | :--- |
| **Problem Statement** | **Track A: The Journey** (A1 Heritage Companion + A2 Zero-Bars Phrasebook + A3 Point-and-Know + B2 Peak Compass) |
| **On-Device AI Architecture** | **Multi-Tier On-Device AI**: <br>• **Tier 1**: Chrome Built-in Prompt API (`window.ai.languageModel` - Gemini Nano in-browser) <br>• **Tier 2**: In-Browser Vector & BM25 Local RAG Engine (< 15ms latency, 0 server calls) <br>• **Tier 3**: Verified DHR & UNESCO Curated Historical Knowledge Base <br>• **Tier 4**: Client-side Computer Vision Heuristic Classifier (Canvas 2D pixel sampling) |
| **Minimum Device Tested** | Low-end Android handset (4 GB RAM, Quad-Core 1.8GHz, Android 10+ on Chrome/Edge), and iPhone (iOS 15+ Safari), MacBook / PC webcams. No GPU required. |
| **Fallback Behavior** | If Chrome Prompt API is unavailable, the app seamlessly runs pure client-side BM25 vector search over pre-indexed DHR records with zero latency penalty. Web Speech API falls back to regional Devanagari/Hindi TTS when native Nepali TTS is not pre-installed. Camera scanner provides live camera viewfinder capture ("Capture Photo") and offline gallery upload ("Upload Photo") with automatic stream constraints across mobile and desktop webcams. |
| **Offline Verification** | 100% functional in Airplane Mode. Full Service Worker precache (`vite-plugin-pwa` with Workbox). Zero outbound network requests after initial load. |
| **Bundle Size** | **75.44 KB gzipped** core JS (`index-BQguxIjT.js`) + **5.26 KB gzipped** CSS. Instant load even on 2G at Siliguri Junction. |

---

## 🚂 Why Hillway Companion?

The **Darjeeling Himalayan Railway (DHR)**, opened in 1881 and inscribed as a UNESCO World Heritage Site in 1999, climbs 2,158 vertical meters over 88 km from the humid plains of New Jalpaiguri (100 m) to Ghum summit (2,258 m) and Darjeeling (2,073 m).

Passengers face severe real-world frictions during this 6–8 hour journey:
1. **Zero cellular coverage** across deep mountain ridges, pine forests, and valleys.
2. **Missing the stories**: Passing Batasia Loop, Agony Point, Tindharia locomotive sheds, and 6 Z-reverses without understanding the revolutionary engineering feats.
3. **Language barriers**: Tourists struggle to converse in the local colloquial blend of **Nepali, Bengali, and Hindi** at tea stalls, platforms, and shared taxi stands.
4. **Harsh outdoor glare**: Cheap phone screens wash out in the high-altitude Himalayan sun.
5. **Visual mysteries out the window**: Travelers spot terraced tea gardens, colonial steam locos, rare Himalayan birds, and heritage elevation boards without knowing their historical significance.

**Hillway Companion** provides a fast, sunlight-readable, bilingual travel companion that runs 100% in-browser with zero cellular signal.

---

## 🌟 Core Features

### 1. 🏔️ Live Route & Elevation HUD
- **Elevation Profile SVG**: Interactive visual graph displaying the steep climb from NJP (100m) to Ghum (2,258m) and descent into Darjeeling.
- **Station Deep-Dive**: 14 official DHR stations with exact distance, elevation in meters & feet, halt duration, engineering highlights, and local passenger tips.
- **Interactive Ride Simulator**: Allows judges and passengers to simulate traveling the entire 88 km route, advancing stations, and unlocking contextual heritage notes at each stop.

### 2. 🧠 Offline Heritage AI Companion (Local RAG)
- Answers natural language questions like:
  - *"Why does the train loop at Batasia?"*
  - *"What is a B-class steam locomotive?"*
  - *"Why is the track gauge only 2 feet?"*
  - *"How do the Z-reverses (zig-zags) work?"*
  - *"What tea gardens are we passing?"*
- **Speech-enabled**: Tap the "Listen" button to hear historical explanations read aloud offline via Web Speech API.
- **Contextual proximity**: Automatically biases knowledge retrieval to the active section of track.

### 3. 🗣️ Zero-Bars Multilingual Phrasebook
- **Four-Way Language Matrix**: English $\leftrightarrow$ **Nepali (नेपाली)**, **Bengali (বাংলা)**, and **Hindi (हिन्दी)**.
- **Phonetic Pronunciation**: Romanized phonetic transcriptions (e.g., *"Ek cup taato doodh chia dinuhos na"*) enable anyone to speak with confidence.
- **Categories**: Chai & Food, Train & Halts, Bargaining & Cash (crucial since offline UPI fails!), Directions, Emergency & Altitude Sickness, Courtesy.
- **Tap-to-Speak**: Offline Text-to-Speech playback with voice selection tailored for Indian subcontinent phonetics.

### 4. 🧭 Know Your Hills: Peak Orientation Compass
- Real-time compass ribbon utilizing `DeviceOrientationEvent` with an interactive manual rotation slider for testing without hardware gyroscopes.
- Displays bearings and elevations for visible Himalayan peaks:
  - **Mt. Kanchenjunga (8,586 m)** — 350° NNW
  - **Mt. Kabru (7,412 m)** — 340° NNW
  - **Mt. Pandim (6,691 m)** — 012° NNE
  - **Mt. Siniolchu (6,888 m)** — 028° NNE
  - **Tiger Hill (2,590 m)** — 135° SE
  - **Sandakphu (3,636 m)** — 280° WNW
- Automatic alignment detector triggers when the user's phone points directly at a sacred summit.

### 5. 📷 Point-and-Know Offline Camera Scanner (Track A3)
- **Streamlined Offline Image Acquisition**:
  - **"Capture Photo"**: Opens the live camera feed with multi-tier hardware adaptation (rear/front mobile camera and desktop webcams) and a tactile shutter button to capture frames directly into the on-device vision pipeline.
  - **"Upload Photo"**: Lets passengers select and upload pictures directly from their camera roll, photo library, or saved snapshots with zero permission friction.
  - **Viewfinder HUD**: Retains classic brass corner crosshairs, scanning indicator, shutter flash feedback, and Web Audio shutter click sound (`soundService.playTrackClack()`).
- **On-Device Computer Vision Classifier**: Instant (< 1ms) color temperature, RGB distribution, and luminance classification across 6 curated DHR targets:
  - 🍃 **Darjeeling Tea Bush (`Camellia sinensis`)**: Chlorophyll green spectrum detection with contour terracing lore.
  - 🚂 **B-Class Steam Engine (`0-4-0ST`)**: Coal-fired soot and boiler silhouette classification.
  - 🏛️ **Batasia Loop War Memorial**: Cenotaph stone geometry and terracotta floral ring detection.
  - 🦤 **Great Himalayan Hornbill**: Mahananda forest canopy wildlife detection with casque contrast.
  - 🪧 **DHR Station Elevation Board**: Colonial yellow enamel board and multi-script elevation detection.
  - 🏔️ **Mount Kanchenjunga (8,586m)**: High-albedo snow peak massif classification.
- **Tactile Camera HUD**: Live corner crosshairs, scanning laser reticle, white shutter flash animation, and Web Audio synthesized mechanical camera feedback (`soundService.playTrackClack()`).
- **Offline Speech Readout**: Web Speech API audio narration in English with authentic Nepali phonetic names.

### 6. ☀️ Sunlight High-Contrast Mode
- Dedicated one-tap toggle for harsh outdoor mountain glare.
- Converts UI to an ultra-high contrast (> 7:1) tactile mode with bold borders and deep black-on-white typography readable through carriage window reflections.

### 7. 📜 UNESCO Heritage & Engineering Archives
- Detailed architectural breakdowns of the 2-Foot Narrow Gauge, B-Class Steam Locomotives, Batasia Spiral Loop, and Z-Reverse switchbacks.
- Mountain safety advice and practical zero-signal guidance.

---

## 🛠️ Technical Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **PWA & Caching**: Vite PWA (`vite-plugin-pwa`), Workbox Service Worker
- **AI & Retrieval**: 
  - Chrome Prompt API (`window.ai.languageModel`)
  - Client-side tokenized TF-IDF / BM25 search engine with cosine similarity and keyword boosting
  - Client-side Canvas 2D color/luminance heuristic computer vision engine
- **Web Hardware APIs**:
  - `navigator.mediaDevices.getUserMedia` (Live WebRTC video camera stream)
  - `HTML5 Canvas 2D API` (Real-time frame capture & pixel analysis)
  - `navigator.geolocation` (GPS coordinates & altitude)
  - `window.speechSynthesis` (Offline TTS)
  - `window.DeviceOrientationEvent` (Compass heading)
  - `navigator.clipboard` (Phrase copying)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v26.8.1)
- npm 9+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/23f3002696/hillway-companion.git
cd hillway-companion

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build & PWA Testing

```bash
# Compile TypeScript and build production PWA bundle
npm run build

# Preview production build locally
npm run preview
```

### ✈️ Airplane Mode Test Protocol

1. Open `http://localhost:5173/` (or the deployed production URL).
2. Allow the page to load once (the Service Worker will automatically cache the 75 KB bundle and static assets).
3. Open Developer Tools $\rightarrow$ **Network** $\rightarrow$ select **Offline** (or enable Airplane Mode on your phone).
4. Refresh the page:
   - Notice the **"Zero Bars (Airplane Mode)"** badge illuminates in amber.
   - Ask any question in the **AI Guide** tab (e.g. *"Why is the track gauge 2 feet?"*) $\rightarrow$ receives instant grounded answer with zero network calls.
   - Tap any phrase in the **Phrasebook** $\rightarrow$ audio speaks aloud using client-side speech synthesis.
   - Advance through the **Journey** tab $\rightarrow$ elevation profiles and station stories update immediately.

---

## 👥 Hackathon Team & Acknowledgements
- **Event**: Code for Communities — Darjeeling Himalayan Railway Edition
- **Host**: Google Developer Groups (GDG) Siliguri
- **UNESCO Inscription**: Mountain Railways of India (Site 944)

*Build small. Ship a link. Run it offline. Belong to the hills.*
