import { useState, useEffect, useCallback } from 'react';
import { speechService } from '../utils/speech';
import type { VoiceStatus, SpeechErrorReason } from '../utils/speech';

export interface UseSpeechOptions {
  onErrorNotice?: (message: string) => void;
}

export function useSpeech(options?: UseSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>(() =>
    speechService.getVoiceStatus()
  );

  useEffect(() => {
    const updateVoiceStatus = () => {
      setVoiceStatus(speechService.getVoiceStatus());
    };

    updateVoiceStatus();
    const unsubscribe = speechService.subscribe(updateVoiceStatus);

    return () => {
      unsubscribe();
    };
  }, []);

  const speak = useCallback(
    (
      text: string,
      callbacks?: {
        onStart?: () => void;
        onEnd?: (wasAudioProduced: boolean) => void;
        onError?: (reason: SpeechErrorReason) => void;
      }
    ) => {
      setIsSpeaking(true);

      const success = speechService.speak(text, {
        onStart: () => {
          setIsSpeaking(true);
          callbacks?.onStart?.();
        },
        onEnd: (wasAudioProduced: boolean) => {
          setIsSpeaking(false);
          callbacks?.onEnd?.(wasAudioProduced);
        },
        onError: (reason) => {
          setIsSpeaking(false);
          callbacks?.onError?.(reason);

          if (reason === 'canceled' || reason === 'interrupted') {
            return;
          }

          let userMessage = '';
          if (reason === 'language-unavailable' || reason === 'voice-unavailable') {
            userMessage = 'Kannada voice not installed in browser/OS (kn-IN). Use the phonetic breakdown below.';
          } else if (reason === 'immediate-silent-end') {
            userMessage = 'Speech engine ended without audible sound. Kannada TTS is missing on this OS; check phonetics!';
          } else if (reason === 'not-allowed') {
            userMessage = 'Audio autoplay blocked by browser. Please tap the button again.';
          } else if (reason === 'unsupported') {
            userMessage = 'Speech synthesis is unsupported in this browser.';
          } else {
            userMessage = 'Kannada audio unavailable on this device. Refer to the phonetic guide.';
          }

          options?.onErrorNotice?.(userMessage);
        }
      });

      if (!success) {
        setIsSpeaking(false);
      }
    },
    [options]
  );

  const stop = useCallback(() => {
    speechService.stop();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    voiceStatus,
    hasKannadaVoice: voiceStatus.hasKannadaVoice
  };
}
