import React from 'react';
import {
  Wifi,
  Volume2,
  Mic,
  Heart,
  BookOpen
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useSpeech } from '../hooks/useSpeech';

export const AboutPage: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { voiceStatus } = useSpeech();

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Hackathon 2026 Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          About NammaNudi
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-medium mt-1">
          Learn it. Say it. Use it. An offline-first companion for practical everyday Kannada.
        </p>
      </div>

      {/* Problem Statement Box */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-teal-950 flex items-center space-x-2">
          <span>🎯 Problem Statement 3: Kannada in Everyday Life</span>
        </h2>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Non-Kannada speakers (students, IT professionals, migrants, and tourists) across Karnataka often struggle with daily micro-interactions in bus stations, Darshini hotels, auto rickshaws, clinics, and government offices.
        </p>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Unlike generic translation apps which require active internet connections and produce stiff, literal translations, <strong>NammaNudi</strong> provides instant, curated, context-specific phrases organized by situation with Roman transliteration, syllable pronunciation, offline persistence, and a unique <strong>Show-to-Speak mode</strong> to show directly to the other person.
        </p>
      </div>

      {/* Offline Status & Architecture */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-teal-800 shrink-0" />
            <span>Offline-First Capability</span>
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}
          >
            {isOnline ? 'Online (Cached in Service Worker)' : 'Currently Offline (Functional)'}
          </span>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            • <strong>Service Worker:</strong> The application automatically caches the app shell, stylesheets, icons, and entire phrase database upon initial visit.
          </p>
          <p>
            • <strong>Zero Backend Requirement:</strong> No external paid APIs or server calls are needed. All 95+ verified phrases, search indexing, and practice quizzes execute 100% on-device.
          </p>
          <p>
            • <strong>PWA Ready:</strong> Includes a compliant web app manifest. Users can tap "Add to Home Screen" on Chrome / Safari to use it as a native standalone app.
          </p>
        </div>
      </div>

      {/* Speech Synthesis / Voice Guidance */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center space-x-2">
          <Volume2 className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Speech Synthesis & Voice Detection</span>
        </h2>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-stone-800">
            <span>Status on your current device:</span>
          </div>
          <p className="text-xs font-semibold text-teal-900">
            {voiceStatus.statusMessage}
          </p>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            • <strong>Multi-tier Audio Architecture:</strong> NammaNudi uses the browser <code>SpeechSynthesis API</code> to detect whether a genuine Kannada (<code>kn-IN</code>) voice is installed on your operating system.
          </p>
          <p>
            • <strong>Prerecorded Audio Fallback:</strong> If speech synthesis lacks a Kannada voice on your device (standard on Windows/macOS), the app seamlessly falls back to authentic prerecorded audio files (cached offline in <code>public/audio/</code>) without requiring any server or backend.
          </p>
          <p>
            • <strong>Honest Guidance:</strong> If neither a native TTS voice nor an offline recording is present for a phrase, NammaNudi <strong>never falsely claims audio played</strong> or substitutes English speech. Instead, it guides the learner using the syllable-by-syllable phonetic guide and encourages opening full-screen <strong>Show-to-Speak mode</strong>.
          </p>
          <p>
            • <em>Tip for Android users:</em> Ensure Google Text-to-Speech has the Kannada language pack downloaded under Settings → Accessibility → Text-to-speech output.
          </p>
        </div>
      </div>

      {/* Pronunciation Practice & In-Browser Voice Recording */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-stone-200 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center space-x-2">
          <Mic className="w-5 h-5 text-teal-800 shrink-0" />
          <span>Pronunciation Practice & In-Browser Voice Recording</span>
        </h2>

        <div className="space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          <p>
            • <strong>Pedagogical Cycle:</strong> NammaNudi empowers learners to practice speaking aloud via a structured cycle: <em>Listen Reference → Understand Phonetics → Repeat Aloud → Record Voice → Replay & Compare</em>.
          </p>
          <p>
            • <strong>100% In-Memory Privacy:</strong> Your voice recording is held exclusively in temporary browser RAM (as an in-memory Blob) for immediate self-comparison. Audio is <strong>never uploaded to any server</strong>, stored permanently, or tracked.
          </p>
          <p>
            • <strong>Immediate Hardware Release:</strong> The browser's media stream audio tracks are stopped immediately when you stop recording, cancel, or close the modal, turning off your microphone hardware indicator right away.
          </p>
          <p>
            • <strong>Honest Self-Assessment:</strong> Rather than pretending to use unreliable AI grading, NammaNudi provides clear, authentic linguistic criteria (vowel lengths, natural pauses, respectful suffixes like <em>-ri</em> and <em>-banni</em>) alongside a side-by-side comparison player.
          </p>
        </div>
      </div>

      {/* Karnataka Courtesy & Cultural Tips */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-3xl p-4 sm:p-6 md:p-8 border border-amber-200 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-amber-950 flex items-center space-x-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
          <span>Everyday Etiquette Tips in Karnataka</span>
        </h2>
        <ul className="space-y-2 text-xs sm:text-sm text-amber-950/90 list-disc list-inside leading-relaxed">
          <li>
            <strong>Always greet with "Namaskara":</strong> Starting with "Namaskara!" or addressing people with "Anna" (brother) or "Akka" (sister) immediately creates warmth.
          </li>
          <li>
            <strong>Polite vs Casual:</strong> In Kannada, verbal suffixes ending in <em>-ri</em>, <em>-kodi</em>, and <em>-banni</em> indicate respect. NammaNudi highlights formality levels on every phrase card.
          </li>
          <li>
            <strong>"Kannada swalpa swalpa barutthe":</strong> Saying "I know a little bit of Kannada" is one of the most effective ways to break the ice!
          </li>
        </ul>
      </div>
    </div>
  );
};

