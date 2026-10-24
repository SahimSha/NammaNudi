import { useState, useEffect, useCallback } from 'react';
import { speechService } from '../utils/speech';
import type { VoiceStatus } from '../utils/speech';

export function useSpeech() {
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

  const speak = useCallback((text: string, onDone?: () => void) => {
    setIsSpeaking(true);
    speechService.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        onDone?.();
      },
      onError: () => {
        setIsSpeaking(false);
      }
    });
  }, []);

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

