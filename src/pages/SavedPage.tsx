import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  History,
  Trash2,
  ArrowRight,
  Star,
  Brain,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { PhraseCard } from '../components/PhraseCard';
import type { SRSReviewRating } from '../types';

export const SavedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'recents' | 'srs'>('saved');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const {
    savedPhraseIds,
    recentPhraseIds,
    getPhraseById,
    clearRecents,
    srsItems,
    submitSRSReview,
    duePhraseIds,
    srsStats,
    showToast
  } = useApp();

  const { speak, stop, isSpeaking } = useSpeech({
    onErrorNotice: (msg) => showToast(msg, 'warning')
  });

  const savedPhrases = savedPhraseIds
    .map((id) => getPhraseById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const recentPhrases = recentPhraseIds
    .map((id) => getPhraseById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const duePhrases = duePhraseIds
    .map((id) => getPhraseById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const currentDuePhrase = duePhrases.length > 0 ? duePhrases[0] : null;
  const currentSRSItem = currentDuePhrase ? srsItems[currentDuePhrase.id] : null;

  const handleSRSGrade = (rating: SRSReviewRating) => {
    stop();
    if (!currentDuePhrase) return;
    submitSRSReview(currentDuePhrase.id, rating);
    setIsAnswerRevealed(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Saved Phrases & Memory Queue
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Revisit starred expressions and train your long-term spoken recall with Leitner spaced repetition
          </p>
        </div>

        {activeTab === 'recents' && recentPhrases.length > 0 && (
          <button
            onClick={clearRecents}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => {
            stop();
            setActiveTab('saved');
          }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'saved'
              ? 'bg-amber-400 text-teal-950 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bookmark className="w-4 h-4 fill-current" />
          <span>Favourites ({savedPhrases.length})</span>
        </button>

        <button
          onClick={() => {
            stop();
            setActiveTab('srs');
          }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'srs'
              ? 'bg-teal-800 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Spaced Review Queue</span>
          {duePhraseIds.length > 0 && (
            <span className="bg-amber-400 text-teal-950 text-[11px] font-black px-2 py-0.5 rounded-full ml-1">
              {duePhraseIds.length} due
            </span>
          )}
        </button>

        <button
          onClick={() => {
            stop();
            setActiveTab('recents');
          }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeTab === 'recents'
              ? 'bg-amber-400 text-teal-950 shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recently Viewed ({recentPhrases.length})</span>
        </button>
      </div>

      {/* 1. Tab Content: Favourites */}
      {activeTab === 'saved' && (
        savedPhrases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPhrases.map((phrase) => (
              <PhraseCard key={phrase.id} phrase={phrase} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
              <Star className="w-7 h-7 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                No saved phrases yet
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Whenever you find a phrase you want to remember or show to an auto driver, click the ⭐ star icon to pin it here.
              </p>
            </div>
            <Link
              to="/phrasebook"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>Explore Phrasebook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )
      )}

      {/* 2. Tab Content: Spaced Review Queue (SRS) */}
      {activeTab === 'srs' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* SRS Leitner Box Overview Bar */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-800" />
                <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                  Leitner Spaced Retention Schedule
                </h3>
              </div>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                {srsStats.total} phrases enrolled
              </span>
            </div>

            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Phrases graduate from Box 1 (everyday) through Box 5 (monthly) as your memory strengthens. If you stumble, the phrase returns to Box 1 for reinforcement.
            </p>

            <div className="grid grid-cols-5 gap-2 text-center">
              {[
                { box: 1, label: 'Box 1', interval: '1 day', count: srsStats.learning, color: 'bg-rose-50 border-rose-200 text-rose-800' },
                { box: 2, label: 'Box 2', interval: '3 days', count: Object.values(srsItems).filter((i) => i.box === 2).length, color: 'bg-amber-50 border-amber-200 text-amber-800' },
                { box: 3, label: 'Box 3', interval: '7 days', count: Object.values(srsItems).filter((i) => i.box === 3).length, color: 'bg-blue-50 border-blue-200 text-blue-800' },
                { box: 4, label: 'Box 4', interval: '14 days', count: Object.values(srsItems).filter((i) => i.box === 4).length, color: 'bg-teal-50 border-teal-200 text-teal-800' },
                { box: 5, label: 'Box 5', interval: '30 days', count: srsStats.mastered, color: 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' }
              ].map((b) => (
                <div key={b.box} className={`p-2.5 rounded-xl border ${b.color} flex flex-col justify-between`}>
                  <span className="text-[10px] font-bold uppercase">{b.label}</span>
                  <span className="text-base sm:text-lg font-black my-0.5">{b.count}</span>
                  <span className="text-[9px] text-stone-500">{b.interval}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Review Flashcard */}
          {currentDuePhrase && currentSRSItem ? (
            <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md relative overflow-hidden transition-all text-center">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
                <span className="font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
                  {duePhrases.length} {duePhrases.length === 1 ? 'phrase' : 'phrases'} due today
                </span>
                <span className="font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                  Currently in Box {currentSRSItem.box}
                </span>
              </div>

              {/* Prompt: English + Situation */}
              <div className="my-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 px-2.5 py-0.5 rounded-md inline-block">
                  {currentDuePhrase.situation}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                  "{currentDuePhrase.english}"
                </h2>
                {currentDuePhrase.contextNote && (
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    💡 Hint: {currentDuePhrase.contextNote}
                  </p>
                )}
              </div>

              {/* Hidden vs Revealed State */}
              {!isAnswerRevealed ? (
                <div className="pt-4 border-t border-stone-200/80">
                  <button
                    onClick={() => setIsAnswerRevealed(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3.5 bg-teal-800 hover:bg-teal-900 text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-98"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Show Kannada Answer (ಉತ್ತರ ನೋಡಿ)</span>
                  </button>
                  <p className="text-[11px] text-stone-400 mt-2">
                    Try recalling the phrase out loud before revealing!
                  </p>
                </div>
              ) : (
                <div className="pt-4 border-t border-stone-200 space-y-4 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-kannada text-3xl sm:text-4xl font-black text-teal-950 mb-1.5 leading-snug">
                      {currentDuePhrase.kannada}
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-teal-800 italic">
                      {currentDuePhrase.transliteration}
                    </p>
                    {currentDuePhrase.pronunciationGuide && (
                      <p className="text-xs font-mono text-stone-600 mt-1">
                        Phonetic: {currentDuePhrase.pronunciationGuide}
                      </p>
                    )}
                  </div>

                  {/* Audio Listen */}
                  <div>
                    <button
                      onClick={() => {
                        if (isSpeaking) {
                          stop();
                        } else {
                          speak(currentDuePhrase.kannada, undefined, currentDuePhrase.id);
                        }
                      }}
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all ${
                        isSpeaking
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-teal-800" />
                          <span>Listen Audio</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Rating Buttons */}
                  <div className="pt-4 border-t border-stone-200/80">
                    <p className="text-xs font-semibold text-stone-600 mb-2.5">
                      How easily did you recall this Kannada phrase?
                    </p>

                    <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                      <button
                        onClick={() => handleSRSGrade('again')}
                        className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs transition-all flex flex-col items-center gap-1"
                      >
                        <RotateCcw className="w-4 h-4 text-rose-600" />
                        <span>Again</span>
                        <span className="text-[10px] font-normal text-rose-600/80">1 day (Box 1)</span>
                      </button>

                      <button
                        onClick={() => handleSRSGrade('good')}
                        className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs transition-all flex flex-col items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        <span>Good</span>
                        <span className="text-[10px] font-normal text-amber-700/80">
                          +1 Box ({Math.min(5, currentSRSItem.box + 1)})
                        </span>
                      </button>

                      <button
                        onClick={() => handleSRSGrade('easy')}
                        className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs transition-all flex flex-col items-center gap-1"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Easy</span>
                        <span className="text-[10px] font-normal text-emerald-700/80">
                          +2 Boxes ({Math.min(5, currentSRSItem.box + 2)})
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* All Caught Up Milestone */
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-stone-900 text-lg">
                  All Scheduled Reviews Complete! 🎉
                </h3>
                <p className="font-kannada text-sm text-teal-800 font-semibold">
                  ಇಂದಿನ ಪುನರಾವರ್ತನೆ ಪೂರ್ಣಗೊಂಡಿದೆ!
                </p>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed pt-1">
                  You have reviewed every due phrase for today. Your long-term memory consolidation is progressing beautifully. Come back tomorrow for your next queue!
                </p>
              </div>

              {/* Enrolled phrases summary list */}
              {Object.keys(srsItems).length > 0 && (
                <div className="pt-6 border-t border-stone-100 text-left">
                  <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Enrolled Memory Queue ({Object.keys(srsItems).length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {Object.values(srsItems).map((item) => {
                      const p = getPhraseById(item.phraseId);
                      if (!p) return null;
                      return (
                        <div
                          key={item.phraseId}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 text-xs"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <span className="font-kannada font-bold text-stone-900 block truncate">
                              {p.kannada}
                            </span>
                            <span className="text-stone-500 block truncate">
                              "{p.english}"
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              Box {item.box}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              Due: {item.nextReviewDate}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Link
                to="/phrasebook"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <span>Add More Phrases from Phrasebook</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 3. Tab Content: Recents */}
      {activeTab === 'recents' && (
        recentPhrases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPhrases.map((phrase) => (
              <PhraseCard key={phrase.id} phrase={phrase} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <History className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                No recent history
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                As you explore Kannada phrases in the app, your recently viewed expressions will appear here automatically.
              </p>
            </div>
            <Link
              to="/phrasebook"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>Explore Phrasebook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )
      )}
    </div>
  );
};
