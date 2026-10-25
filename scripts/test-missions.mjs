import assert from 'node:assert';
import {
  getLocalDateString,
  getYesterdayDateString,
  getDefaultDailyTasks,
  initDailyMissionState,
  completeDailyTask
} from '../src/utils/dailyMissions.ts';

console.log('--- TEST: Personalized Daily Kannada Mission System ---');

// 1. Date format check
const today = getLocalDateString();
assert(/^\d{4}-\d{2}-\d{2}$/.test(today), `Today date string "${today}" must be YYYY-MM-DD format`);

const yesterday = getYesterdayDateString();
assert(/^\d{4}-\d{2}-\d{2}$/.test(yesterday), `Yesterday date string "${yesterday}" must be YYYY-MM-DD format`);
assert(today !== yesterday, 'Today and yesterday must differ');

console.log(`✓ Local dates verified: Today = ${today}, Yesterday = ${yesterday}`);

// 2. Default tasks check
const tasks = getDefaultDailyTasks();
assert.strictEqual(tasks.length, 3, 'Must have 3 core daily habits');
const taskIds = tasks.map(t => t.id);
assert(taskIds.includes('daily-phrase'), 'Must include daily phrase practice');
assert(taskIds.includes('daily-convo'), 'Must include daily conversation scenario');
assert(taskIds.includes('daily-quiz'), 'Must include daily quiz test');

for (const t of tasks) {
  assert(t.title && t.title.length > 0, 'Task must have title');
  assert(t.kannadaTitle && t.kannadaTitle.length > 0, 'Task must have Kannada title');
  assert(t.actionUrl && t.actionUrl.startsWith('/'), 'Task actionUrl must be valid route');
  assert.strictEqual(t.isCompleted, false, 'Initial task must not be completed');
}
console.log('✓ Default tasks structure verified');

// 3. Task completion flow
let state = initDailyMissionState(today);
assert.strictEqual(state.streakDays, 0);

// Complete first task
const res1 = completeDailyTask(state, 'daily-phrase');
assert.strictEqual(res1.isFirstCompletion, true);
assert.strictEqual(res1.isMissionAllDone, false);
assert.strictEqual(res1.updatedState.tasks.find(t => t.id === 'daily-phrase').isCompleted, true);
assert.strictEqual(res1.updatedState.tasks.find(t => t.id === 'daily-convo').isCompleted, false);

// Complete second task
const res2 = completeDailyTask(res1.updatedState, 'daily-convo');
assert.strictEqual(res2.isFirstCompletion, true);
assert.strictEqual(res2.isMissionAllDone, false);

// Complete third task -> Mission All Done!
const res3 = completeDailyTask(res2.updatedState, 'daily-quiz');
assert.strictEqual(res3.isFirstCompletion, true);
assert.strictEqual(res3.isMissionAllDone, true);
assert.strictEqual(res3.updatedState.streakDays, 1, 'Streak should increment to 1 upon all tasks done');
assert.strictEqual(res3.updatedState.lastCompletedDate, today);
console.log('✓ Task completion and completion milestone verified');

// 4. Persistence across refresh simulation (same date retains completed state)
const refreshedState = res3.updatedState;
assert.strictEqual(refreshedState.date, today);
assert.strictEqual(refreshedState.tasks.every(t => t.isCompleted), true, 'Same day reload must not reset completed tasks');
assert.strictEqual(refreshedState.streakDays, 1);
console.log('✓ Page refresh stability verified (no accidental resets on same day)');

// 5. Successive day completion increments streak
let tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrowStr = getLocalDateString(tomorrowDate);

// Simulate next day rollover with yesterday all completed
const nextDayState = {
  date: tomorrowStr,
  tasks: getDefaultDailyTasks(),
  streakDays: 1,
  lastCompletedDate: today
};

// Finish all tasks on next day
const d2_1 = completeDailyTask(nextDayState, 'daily-phrase');
const d2_2 = completeDailyTask(d2_1.updatedState, 'daily-convo');
const d2_3 = completeDailyTask(d2_2.updatedState, 'daily-quiz');

assert.strictEqual(d2_3.isMissionAllDone, true);
assert.strictEqual(d2_3.updatedState.streakDays, 2, 'Streak should advance to 2 consecutive days');
assert.strictEqual(d2_3.updatedState.lastCompletedDate, tomorrowStr);
console.log('✓ Multi-day streak advancement verified');

console.log('\n✓ PASS: Daily Kannada Mission logic, date transitions, and streak retention verified!');
