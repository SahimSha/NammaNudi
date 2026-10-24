import React, { useState } from 'react';
import { Volume2, VolumeX, Star, Maximize2, Copy, Check } from 'lucide-react';
import type { Phrase } from '../types';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { CATEGORIES } from '../data/categories';

interface PhraseCardProps {
  phrase: Phrase;
  onSelect?: () => void;
  showCategoryBadge?: boolean;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  onSelect,
  showCategoryBadge = true
}) => {
  const {
    isPhraseSaved,
    toggleSavePhrase,
    setShowToSpeakPhrase,
    setActiveDetailPhrase,
    addRecentPhrase,
    showToast
  } = useApp();

  const { speak, isSpeaking, hasKannadaVoice } = useSpeech();
  const [thisSpeaking, setThisSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const isSaved = isPhraseSaved(phrase.id);
  const category = CATEGORIES.find((c) => c.id === phrase.categoryId);

  const handleCardClick = () => {
    addRecentPhrase(phrase.id);
    if (onSelect) {
      onSelect();
    } else {
      setActiveDetailPhrase(phrase);
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    addRecentPhrase(phrase.id);
    if (!hasKannadaVoice) {
      showToast('Kannada audio voice not installed on device. Open details for phonetics!', 'warning');
      return;
    }
    setThisSpeaking(true);
    speak(phrase.kannada, () => {
      setThisSpeaking(false);
    });
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSavePhrase(phrase.id);
  };

  const handleShowToSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    addRecentPhrase(phrase.id);
    setShowToSpeakPhrase(phrase);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        `${phrase.kannada}\n${phrase.transliteration}\n"${phrase.english}"`
      );
      setCopied(true);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Unable to copy text', 'warning');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      tabIndex={0}
      role="button"
      className="group text-left bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer relative flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-teal-600"
    >
      {/* Top Bar: Category badge & Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {showCategoryBadge && category && (
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${category.badgeBg}`}
          >
            {category.name}
          </span>
        )}
        <div className="flex items-center space-x-1 ml-auto">
          {/* Formality badge */}
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider bg-stone-100 px-2 py-0.5 rounded-md">
            {phrase.formality}
          </span>

          {/* Star favourite button */}
          <button
            onClick={handleToggleSave}
            title={isSaved ? 'Remove from saved' : 'Save phrase'}
            aria-label={isSaved ? 'Remove from saved' : 'Save phrase'}
            className={`p-1.5 rounded-lg transition-colors ${
              isSaved
                ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                : 'text-stone-300 hover:text-amber-500 hover:bg-stone-100'
            }`}
          >
            <Star className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-4">
        {/* Kannada Script */}
        <h3 className="font-kannada text-2xl font-bold text-teal-950 mb-1 leading-snug tracking-wide group-hover:text-teal-800 transition-colors">
          {phrase.kannada}
        </h3>

        {/* Transliteration */}
        <p className="text-sm font-semibold text-teal-700 mb-1.5 italic tracking-tight">
          {phrase.transliteration}
        </p>

        {/* English Meaning */}
        <p className="text-sm font-medium text-stone-800 line-clamp-2">
          {phrase.english}
        </p>

        {/* Short Context note */}
        {phrase.contextNote && (
          <p className="text-xs text-stone-500 mt-2 line-clamp-1 italic bg-stone-50 px-2.5 py-1 rounded-md border border-stone-100">
            💡 {phrase.contextNote}
          </p>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-stone-500">
        <div className="flex items-center space-x-2">
          {/* Audio Pronunciation Button */}
          <button
            onClick={handleSpeak}
            title="Listen to pronunciation"
            aria-label="Listen to pronunciation"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              thisSpeaking && isSpeaking
                ? 'bg-teal-600 text-white animate-pulse'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/60'
            }`}
          >
            {thisSpeaking && isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Speaking</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy phrase"
            aria-label="Copy phrase"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Show-to-Speak Button */}
        <button
          onClick={handleShowToSpeak}
          title="Open large full-screen view to show to person"
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5 text-amber-700" />
          <span>Show to Speak</span>
        </button>
      </div>
    </div>
  );
};

