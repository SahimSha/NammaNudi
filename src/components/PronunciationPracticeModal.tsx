import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  HelpCircle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { CATEGORIES } from '../data/categories';
import { hasPrerecordedAudio } from '../data/audioRegistry';

export const PronunciationPracticeModal: React.FC = () => {
  const { practicePhrase, setPracticePhrase, showToast } = useApp();

  const {
    speak,
    stop: stopReferenceSpeech,
    isSpeaking: isReferenceSpeaking,
    hasKannadaVoice,
    voiceStatus
  } = useSpeech({
    onErrorNotice: (msg) => showToast(msg, 'warning')
  });

  const {
    status: recorderStatus,
    isRecording,
    isPlaying: isUserPlaying,
    hasRecording,
    recordingDuration,
    playbackCurrentTime,
    playbackProgress,
    errorMessage: recorderError,
    isSupported: isRecordingSupported,
    diagnostics,
    refreshDiagnostics,
    startRecording,
    stopRecording,
    playRecording,
    pauseRecording,
    resetRecording
  } = useAudioRecorder({
    maxDurationSeconds: 30,
    onMaxDurationReached: () => {
      showToast('Maximum recording limit (30s) reached', 'info');
    },
    onError: (err) => {
      showToast(err, 'warning');
    }
  });

  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  // Clean up all audio and recording when active phrase changes or modal closes
  const handleClose = useCallback(() => {
    stopReferenceSpeech();
    stopRecording();
    resetRecording();
    setPracticePhrase(null);
  }, [stopReferenceSpeech, stopRecording, resetRecording, setPracticePhrase]);

  // Stop reference speech and recording when practicePhrase changes
  useEffect(() => {
    stopReferenceSpeech();
    resetRecording();
  }, [practicePhrase?.id, stopReferenceSpeech, resetRecording]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!practicePhrase) return;
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [practicePhrase, handleClose]);

  if (!practicePhrase) return null;

  const category = CATEGORIES.find((c) => c.id === practicePhrase.categoryId);

  // Reference audio play/stop
  const handleToggleReferenceAudio = () => {
    if (isUserPlaying) {
      pauseRecording();
    }

    if (isReferenceSpeaking) {
      stopReferenceSpeech();
    } else {
      speak(practicePhrase.kannada, undefined, practicePhrase.id);
    }
  };

  // Start recording voice
  const handleStartRecording = async () => {
    if (isReferenceSpeaking) {
      stopReferenceSpeech();
    }
    if (isUserPlaying) {
      pauseRecording();
    }

    await startRecording();
  };

  // Toggle user recording playback
  const handleToggleUserPlayback = () => {
    if (isReferenceSpeaking) {
      stopReferenceSpeech();
    }

    if (isUserPlaying) {
      pauseRecording();
    } else {
      playRecording();
    }
  };

  // Format seconds into mm:ss
  const formatTime = (secs: number) => {
    const rounded = Math.floor(secs);
    const m = Math.floor(rounded / 60);
    const s = rounded % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="practice-title"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl p-4 sm:p-6 md:p-7 shadow-2xl border border-stone-200 relative my-auto max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2.5rem)] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-800 shrink-0">
              <Mic className="w-5 h-5 text-teal-800" />
            </span>
            <div className="min-w-0">
              <h2 id="practice-title" className="text-base sm:text-lg font-extrabold text-stone-900 leading-tight truncate">
                Pronunciation Practice
              </h2>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
                {category && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${category.badgeBg}`}>
                    {category.name}
                  </span>
                )}
                <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded-md">
                  {practicePhrase.formality}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  #{practicePhrase.id}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close pronunciation practice"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4 my-2">
          {/* 4-Step Learning Cycle Indicator */}
          <div className="p-2.5 sm:p-3 bg-stone-50 rounded-2xl border border-stone-200/70">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-stone-600 gap-1 overflow-x-auto py-0.5">
              <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg shrink-0 ${isReferenceSpeaking ? 'bg-teal-100 text-teal-900 font-bold' : ''}`}>
                <span className="w-4 h-4 rounded-full bg-teal-800 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                <span>Listen</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg shrink-0">
                <span className="w-4 h-4 rounded-full bg-stone-300 text-stone-700 text-[10px] flex items-center justify-center font-bold">2</span>
                <span>Repeat</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg shrink-0 ${isRecording ? 'bg-rose-100 text-rose-900 font-bold animate-pulse' : ''}`}>
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                <span>Record</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg shrink-0 ${hasRecording ? 'bg-emerald-100 text-emerald-900 font-bold' : ''}`}>
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">4</span>
                <span>Compare</span>
              </div>
            </div>
          </div>

          {/* Kannada Phrase Presentation Card */}
          <div className="p-4 sm:p-5 bg-[#FAF8F5] rounded-2xl border border-stone-200/90 text-center">
            <h3 className="font-kannada text-2xl sm:text-3xl md:text-4xl font-black text-teal-950 mb-2 leading-relaxed break-words">
              {practicePhrase.kannada}
            </h3>
            <p className="text-base sm:text-lg md:text-xl font-bold text-teal-800 italic mb-1.5 break-words">
              {practicePhrase.transliteration}
            </p>
            <p className="text-sm sm:text-base font-semibold text-stone-800 break-words">
              "{practicePhrase.english}"
            </p>

            {/* Phonetic Breakdown Pill */}
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-mono text-amber-950 max-w-full">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="font-bold text-[10px] uppercase tracking-wider text-amber-800">Phonetic:</span>
              <span className="font-bold break-words">{practicePhrase.pronunciationGuide}</span>
            </div>

            {/* Reference Audio Play Button */}
            <div className="mt-4 flex flex-col items-center">
              <button
                onClick={handleToggleReferenceAudio}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all active:scale-98 min-h-[44px] ${
                  isReferenceSpeaking
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-teal-800 hover:bg-teal-900 text-white'
                }`}
              >
                {isReferenceSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Reference Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Listen to Reference Pronunciation</span>
                  </>
                )}
              </button>

              {/* Audio source indicator */}
              <p className="text-[11px] text-stone-500 mt-2 text-center">
                {hasKannadaVoice ? (
                  <span className="text-emerald-700 font-medium">
                    ✓ Native Kannada TTS ready ({voiceStatus.voiceName})
                  </span>
                ) : hasPrerecordedAudio(practicePhrase.id) ? (
                  <span className="text-emerald-700 font-medium">
                    ✓ Genuine offline voice recording
                  </span>
                ) : (
                  <span className="text-stone-500">
                    ℹ️ Device lacks Kannada speech voice; follow the phonetic syllables.
                  </span>
                )}
              </p>
            </div>
          </div>

        {/* Recording & Repeat Section */}
        <div className="mt-5 p-5 rounded-2xl border border-stone-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-teal-800" />
              <span>Voice Recording</span>
            </span>

            {/* Status indicator badge */}
            {isRecording && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                Recording ({formatTime(recordingDuration)})
              </span>
            )}
            {hasRecording && !isRecording && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Recorded ({formatTime(recordingDuration)})
              </span>
            )}
          </div>

          {/* UNSUPPORTED CAPABILITY 1: Insecure HTTP Context on Phone/LAN */}
          {!isRecordingSupported && diagnostics.issue === 'insecure-context' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs mb-3 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-amber-900 text-sm">
                    Microphone Inactive: Insecure HTTP Connection
                  </p>
                  <p className="text-amber-800 mt-1 leading-relaxed">
                    Your browser is accessing NammaNudi over an insecure local network connection{' '}
                    <code className="bg-amber-100/80 px-1.5 py-0.5 rounded text-[11px] font-mono">
                      {diagnostics.protocol}//{diagnostics.hostname}
                    </code>
                    . For user security, modern mobile browsers (Android Chrome, Safari, Edge) strictly require a{' '}
                    <strong>Secure Context (HTTPS or localhost)</strong> to enable microphone capture.
                  </p>
                </div>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/80 text-[11px] text-stone-700 space-y-1.5 mt-2">
                <p className="font-bold text-amber-950">How to test recording on your phone:</p>
                <p>
                  • <strong>Option A (HTTPS):</strong> Access the app via an HTTPS URL (e.g. your deployed Vercel URL or an HTTPS tunnel).
                </p>
                <p>
                  • <strong>Option B (Chrome USB Port Forwarding):</strong> Connect your phone via USB, open{' '}
                  <code className="bg-stone-100 px-1 py-0.5 rounded">chrome://inspect</code> on your PC, forward port 5173, and browse to{' '}
                  <code className="bg-stone-100 px-1 py-0.5 rounded">http://localhost:5173</code> (localhost is always a secure context).
                </p>
                <p>
                  • <strong>Option C (Android Chrome Flag):</strong> In Chrome on your phone, open{' '}
                  <code className="bg-stone-100 px-1 py-0.5 rounded">chrome://flags/#unsafely-treat-insecure-origin-as-secure</code>, add this exact URL, enable it, and restart Chrome.
                </p>
              </div>
            </div>
          )}

          {/* UNSUPPORTED CAPABILITY 2: Missing getUserMedia (e.g. In-App WebViews) */}
          {!isRecordingSupported && diagnostics.issue === 'missing-getusermedia' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Microphone Capture Unavailable</p>
                <p className="text-rose-700 mt-1 leading-relaxed">
                  {diagnostics.reasonMessage || 'The media capture API is not available in this browser window.'}
                </p>
                {diagnostics.remedyMessage && (
                  <p className="text-[11px] font-semibold text-rose-900 mt-1.5 bg-white/70 p-2 rounded-lg border border-rose-200">
                    💡 {diagnostics.remedyMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* UNSUPPORTED CAPABILITY 3: Missing MediaRecorder API */}
          {!isRecordingSupported && diagnostics.issue === 'missing-mediarecorder' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Audio Recording (MediaRecorder) Not Supported</p>
                <p className="text-rose-700 mt-1 leading-relaxed">
                  {diagnostics.reasonMessage || 'Your browser version does not support window.MediaRecorder.'}
                </p>
                {diagnostics.remedyMessage && (
                  <p className="text-[11px] font-semibold text-rose-900 mt-1.5 bg-white/70 p-2 rounded-lg border border-rose-200">
                    💡 {diagnostics.remedyMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Generic runtime recording error (permission rejection, hardware error) */}
          {recorderError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Microphone Status</p>
                <p className="mt-0.5">{recorderError}</p>
                <p className="text-[11px] text-amber-800 mt-1">
                  💡 If prompted by your browser, tap <strong>Allow</strong> on the microphone permission popup.
                </p>
              </div>
            </div>
          )}

          {/* STATE 1: IDLE (No recording yet) */}
          {recorderStatus === 'idle' && isRecordingSupported && (
            <div className="text-center py-4">
              <p className="text-xs text-stone-600 mb-4 max-w-sm mx-auto">
                Listen to the reference first, then tap below to record yourself repeating the phrase.
              </p>
              <button
                onClick={handleStartRecording}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                <Mic className="w-5 h-5 text-amber-300" />
                <span>Start Recording My Voice</span>
              </button>
            </div>
          )}

          {/* STATE 2: RECORDING IN PROGRESS */}
          {isRecording && (
            <div className="text-center py-4 bg-rose-50/50 rounded-2xl border border-rose-100">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping"></span>
                <span className="text-xl font-mono font-black text-rose-700">
                  {formatTime(recordingDuration)}
                </span>
                <span className="text-xs text-stone-400 font-mono">/ 00:30</span>
              </div>

              {/* Progress bar */}
              <div className="w-48 h-1.5 bg-rose-200 rounded-full mx-auto mb-4 overflow-hidden">
                <div
                  className="h-full bg-rose-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (recordingDuration / 30) * 100)}%` }}
                ></div>
              </div>

              <p className="text-xs text-rose-900 font-semibold mb-4">
                Speak the Kannada phrase clearly into your microphone now...
              </p>

              <button
                onClick={stopRecording}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Recording</span>
              </button>
            </div>
          )}

          {/* STATE 3 & 4: RECORDED & REPLAY */}
          {hasRecording && !isRecording && (
            <div className="space-y-4">
              {/* Audio player card */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={handleToggleUserPlayback}
                    className="p-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white shadow-sm transition-all active:scale-95 flex-shrink-0"
                    aria-label={isUserPlaying ? 'Pause recorded voice' : 'Play recorded voice'}
                  >
                    {isUserPlaying ? (
                      <Pause className="w-5 h-5 fill-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-[140px]">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-1">
                      <span>{isUserPlaying ? 'Playing Your Voice' : 'Your Recording'}</span>
                      <span className="font-mono text-stone-500">
                        {formatTime(playbackCurrentTime)} / {formatTime(recordingDuration)}
                      </span>
                    </div>

                    {/* Scrubbing progress bar */}
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-600 transition-all duration-100"
                        style={{ width: `${playbackProgress * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Secondary Actions: Record Again & Delete */}
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleStartRecording}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 transition-colors"
                    title="Record your voice again"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                    <span>Record Again</span>
                  </button>

                  <button
                    onClick={resetRecording}
                    className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                    title="Delete recording"
                    aria-label="Delete recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Side-by-Side Quick Comparison Bar */}
              <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-200/60">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-950 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>Compare Side-by-Side</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleToggleReferenceAudio}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isReferenceSpeaking
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-teal-900 border-teal-200 hover:bg-teal-50'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isReferenceSpeaking ? 'Stop Reference' : '1. Play Reference'}</span>
                  </button>

                  <button
                    onClick={handleToggleUserPlayback}
                    className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isUserPlaying
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isUserPlaying ? 'Pause My Voice' : '2. Play My Voice'}</span>
                  </button>
                </div>
              </div>

              {/* Honest Self-Assessment Guide */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-stone-700">
                <div className="flex items-center space-x-1.5 font-bold text-amber-950 uppercase tracking-wider mb-2">
                  <Info className="w-3.5 h-3.5 text-amber-800" />
                  <span>Self-Assessment Checklist</span>
                </div>
                <ul className="space-y-1.5 text-xs leading-relaxed text-stone-700 pl-1">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-800 font-bold">•</span>
                    <span>
                      <strong>Vowel lengths:</strong> Did you hold long syllables (e.g. <em>aa</em>, <em>ee</em>, <em>oo</em>) as indicated in the phonetic guide?
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-800 font-bold">•</span>
                    <span>
                      <strong>Rhythm & cadence:</strong> Did you pause naturally without rushing the ending?
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-800 font-bold">•</span>
                    <span>
                      <strong>Politeness:</strong> Ensure polite suffixes like <em>-ri</em> (ಬನ್ನಿ / banni, ಕೊಡಿ / kodi) sound natural and gentle.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Expandable Technical Diagnostics Toggle */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => setShowDiagnostics((prev) => !prev)}
              className="flex items-center justify-between w-full text-[11px] font-semibold text-stone-500 hover:text-stone-800 transition-colors py-1"
            >
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-stone-400" />
                <span>Device Audio Capabilities & Diagnostics</span>
              </span>
              {showDiagnostics ? (
                <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              )}
            </button>

            {showDiagnostics && (
              <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-stone-100">
                    <span className="text-stone-500">Secure Context:</span>
                    <span className="font-semibold flex items-center gap-1">
                      {diagnostics.isSecureContext ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Yes</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-amber-600" />
                          <span className="text-amber-700">No (HTTP)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-stone-100">
                    <span className="text-stone-500">MediaDevices:</span>
                    <span className="font-semibold flex items-center gap-1">
                      {diagnostics.hasMediaDevices ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-stone-400" />
                          <span className="text-stone-500">Missing</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-stone-100">
                    <span className="text-stone-500">getUserMedia:</span>
                    <span className="font-semibold flex items-center gap-1">
                      {diagnostics.hasGetUserMedia ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-stone-400" />
                          <span className="text-stone-500">Missing</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-stone-100">
                    <span className="text-stone-500">MediaRecorder:</span>
                    <span className="font-semibold flex items-center gap-1">
                      {diagnostics.hasMediaRecorder ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-stone-400" />
                          <span className="text-stone-500">Missing</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-100 space-y-1">
                  <div className="flex items-center justify-between text-stone-500 flex-wrap gap-1">
                    <span>Host / Protocol:</span>
                    <span className="font-mono text-stone-700 break-all">
                      {diagnostics.protocol}//{diagnostics.hostname || 'localhost'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-500 flex-wrap gap-1">
                    <span>Audio Codecs:</span>
                    <span className="font-mono text-stone-700 text-[10px] break-all">
                      {diagnostics.supportedMimeTypes.length > 0
                        ? diagnostics.supportedMimeTypes.slice(0, 2).join(', ')
                        : 'Native container fallback'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => {
                      refreshDiagnostics();
                      showToast('Audio capabilities refreshed', 'info');
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-stone-200/70 hover:bg-stone-300/80 text-stone-700 font-bold text-[10px] transition-colors min-h-[32px]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-check Capabilities</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Privacy & Hardware Safety Guarantee */}
        <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start space-x-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>100% In-Browser Privacy:</strong> Your voice is recorded strictly in your browser's temporary memory for self-assessment. It is never uploaded to any server, tracked, or stored permanently. Your microphone hardware is immediately released when recording finishes.
          </p>
        </div>
      </div>

      {/* Modal Bottom Close Button */}
      <div className="pt-3 border-t border-stone-100 flex justify-end shrink-0">
        <button
          onClick={handleClose}
          className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors min-h-[44px] flex items-center justify-center"
        >
          Done Practising
        </button>
      </div>
    </div>
  </div>
);
};
