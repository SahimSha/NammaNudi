# NammaNudi Audio Assets Directory

This directory (`public/audio/`) is designated for offline, prerecorded native Kannada audio pronunciations.

## File Naming Convention
To add native human voice recordings for phrases, save audio files in standard MP3 or WebM format using the stable phrase IDs:
- `bs-01.mp3` -> "ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ?" (Hello / Greetings! How are you?)
- `bs-02.mp3` -> "ಕನ್ನಡ ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಬರುತ್ತೆ." (I know a little bit of Kannada.)
- `td-01.mp3` -> "ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗುವುದು?" (How do I go here?)
- `pt-01.mp3` -> "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಒಂದು ಟಿಕೆಟ್ ಕೊಡಿ." (Please give one ticket to Majestic.)
- `pt-05.mp3` -> "ಆಟೋ ಮೀಟರ್ ಹಾಕಿ ಬರುತ್ತೀರಾ?" (Will you come by meter?)
- `fd-01.mp3` -> "ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ." (One masala dosa and hot filter coffee please.)
...and so on for all 95 phrases.

## Registration
When a genuine recording is placed here, register it in `src/data/audioRegistry.ts`:
```typescript
export const RECORDED_AUDIO_MAP: Record<string, string> = {
  'bs-01': '/audio/bs-01.mp3',
  ...
};
```
The application will automatically detect the recording, prioritize native browser TTS if a Kannada voice is installed, and seamlessly fall back to these high-fidelity offline audio files when TTS is unavailable on the user's OS.
