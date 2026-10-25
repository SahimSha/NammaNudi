# NammaNudi Offline Audio Assets & Contribution Guide

This directory (`public/audio/`) holds authentic offline audio recordings for **NammaNudi — Everyday Kannada Companion**.

---

## 1. Multi-Tier Audio Architecture

NammaNudi follows a 3-tier audio playback design to deliver authentic Kannada audio on all platforms without requiring any server or backend:

1. **Tier 1 (Authentic Local Audio):**
   If an authentic human audio file is placed in this directory (e.g. `public/audio/bs-01.mp3`) and mapped in `src/data/audioRegistry.ts`, NammaNudi plays it using the browser HTML5 Audio engine. The Service Worker automatically caches it offline on initial playback.
2. **Tier 2 (Native Browser Kannada SpeechSynthesis):**
   If no prerecorded audio file is registered, NammaNudi checks whether the client device has a native Kannada (`kn-IN`) TTS voice installed (available on Android via Google TTS and on Microsoft Edge via Natural voices).
3. **Tier 3 (Phonetic Syllable Breakdown & Show-to-Speak):**
   If neither a local recording nor a native Kannada voice exists on the client device (e.g. Windows Chrome without TTS pack), NammaNudi **never fabricates synthetic, silent, or fake audio**. Instead, it resets the button to idle, displays the syllable-by-syllable phonetic guide, and encourages opening the full-screen **Show-to-Speak** display.

---

## 2. Audio Quality & Recording Specifications

To ensure consistent quality, clear pronunciation, and optimal mobile loading, all contributed audio recordings must adhere to these standards:

| Parameter | Specification | Recommendation / Notes |
|---|---|---|
| **File Format** | MP3 (`.mp3`) | Universally supported across iOS, Android, macOS, Windows, Linux |
| **Sample Rate** | 44.1 kHz or 48 kHz | Standard audio fidelity |
| **Bitrate** | 128 kbps (CBR or VBR) | High speech clarity with minimal bundle footprint (~20-40 KB per phrase) |
| **Channels** | Mono | Optimal for voice; saves bandwidth |
| **Peak Normalization** | -1.0 dB FS | Ensures consistent loudness across all phrases without digital clipping |
| **Target Loudness** | -16 to -18 LUFS | Standard spoken podcast/voice level |
| **Trimming** | <100ms leading / trailing silence | Instant responsiveness upon button click |

---

## 3. Legal, Provenance & Licensing Requirements

To preserve legal integrity and authenticity:

1. **Native Speaker Authenticity:** Recordings must be performed by native or fluent Kannada speakers pronouncing contemporary, polite everyday Kannada.
2. **Open Licensing:** All contributed voice recordings must be explicitly released under one of the following open licenses:
   - **CC0 1.0 Universal (Public Domain Dedication)** *(Preferred)*
   - **Creative Commons Attribution 4.0 International (CC BY 4.0)**
   - **MIT License**
3. **Strict Ban on Fabricated Audio:** Do **NOT** use commercial cloud TTS dumps (e.g. ElevenLabs, AWS Polly, Google Cloud TTS) disguised as human recordings, do not upload silent files, and do not scrape non-free audio sources.

---

## 4. How to Add a Recording (Step-by-Step)

1. **Record the Phrase:**
   Record a native speaker speaking clearly at natural or slightly deliberate conversational pace.
2. **Export & Name File:**
   Trim background noise and silence, export as `.mp3`, and name the file with its exact phrase ID:
   ```
   public/audio/<phraseId>.mp3
   ```
   *(e.g., `public/audio/bs-01.mp3` for "ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ?")*
3. **Register in `src/data/audioRegistry.ts`:**
   Add the entry to `RECORDED_AUDIO_MAP`:
   ```typescript
   export const RECORDED_AUDIO_MAP: Record<string, string> = {
     'bs-01': '/audio/bs-01.mp3',
     // Add new phrase IDs here
   };
   ```
4. **Verify in App:**
   Run `npm run build` and test playback in your browser or local preview (`npm run preview`).

---

## 5. Complete Phrase Catalog (All 95 Phrases)

### Travel & Directions (ದಾರಿ ಮತ್ತು ಪ್ರಯಾಣ) — `travel-directions`
- `td-01.mp3`: ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗುವುದು? (How do I go here? / How to reach here?)
- `td-02.mp3`: ಸ್ವಲ್ಪ ಮುಂದಕ್ಕೆ ಹೋಗಿ, ಆಮೇಲೆ ಬಲಕ್ಕೆ ತಿರುಗಿ. (Go a little forward, then turn right.)
- `td-03.mp3`: ಎಡಕ್ಕೆ ಹೋಗಬೇಕಾ ಅಥವಾ ಬಲಕ್ಕಾ? (Should I go left or right?)
- `td-04.mp3`: ಇಲ್ಲಿ ಹತ್ತಿರ ಮೆಟ್ರೋ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? (Where is the nearest Metro station around here?)
- `td-05.mp3`: ಇದು ಎಷ್ಟು ದೂರ ಇದೆ? (How far is this?)
- `td-06.mp3`: ನಾನು ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ. (I have lost my way, please help me.)
- `td-07.mp3`: ನೇರವಾಗಿ ಹೋಗಿ, ಸರ್ಕಲ್ ಹತ್ತಿರ ನಿಲ್ಲಿಸಿ. (Go straight and stop near the circle / roundabout.)
- `td-08.mp3`: ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಯಾವ ಕಡೆ ಬರುತ್ತದೆ? (Which direction is the railway station?)
- `td-09.mp3`: ಇಲ್ಲಿಂದ ನಡ್ಕೊಂಡು ಹೋಗಬಹುದಾ? (Can I walk from here?)
- `td-10.mp3`: ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಬಹುದಾ? (Can you show it on the map?)

### Public Transport & Buses (ಸಾರಿಗೆ ಮತ್ತು ಬಸ್ ನಿಲ್ದಾಣ) — `public-transport`
- `pt-01.mp3`: ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ. (Please give one ticket to Majestic.)
- `pt-02.mp3`: ಈ ಬಸ್ ಶಿವಾಜಿನಗರಕ್ಕೆ ಹೋಗುತ್ತಾ? (Does this bus go to Shivajinagar?)
- `pt-03.mp3`: ಮುಂದಿನ ನಿಲ್ದಾಣ ಯಾವುದು? (Which is the next stop?)
- `pt-04.mp3`: ನನ್ನ ಸ್ಟಾಪ್ ಬಂದಾಗ ದಯವಿಟ್ಟು ತಿಳಿಸಿ. (Please let me know when my stop arrives.)
- `pt-05.mp3`: ಆಟೋ ಮೀಟರ್ ಹಾಕಿ ಬರುತ್ತೀರಾ? (Will you come by meter?)
- `pt-06.mp3`: ಇಲ್ಲಿ ಇಳಿಯುತ್ತೇನೆ, ನಿಲ್ಲಿಸಿ ಅಣ್ಣಾ. (I will get down here, please stop brother.)
- `pt-07.mp3`: ಮೆಟ್ರೋ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ರಿಚಾರ್ಜ್ ಮಾಡಬೇಕು. (I need to recharge my Metro smart card.)
- `pt-08.mp3`: ಚಿಲ್ಲರೆ ಇಲ್ಲ, ಯುಪಿಐ ಮಾಡಬಹುದಾ? (I don’t have change, can I pay via UPI?)
- `pt-09.mp3`: ಬಸ್ ಎಷ್ಟು ಹೊತ್ತಿಗೆ ಹೊರಡುತ್ತದೆ? (What time does the bus leave?)
- `pt-10.mp3`: ಇಂದಿರಾನಗರಕ್ಕೆ ಎಷ್ಟು ಆಗುತ್ತೆ ಅಣ್ಣಾ? (How much will it cost to Indiranagar, brother?)

### Shopping & Markets (ಖರೀದಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆ) — `shopping-markets`
- `sm-01.mp3`: ಇದು ಎಷ್ಟು ರೂಪಾಯಿ? (How much is this? (What is the price?))
- `sm-02.mp3`: ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಕೊಡಿ. (Please give some discount / make it a little cheaper.)
- `sm-03.mp3`: ತಾಜಾ ತರಕಾರಿಗಳು ಇವೆಯಾ? (Are there fresh vegetables?)
- `sm-04.mp3`: ಒಂದು ಕೆಜಿ ಈರುಳ್ಳಿ ಕೊಡಿ. (Give one kilo of onions.)
- `sm-05.mp3`: ಯುಪಿಐ ಕ್ಯೂಆರ್ ಕೋಡ್ ಎಲ್ಲಿದೆ? (Where is the UPI QR code?)
- `sm-06.mp3`: ಇದು ಬೇರೆ ಬಣ್ಣದಲ್ಲಿ ಸಿಗುತ್ತಾ? (Is this available in another colour?)
- `sm-07.mp3`: ಸ್ವಲ್ಪ ದೊಡ್ಡ ಸೈಜ್ ತೋರಿಸಿ. (Please show a slightly bigger size.)
- `sm-08.mp3`: ಬಿಲ್ ಕೊಡ್ತೀರಾ? (Will you give a bill / receipt?)
- `sm-09.mp3`: ಕ್ಯಾರಿ ಬ್ಯಾಗ್ ಅಥವಾ ಚೀಲ ಇದೆಯಾ? (Do you have a carry bag or cloth bag?)
- `sm-10.mp3`: ನನಗೆ ಇದು ಬೇಡ, ಬೇರೆ ತೋರಿಸಿ. (I don’t want this, show another one.)

### Food & Restaurants (ಆಹಾರ ಮತ್ತು ಹೋಟೆಲ್) — `food-dining`
- `fd-01.mp3`: ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ. (One masala dosa and hot filter coffee please.)
- `fd-02.mp3`: ಸ್ವಲ್ಪ ಖಾರ ಕಡಿಮೆ ಮಾಡಿ. (Please make it less spicy.)
- `fd-03.mp3`: ಕುಡಿಯಲು ಬಿಸಿ ನೀರು ಸಿಗುತ್ತಾ? (Can I get warm / hot drinking water?)
- `fd-04.mp3`: ಇಲ್ಲಿ ಸ್ಪೆಷಲ್ ಊಟ ಏನು? (What is the special meal / dish here?)
- `fd-05.mp3`: ಬಿಲ್ ತನ್ನಿ, ಕೈ ತೊಳೆಯುವ ಜಾಗ ಎಲ್ಲಿದೆ? (Bring the bill, and where is the handwash area?)
- `fd-06.mp3`: ಪಾರ್ಸಲ್ ಕಟ್ಟಿ ಕೊಡಿ. (Please pack it for takeaway / parcel.)
- `fd-07.mp3`: ಸಾಂಬಾರ್ ಸ್ವಲ್ಪ ಜಾಸ್ತಿ ಹಾಕಿ. (Please pour a little more sambar.)
- `fd-08.mp3`: ಇದು ಸಸ್ಯಾಹಾರ ಹೋಟೆಲ್ ಅಲ್ವಾ? (This is a vegetarian restaurant, right?)
- `fd-09.mp3`: ಉಪ್ಪು ಸ್ವಲ್ಪ ಕಡಿಮೆ ಇದೆ. (Salt is a bit less.)
- `fd-10.mp3`: ತಿಂಡಿ ತುಂಬಾ ರುಚಿಯಾಗಿದೆ! (The snack / food is very delicious!)

### Healthcare & Medical (ಆರೋಗ್ಯ ಮತ್ತು ಆಸ್ಪತ್ರೆ) — `healthcare`
- `hc-01.mp3`: ನನಗೆ ತಲೆನೋವು ಮತ್ತು ಜ್ವರ ಬಂದಿದೆ. (I have a headache and fever.)
- `hc-02.mp3`: ಹತ್ತಿರದ ಔಷಧಿ ಅಂಗಡಿ ಎಲ್ಲಿದೆ? (Where is the nearest medical shop / pharmacy?)
- `hc-03.mp3`: ಡಾಕ್ಟರ್ ಯಾವಾಗ ಸಿಗುತ್ತಾರೆ? (When will the doctor be available?)
- `hc-04.mp3`: ಹೊಟ್ಟೆ ನೋವಿಗೆ ಮಾತ್ರೆ ಇದೆಯಾ? (Is there a tablet for stomach ache?)
- `hc-05.mp3`: ಈ ಔಷಧಿಯನ್ನು ಊಟದ ನಂತರ ತಗೋಬೇಕಾ? (Should I take this medicine after food?)
- `hc-06.mp3`: ನನಗೆ ಅಲರ್ಜಿ ಇದೆ, ಬೇರೆ ಔಷಧಿ ಕೊಡಿ. (I have an allergy, give another medicine.)
- `hc-07.mp3`: ಬಿಪಿ ಮತ್ತು ಶುಗರ್ ಪರೀಕ್ಷೆ ಮಾಡಿಸಬೇಕು. (I need to get my blood pressure and sugar checked.)
- `hc-08.mp3`: ನನಗೆ ಉಸಿರಾಡಲು ಸ್ವಲ್ಪ ಕಷ್ಟವಾಗುತ್ತಿದೆ. (I am finding it a little difficult to breathe.)
- `hc-09.mp3`: ದಯವಿಟ್ಟು ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆಯಿರಿ. (Please call an ambulance.)
- `hc-10.mp3`: ದಿನಕ್ಕೆ ಎಷ್ಟು ಸಲ ಈ ಮಾತ್ರೆ ತಗೋಬೇಕು? (How many times a day should I take this tablet?)

### Emergencies (ತುರ್ತು ಪರಿಸ್ಥಿತಿ) — `emergencies`
- `em-01.mp3`: ದಯವಿಟ್ಟು ಬೇಗ ಸಹಾಯ ಮಾಡಿ! (Please help quickly!)
- `em-02.mp3`: ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ? (Where is the police station?)
- `em-03.mp3`: ನನ್ನ ಮೊಬೈಲ್ ಮತ್ತು ಪರ್ಸ್ ಕಳೆದುಹೋಗಿದೆ. (My phone and purse are lost / missing.)
- `em-04.mp3`: ಇಲ್ಲಿ ಅಪಘಾತ ಆಗಿದೆ. (An accident has happened here.)
- `em-05.mp3`: ದಯವಿಟ್ಟು ಪೊಲೀಸ್ ಅಥವಾ 112 ಗೆ ಕರೆ ಮಾಡಿ. (Please call the police or 112.)
- `em-06.mp3`: ನನಗೆ ತುರ್ತು ಸಹಾಯ ಬೇಕಾಗಿದೆ. (I need urgent emergency help.)
- `em-07.mp3`: ನನ್ನನ್ನು ಯಾರೋ ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆ, ರಕ್ಷಿಸಿ. (Someone is following me, please protect me.)
- `em-08.mp3`: ಬೆಂಕಿ ಬಿದ್ದಿದೆ, ಫೈರ್ ಬ್ರಿಗೇಡ್ ಕರೆಯಿರಿ. (A fire has broken out, call the fire brigade.)
- `em-09.mp3`: ನನಗೆ ದಾರಿ ಗೊತ್ತಿಲ್ಲ, ನಾನು ಕಳೆದುಹೋಗಿದ್ದೇನೆ. (I don’t know the way, I am lost.)
- `em-10.mp3`: ಶಾಂತರಾಗಿರಿ, ಎಲ್ಲವೂ ಸರಿಯಾಗುತ್ತದೆ. (Stay calm, everything will be alright.)

### Education & Campus (ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು) — `education-campus`
- `ed-01.mp3`: ಗ್ರಂಥಾಲಯ ಎಷ್ಟು ಗಂಟೆಗೆ ಮುಚ್ಚುತ್ತಾರೆ? (What time does the library close?)
- `ed-02.mp3`: ಪ್ರೊಫೆಸರ್ ಅವರ ಕೊಠಡಿ ಎಲ್ಲಿದೆ? (Where is the professor’s cabin / room?)
- `ed-03.mp3`: ನನಗೆ ಈ ನೋಟ್ಸ್ ಜೆರಾಕ್ಸ್ ಮಾಡಿಕೊಳ್ಳಲು ಕೊಡ್ತೀರಾ? (Will you lend me these notes to make photocopies?)
- `ed-04.mp3`: ಪರೀಕ್ಷಾ ಹಾಲ್ ಎಲ್ಲಿದೆ? (Where is the examination hall?)
- `ed-05.mp3`: ಈ ಅಸೈನ್‌ಮೆಂಟ್ ಸಲ್ಲಿಸಲು ಕೊನೆಯ ದಿನಾಂಕ ಯಾವಾಗ? (When is the deadline / last date to submit this assignment?)
- `ed-06.mp3`: ಕ್ಲಾಸ್ ಯಾವಾಗ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ? (When does the class start?)
- `ed-07.mp3`: ಕ್ಯಾಂಟೀನ್ ಯಾವ ಕಡೆ ಇದೆ? (Which side is the campus canteen?)
- `ed-08.mp3`: ಕನ್ನಡ ಕಲಿಯಲು ನನಗೆ ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡ್ತೀರಾ? (Will you help me a little with learning Kannada?)
- `ed-09.mp3`: ನನ್ನ ಐಡಿ ಕಾರ್ಡ್ ಕಳೆದುಹೋಗಿದೆ, ಹೊಸದು ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ? (I lost my student ID card, where do I get a new one?)
- `ed-10.mp3`: ಇವತ್ತು ರಜೆ ಇದೆಯಾ? (Is today a holiday?)

### Workplace & Office (ಕಚೇರಿ ಮತ್ತು ಕೆಲಸ) — `workplace`
- `wp-01.mp3`: ಶುಭೋದಯ! ಹೇಗಿದ್ದೀರಾ? (Good morning! How are you?)
- `wp-02.mp3`: ಮೀಟಿಂಗ್ ಎಷ್ಟು ಗಂಟೆಗೆ ಆರಂಭವಾಗುತ್ತದೆ? (What time does the meeting start?)
- `wp-03.mp3`: ಊಟಕ್ಕೆ ಹೋಗೋಣ್ವಾ? (Shall we go for lunch?)
- `wp-04.mp3`: ನಾನು ಒಂದು ದಿನ ರಜೆ ತೆಗೆದುಕೊಳ್ಳಬಹುದಾ? (Can I take one day of leave?)
- `wp-05.mp3`: ಈ ಕೆಲಸವನ್ನು ಇವತ್ತೇ ಮುಗಿಸುತ್ತೇನೆ. (I will finish this task today itself.)
- `wp-06.mp3`: ನಿಮ್ಮ ಸಹಾಯಕ್ಕೆ ತುಂಬಾ ಧನ್ಯವಾದಗಳು. (Thank you very much for your help.)
- `wp-07.mp3`: ದಯವಿಟ್ಟು ಈ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ. (Please review / check this email.)
- `wp-08.mp3`: ನನಗೆ ಈ ವಿಷಯ ಅರ್ಥವಾಗಲಿಲ್ಲ, ಮತ್ತೊಮ್ಮೆ ಹೇಳಿ. (I did not understand this topic, please explain again.)
- `wp-09.mp3`: ಟೀ ಬ್ರೇಕ್ ತಗೊಳ್ಳೋಣ್ವಾ? (Shall we take a quick tea / coffee break?)
- `wp-10.mp3`: ನಾಳೆ ಸಿಗೋಣ, ಬಾಯ್! (See you tomorrow, bye!)

### Accommodation & Daily Needs (ವಸತಿ ಮತ್ತು ದೈನಂದಿನ ಅಗತ್ಯಗಳು) — `accommodation-daily`
- `ad-01.mp3`: ಇಲ್ಲಿ 2BHK ಬಾಡಿಗೆ ಮನೆ ಇದೆಯಾ? (Is there a 2BHK rental house available here?)
- `ad-02.mp3`: ತಿಂಗಳಿಗೆ ಬಾಡಿಗೆ ಎಷ್ಟು ಮತ್ತು ಅಡ್ವಾನ್ಸ್ ಎಷ್ಟು? (How much is the monthly rent and deposit/advance?)
- `ad-03.mp3`: ನೀರು ಮತ್ತು ಕರೆಂಟ್ 24 ಗಂಟೆ ಬರುತ್ತಾ? (Is water and electricity available 24 hours?)
- `ad-04.mp3`: ಮನೆಯಲ್ಲಿ ಪೈಪ್ ಸೋರುತ್ತಿದೆ, ಪ್ಲಂಬರ್ ಕರೆಯಿರಿ. (The pipe is leaking in the house, please call a plumber.)
- `ad-05.mp3`: ಕಸ ತಗೋಳೋ ಗಾಡಿ ಬಂತಾ? (Has the garbage collection vehicle arrived?)
- `ad-06.mp3`: ಮನೆ ಕೆಲಸಕ್ಕೆ ಯಾರಾದರೂ ಪರಿಚಿತರು ಸಿಗುತ್ತಾರಾ? (Do you know someone reliable for household work / cleaning?)
- `ad-07.mp3`: ಕರೆಂಟ್ ಬಿಲ್ ಎಲ್ಲಿ ಕಟ್ಟಬೇಕು? (Where should I pay the electricity bill (BESCOM)?)
- `ad-08.mp3`: ನಮಗೆ 20 ಲೀಟರ್ ಕುಡಿಯುವ ನೀರಿನ ಕ್ಯಾನ್ ಬೇಕು. (We need a 20-litre drinking water can.)
- `ad-09.mp3`: ಇಂಟರ್ನೆಟ್ ವೈಫೈ ಕೆಲಸ ಮಾಡುತ್ತಿಲ್ಲ. (The internet WiFi is not working.)
- `ad-10.mp3`: ಅಕ್ಕಪಕ್ಕದಲ್ಲಿ ಲಾಂಡ್ರಿ ಶಾಪ್ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ? (Where can I find an ironing / laundry shop nearby?)

### Essential Kannada Everyday Survival Phrases — `bonus-phrases`
- `bs-01.mp3`: ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ? (Hello / Greetings! How are you?)
- `bs-02.mp3`: ಕನ್ನಡ ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಬರುತ್ತೆ. (I know a little bit of Kannada.)
- `bs-03.mp3`: ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ. (Please speak slowly.)
- `bs-04.mp3`: ನನಗೆ ಕನ್ನಡ ಸರಿಯಾಗಿ ಗೊತ್ತಿಲ್ಲ. (I do not know Kannada properly.)
- `bs-05.mp3`: ತುಂಬಾ ಧನ್ಯವಾದಗಳು ಅಣ್ಣಾ! (Thank you very much, brother!)
