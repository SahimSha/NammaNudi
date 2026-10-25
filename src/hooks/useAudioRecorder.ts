import { useState, useRef, useEffect, useCallback } from 'react';

export type RecordingStatus = 'idle' | 'recording' | 'recorded' | 'playing';

export interface UseAudioRecorderOptions {
  maxDurationSeconds?: number;
  onMaxDurationReached?: () => void;
  onError?: (error: string) => void;
}

export interface UseAudioRecorderReturn {
  status: RecordingStatus;
  isRecording: boolean;
  isPlaying: boolean;
  hasRecording: boolean;
  recordingDuration: number;
  playbackCurrentTime: number;
  playbackProgress: number; // 0 to 1
  audioBlob: Blob | null;
  audioUrl: string | null;
  errorMessage: string | null;
  isSupported: boolean;
  startRecording: () => Promise<boolean>;
  stopRecording: () => void;
  playRecording: () => void;
  pauseRecording: () => void;
  resetRecording: () => void;
}

/**
 * Custom hook for local in-memory voice recording and replay.
 * Guarantees zero server uploads, immediate track cleanup on stop/unmount,
 * and reliable object URL revocation to prevent memory leaks.
 */
export function useAudioRecorder(options: UseAudioRecorderOptions = {}): UseAudioRecorderReturn {
  const maxDurationSeconds = options.maxDurationSeconds ?? 60;

  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [playbackCurrentTime, setPlaybackCurrentTime] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References to browser APIs and hardware resources
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Keep options in a ref to avoid stale closures in event listeners
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Keep track of audioUrl in ref for clean cleanup
  useEffect(() => {
    audioUrlRef.current = audioUrl;
  }, [audioUrl]);

  // Check if browser supports recording
  const isSupported =
    typeof window !== 'undefined' &&
    !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) &&
    typeof window.MediaRecorder !== 'undefined';

  // Helper to release microphone hardware tracks immediately
  const releaseStreamTracks = useCallback(() => {
    if (mediaStreamRef.current) {
      try {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (err) {
        console.warn('Error releasing media stream tracks:', err);
      }
      mediaStreamRef.current = null;
    }
  }, []);

  // Helper to stop and clear recording timer
  const clearRecordingTimer = useCallback(() => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // Helper to stop HTML5 audio playback and listeners
  const cleanupAudioPlayer = useCallback(() => {
    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
        audioElementRef.current.currentTime = 0;
        audioElementRef.current.onended = null;
        audioElementRef.current.ontimeupdate = null;
        audioElementRef.current.onerror = null;
      } catch (err) {
        console.warn('Error cleaning up audio player:', err);
      }
      audioElementRef.current = null;
    }
    setPlaybackCurrentTime(0);
  }, []);

  // Helper to revoke existing object URL
  const revokeCurrentUrl = useCallback(() => {
    if (audioUrlRef.current) {
      try {
        URL.revokeObjectURL(audioUrlRef.current);
      } catch (err) {
        console.warn('Error revoking object URL:', err);
      }
      audioUrlRef.current = null;
    }
  }, []);

  // Determine the best supported audio MIME type
  const getSupportedMimeType = (): string | undefined => {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
      return undefined;
    }
    const candidateTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus'
    ];
    for (const type of candidateTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return undefined;
  };

  // Start recording
  const startRecording = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      const msg = 'Audio recording is not supported in this browser. Please use Chrome, Edge, Safari, or Firefox.';
      setErrorMessage(msg);
      optionsRef.current.onError?.(msg);
      return false;
    }

    // Clean up any previous recording and state
    cleanupAudioPlayer();
    clearRecordingTimer();
    releaseStreamTracks();
    revokeCurrentUrl();

    setErrorMessage(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    audioChunksRef.current = [];

    try {
      // Explicitly request microphone access only upon user interaction
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorderOptions: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        clearRecordingTimer();
        releaseStreamTracks();

        const currentChunks = audioChunksRef.current;
        if (currentChunks.length > 0) {
          const finalMimeType = recorder.mimeType || mimeType || 'audio/webm';
          const blob = new Blob(currentChunks, { type: finalMimeType });
          const url = URL.createObjectURL(blob);
          setAudioBlob(blob);
          setAudioUrl(url);
          setStatus('recorded');
        } else {
          setStatus('idle');
          setErrorMessage('No audio data was recorded. Please check your microphone.');
        }
      };

      recorder.onerror = (event: Event) => {
        clearRecordingTimer();
        releaseStreamTracks();
        setStatus('idle');
        const msg = 'An error occurred while recording audio.';
        setErrorMessage(msg);
        optionsRef.current.onError?.(msg);
        console.error('MediaRecorder error:', event);
      };

      // Start recording with 200ms timeslices so chunks arrive reliably
      recorder.start(200);
      setStatus('recording');

      // Start duration timer
      let seconds = 0;
      timerIntervalRef.current = window.setInterval(() => {
        seconds += 1;
        setRecordingDuration(seconds);

        if (seconds >= maxDurationSeconds) {
          // Max duration protection reached
          if (recorder.state === 'recording') {
            try {
              recorder.stop();
            } catch (e) {
              console.warn('Error auto-stopping recorder at max duration:', e);
            }
          }
          optionsRef.current.onMaxDurationReached?.();
        }
      }, 1000);

      return true;
    } catch (err: unknown) {
      releaseStreamTracks();
      clearRecordingTimer();
      setStatus('idle');

      let userMsg = 'Could not access microphone.';
      if (err instanceof DOMException || (err as { name?: string }).name) {
        const errorName = (err as { name: string }).name;
        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
          userMsg = 'Microphone permission was denied. Please allow microphone access in your browser address bar to practise pronunciation.';
        } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
          userMsg = 'No microphone was detected on this device. Please connect a microphone or headset.';
        } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
          userMsg = 'Your microphone is currently in use by another application. Please free it and try again.';
        }
      }

      setErrorMessage(userMsg);
      optionsRef.current.onError?.(userMsg);
      return false;
    }
  }, [
    isSupported,
    cleanupAudioPlayer,
    clearRecordingTimer,
    releaseStreamTracks,
    revokeCurrentUrl,
    maxDurationSeconds
  ]);

  // Stop recording
  const stopRecording = useCallback(() => {
    clearRecordingTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping MediaRecorder:', err);
      }
    }
    // Release hardware tracks immediately
    releaseStreamTracks();
  }, [clearRecordingTimer, releaseStreamTracks]);

  // Play the recorded audio
  const playRecording = useCallback(() => {
    if (!audioUrl) return;

    cleanupAudioPlayer();

    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;

    audio.ontimeupdate = () => {
      setPlaybackCurrentTime(audio.currentTime);
    };

    audio.onended = () => {
      setStatus('recorded');
      setPlaybackCurrentTime(0);
    };

    audio.onerror = () => {
      setStatus('recorded');
      setPlaybackCurrentTime(0);
      const msg = 'Unable to play recorded voice. Please record again.';
      setErrorMessage(msg);
      optionsRef.current.onError?.(msg);
    };

    audio.play().then(
      () => {
        setStatus('playing');
      },
      (err) => {
        console.warn('Playback initiation error:', err);
        setStatus('recorded');
      }
    );
  }, [audioUrl, cleanupAudioPlayer]);

  // Pause playback
  const pauseRecording = useCallback(() => {
    if (audioElementRef.current && !audioElementRef.current.paused) {
      audioElementRef.current.pause();
    }
    setStatus('recorded');
  }, []);

  // Reset recording completely
  const resetRecording = useCallback(() => {
    stopRecording();
    cleanupAudioPlayer();
    clearRecordingTimer();
    revokeCurrentUrl();

    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    setPlaybackCurrentTime(0);
    setErrorMessage(null);
    setStatus('idle');
  }, [
    stopRecording,
    cleanupAudioPlayer,
    clearRecordingTimer,
    revokeCurrentUrl
  ]);

  // Unmount cleanup: immediately stop recorder, release tracks, clear timers, revoke URLs
  useEffect(() => {
    return () => {
      clearRecordingTimer();
      releaseStreamTracks();
      cleanupAudioPlayer();
      revokeCurrentUrl();
    };
  }, [
    clearRecordingTimer,
    releaseStreamTracks,
    cleanupAudioPlayer,
    revokeCurrentUrl
  ]);

  const playbackProgress =
    recordingDuration > 0
      ? Math.min(1, Math.max(0, playbackCurrentTime / recordingDuration))
      : 0;

  return {
    status,
    isRecording: status === 'recording',
    isPlaying: status === 'playing',
    hasRecording: status === 'recorded' || status === 'playing',
    recordingDuration,
    playbackCurrentTime,
    playbackProgress,
    audioBlob,
    audioUrl,
    errorMessage,
    isSupported,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
    resetRecording
  };
}
