import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Flame,
  RotateCcw,
  ChevronRight,
  Brain,
  MessageSquare,
  Sparkles,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { CONVERSATION_SCENARIOS } from '../data/conversations';
import { CategoryIcon } from '../components/CategoryIcon';

export const ProgressPage: React.FC = () => {
  const {
    progress,
    savedPhraseIds,
    recentPhraseIds,
    dailyMission,
    srsStats,
    resetAllProgress
  } = useApp();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const totalQuestions = progress.totalQuestionsAnswered;
  const correctCount = progress.correctAnswersCount;
  const accuracyPct =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Completed scenario IDs from localStorage
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('nammanudi_conversations_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleReset = () => {
    resetAllProgress();
    setCompletedScenarioIds([]);
    try {
      localStorage.setItem('nammanudi_conversations_v1', JSON.stringify([]));
    } catch {}
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 mb-1">
            <Award className="w-4 h-4 text-teal-700" />
            <span>Learning Outcomes & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Your Spoken Kannada Progress
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
            Transparent insights distinguishing your practice volume from demonstrated conversational recall
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
              Reset all local statistics, SRS queue, and saved phrases?
            </h4>
            <p className="text-[11px] text-rose-700">
              This will reset your local quiz scores, spaced repetition boxes, and bookmarks on this device.
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

      {/* Honest Telemetry Transparency Banner */}
      <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-start space-x-3 text-teal-950 text-xs">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <p className="font-bold">
            Honest Local Telemetry & Privacy Notice
          </p>
          <p className="text-stone-600 leading-relaxed">
            NammaNudi never invents artificial "fluency percentages" or uploads personal voice data. We distinguish between <strong>Activity Volume</strong> (time spent browsing and testing) and <strong>Demonstrated Mastery</strong> (active recall in SRS and quiz precision).
          </p>
        </div>
      </div>

      {/* 1. DEMONSTRATED MASTERY SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-lg font-bold text-stone-900">
                Demonstrated Spoken Mastery
              </h2>
              <span className="text-xs font-kannada text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                ಸಾಧಿಸಿದ ಪ್ರಾವೀಣ್ಯತೆ
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Active retrieval accuracy and graduated memory retention
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quiz Accuracy */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Quiz Accuracy
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
              {correctCount} correct of {totalQuestions} answered
            </p>
          </div>

          {/* Mastered in SRS */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Mastered (SRS Box 5)
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-stone-900">
                {srsStats.mastered}
              </span>
              <span className="text-xs font-semibold text-stone-400 ml-1">phrases</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {srsStats.reviewing} in progressive review
            </p>
          </div>

          {/* Scenarios Mastered */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Scenarios Solved
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-stone-900">
                {completedScenarioIds.length}
              </span>
              <span className="text-xs font-semibold text-stone-400 ml-1">
                / {CONVERSATION_SCENARIOS.length}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Real-life Karnataka roleplays
            </p>
          </div>

          {/* Active Learning Streak */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Daily Streak
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500" />
              </div>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-stone-900">
                {dailyMission.streakDays}
              </span>
              <span className="text-xs font-semibold text-stone-400 ml-1">days</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {dailyMission.tasks.filter((t) => t.isCompleted).length}/3 tasks done today
            </p>
          </div>
        </div>
      </section>

      {/* 2. ACTIVITY & ENGAGEMENT VOLUME SECTION */}
      <section className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-stone-500" />
            <h2 className="text-lg font-bold text-stone-900">
              Practice Volume & Exposure
            </h2>
            <span className="text-xs font-kannada text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
              ನಿತ್ಯಾಭ್ಯಾಸ
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Total vocabulary explored, starred phrases, and quiz sessions completed
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Phrases Explored
            </span>
            <span className="text-xl sm:text-2xl font-black text-stone-800 mt-1 block">
              {recentPhraseIds.length}
            </span>
            <span className="text-[10px] text-stone-400">recent history cache</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Starred Phrases
            </span>
            <span className="text-xl sm:text-2xl font-black text-stone-800 mt-1 block">
              {savedPhraseIds.length}
            </span>
            <span className="text-[10px] text-stone-400">ready in Show-to-Speak</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Quiz Sessions
            </span>
            <span className="text-xl sm:text-2xl font-black text-stone-800 mt-1 block">
              {progress.totalQuizzesTaken}
            </span>
            <span className="text-[10px] text-stone-400">completed quizzes</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              SRS Enrolled
            </span>
            <span className="text-xl sm:text-2xl font-black text-stone-800 mt-1 block">
              {srsStats.total}
            </span>
            <span className="text-[10px] text-stone-400">in Leitner memory schedule</span>
          </div>
        </div>
      </section>

      {/* 3. Real-Life Conversation Scenarios Progress */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Bengaluru Conversation Scenarios
            </h2>
            <p className="text-xs text-stone-500">
              Interactive roleplay completion across practical Karnataka settings
            </p>
          </div>
          <Link
            to="/conversations"
            className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center space-x-1"
          >
            <span>Open Simulator</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONVERSATION_SCENARIOS.map((scenario) => {
            const isDone = completedScenarioIds.includes(scenario.id);
            return (
              <div
                key={scenario.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-stone-50/70 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-2xl shrink-0">{scenario.avatarEmoji}</span>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {scenario.title}
                    </h4>
                    <p className="font-kannada text-[11px] text-teal-800 truncate">
                      {scenario.kannadaTitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                      Not started
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Category Mastery Breakdown */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
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
      </section>
    </div>
  );
};
