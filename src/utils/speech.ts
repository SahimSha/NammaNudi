export interface VoiceStatus {
  supported: boolean;
  hasKannadaVoice: boolean;
  voiceName: string | null;
  statusMessage: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private listeners: Set<() => void> = new Set();
  public isVoicesReady: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      this.isVoicesReady = true;
      this.notifyListeners();
    };

    if (this.synth.getVoices().length > 0) {
      this.isVoicesReady = true;
    }

    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
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
        v.lang.toLowerCase().startsWith('kn') ||
        v.name.toLowerCase().includes('kannada')
    );

    if (kannadaVoice) {
      return {
        supported: true,
        hasKannadaVoice: true,
        voiceName: kannadaVoice.name,
        statusMessage: `Kannada voice available (${kannadaVoice.name})`
      };
    }

    return {
      supported: true,
      hasKannadaVoice: false,
      voiceName: null,
      statusMessage: 'Kannada audio voice is not pre-installed on this device/browser. Use the phonetic pronunciation guide below.'
    };
  }

  public getKannadaVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    return (
      voices.find(
        (v) =>
          v.lang.toLowerCase() === 'kn-in' ||
          v.lang.toLowerCase().startsWith('kn') ||
          v.name.toLowerCase().includes('kannada')
      ) || null
    );
  }

  public speak(
    text: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    }
  ): boolean {
    if (!this.synth) {
      callbacks?.onError?.('Speech synthesis not supported');
      return false;
    }

    // Stop any existing speech
    this.stop();

    const voice = this.getKannadaVoice();
    const utterance = new SpeechSynthesisUtterance(text);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'kn-IN';
    } else {
      utterance.lang = 'kn-IN';
    }

    utterance.rate = 0.85; // slightly slower for language learners to hear clearly
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      callbacks?.onError?.(e);
    };

    this.synth.speak(utterance);
    return true;
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechService = new SpeechService();

