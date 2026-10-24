/**
 * Audio Registry for NammaNudi Prerecorded Pronunciations.
 * Maps stable phrase IDs to local static audio files stored in public/audio/.
 * 
 * Multi-Tier Pronunciation Strategy:
 * 1. Tier 1 (Authentic Local Audio): If a genuine native recording is registered here,
 *    NammaNudi plays it directly using the HTML5 Audio engine (zero backend, fully cached by Service Worker).
 * 2. Tier 2 (Native Browser TTS): If no prerecorded audio is available, NammaNudi checks
 *    whether the user's browser/OS provides a native Kannada (kn-IN) SpeechSynthesis voice
 *    (standard on Android with Google TTS; available via Microsoft Edge natural voices).
 * 3. Tier 3 (Phonetic Guidance & Show-to-Speak): If neither audio source is available on the device,
 *    NammaNudi never fabricates synthetic or silent audio. Instead, it resets the button to idle,
 *    prominently displays the syllable-by-syllable phonetic guide, and encourages opening
 *    the full-screen Show-to-Speak display.
 */

export interface AudioCatalogItem {
  phraseId: string;
  fileName: string;
  url: string;
  kannada: string;
  transliteration: string;
  english: string;
  hasAudio: boolean;
}

/**
 * Active lookup of verified, authentic human voice recordings.
 * When a genuine native recording is placed in public/audio/<phraseId>.mp3,
 * map it here:
 * 
 * Example:
 *   'bs-01': '/audio/bs-01.mp3', // ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ?
 *   'pt-01': '/audio/pt-01.mp3', // ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗುತ್ತಾ?
 */
export const RECORDED_AUDIO_MAP: Record<string, string> = {
  // Empty by default until authentic native Kannada speaker recordings
  // with verified open licenses (CC0, CC-BY 4.0, or MIT) are added.
  // Synthetic, fake, or unverified third-party audio is strictly avoided.
};

/**
 * Returns the relative URL of a prerecorded audio file if one is registered, or null if missing.
 */
export function getPhraseAudioUrl(phraseId: string): string | null {
  return RECORDED_AUDIO_MAP[phraseId] || null;
}

/**
 * Checks whether a genuine prerecorded audio file is currently available for this phrase ID.
 */
export function hasPrerecordedAudio(phraseId: string): boolean {
  return Boolean(RECORDED_AUDIO_MAP[phraseId]);
}

/**
 * Canonical filename generator for a given phrase ID.
 */
export function getCanonicalAudioFileName(phraseId: string): string {
  return `${phraseId}.mp3`;
}
