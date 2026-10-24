import { useState, useEffect, useCallback, useRef } from 'react';
import { speechService } from '../utils/speech';
import type { VoiceStatus, SpeechErrorReason } from '../utils/speech';
import { audioPlayerService } from '../utils/audioPlayer';
import { getPhraseAudioUrl } from '../data/audioRegistry';

export interface UseSpeechOptions {
  onErrorNotice?: (message: string) => void;
}

export function useSpeech(options?: UseSpeechOptions) {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>(() =>
    speechService.getVoiceStatus()
  );

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

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

  const stop = useCallback(() => {
    speechService.stop();
    audioPlayerService.stop();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (
      text: string,
      callbacks?: {
        onStart?: () => void;
        onEnd?: (wasAudioProduced: boolean) => void;
        onError?: (reason: string) => void;
      },
      phraseId?: string
    ) => {
      // Cleanly stop any existing speech or audio playback
      speechService.stop();
      audioPlayerService.stop();

      const currentStatus = speechService.getVoiceStatus();
      const prerecordedUrl = phraseId ? getPhraseAudioUrl(phraseId) : null;

      // Helper to play prerecorded audio fallback
      const tryPrerecordedAudio = (ttsFailureReason?: string) => {
        if (prerecordedUrl) {
          setIsSpeaking(true);
          const audioStarted = audioPlayerService.play(prerecordedUrl, {
            onStart: () => {
              setIsSpeaking(true);
              callbacks?.onStart?.();
            },
            onEnd: () => {
              setIsSpeaking(false);
              callbacks?.onEnd?.(true);
            },
            onError: () => {
              setIsSpeaking(false);
              callbacks?.onError?.('audio-playback-failed');
              optionsRef.current?.onErrorNotice?.(
                'Failed to play prerecorded Kannada audio. Please refer to the phonetic guide.'
              );
            }
          });

          if (!audioStarted) {
            setIsSpeaking(false);
          }
          return;
        }

        // Neither native Kannada TTS nor prerecorded audio is available
        setIsSpeaking(false);
        callbacks?.onError?.(ttsFailureReason || 'no-kannada-audio');

        let message = '';
        if (currentStatus.hasKannadaVoice) {
          message = 'Kannada speech synthesis encountered an error on this device. Please refer to the phonetic pronunciation guide.';
        } else {
          message = 'Kannada audio unavailable on this device: Windows/browser lacks a native Kannada TTS voice, and no offline recording has been added for this phrase yet. Please use the phonetic pronunciation guide!';
        }
        optionsRef.current?.onErrorNotice?.(message);
      };

      // 1. If native Kannada voice is installed, prioritize browser SpeechSynthesis
      if (currentStatus.hasKannadaVoice) {
        setIsSpeaking(true);
        const ttsInitiated = speechService.speak(text, {
          onStart: () => {
            setIsSpeaking(true);
            callbacks?.onStart?.();
          },
          onEnd: (wasAudioProduced: boolean) => {
            if (wasAudioProduced) {
              setIsSpeaking(false);
              callbacks?.onEnd?.(true);
            } else {
              // Immediate silent completion: fallback to prerecorded audio if available
              tryPrerecordedAudio('immediate-silent-end');
            }
          },
          onError: (reason: SpeechErrorReason) => {
            if (reason === 'canceled' || reason === 'interrupted') {
              setIsSpeaking(false);
              callbacks?.onError?.(reason);
              return;
            }
            // TTS failed: attempt prerecorded audio fallback
            tryPrerecordedAudio(reason);
          }
        });

        if (!ttsInitiated) {
          tryPrerecordedAudio('tts-initiation-failed');
        }
        return;
      }

      // 2. If no Kannada voice exists on this device, directly attempt prerecorded audio fallback
      tryPrerecordedAudio();
    },
    []
  );

  return {
    speak,
    stop,
    isSpeaking,
    voiceStatus,
    hasKannadaVoice: voiceStatus.hasKannadaVoice
  };
}
