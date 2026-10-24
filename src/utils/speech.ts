export interface VoiceStatus {
  supported: boolean;
  hasKannadaVoice: boolean;
  voiceName: string | null;
  statusMessage: string;
}

export type SpeechErrorReason =
  | 'language-unavailable'
  | 'voice-unavailable'
  | 'synthesis-unavailable'
  | 'synthesis-failed'
  | 'not-allowed'
  | 'audio-busy'
  | 'interrupted'
  | 'canceled'
  | 'immediate-silent-end'
  | 'unsupported'
  | 'unknown';

export interface SpeakCallbacks {
  onStart?: () => void;
  onEnd?: (wasAudioProduced: boolean) => void;
  onError?: (reason: SpeechErrorReason, details?: unknown) => void;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private listeners: Set<() => void> = new Set();
  // CRITICAL: Prevent Chromium/Safari garbage collection of active utterances
  private activeUtterances: Set<SpeechSynthesisUtterance> = new Set();
  private isSpeakingInternal: boolean = false;
  private voicesLoaded: boolean = false;
  private speechStartTime: number = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;

    const handleVoicesChanged = () => {
      this.voicesLoaded = true;
      this.notifyListeners();
    };

    // If voices are already populated
    if (this.synth.getVoices().length > 0) {
      this.voicesLoaded = true;
    }

    // Attach both standard addEventListener and property assignment for maximum cross-browser support
    if (typeof this.synth.addEventListener === 'function') {
      this.synth.addEventListener('voiceschanged', handleVoicesChanged);
    }
    this.synth.onvoiceschanged = handleVoicesChanged;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  public getVoiceStatus(): VoiceStatus {
    if (!this.synth || typeof SpeechSynthesisUtterance === 'undefined') {
      return {
        supported: false,
        hasKannadaVoice: false,
        voiceName: null,
        statusMessage: 'Speech synthesis is not supported in this browser.'
      };
    }

    const voices = this.synth.getVoices();
    const kannadaVoice = voices.find(
      (v) =>
        v.lang.toLowerCase() === 'kn-in' ||
        v.lang.toLowerCase() === 'kn' ||
        v.lang.toLowerCase().startsWith('kn-') ||
        v.name.toLowerCase().includes('kannada')
    );

    if (kannadaVoice) {
      return {
        supported: true,
        hasKannadaVoice: true,
        voiceName: kannadaVoice.name,
        statusMessage: `Native Kannada voice ready (${kannadaVoice.name})`
      };
    }

    return {
      supported: true,
      hasKannadaVoice: false,
      voiceName: null,
      statusMessage: this.voicesLoaded
        ? 'No Kannada voice installed on this device. Kannada speech will be requested via lang="kn-IN" with phonetic fallback.'
        : 'Loading browser voices...'
    };
  }

  public getKannadaVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    return (
      voices.find(
        (v) =>
          v.lang.toLowerCase() === 'kn-in' ||
          v.lang.toLowerCase() === 'kn' ||
          v.lang.toLowerCase().startsWith('kn-') ||
          v.name.toLowerCase().includes('kannada')
      ) || null
    );
  }

  public speak(text: string, callbacks?: SpeakCallbacks): boolean {
    if (!this.synth || typeof SpeechSynthesisUtterance === 'undefined') {
      callbacks?.onError?.('unsupported');
      return false;
    }

    // Workaround for Chromium engine freeze: unpause synthesis if stuck
    if (this.synth.paused) {
      try {
        this.synth.resume();
      } catch {}
    }

    // If an utterance is already speaking, cancel it cleanly
    if (this.isSpeakingInternal || this.synth.speaking) {
      try {
        this.synth.cancel();
      } catch {}
      this.isSpeakingInternal = false;
      this.activeUtterances.clear();
    }

    const kannadaVoice = this.getKannadaVoice();
    const utterance = new SpeechSynthesisUtterance(text);

    // Retain strong reference to prevent Chromium garbage collection
    this.activeUtterances.add(utterance);

    // Speak the actual Kannada text in kn-IN language
    utterance.lang = 'kn-IN';
    if (kannadaVoice) {
      utterance.voice = kannadaVoice;
      utterance.lang = kannadaVoice.lang || 'kn-IN';
    }

    // Set rate slightly slower (0.85x) for language learner clarity
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    let started = false;

    utterance.onstart = () => {
      started = true;
      this.isSpeakingInternal = true;
      this.speechStartTime = Date.now();
      callbacks?.onStart?.();
    };

    utterance.onend = (event) => {
      this.activeUtterances.delete(utterance);
      this.isSpeakingInternal = false;

      const elapsed = Date.now() - this.speechStartTime;

      // Detect immediate silent finish (e.g. OS lacks Kannada voice and immediately dispatches onend in <150ms)
      if (started && elapsed < 120 && text.trim().length > 3 && !kannadaVoice) {
        callbacks?.onEnd?.(false);
        callbacks?.onError?.('immediate-silent-end', { elapsed, event });
        return;
      }

      callbacks?.onEnd?.(true);
    };

    utterance.onerror = (e) => {
      this.activeUtterances.delete(utterance);
      this.isSpeakingInternal = false;

      const rawError = (e as SpeechSynthesisErrorEvent).error;

      // Handle normal cancellation when user stops or switches phrase
      if (rawError === 'canceled' || rawError === 'interrupted') {
        callbacks?.onError?.(rawError, e);
        return;
      }

      let reason: SpeechErrorReason = 'unknown';
      if (
        rawError === 'language-unavailable' ||
        rawError === 'voice-unavailable' ||
        rawError === 'synthesis-unavailable'
      ) {
        reason = 'language-unavailable';
      } else if (rawError === 'not-allowed') {
        reason = 'not-allowed';
      } else if (rawError === 'audio-busy') {
        reason = 'audio-busy';
      } else if (rawError === 'synthesis-failed') {
        reason = 'synthesis-failed';
      }

      callbacks?.onError?.(reason, e);
    };

    try {
      // Ensure audio pipeline is resumed before dispatching
      if (typeof this.synth.resume === 'function') {
        this.synth.resume();
      }
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      this.activeUtterances.delete(utterance);
      this.isSpeakingInternal = false;
      callbacks?.onError?.('synthesis-failed', err);
      return false;
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    this.isSpeakingInternal = false;
    this.activeUtterances.clear();
  }

  public isSpeaking(): boolean {
    return this.isSpeakingInternal || (this.synth ? this.synth.speaking : false);
  }
}

export const speechService = new SpeechService();
