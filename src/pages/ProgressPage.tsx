import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Flame,
  Bookmark,
  RotateCcw,
  ChevronRight,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { PHRASES } from '../data/phrases';
import { CategoryIcon } from '../components/CategoryIcon';

export const ProgressPage: React.FC = () => {
  const { progress, savedPhraseIds, resetAllProgress } = useApp();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const totalQuestions = progress.totalQuestionsAnswered;
  const correctCount = progress.correctAnswersCount;
  const accuracyPct =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handleReset = () => {
    resetAllProgress();
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 mb-1">
            <Award className="w-4 h-4 text-teal-700" />
            <span>Learning Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Your Kannada Progress
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Track your everyday conversational readiness across Karnataka situations
          </p>
        </div>

        <button
          onClick={() => setShowConfirmReset(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-stone-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmReset && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <h4 className="text-xs font-bold text-rose-900">
              Reset all local statistics and saved phrases?
            </h4>
            <p className="text-[11px] text-rose-700">
              This will clear your local quiz scores, streak, and bookmarks on this browser.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-stone-700 border border-stone-300"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      )}

      {/* Local Data Privacy Callout */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center space-x-3 text-teal-950 text-xs">
        <Database className="w-5 h-5 text-teal-700 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-bold">
            100% Offline & Stored Locally
          </p>
          <p className="text-stone-600 mt-0.5">
            Your quiz attempts, favourites, and recents are saved purely in your browser’s LocalStorage. No account, sign-in, or internet connection is needed.
          </p>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Learning Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-stone-900">
              {progress.streakDays}
            </span>
            <span className="text-xs font-semibold text-stone-400 ml-1">days</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Keep practicing daily</p>
        </div>

        {/* Quizzes Taken */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Quizzes Taken
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-stone-900">
              {progress.totalQuizzesTaken}
            </span>
            <span className="text-xs font-semibold text-stone-400 ml-1">sessions</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {totalQuestions} questions total
          </p>
        </div>

        {/* Accuracy */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Accuracy Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-stone-900">
              {accuracyPct}%
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {correctCount} correct answers
          </p>
        </div>

        {/* Saved Phrases */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Starred Phrases
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Bookmark className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-stone-900">
              {savedPhraseIds.length}
            </span>
            <span className="text-xs font-semibold text-stone-400 ml-1">
              / {PHRASES.length}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Ready in Show-to-Speak
          </p>
        </div>
      </div>

      {/* Category Mastery Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Category Mastery Breakdown
            </h2>
            <p className="text-xs text-stone-500">
              Practice performance across everyday situations
            </p>
          </div>
          <Link
            to="/quiz"
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center space-x-1"
          >
            <span>Practice a Category</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const stats = progress.categoryStats[cat.id] || {
              attempted: 0,
              correct: 0
            };
            const catAccuracy =
              stats.attempted > 0
                ? Math.round((stats.correct / stats.attempted) * 100)
                : 0;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/70 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon
                      iconName={cat.iconName}
                      className="w-4 h-4 text-teal-800"
                    />
                    <span className="text-xs font-bold text-stone-800 truncate">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-teal-900">
                    {stats.attempted > 0 ? `${catAccuracy}%` : 'Not tested'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-800 rounded-full transition-all"
                    style={{ width: `${catAccuracy}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span className="font-kannada text-teal-800 font-semibold">
                    {cat.kannadaName}
                  </span>
                  <span>
                    {stats.correct}/{stats.attempted} correct
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

