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

## 5. Complete Phrase Catalog (95 Phrases)

### Travel & Directions (`travel-directions`)
- `td-01.mp3`: ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗುವುದು? (How do I go here?)
- `td-02.mp3`: ಸ್ವಲ್ಪ ಮುಂದಕ್ಕೆ ಹೋಗಿ, ಆಮೇಲೆ ಬಲಕ್ಕೆ ತಿರುಗಿ. (Go a little forward, then turn right.)
- `td-03.mp3`: ಎಡಕ್ಕೆ ಹೋಗಬೇಕಾ ಅಥವಾ ಬಲಕ್ಕಾ? (Should I go left or right?)
- `td-04.mp3`: ಇಲ್ಲಿ ಹತ್ತಿರ ಮೆಟ್ರೋ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ? (Where is the nearest Metro station around here?)
- `td-05.mp3`: ಇಲ್ಲಿಂದ ಎಷ್ಟು ದೂರ ಇದೆ? (How far is it from here?)
- `td-06.mp3`: ಕಾಲ್ನಡಿಗೆಯಲ್ಲಿ ಹೋಗಬಹುದಾ? (Can I go there by walk?)
- `td-07.mp3`: ಆ ಜಾಗಕ್ಕೆ ತಲುಪಲು ಎಷ್ಟು ಸಮಯ ಬೇಕಾಗುತ್ತದೆ? (How much time will it take to reach that place?)
- `td-08.mp3`: ನಾನು ದಾರಿ ತಪ್ಪಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ. (I have lost my way, please help.)
- `td-09.mp3`: ನೇರವಾಗಿ ಹೋಗಿ, ಸಿಗ್ನಲ್ ನಂತರ ಎಡಕ್ಕೆ ತಿರುಗಿ. (Go straight, turn left after the signal.)
- `td-10.mp3`: ಈ ಹತ್ತಿರದಲ್ಲಿ ಆಟೋ ಸ್ಟ್ಯಾಂಡ್ ಎಲ್ಲಿದೆ? (Where is the auto stand nearby?)

### Public Transport & Buses (`public-transport`)
- `pt-01.mp3`: ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗುತ್ತಾ? (Does this bus go to Majestic?)
- `pt-02.mp3`: ಮುಂದಿನ ಸ್ಟಾಪ್ ಯಾವುದು? (Which is the next stop?)
- `pt-03.mp3`: ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ. (Please put the meter, brother.)
- `pt-04.mp3`: ಇಂದಿರಾನಗರಕ್ಕೆ ಎಷ್ಟು ಆಗುತ್ತೆ? (How much to Indiranagar?)
- `pt-05.mp3`: ಚಿಲ್ಲರೆ ಇಲ್ಲ, UPI ಮಾಡ್ಲಾ? (No change, can I pay via UPI?)
- `pt-06.mp3`: ಇಬ್ಬರಿಗೆ ಶಿವಾಜಿನಗರ ಟಿಕೆಟ್ ಕೊಡಿ. (Give two tickets to Shivajinagar.)
- `pt-07.mp3`: ಈ ಬಸ್ ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿಗೆ ಹೋಗುತ್ತಾ? (Does this bus go to Electronic City?)
- `pt-08.mp3`: ಬಸ್ ನಿಲ್ಲಿಸಿ, ನಾನು ಇಳಿಯಬೇಕು! (Stop the bus, I need to get down!)
- `pt-09.mp3`: ಮುಂದಿನ ಸ್ಟಾಪ್ ಬಂದಾಗ ದಯವಿಟ್ಟು ತಿಳಿಸಿ. (Please inform me when the next stop arrives.)
- `pt-10.mp3`: ಆಟೋದಲ್ಲಿ ಎಷ್ಟು ಜನ ಹೋಗಬಹುದು? (How many people can travel in the auto?)
- `pt-11.mp3`: ಮೆಟ್ರೋ ಟೋಕನ್ ಎಲ್ಲಿ ಸಿಗುತ್ತೆ? (Where do we get metro tokens?)
- `pt-12.mp3`: ಮೆಟ್ರೋ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ರಿಚಾರ್ಜ್ ಮಾಡಬೇಕು. (Need to recharge metro smart card.)

### Shopping & Markets (`shopping-markets`)
- `sm-01.mp3`: ಇದರ ಬೆಲೆ ಎಷ್ಟು? (How much does this cost?)
- `sm-02.mp3`: ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ ಕೊಡಿ. (Please reduce the price a little.)
- `sm-03.mp3`: ಒಂದು ಕೆಜಿ ಟೊಮೇಟೊ ಕೊಡಿ. (Please give one kilogram of tomatoes.)
- `sm-04.mp3`: ತಾಜಾ ತರಕಾರಿಗಳು ಇವೆಯಾ? (Are these fresh vegetables?)
- `sm-05.mp3`: ಫೋನ್ ಪೇ / ಗೂಗಲ್ ಪೇ ಇದೆಯಾ? (Is PhonePe / Google Pay available?)
- `sm-06.mp3`: ಬ್ಯಾಗ್ ಇದೆಯಾ ಅಥವಾ ಕ್ಯಾರಿ ಬ್ಯಾಗ್ ಕೊಡ್ತೀರಾ? (Do you have a carry bag?)
- `sm-07.mp3`: ಇದು ತುಂಬಾ ದುಬಾರಿ ಆಯ್ತು! (This is too expensive!)
- `sm-08.mp3`: ಬೇರೆ ಬಣ್ಣ ಅಥವಾ ಸೈಜ್ ಇದೆಯಾ? (Do you have a different colour or size?)
- `sm-09.mp3`: ಬಿಲ್ ಕೊಡಿ ದಯವಿಟ್ಟು. (Please give the bill.)
- `sm-10.mp3`: ಸಾಕು, ಇಷ್ಟೇ ಸಾಕು. (Enough, this is enough.)
- `sm-11.mp3`: ಚಿಲ್ಲರೆ ವಾಪಸ್ ಕೊಡಿ. (Please give back the change.)

### Food & Restaurants (`food-restaurants`)
- `fr-01.mp3`: ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ. (Please give one masala dose.)
- `fr-02.mp3`: ಕಾಫಿ ಬಿಸಿಯಾಗಿ ಕೊಡಿ, ಸಕ್ಕರೆ ಕಡಿಮೆ. (Please give hot coffee, less sugar.)
- `fr-03.mp3`: ಊಟದಲ್ಲಿ ಖಾರ ಕಡಿಮೆ ಮಾಡಿ. (Please make the food less spicy.)
- `fr-04.mp3`: ಕೈ ತೊಳೆಯುವ ಜಾಗ ಎಲ್ಲಿದೆ? (Where is the place to wash hands?)
- `fr-05.mp3`: ಬಿಲ್ ಎಷ್ಟು ಆಯಿತು? (How much is the bill?)
- `fr-06.mp3`: ಪಾರ್ಸೆಲ್ ಮಾಡಿಕೊಡಿ. (Please pack this for takeaway.)
- `fr-07.mp3`: ಕುಡಿಯುವ ನೀರು ಕೊಡಿ ದಯವಿಟ್ಟು. (Please give drinking water.)
- `fr-08.mp3`: ಇಲ್ಲಿ ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ ಊಟ ಸಿಗುತ್ತಾ? (Is pure vegetarian food available here?)
- `fr-09.mp3`: ಇವತ್ತಿನ ಸ್ಪೆಷಲ್ ಏನು? (What is today's special?)
- `fr-10.mp3`: ಒಂದು ಪ್ಲೇಟ್ ಇಡ್ಲಿ ವಡೆ ಸಾಂಬಾರ್ ಕೊಡಿ. (Please give one plate idli vada with sambar.)
- `fr-11.mp3`: ಚಟ್ನಿ ಸ್ವಲ್ಪ ಜಾಸ್ತಿ ಕೊಡಿ. (Please give a little extra chutney.)
- `fr-12.mp3`: ಊಟ ತುಂಬಾ ರುಚಿಯಾಗಿತ್ತು! (The food was very delicious!)

### Healthcare & Medical (`healthcare-medical`)
- `hm-01.mp3`: ನನಗೆ ಹುಷಾರಿಲ್ಲ, ಜ್ವರ ಬಂದಿದೆ. (I am not feeling well, I have fever.)
- `hm-02.mp3`: ಹತ್ತಿರದಲ್ಲಿ ಕ್ಲಿನಿಕ್ ಅಥವಾ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ? (Where is the nearest clinic or hospital?)
- `hm-03.mp3`: ಈ ಮಾತ್ರೆಗಳನ್ನು ಊಟದ ನಂತರ ತಗೋಬೇಕಾ? (Should I take these tablets after food?)
- `hm-04.mp3`: ಡಾಕ್ಟರ್ ಯಾವಾಗ ಬರ್ತಾರೆ? (When will the doctor arrive?)
- `hm-05.mp3`: ನನಗೆ ತಲೆನೋವು ಮತ್ತು ಕೆಮ್ಮು ಇದೆ. (I have headache and cough.)
- `hm-06.mp3`: ಮೆಡಿಕಲ್ ಶಾಪ್ ರಾತ್ರಿ ಓಪನ್ ಇರುತ್ತಾ? (Is the medical pharmacy open at night?)
- `hm-07.mp3`: ನನಗೆ ಈ ಔಷಧಿ ತುರ್ತಾಗಿ ಬೇಕು. (I need this medicine urgently.)
- `hm-08.mp3`: ಹೊಟ್ಟೆ ನೋವಿಗೆ ಮಾತ್ರೆ ಇದೆಯಾ? (Do you have tablets for stomach ache?)
- `hm-09.mp3`: ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ತಗೋಬೇಕಾ? (Do we need to take an appointment?)
- `hm-10.mp3`: ರಕ್ತ ಪರೀಕ್ಷೆ ಎಲ್ಲಿ ಮಾಡಿಸಬೇಕು? (Where should blood test be done?)

### Emergencies (`emergencies`)
- `em-01.mp3`: ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ! (Please help me!)
- `em-02.mp3`: ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ, ಬೇಗ! (Call an ambulance, quickly!)
- `em-03.mp3`: ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ? (Where is the police station?)
- `em-04.mp3`: ನನ್ನ ಮೊಬೈಲ್ ಕಳೆದುಹೋಗಿದೆ. (My mobile phone is lost.)
- `em-05.mp3`: ನನ್ನ ಪರ್ಸ್ ಕಳ್ಳತನವಾಗಿದೆ. (My purse / wallet has been stolen.)
- `em-06.mp3`: ಇಲ್ಲಿ ಅಪಘಾತವಾಗಿದೆ, ಬೇಗ ಬನ್ನಿ! (An accident has occurred here, come quickly!)
- `em-07.mp3`: ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಇದೆ, ದಾರಿ ಬಿಡಿ! (There is an emergency, make way!)
- `em-08.mp3`: ನನಗೆ ಉಸಿರಾಟದ ತೊಂದರೆ ಆಗ್ತಿದೆ. (I am having trouble breathing.)
- `em-09.mp3`: ಯಾರಾದರೂ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಬಲ್ಲವರು ಇದ್ದೀರಾ? (Is there anyone who knows Kannada and English?)
- `em-10.mp3`: ಪೊಲೀಸ್ ಸಹಾಯವಾಣಿ 112 ಗೆ ಕರೆ ಮಾಡಿ. (Call the police helpline 112.)

### Education & Campus (`education-campus`)
- `ec-01.mp3`: ಕ್ಲಾಸ್ ಯಾವ ರೂಮ್‌ನಲ್ಲಿ ಇದೆ? (In which room is the class?)
- `ec-02.mp3`: ಲೈಬ್ರರಿ ಎಷ್ಟು ಗಂಟೆಗೆ ಮುಚ್ಚುತ್ತೆ? (At what time does the library close?)
- `ec-03.mp3`: ಇವತ್ತಿನ ನೋಟ್ಸ್ ಕೊಡ್ತೀರಾ? (Will you give today's notes?)
- `ec-04.mp3`: ಪ್ರೊಫೆಸರ್ ಅವರ ಕ್ಯಾಬಿನ್ ಎಲ್ಲಿದೆ? (Where is the professor's cabin?)
- `ec-05.mp3`: ಅಸೈನ್‌ಮೆಂಟ್ ಸಬ್ಮಿಷನ್ ಕೊನೆ ದಿನ ಯಾವಾಗ? (When is the last date for assignment submission?)
- `ec-06.mp3`: ಜೆರಾಕ್ಸ್ ಅಂಗಡಿ ಕ್ಯಾಂಪಸ್‌ನಲ್ಲಿ ಎಲ್ಲಿದೆ? (Where is the xerox photocopy shop on campus?)
- `ec-07.mp3`: ಕ್ಯಾಂಟೀನ್ ಎಲ್ಲಿ ಇದೆ? (Where is the canteen?)
- `ec-08.mp3`: ನಾಳೆ ಕಾಲೇಜ್ ರಜೆ ಇದೆಯಾ? (Is tomorrow a college holiday?)
- `ec-09.mp3`: ಎಕ್ಸಾಮ್ ಹಾಲ್ ಟಿಕೆಟ್ ಎಲ್ಲಿ ಸಿಗುತ್ತೆ? (Where do we get the exam hall ticket?)
- `ec-10.mp3`: ಲ್ಯಾಬ್ ಸೆಷನ್ ಯಾವಾಗ ಶುರುವಾಗುತ್ತೆ? (When does the laboratory session begin?)

### Workplace & Office (`workplace-office`)
- `wo-01.mp3`: ನಮಸ್ಕಾರ, ಶುಭೋದಯ! (Hello, Good morning!)
- `wo-02.mp3`: ಮೀಟಿಂಗ್ ಎಷ್ಟು ಗಂಟೆಗೆ ಶುರುವಾಗುತ್ತೆ? (What time does the meeting start?)
- `wo-03.mp3`: ಊಟಕ್ಕೆ ಹೋಗೋಣ್ವಾ? (Shall we go for lunch?)
- `wo-04.mp3`: ಈ ಡಾಕ್ಯುಮೆಂಟ್ ಸ್ವಲ್ಪ ರಿವ್ಯೂ ಮಾಡ್ತೀರಾ? (Will you please review this document?)
- `wo-05.mp3`: ನಾನು ಇವತ್ತು ಅರ್ಧ ದಿನ ರಜೆ ತಗೋತೀನಿ. (I am taking a half-day leave today.)
- `wo-06.mp3`: ಇವತ್ತಿನ ಕೆಲಸ ಮುಗಿಯಿತು, ನಾಳೆ ಸಿಗೋಣ. (Today's work is finished, see you tomorrow.)
- `wo-07.mp3`: ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಕಟ್ ಆಗಿದೆ. (Internet connection is disconnected.)
- `wo-08.mp3`: ಕಾನ್ಫರೆನ್ಸ್ ರೂಮ್ ಬುಕ್ ಆಗಿದೆಯಾ? (Is the conference room booked?)
- `wo-09.mp3`: ಇಮೇಲ್ ಕಳಿಸಿದ್ದೇನೆ, ದಯವಿಟ್ಟು ನೋಡಿ. (I have sent an email, please check.)
- `wo-10.mp3`: ಮ್ಯಾನೇಜರ್ ಯಾವಾಗ ಲಭ್ಯವಿರುತ್ತಾರೆ? (When will the manager be available?)

### Accommodation & Daily Needs (`accommodation-daily`)
- `ad-01.mp3`: ಮನೆ ಬಾಡಿಗೆ ಎಷ್ಟು? (How much is the house rent?)
- `ad-02.mp3`: ನಲ್ಲಿಯಲ್ಲಿ ನೀರು ಬರ್ತಿಲ್ಲ. (Water is not coming from the tap.)
- `ad-03.mp3`: ಕಸದ ಗಾಡಿ ಯಾವಾಗ ಬರುತ್ತೆ? (When does the BBMP garbage truck arrive?)
- `ad-04.mp3`: ಪ್ಲಂಬರ್ ಅಥವಾ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ ನಂಬರ್ ಇದೆಯಾ? (Do you have a plumber or electrician's number?)
- `ad-05.mp3`: ವೈಫೈ ಪಾಸ್‌ವರ್ಡ್ ಏನು? (What is the WiFi password?)
- `ad-06.mp3`: ಕರೆಂಟ್ ಹೋಯಿತು, ಯಾವಾಗ ಬರುತ್ತೆ? (Power went out, when will it return?)
- `ad-07.mp3`: ಇವತ್ತು ಕೆಲಸದವರು ಬರ್ತಾರಾ? (Will the domestic helper come today?)
- `ad-08.mp3`: ಅಡ್ವಾನ್ಸ್ ಅಮೌಂಟ್ ಎಷ್ಟು ಕೊಡಬೇಕು? (How much advance deposit should be paid?)
- `ad-09.mp3`: ವಾಟರ್ ಕ್ಯಾನ್ ಒಂದು ಕೊಟ್ಟು ಹೋಗಿ. (Please deliver one 20L water can.)
- `ad-10.mp3`: ಗ್ಯಾಸ್ ಸಿಲಿಂಡರ್ ಬುಕ್ ಮಾಡಬೇಕು. (Need to book a cooking gas cylinder.)
