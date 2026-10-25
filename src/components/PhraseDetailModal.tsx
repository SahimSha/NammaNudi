import React, { useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Mic,
  Star,
  Copy,
  Check,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Info,
  HelpCircle,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { CATEGORIES } from '../data/categories';
import { hasPrerecordedAudio } from '../data/audioRegistry';

export const PhraseDetailModal: React.FC = () => {
  const {
    activeDetailPhrase,
    setActiveDetailPhrase,
    isPhraseSaved,
    toggleSavePhrase,
    setShowToSpeakPhrase,
    setPracticePhrase,
    showToast,
    openNextPhrase,
    openPrevPhrase,
    phrases
  } = useApp();

  const { speak, stop, isSpeaking, voiceStatus, hasKannadaVoice } = useSpeech({
    onErrorNotice: (msg) => showToast(msg, 'warning')
  });
  const [copied, setCopied] = React.useState(false);

  // Stop speech when active phrase changes
  useEffect(() => {
    stop();
  }, [activeDetailPhrase?.id, stop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeDetailPhrase) return;
      if (e.key === 'Escape') {
        setActiveDetailPhrase(null);
      } else if (e.key === 'ArrowRight') {
        openNextPhrase();
      } else if (e.key === 'ArrowLeft') {
        openPrevPhrase();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDetailPhrase, openNextPhrase, openPrevPhrase, setActiveDetailPhrase]);

  if (!activeDetailPhrase) return null;

  const isSaved = isPhraseSaved(activeDetailPhrase.id);
  const category = CATEGORIES.find((c) => c.id === activeDetailPhrase.categoryId);

  const currentIndex = phrases.findIndex((p) => p.id === activeDetailPhrase.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < phrases.length - 1;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${activeDetailPhrase.kannada}\n${activeDetailPhrase.transliteration}\n"${activeDetailPhrase.english}"\n\nUsage context: ${activeDetailPhrase.contextNote}`
      );
      setCopied(true);
      showToast('Copied full phrase details!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy', 'warning');
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(activeDetailPhrase.kannada, undefined, activeDetailPhrase.id);
    }
  };

  const handleOpenShowToSpeak = () => {
    const phrase = activeDetailPhrase;
    setActiveDetailPhrase(null);
    setShowToSpeakPhrase(phrase);
  };

  const handleOpenPractice = () => {
    stop();
    const phrase = activeDetailPhrase;
    setActiveDetailPhrase(null);
    setPracticePhrase(phrase);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={() => {
        stop();
        setActiveDetailPhrase(null);
      }}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            {category && (
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${category.badgeBg}`}
              >
                {category.name}
              </span>
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
              {activeDetailPhrase.formality}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Star favourite */}
            <button
              onClick={() => toggleSavePhrase(activeDetailPhrase.id)}
              aria-label="Save phrase"
              className={`p-2 rounded-xl transition-colors ${
                isSaved
                  ? 'text-amber-500 bg-amber-50'
                  : 'text-stone-400 hover:text-amber-500 hover:bg-stone-100'
              }`}
            >
              <Star className={`w-5 h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              aria-label="Copy phrase"
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                stop();
                setActiveDetailPhrase(null);
              }}
              aria-label="Close modal"
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kannada Script Hero Box */}
        <div className="mt-5 p-5 sm:p-6 bg-[#FAF8F5] rounded-2xl border border-stone-200/80 text-center">
          <h2 className="font-kannada text-3xl sm:text-4xl font-black text-teal-950 mb-2 leading-relaxed">
            {activeDetailPhrase.kannada}
          </h2>
          <p className="text-lg sm:text-xl font-bold text-teal-800 italic mb-2">
            {activeDetailPhrase.transliteration}
          </p>
          <p className="text-base sm:text-lg font-semibold text-stone-800">
            "{activeDetailPhrase.english}"
          </p>

          {activeDetailPhrase.literalMeaning && (
            <p className="text-xs text-stone-500 mt-2 font-mono">
              Literal: {activeDetailPhrase.literalMeaning}
            </p>
          )}

          {/* Audio Action in Hero */}
          <div className="mt-4 flex flex-col items-center">
            <button
              onClick={handleSpeak}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-teal-800 hover:bg-teal-900 text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Pronunciation</span>
                </>
              )}
            </button>

            {/* Voice status explanation */}
            <p className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
              {hasKannadaVoice ? (
                <span className="text-emerald-700 font-medium">
                  ✓ Native browser Kannada voice ready ({voiceStatus.voiceName})
                </span>
              ) : hasPrerecordedAudio(activeDetailPhrase.id) ? (
                <span className="text-emerald-700 font-medium">
                  ✓ Offline audio recording available
                </span>
              ) : (
                <span className="text-stone-500">
                  ℹ️ Kannada voice not installed on device; check phonetic guide below.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Detailed Learning Blocks */}
        <div className="mt-6 space-y-4">
          {/* Pronunciation breakdown */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Pronunciation Breakdown</span>
            </div>
            <p className="text-sm font-bold font-mono text-stone-800 tracking-wide">
              {activeDetailPhrase.pronunciationGuide}
            </p>
          </div>

          {/* Situation & Usage Note */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5 text-teal-700" />
              <span>Real-Life Situation & Context</span>
            </div>
            <p className="text-sm font-semibold text-teal-900 mb-1">
              {activeDetailPhrase.situation}
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              {activeDetailPhrase.contextNote}
            </p>
          </div>

          {/* Dialect notice if flagged */}
          {activeDetailPhrase.needsDialectReview && (
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-950 flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Dialect note:</strong> This expression reflects colloquial Bengaluru spoken usage. Regional variations (e.g. Uttara Karnataka or Coastal dialects) may vary and welcome native speaker feedback.
              </span>
            </div>
          )}

          {/* Speaker review notice if flagged */}
          {activeDetailPhrase.needsSpeakerReview && (
            <div className="p-3 rounded-xl bg-orange-50/80 border border-orange-200 text-[11px] text-orange-950 flex items-start space-x-2">
              <Info className="w-3.5 h-3.5 text-orange-700 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Needs Kannada speaker review:</strong> This phrase involves colloquial idioms or localized spoken nuances. Ongoing peer review by native Kannada speakers from across Karnataka is invited.
              </span>
            </div>
          )}

          {/* Tags */}
          {activeDetailPhrase.tags && activeDetailPhrase.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-1.5 pt-1">
              <Tag className="w-3.5 h-3.5 text-stone-400 mr-1" />
              {activeDetailPhrase.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full sm:w-auto flex-1">
            <button
              onClick={handleOpenPractice}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <Mic className="w-4 h-4 text-amber-300" />
              <span>Practise Pronunciation</span>
            </button>
            <button
              onClick={handleOpenShowToSpeak}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-teal-950 font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <Maximize2 className="w-4 h-4 text-teal-950" />
              <span>Show-to-Speak Mode</span>
            </button>
          </div>

          {/* Prev / Next navigation buttons */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={openPrevPhrase}
              disabled={!hasPrev}
              title="Previous phrase"
              className={`p-2.5 rounded-xl border border-stone-200 ${
                hasPrev
                  ? 'hover:bg-stone-100 text-stone-700'
                  : 'opacity-40 cursor-not-allowed text-stone-400'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-stone-400">
              {currentIndex + 1} / {phrases.length}
            </span>
            <button
              onClick={openNextPhrase}
              disabled={!hasNext}
              title="Next phrase"
              className={`p-2.5 rounded-xl border border-stone-200 ${
                hasNext
                  ? 'hover:bg-stone-100 text-stone-700'
                  : 'opacity-40 cursor-not-allowed text-stone-400'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
