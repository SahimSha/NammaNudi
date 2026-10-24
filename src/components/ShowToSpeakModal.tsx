import React, { useEffect, useCallback } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Star,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { CATEGORIES } from '../data/categories';

export const ShowToSpeakModal: React.FC = () => {
  const {
    showToSpeakPhrase,
    setShowToSpeakPhrase,
    isPhraseSaved,
    toggleSavePhrase,
    showToast,
    phrases
  } = useApp();

  const { speak, stop, isSpeaking, hasKannadaVoice } = useSpeech();
  const [copied, setCopied] = React.useState(false);

  const currentIndex = showToSpeakPhrase
    ? phrases.findIndex((p) => p.id === showToSpeakPhrase.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < phrases.length - 1;

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setShowToSpeakPhrase(phrases[currentIndex - 1]);
    }
  }, [currentIndex, phrases, setShowToSpeakPhrase]);

  const goToNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < phrases.length - 1) {
      setShowToSpeakPhrase(phrases[currentIndex + 1]);
    }
  }, [currentIndex, phrases, setShowToSpeakPhrase]);

  // Close on Escape key & keyboard left/right navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showToSpeakPhrase) return;
      if (e.key === 'Escape') {
        setShowToSpeakPhrase(null);
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToSpeakPhrase, goToNext, goToPrev, setShowToSpeakPhrase]);

  if (!showToSpeakPhrase) return null;

  const isSaved = isPhraseSaved(showToSpeakPhrase.id);
  const category = CATEGORIES.find((c) => c.id === showToSpeakPhrase.categoryId);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${showToSpeakPhrase.kannada}\n(${showToSpeakPhrase.transliteration})\n"${showToSpeakPhrase.english}"`
      );
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy', 'warning');
    }
  };

  const handleSpeak = () => {
    if (!hasKannadaVoice) {
      showToast('No Kannada voice installed on device. Display this card directly or use phonetics below!', 'warning');
      return;
    }
    if (isSpeaking) {
      stop();
    } else {
      speak(showToSpeakPhrase.kannada);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Top Banner & Control Bar */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between text-white pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="px-2.5 py-1 rounded-lg bg-amber-400 text-teal-950 font-black text-xs uppercase tracking-wider flex items-center space-x-1 shadow-sm">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Show to Speak Mode</span>
          </div>
          {category && (
            <span className="text-xs text-white/70 font-medium hidden sm:inline">
              • {category.name}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Favourite button */}
          <button
            onClick={() => toggleSavePhrase(showToSpeakPhrase.id)}
            aria-label="Save phrase"
            className={`p-2 rounded-xl transition-colors ${
              isSaved
                ? 'text-amber-400 bg-white/10'
                : 'text-white/60 hover:text-amber-400 hover:bg-white/10'
            }`}
          >
            <Star className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            aria-label="Copy phrase"
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>

          {/* Close button */}
          <button
            onClick={() => {
              stop();
              setShowToSpeakPhrase(null);
            }}
            aria-label="Close Show to Speak view"
            className="p-2 rounded-xl text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Focus Card - Ultra High Contrast */}
      <div className="max-w-2xl w-full mx-auto my-auto py-6">
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-300 flex flex-col justify-center text-center relative overflow-hidden">
          {/* Subtle top indicator for user instruction */}
          <div className="mb-4 inline-flex items-center justify-center space-x-1.5 self-center bg-teal-900/10 text-teal-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>👇 Turn screen to the person</span>
          </div>

          {/* Kannada Text (Gigantic & Bold) */}
          <div className="my-3 sm:my-6">
            <h1 className="font-kannada text-4xl sm:text-5xl md:text-6xl font-black text-stone-900 leading-tight tracking-normal selection:bg-amber-300">
              {showToSpeakPhrase.kannada}
            </h1>
          </div>

          {/* Roman Transliteration */}
          <div className="mb-3">
            <p className="text-xl sm:text-2xl font-bold text-teal-800 italic">
              {showToSpeakPhrase.transliteration}
            </p>
          </div>

          {/* English Meaning */}
          <div className="pt-4 border-t border-stone-200">
            <p className="text-base sm:text-xl font-semibold text-stone-700">
              "{showToSpeakPhrase.english}"
            </p>
            {showToSpeakPhrase.contextNote && (
              <p className="text-xs sm:text-sm text-stone-500 mt-2">
                Context: {showToSpeakPhrase.contextNote}
              </p>
            )}
          </div>

          {/* Phonetic Breakdown hint */}
          {showToSpeakPhrase.pronunciationGuide && (
            <div className="mt-4 inline-block bg-white border border-stone-200 rounded-xl px-4 py-2 self-center">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-2">
                Phonetic:
              </span>
              <span className="text-sm font-bold text-stone-700 tracking-wide font-mono">
                {showToSpeakPhrase.pronunciationGuide}
              </span>
            </div>
          )}

          {/* Fallback voice notice if no Kannada voice is in browser */}
          {!hasKannadaVoice && (
            <div className="mt-4 p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 text-xs flex items-center justify-center space-x-1.5">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>
                Kannada voice not installed in device TTS. Display this screen directly or use phonetics!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls: Previous, Big Speaker, Next */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between gap-4 pt-2">
        <button
          onClick={goToPrev}
          disabled={!hasPrev}
          className={`flex items-center space-x-1 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
            hasPrev
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'opacity-30 cursor-not-allowed text-white/40'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Big Central Audio Trigger */}
        <button
          onClick={handleSpeak}
          className={`flex-1 max-w-xs flex items-center justify-center space-x-2 py-4 px-6 rounded-2xl font-extrabold text-base shadow-lg transition-transform active:scale-95 ${
            isSpeaking
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 text-teal-950 hover:brightness-105'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-6 h-6" />
              <span>Stop Speaking</span>
            </>
          ) : (
            <>
              <Volume2 className="w-6 h-6" />
              <span>Speak Out Loud</span>
            </>
          )}
        </button>

        <button
          onClick={goToNext}
          disabled={!hasNext}
          className={`flex items-center space-x-1 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
            hasNext
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'opacity-30 cursor-not-allowed text-white/40'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

