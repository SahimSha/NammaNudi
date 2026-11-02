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
  // Travel & Directions (td-01 to td-10)
  'td-01': '/audio/kn/td-01.mp3',
  'td-02': '/audio/kn/td-02.mp3',
  'td-03': '/audio/kn/td-03.mp3',
  'td-04': '/audio/kn/td-04.mp3',
  'td-05': '/audio/kn/td-05.mp3',
  'td-06': '/audio/kn/td-06.mp3',
  'td-07': '/audio/kn/td-07.mp3',
  'td-08': '/audio/kn/td-08.mp3',
  'td-09': '/audio/kn/td-09.mp3',
  'td-10': '/audio/kn/td-10.mp3',

  // Public Transport (pt-01 to pt-10)
  'pt-01': '/audio/kn/pt-01.mp3',
  'pt-02': '/audio/kn/pt-02.mp3',
  'pt-03': '/audio/kn/pt-03.mp3',
  'pt-04': '/audio/kn/pt-04.mp3',
  'pt-05': '/audio/kn/pt-05.mp3',
  'pt-06': '/audio/kn/pt-06.mp3',
  'pt-07': '/audio/kn/pt-07.mp3',
  'pt-08': '/audio/kn/pt-08.mp3',
  'pt-09': '/audio/kn/pt-09.mp3',
  'pt-10': '/audio/kn/pt-10.mp3',

  // Shopping & Markets (sm-01 to sm-10)
  'sm-01': '/audio/kn/sm-01.mp3',
  'sm-02': '/audio/kn/sm-02.mp3',
  'sm-03': '/audio/kn/sm-03.mp3',
  'sm-04': '/audio/kn/sm-04.mp3',
  'sm-05': '/audio/kn/sm-05.mp3',
  'sm-06': '/audio/kn/sm-06.mp3',
  'sm-07': '/audio/kn/sm-07.mp3',
  'sm-08': '/audio/kn/sm-08.mp3',
  'sm-09': '/audio/kn/sm-09.mp3',
  'sm-10': '/audio/kn/sm-10.mp3',

  // Food & Dining (fd-01 to fd-10)
  'fd-01': '/audio/kn/fd-01.mp3',
  'fd-02': '/audio/kn/fd-02.mp3',
  'fd-03': '/audio/kn/fd-03.mp3',
  'fd-04': '/audio/kn/fd-04.mp3',
  'fd-05': '/audio/kn/fd-05.mp3',
  'fd-06': '/audio/kn/fd-06.mp3',
  'fd-07': '/audio/kn/fd-07.mp3',
  'fd-08': '/audio/kn/fd-08.mp3',
  'fd-09': '/audio/kn/fd-09.mp3',
  'fd-10': '/audio/kn/fd-10.mp3',

  // Healthcare (hc-01 to hc-10)
  'hc-01': '/audio/kn/hc-01.mp3',
  'hc-02': '/audio/kn/hc-02.mp3',
  'hc-03': '/audio/kn/hc-03.mp3',
  'hc-04': '/audio/kn/hc-04.mp3',
  'hc-05': '/audio/kn/hc-05.mp3',
  'hc-06': '/audio/kn/hc-06.mp3',
  'hc-07': '/audio/kn/hc-07.mp3',
  'hc-08': '/audio/kn/hc-08.mp3',
  'hc-09': '/audio/kn/hc-09.mp3',
  'hc-10': '/audio/kn/hc-10.mp3',

  // Emergencies (em-01 to em-10)
  'em-01': '/audio/kn/em-01.mp3',
  'em-02': '/audio/kn/em-02.mp3',
  'em-03': '/audio/kn/em-03.mp3',
  'em-04': '/audio/kn/em-04.mp3',
  'em-05': '/audio/kn/em-05.mp3',
  'em-06': '/audio/kn/em-06.mp3',
  'em-07': '/audio/kn/em-07.mp3',
  'em-08': '/audio/kn/em-08.mp3',
  'em-09': '/audio/kn/em-09.mp3',
  'em-10': '/audio/kn/em-10.mp3',

  // Education & Campus (ed-01 to ed-10)
  'ed-01': '/audio/kn/ed-01.mp3',
  'ed-02': '/audio/kn/ed-02.mp3',
  'ed-03': '/audio/kn/ed-03.mp3',
  'ed-04': '/audio/kn/ed-04.mp3',
  'ed-05': '/audio/kn/ed-05.mp3',
  'ed-06': '/audio/kn/ed-06.mp3',
  'ed-07': '/audio/kn/ed-07.mp3',
  'ed-08': '/audio/kn/ed-08.mp3',
  'ed-09': '/audio/kn/ed-09.mp3',
  'ed-10': '/audio/kn/ed-10.mp3',

  // Workplace (wp-01 to wp-10)
  'wp-01': '/audio/kn/wp-01.mp3',
  'wp-02': '/audio/kn/wp-02.mp3',
  'wp-03': '/audio/kn/wp-03.mp3',
  'wp-04': '/audio/kn/wp-04.mp3',
  'wp-05': '/audio/kn/wp-05.mp3',
  'wp-06': '/audio/kn/wp-06.mp3',
  'wp-07': '/audio/kn/wp-07.mp3',
  'wp-08': '/audio/kn/wp-08.mp3',
  'wp-09': '/audio/kn/wp-09.mp3',
  'wp-10': '/audio/kn/wp-10.mp3',

  // Accommodation & Daily Life (ad-01 to ad-10)
  'ad-01': '/audio/kn/ad-01.mp3',
  'ad-02': '/audio/kn/ad-02.mp3',
  'ad-03': '/audio/kn/ad-03.mp3',
  'ad-04': '/audio/kn/ad-04.mp3',
  'ad-05': '/audio/kn/ad-05.mp3',
  'ad-06': '/audio/kn/ad-06.mp3',
  'ad-07': '/audio/kn/ad-07.mp3',
  'ad-08': '/audio/kn/ad-08.mp3',
  'ad-09': '/audio/kn/ad-09.mp3',
  'ad-10': '/audio/kn/ad-10.mp3',

  // Essential Bonus Survival Phrases (bs-01 to bs-05)
  'bs-01': '/audio/kn/bs-01.mp3',
  'bs-02': '/audio/kn/bs-02.mp3',
  'bs-03': '/audio/kn/bs-03.mp3',
  'bs-04': '/audio/kn/bs-04.mp3',
  'bs-05': '/audio/kn/bs-05.mp3'
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
