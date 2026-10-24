import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  Bookmark,
  Award,
  TrendingUp,
  Volume2,
  Maximize2,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { PHRASES } from '../data/phrases';
import { useApp } from '../context/AppContext';
import { useSpeech } from '../hooks/useSpeech';
import { CategoryIcon } from '../components/CategoryIcon';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    savedPhraseIds,
    getPhraseById,
    setShowToSpeakPhrase,
    progress,
    showToast
  } = useApp();

  const { speak, isSpeaking, hasKannadaVoice } = useSpeech();

  // Search input state on home page
  const [searchInput, setSearchInput] = useState('');

  // Daily phrase state (randomized on demand or default to an inspiring one)
  const [dailyPhraseIndex, setDailyPhraseIndex] = useState(() => {
    // Deterministic daily index based on day of year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % PHRASES.length;
  });

  const dailyPhrase = PHRASES[dailyPhraseIndex] || PHRASES[0];

  const handleNextDaily = () => {
    setDailyPhraseIndex((prev) => (prev + 1) % PHRASES.length);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/search');
    }
  };

  // Saved phrases resolution
  const savedPhrases = savedPhraseIds
    .map((id) => getPhraseById(id))
    .filter((p): p is typeof PHRASES[0] => Boolean(p))
    .slice(0, 3);

  const accuracyPct =
    progress.totalQuestionsAnswered > 0
      ? Math.round(
          (progress.correctAnswersCount / progress.totalQuestionsAnswered) * 100
        )
      : 0;

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-950 to-stone-900 text-white p-6 sm:p-10 shadow-xl border border-teal-800/40">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-200 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Problem Statement 3: Kannada in Everyday Life</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-3">
            Everyday Kannada Companion for Real Karnataka Life.
          </h1>

          <p className="text-base sm:text-lg text-teal-100/90 font-medium mb-6 leading-relaxed max-w-2xl">
            Learn it. Say it. Use it. Whether you are catching a BMTC bus, hailing an auto, ordering dosa at a Darshini, or shopping at KR Market.
          </p>

          {/* Search Box on Hero */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search any phrase, e.g. 'auto meter', 'bill', 'dosa', 'help'..."
                className="w-full pl-12 pr-28 py-3.5 bg-white text-stone-900 rounded-2xl shadow-lg border-2 border-transparent focus:border-amber-400 focus:outline-none text-sm font-medium transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick pills */}
          <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold text-teal-200/90">
            <span className="text-amber-300 font-bold">Try searching:</span>
            <button
              onClick={() => navigate('/search?q=auto')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Auto meter
            </button>
            <button
              onClick={() => navigate('/search?q=dosa')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Masala dose
            </button>
            <button
              onClick={() => navigate('/search?q=discount')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Bargaining
            </button>
            <button
              onClick={() => navigate('/search?q=emergency')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Emergency
            </button>
          </div>
        </div>
      </section>

      {/* 2. Daily Kannada Phrase (Phrase of the Day) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Daily Kannada Phrase
              </h2>
              <p className="text-xs text-stone-500">
                Master one practical phrase every day
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleNextDaily}
              title="Shuffle another daily phrase"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        <div className="bg-[#FAF8F5] rounded-2xl p-5 sm:p-6 border border-stone-200/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  {dailyPhrase.situation}
                </span>
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                  {dailyPhrase.formality}
                </span>
              </div>
              <h3 className="font-kannada text-2xl sm:text-3xl font-extrabold text-teal-950 leading-snug">
                {dailyPhrase.kannada}
              </h3>
              <p className="text-sm sm:text-base font-semibold text-teal-700 italic">
                {dailyPhrase.transliteration}
              </p>
              <p className="text-sm font-medium text-stone-800">
                "{dailyPhrase.english}"
              </p>
              {dailyPhrase.contextNote && (
                <p className="text-xs text-stone-500 pt-1">
                  💡 {dailyPhrase.contextNote}
                </p>
              )}
            </div>

            <div className="flex sm:flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  if (!hasKannadaVoice) {
                    showToast('Kannada voice not installed on device. Use Show-to-Speak mode below!', 'warning');
                    return;
                  }
                  speak(dailyPhrase.kannada);
                }}
                className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
                  isSpeaking
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-teal-800 hover:bg-teal-900 text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Pronunciation</span>
              </button>

              <button
                onClick={() => setShowToSpeakPhrase(dailyPhrase)}
                className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-500 text-teal-950 transition-colors shadow-sm"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Show to Speak</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Situation-Based Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Everyday Situations
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Choose your real-world setting to find exact Kannada phrases
            </p>
          </div>
          <Link
            to="/phrasebook"
            className="text-xs sm:text-sm font-bold text-teal-800 hover:text-teal-950 flex items-center space-x-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const count = PHRASES.filter((p) => p.categoryId === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/phrasebook?category=${cat.id}`}
                className="group bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md hover:border-teal-400/60 transition-all flex items-start space-x-4"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${cat.accentColor}18`, color: cat.accentColor }}
                >
                  <CategoryIcon iconName={cat.iconName} className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="font-bold text-stone-900 text-sm group-hover:text-teal-900 transition-colors truncate">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </div>
                  <p className="font-kannada text-xs font-semibold text-teal-800 mb-1">
                    {cat.kannadaName}
                  </p>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Continue Learning & Practice Quiz Banner */}
      <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-3xl p-6 sm:p-8 text-teal-950 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-teal-950/10 text-teal-950 font-bold text-xs uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Interactive Practice Quiz</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Test Your Everyday Kannada Skills
          </h2>
          <p className="text-sm font-semibold text-teal-950/80 leading-relaxed">
            Practice real scenarios like bus ticketing, ordering food, and bargaining. Get instant feedback and track your learning streak!
          </p>
        </div>

        <Link
          to="/quiz"
          className="flex-shrink-0 px-6 py-3.5 bg-teal-950 hover:bg-teal-900 text-amber-200 rounded-2xl font-bold text-sm shadow-lg flex items-center space-x-2 transition-transform hover:scale-105"
        >
          <span>Start Practice Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* 5. Recently Viewed & Saved Phrases Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Phrases */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-amber-500 fill-amber-400" />
              <h2 className="font-bold text-stone-900 text-base">
                Saved Phrases ({savedPhraseIds.length})
              </h2>
            </div>
            <Link
              to="/saved"
              className="text-xs font-bold text-teal-800 hover:text-teal-950"
            >
              See all
            </Link>
          </div>

          {savedPhrases.length > 0 ? (
            <div className="space-y-3">
              {savedPhrases.map((phrase) => (
                <div
                  key={phrase.id}
                  onClick={() => setShowToSpeakPhrase(phrase)}
                  className="p-3.5 rounded-xl bg-stone-50 hover:bg-teal-50/50 border border-stone-200/60 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-kannada text-base font-bold text-teal-950 truncate">
                      {phrase.kannada}
                    </p>
                    <p className="text-xs font-medium text-stone-600 truncate">
                      {phrase.transliteration} — "{phrase.english}"
                    </p>
                  </div>
                  <Maximize2 className="w-4 h-4 text-stone-400 hover:text-teal-800 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-xs">
              No saved phrases yet. Click the ⭐ icon on any phrase to save it!
            </div>
          )}
        </div>

        {/* Learning Progress Summary */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-stone-900 text-base">
                Your Learning Progress
              </h2>
            </div>
            <Link
              to="/progress"
              className="text-xs font-bold text-teal-800 hover:text-teal-950"
            >
              Details
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/70">
              <span className="text-2xl font-black text-teal-950">
                {progress.streakDays}
              </span>
              <p className="text-[11px] font-semibold text-stone-500 mt-0.5">
                Day Streak 🔥
              </p>
            </div>
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/70">
              <span className="text-2xl font-black text-teal-950">
                {progress.totalQuizzesTaken}
              </span>
              <p className="text-[11px] font-semibold text-stone-500 mt-0.5">
                Quizzes Taken
              </p>
            </div>
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/70">
              <span className="text-2xl font-black text-teal-950">
                {accuracyPct}%
              </span>
              <p className="text-[11px] font-semibold text-stone-500 mt-0.5">
                Accuracy
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-500 italic bg-stone-50 p-3 rounded-xl border border-stone-100">
            🔒 All learning progress is stored 100% on this device in local storage. Fully usable offline.
          </p>
        </div>
      </div>
    </div>
  );
};

