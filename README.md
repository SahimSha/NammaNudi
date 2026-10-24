# NammaNudi — Everyday Kannada Companion (ನಮ್ಮನುಡಿ)

> **Learn it. Say it. Use it.**  
> A mobile-first, offline-ready Kannada companion for tourists, students, IT professionals, and non-Kannada speakers navigating daily life across Karnataka.

Built for the **Kannada Digital Innovation Hackathon 2026**  
**Problem Statement:** Problem Statement 3 — *Kannada in Everyday Life*

---

## 📌 Executive Summary

### Problem
Non-Kannada speakers in Karnataka frequently struggle with everyday micro-interactions at bus stands (BMTC/KSRTC), auto stands, Darshini hotels, grocery markets (KR Market), educational campuses, diagnostic clinics, and residential apartments. Generic translation tools often produce stiff, formal sentences, require constant high-speed mobile data, and do not provide an immediate, readable way to communicate with local people on the spot.

### Solution
**NammaNudi** solves this with an offline-first companion application featuring:
1. **9 Real-World Situation Categories** with 95+ verified, authentic, everyday colloquial and polite phrases.
2. **Instant Bilingual Transliteration & Phonetics** so learners know how to pronounce each phrase accurately.
3. **Show-to-Speak Full-Screen Mode:** An ultra-high-contrast, giant-typography card designed specifically to be shown directly to an auto driver, conductor, or shopkeeper.
4. **Browser SpeechSynthesis Integration:** Speech playback with automated Kannada voice detection and graceful fallback.
5. **Interactive Practice Quiz:** 4-option situational quizzes with smart distractors, instant feedback, and streak tracking.
6. **100% Offline-First Architecture:** Cached via Service Worker and Progressive Web App (PWA) manifest; zero backend or paid APIs required.

---

## 🚀 Key Features

### 1. Home Dashboard
- **Brand & Tagline:** Warm Karnataka cultural aesthetic with deep teal, sandalwood ivory, and temple gold accents.
- **Prominent Search Bar:** Jump directly to phrases by keyword (e.g. *auto meter*, *dosa*, *chillare*, *emergency*).
- **Phrase of the Day:** Fresh practical phrase with audio pronunciation, situation badge, and shuffle button.
- **Situation Category Grid:** Quick access to all 9 everyday categories with phrase counts and Kannada titles.
- **Learning Streak & Stats:** Live overview of day streak, quizzes taken, and accuracy percentage.
- **Saved Phrases Carousel:** Instant access to your pinned bookmarks.

### 2. Situation-Based Phrasebook (9 Categories)
Every phrase includes Kannada Unicode script, English translation, Roman transliteration, phonetic breakdown, context note, and formality level (`polite`, `casual`, `formal`).

1. **Travel & Directions (ದಾರಿ ಮತ್ತು ಪ್ರಯಾಣ):** Landmarks, right/left turns, Metro stations, distances.
2. **Public Transport & Buses (ಸಾರಿಗೆ ಮತ್ತು ಬಸ್ ನಿಲ್ದಾಣ):** BMTC bus stops, conductor queries, tickets, auto meter negotiations, UPI payment.
3. **Shopping & Markets (ಖರೀದಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆ):** Bargaining, asking prices, vegetable stalls, UPI QR codes.
4. **Food & Restaurants (ಆಹಾರ ಮತ್ತು ಹೋಟೆಲ್):** Darshini orders (masala dose, filter coffee), spice levels, bills, handwash, takeaways.
5. **Healthcare & Medical (ಆರೋಗ್ಯ ಮತ್ತು ಆಸ್ಪತ್ರೆ):** Describing symptoms, fever, pharmacy medication schedules, clinic appointments.
6. **Emergencies (ತುರ್ತು ಪರಿಸ್ಥಿತಿ):** 112 distress calls, lost phones/wallets, accident alerts, urgent assistance.
7. **Education & Campus (ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು):** Professor cabins, lecture timetables, library hours, xerox notes, classmate banter.
8. **Workplace & Office (ಕಚೇರಿ ಮತ್ತು ಕೆಲಸ):** Greetings, meeting schedules, lunch invites, casual leave requests, wrap-up.
9. **Accommodation & Daily Needs (ವಸತಿ ಮತ್ತು ದೈನಂದಿನ ಅಗತ್ಯಗಳು):** House rent, plumber/leak repairs, BBMP garbage trucks, domestic help, 20L water cans.

### 3. "Show-to-Speak" Full-Screen Mode
- Built for real-world encounters on noisy streets or crowded buses.
- Renders giant, high-contrast Kannada text readable from 2 meters away.
- One-tap audio speech button with visual waveform feedback.
- Accessible previous/next swipe buttons for active conversation flow.

### 4. Client-Side Instant Search
- Real-time client-side search across Kannada script, English meaning, phonetic transliteration, situation tags, and categories.
- Quick search recommendation pills.
- Empty states and clear search shortcuts.

### 5. Practice Quiz & Streaks
- Multiple-choice quiz engine with dynamic randomized questions.
- Tests English-to-Kannada and Kannada/Situation-to-English.
- Contextual explanations for every answer.
- Streak tracking and local score logging.

### 6. Local-First Progress & Privacy
- Tracks quizzes completed, accuracy %, categories mastered, and starred phrases.
- **100% on-device:** Persisted in browser `localStorage`. No accounts, tracking, or cloud sync needed.
- Complete user control with a "Reset Progress" option.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| **React 19** | Declarative component UI library |
| **TypeScript 6** | Strict type safety and compile-time correctness |
| **Vite 8** | High-performance bundler and development server |
| **Tailwind CSS v4** | Modern utility-first styling with custom typography |
| **React Router v7** | Client-side routing (`/phrasebook`, `/quiz`, `/saved`, `/progress`, `/search`, `/about`) |
| **Lucide React** | Clean, modern vector iconography |
| **Web SpeechSynthesis API** | Native text-to-speech with Kannada voice detection and fallback |
| **Service Worker & PWA** | Offline app shell caching, background asset caching, and standalone installation |
| **LocalStorage** | Persistence of favorites, recents, quiz scores, and streak |

---

## 🏛️ Architecture Overview

```
NammaNudi/
├── public/
│   ├── favicon.svg             # Custom Kannada 'ನ' vector favicon
│   ├── manifest.webmanifest    # PWA configuration
│   └── sw.js                   # Offline-first caching Service Worker
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── CategoryIcon.tsx    # Dynamic Lucide icon mapper
│   │   ├── Header.tsx          # Top navigation & offline status badge
│   │   ├── MobileNav.tsx       # Bottom mobile tab navigation
│   │   ├── PhraseCard.tsx      # Interactive phrase card
│   │   ├── PhraseDetailModal.tsx # Full phrase learning view
│   │   ├── ShowToSpeakModal.tsx  # Giant full-screen Show-to-Speak view
│   │   └── Toast.tsx           # Non-blocking user notifications
│   ├── context/
│   │   └── AppContext.tsx      # Global state (favourites, recents, progress, modals)
│   ├── data/
│   │   ├── categories.ts       # 9 Everyday situation categories
│   │   └── phrases.ts          # 95+ verified everyday Kannada phrases
│   ├── hooks/
│   │   ├── useOnlineStatus.ts  # Live navigator.onLine hook
│   │   └── useSpeech.ts        # Browser SpeechSynthesis hook
│   ├── pages/
│   │   ├── AboutPage.tsx       # Hackathon problem statement & documentation
│   │   ├── HomePage.tsx        # Dashboard, daily phrase, hero search
│   │   ├── PhrasebookPage.tsx  # Categorized phrase directory with filters
│   │   ├── ProgressPage.tsx    # Learning analytics and category mastery
│   │   ├── QuizPage.tsx        # Interactive practice quiz
│   │   ├── SavedPage.tsx       # Starred favorites and recent history
│   │   └── SearchPage.tsx      # Instant client-side search
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces & types
│   ├── utils/
│   │   └── speech.ts           # SpeechService engine with fallback logic
│   ├── App.tsx                 # Root application component and router
│   ├── index.css               # Tailwind CSS imports and Kannada fonts
│   └── main.tsx                # React root entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Local Setup & Run Instructions

### Prerequisites
- Node.js (version 18+ or 20+)
- npm or pnpm

### Installation
```bash
# Clone or navigate into the project directory
cd NammaNudi

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at: `http://localhost:5173`

---

## 📦 Production Build

```bash
# Typecheck and build optimized static assets
npm run build

# Preview production build locally
npm run preview
```

Static assets are compiled into the `dist/` directory, ready for deployment to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

---

## 📴 Offline Capability & Limitations

### How Offline Works
1. **Initial Visit:** On your first online visit, the Service Worker registers and caches the core app shell (`index.html`, stylesheets, scripts, icons).
2. **Phrase Database:** All 95+ phrases and 9 categories are bundled directly in the client bundle—**no API calls** are required to read, search, or practice phrases.
3. **Storage:** All bookmarks, quiz history, and streaks are stored locally in the browser's `localStorage`.
4. **PWA Standalone:** Users can install NammaNudi on Android or iOS ("Add to Home Screen") to launch it like an app even without cellular connectivity.

### Limitations & Honest Disclosure
- **Browser Kannada TTS Voice:** Text-to-speech audio depends on whether the user's OS or browser has a Kannada voice (`kn-IN` or `kn`) installed. If a system lacks a Kannada voice (such as barebones desktop browsers), NammaNudi gracefully warns the user and presents syllable phonetic guides rather than fabricating audio playback.
- **Initial Load:** A device must open the app at least once online to download and cache the static shell for subsequent offline visits.

---

## 📸 Screenshots & Visual Walkthrough

- **Home Screen:** Clean warm palette with daily phrase card and instant situation categories.
- **Show-to-Speak Mode:** Giant Kannada font on high-contrast backdrop designed for one-handed communication.
- **Category Phrasebook:** Filterable tabs with formality indicators and audio triggers.
- **Practice Quiz:** Real-world multiple-choice scenarios with instant feedback.
- **Progress Dashboard:** Streak counter, overall accuracy percentage, and category mastery breakdown.

---

## 🔮 Future Enhancements (Post-MVP Roadmap)

1. **AI Voice Pronunciation Scoring:** Browser WebAudio / WebAssembly acoustic scoring to rate pronunciation accuracy.
2. **Pre-recorded Native Audio Pack:** Bundled high-fidelity studio voice clips for all core phrases to ensure consistent audio on devices without native TTS.
3. **Kannada Script Practice:** Canvas-based stroke recognition for learning basic Kannada alphabet (Aksharamale).
4. **Contextual Geofencing:** Suggesting bus phrases when near BMTC bus stands or Darshini phrases during meal times.
5. **Community Submissions:** Verified crowdsourcing of regional Kannada dialects (e.g., Bengaluru, Mysuru, Hubballi-Dharwad, Mangaluru).

---

## 📜 License
Developed for the **Kannada Digital Innovation Hackathon 2026**. Open source under the MIT License.
