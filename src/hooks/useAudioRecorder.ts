import { useState, useRef, useEffect, useCallback } from 'react';

export type RecordingStatus = 'idle' | 'recording' | 'recorded' | 'playing';

export type CapabilityIssue =
  | 'insecure-context'
  | 'missing-getusermedia'
  | 'missing-mediarecorder'
  | 'no-supported-mimetype'
  | null;

export interface AudioCapabilityDiagnostics {
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  hasMediaRecorder: boolean;
  hasMimeTypeCheck: boolean;
  supportedMimeTypes: string[];
  protocol: string;
  hostname: string;
  issue: CapabilityIssue;
  reasonMessage: string | null;
  remedyMessage: string | null;
}

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
  diagnostics: AudioCapabilityDiagnostics;
  refreshDiagnostics: () => AudioCapabilityDiagnostics;
  startRecording: () => Promise<boolean>;
  stopRecording: () => void;
  playRecording: () => void;
  pauseRecording: () => void;
  resetRecording: () => void;
}

/**
 * Inspects all browser audio recording capabilities independently.
 * Distinguishes insecure origins (HTTP over LAN), missing getUserMedia,
 * unsupported MediaRecorder, and MIME support.
 */
export function detectAudioCapabilities(): AudioCapabilityDiagnostics {
  if (typeof window === 'undefined') {
    return {
      isSecureContext: false,
      hasMediaDevices: false,
      hasGetUserMedia: false,
      hasMediaRecorder: false,
      hasMimeTypeCheck: false,
      supportedMimeTypes: [],
      protocol: '',
      hostname: '',
      issue: 'missing-getusermedia',
      reasonMessage: 'SSR or non-browser environment detected.',
      remedyMessage: null
    };
  }

  const protocol = window.location?.protocol || '';
  const hostname = window.location?.hostname || '';

  // W3C Secure Context check: https: or localhost/127.0.0.1
  const isSecure =
    typeof window.isSecureContext === 'boolean'
      ? window.isSecureContext
      : protocol === 'https:' ||
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]';

  const hasMediaDevices = typeof navigator !== 'undefined' && !!navigator.mediaDevices;
  const hasStandardGetUserMedia = !!(hasMediaDevices && navigator.mediaDevices.getUserMedia);
  const hasLegacyGetUserMedia =
    typeof navigator !== 'undefined' &&
    !!(
      (navigator as unknown as { getUserMedia?: unknown }).getUserMedia ||
      (navigator as unknown as { webkitGetUserMedia?: unknown }).webkitGetUserMedia ||
      (navigator as unknown as { mozGetUserMedia?: unknown }).mozGetUserMedia
    );
  const hasGetUserMedia = hasStandardGetUserMedia || hasLegacyGetUserMedia;

  const hasMediaRecorder = typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined';
  const hasMimeTypeCheck = hasMediaRecorder && typeof MediaRecorder.isTypeSupported === 'function';

  const candidateTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
    'audio/wav'
  ];

  const supportedMimeTypes: string[] = [];
  if (hasMimeTypeCheck) {
    for (const type of candidateTypes) {
      try {
        if (MediaRecorder.isTypeSupported(type)) {
          supportedMimeTypes.push(type);
        }
      } catch {
        // Ignore candidate probe errors on browsers that throw on specific codecs
      }
    }
  }

  let issue: CapabilityIssue = null;
  let reasonMessage: string | null = null;
  let remedyMessage: string | null = null;

  // Evaluate the root cause in order of prerequisite
  if (!isSecure && !hasGetUserMedia) {
    issue = 'insecure-context';
    reasonMessage = `Insecure Origin (${protocol}//${hostname}): Modern mobile browsers strictly disable microphone access over insecure HTTP connections.`;
    remedyMessage =
      'Mobile browsers require HTTPS or localhost for microphone capture. Use HTTPS (e.g. Vercel deployment or HTTPS tunnel) or Chrome USB Port Forwarding.';
  } else if (!hasGetUserMedia) {
    issue = 'missing-getusermedia';
    reasonMessage = 'Microphone API (getUserMedia) is not exposed by this browser or in-app webview.';
    remedyMessage =
      'If using an in-app browser (e.g. WhatsApp, Instagram, LinkedIn), tap menu and choose "Open in Chrome" or "Open in Safari".';
  } else if (!hasMediaRecorder) {
    issue = 'missing-mediarecorder';
    reasonMessage = 'Audio recording API (window.MediaRecorder) is not supported in this browser version.';
    remedyMessage =
      'Please update your browser or open NammaNudi in modern Google Chrome, Safari 14.3+, Microsoft Edge, or Mozilla Firefox.';
  }

  return {
    isSecureContext: isSecure,
    hasMediaDevices,
    hasGetUserMedia,
    hasMediaRecorder,
    hasMimeTypeCheck,
    supportedMimeTypes,
    protocol,
    hostname,
    issue,
    reasonMessage,
    remedyMessage
  };
}

/**
 * Requests an audio MediaStream using standard navigator.mediaDevices.getUserMedia,
 * with graceful fallback to legacy vendor-prefixed getUserMedia implementations.
 */
async function requestAudioStream(): Promise<MediaStream> {
  // Standard modern API
  if (
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  ) {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
  }

  // Legacy vendor-prefixed fallbacks for older Android/iOS WebViews
  const nav = navigator as unknown as {
    getUserMedia?: (
      constraints: MediaStreamConstraints,
      success: (stream: MediaStream) => void,
      error: (error: unknown) => void
    ) => void;
    webkitGetUserMedia?: (
      constraints: MediaStreamConstraints,
      success: (stream: MediaStream) => void,
      error: (error: unknown) => void
    ) => void;
    mozGetUserMedia?: (
      constraints: MediaStreamConstraints,
      success: (stream: MediaStream) => void,
      error: (error: unknown) => void
    ) => void;
  };

  const legacyGetUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia;
  if (typeof legacyGetUserMedia === 'function') {
    return new Promise<MediaStream>((resolve, reject) => {
      legacyGetUserMedia.call(
        navigator,
        { audio: true },
        (stream) => resolve(stream),
        (err) => reject(err)
      );
    });
  }

  throw new DOMException('getUserMedia is not supported on this browser or origin', 'NotSupportedError');
}

/**
 * Safely constructs a MediaRecorder, selecting the best supported MIME type
 * or falling back to default options if specific MIME types are rejected.
 */
function createSafeMediaRecorder(stream: MediaStream): { recorder: MediaRecorder; mimeType?: string } {
  const candidateTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus',
    'audio/wav'
  ];

  let selectedMime: string | undefined = undefined;
  if (typeof MediaRecorder.isTypeSupported === 'function') {
    for (const type of candidateTypes) {
      try {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMime = type;
          break;
        }
      } catch {
        // continue
      }
    }
  }

  if (selectedMime) {
    try {
      const recorder = new MediaRecorder(stream, { mimeType: selectedMime });
      return { recorder, mimeType: selectedMime };
    } catch (err) {
      console.warn(`MediaRecorder init with '${selectedMime}' failed, attempting default:`, err);
    }
  }

  // Native container fallback (e.g. MP4 on iOS or WebM on Android)
  const defaultRecorder = new MediaRecorder(stream);
  return { recorder: defaultRecorder, mimeType: defaultRecorder.mimeType || undefined };
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
  const [diagnostics, setDiagnostics] = useState<AudioCapabilityDiagnostics>(() =>
    detectAudioCapabilities()
  );

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

  // Function to refresh diagnostics
  const refreshDiagnostics = useCallback(() => {
    const updated = detectAudioCapabilities();
    setDiagnostics(updated);
    return updated;
  }, []);

  // isSupported is true when required APIs are available and no blocking issue exists
  const isSupported =
    diagnostics.hasGetUserMedia && diagnostics.hasMediaRecorder && diagnostics.issue === null;

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

  // Start recording
  const startRecording = useCallback(async (): Promise<boolean> => {
    const currentDiag = detectAudioCapabilities();
    setDiagnostics(currentDiag);

    if (currentDiag.issue === 'insecure-context') {
      const msg =
        'Microphone access blocked: Page is served over insecure HTTP. Mobile browsers strictly require HTTPS or localhost.';
      setErrorMessage(msg);
      optionsRef.current.onError?.(msg);
      return false;
    }

    if (!currentDiag.hasGetUserMedia || !currentDiag.hasMediaRecorder) {
      const msg =
        currentDiag.reasonMessage ||
        'Audio recording is not supported in this browser. Please use Chrome, Edge, Safari, or Firefox.';
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
      const stream = await requestAudioStream();
      mediaStreamRef.current = stream;

      const { recorder, mimeType } = createSafeMediaRecorder(stream);
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
          userMsg =
            'Microphone permission was denied. Please allow microphone access in your browser address bar to practise pronunciation.';
        } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
          userMsg = 'No microphone was detected on this device. Please connect a microphone or headset.';
        } else if (errorName === 'NotReadableError' || errorName === 'TrackStartError') {
          userMsg =
            'Your microphone is currently in use by another application. Please free it and try again.';
        } else if (errorName === 'SecurityError') {
          userMsg =
            'Microphone access blocked due to security restrictions (Insecure HTTP context). Microphone capture requires HTTPS or localhost.';
        }
      }

      setErrorMessage(userMsg);
      optionsRef.current.onError?.(userMsg);
      return false;
    }
  }, [
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
    diagnostics,
    refreshDiagnostics,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
    resetRecording
  };
}
