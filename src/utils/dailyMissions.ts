import type { DailyMissionState, DailyTask, DailyTaskId } from '../types';

export const STORAGE_KEY_DAILY_MISSIONS = 'nammanudi_daily_missions_v1';

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(d: Date = new Date()): string {
  const yesterday = new Date(d);
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
}

export function getDefaultDailyTasks(): DailyTask[] {
  return [
    {
      id: 'daily-phrase',
      title: "Practise Today's Featured Phrase",
      kannadaTitle: 'ದಿನದ ನುಡಿ ಅಭ್ಯಾಸ',
      description: "Listen to today's phrase, repeat aloud, and practise pronunciation.",
      actionLabel: 'Practise Phrase',
      actionUrl: '/',
      isCompleted: false
    },
    {
      id: 'daily-convo',
      title: 'Real-Life Conversation Dialogue',
      kannadaTitle: 'ನೈಜ ಸಂಭಾಷಣೆ',
      description: 'Complete 1 Bengaluru conversation scenario (Darshini, BMTC Bus, or Auto).',
      actionLabel: 'Start Scenario',
      actionUrl: '/conversations',
      isCompleted: false
    },
    {
      id: 'daily-quiz',
      title: 'Daily Kannada Memory Quiz',
      kannadaTitle: 'ದಿನದ ರಸಪ್ರಶ್ನೆ',
      description: 'Test your retention with a quick 5-question interactive quiz.',
      actionLabel: 'Start Quiz',
      actionUrl: '/quiz',
      isCompleted: false
    }
  ];
}

export function initDailyMissionState(today: string = getLocalDateString()): DailyMissionState {
  return {
    date: today,
    tasks: getDefaultDailyTasks(),
    streakDays: 0,
    lastCompletedDate: undefined
  };
}

export function loadDailyMissionState(): DailyMissionState {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  if (typeof localStorage === 'undefined') {
    return initDailyMissionState(today);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAILY_MISSIONS);
    if (!raw) {
      const fresh = initDailyMissionState(today);
      saveDailyMissionState(fresh);
      return fresh;
    }

    const state: DailyMissionState = JSON.parse(raw);

    // If already today, preserve existing tasks and completion states intact across refreshes
    if (state.date === today && Array.isArray(state.tasks) && state.tasks.length > 0) {
      return state;
    }

    // Date rolled over to a new day!
    // Check if the previous recorded day had completed all tasks
    const prevAllDone = Array.isArray(state.tasks) && state.tasks.every((t) => t.isCompleted);
    let newStreak = state.streakDays || 0;

    if (state.date === yesterday) {
      if (prevAllDone) {
        // Yesterday was fully completed; maintain the active streak into today
        newStreak = state.streakDays || 1;
      } else {
        // Yesterday wasn't finished; streak resets to 0
        newStreak = 0;
      }
    } else if (state.lastCompletedDate === yesterday) {
      // Kept intact
      newStreak = state.streakDays || 0;
    } else {
      // Missed more than 1 day
      newStreak = 0;
    }

    const nextState: DailyMissionState = {
      date: today,
      tasks: getDefaultDailyTasks(),
      streakDays: newStreak,
      lastCompletedDate: prevAllDone ? state.date : state.lastCompletedDate
    };

    saveDailyMissionState(nextState);
    return nextState;
  } catch (e) {
    console.warn('Failed to load daily mission state, using fresh state', e);
    const fallback = initDailyMissionState(today);
    return fallback;
  }
}

export function saveDailyMissionState(state: DailyMissionState): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_DAILY_MISSIONS, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save daily mission state', e);
  }
}

export function completeDailyTask(
  state: DailyMissionState,
  taskId: DailyTaskId
): { updatedState: DailyMissionState; isFirstCompletion: boolean; isMissionAllDone: boolean } {
  let isFirstCompletion = false;

  const updatedTasks = state.tasks.map((task) => {
    if (task.id === taskId) {
      if (!task.isCompleted) {
        isFirstCompletion = true;
      }
      return {
        ...task,
        isCompleted: true,
        completedAt: task.completedAt || new Date().toISOString()
      };
    }
    return task;
  });

  const isMissionAllDone = updatedTasks.every((t) => t.isCompleted);
  const wasAlreadyAllDone = state.tasks.every((t) => t.isCompleted);

  let newStreak = state.streakDays;
  let lastCompletedDate = state.lastCompletedDate;

  if (isMissionAllDone && !wasAlreadyAllDone) {
    // Completed all tasks for today
    newStreak = Math.max(1, (state.streakDays || 0) + 1);
    lastCompletedDate = state.date;
  }

  const updatedState: DailyMissionState = {
    ...state,
    tasks: updatedTasks,
    streakDays: newStreak,
    lastCompletedDate
  };

  saveDailyMissionState(updatedState);
  return { updatedState, isFirstCompletion, isMissionAllDone };
}
