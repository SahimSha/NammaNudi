/**
 * Audio Registry for NammaNudi Prerecorded Pronunciations.
 * Maps stable phrase IDs to local static audio files stored in public/audio/.
 * 
 * If a genuine native recording is added to public/audio/<phraseId>.mp3,
 * map it here. When Web SpeechSynthesis lacks a Kannada voice on the user's
 * device (e.g. standard Windows/macOS installations), NammaNudi will play
 * the prerecorded recording as a seamless offline fallback.
 */

export const RECORDED_AUDIO_MAP: Record<string, string> = {
  // Currently empty because no authentic human voice recordings have been added yet.
  // Example when added:
  // 'bs-01': '/audio/bs-01.mp3', // ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ?
  // 'td-01': '/audio/td-01.mp3', // ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗುವುದು?
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
