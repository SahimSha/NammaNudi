import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Flame, ArrowRight, Sparkles, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyMissionCard: React.FC = () => {
  const { dailyMission, completeDailyMissionTask } = useApp();

  const completedCount = dailyMission.tasks.filter((t) => t.isCompleted).length;
  const totalTasks = dailyMission.tasks.length;
  const isAllComplete = completedCount === totalTasks;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const getTaskIcon = (id: string) => {
    switch (id) {
      case 'daily-phrase':
        return <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'daily-convo':
        return <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'daily-quiz':
        return <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-amber-200 dark:border-amber-900/40 shadow-sm relative overflow-hidden transition-all">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 dark:bg-amber-950/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg">
                Daily Kannada Mission
              </h3>
              <span className="text-xs font-kannada font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
                ದಿನದ ಗುರಿ
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              3 daily habits for spoken Kannada fluency • {dailyMission.date}
            </p>
          </div>
        </div>

        {/* Streak counter */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 px-3 py-1.5 rounded-xl border border-orange-200/70 dark:border-orange-800/40 shadow-2xs">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
          <span className="font-bold text-xs sm:text-sm text-orange-700 dark:text-orange-300">
            {dailyMission.streakDays} {dailyMission.streakDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {completedCount} of {totalTasks} tasks finished
          </span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {progressPercent}%
          </span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isAllComplete
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {dailyMission.tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
              task.isCompleted
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40'
                : 'bg-slate-50/70 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 hover:border-amber-300 dark:hover:border-amber-800/70'
            }`}
          >
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => completeDailyTaskToggle(task.id, task.isCompleted)}
                title={task.isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                className="mt-0.5 focus:outline-hidden"
              >
                {task.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 hover:text-amber-500 transition-colors" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {getTaskIcon(task.id)}
                  <span
                    className={`text-sm font-medium ${
                      task.isCompleted
                        ? 'text-slate-500 dark:text-slate-400 line-through'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="text-xs font-kannada text-slate-400 dark:text-slate-500">
                    ({task.kannadaTitle})
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                  {task.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center">
              {task.isCompleted ? (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                  Done ✓
                </span>
              ) : (
                <Link
                  to={task.actionUrl}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-2xs"
                >
                  <span>{task.actionLabel}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Banner */}
      {isAllComplete && (
        <div className="mt-3.5 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-semibold font-kannada">ಅದ್ಭುತ! ಇಂದಿನ ದಿನದ ಗುರಿ ಪೂರ್ಣಗೊಂಡಿದೆ!</span>
            <span className="block text-emerald-700/80 dark:text-emerald-300/80">
              You completed all 3 spoken Kannada habits for today. Come back tomorrow to maintain your streak!
            </span>
          </div>
        </div>
      )}
    </div>
  );

  function completeDailyTaskToggle(taskId: 'daily-phrase' | 'daily-convo' | 'daily-quiz', isCurrentlyCompleted: boolean) {
    if (!isCurrentlyCompleted) {
      completeDailyMissionTask(taskId);
    }
  }
};

