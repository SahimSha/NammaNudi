import assert from 'node:assert';
import {
  BOX_INTERVALS,
  addDaysToDateString,
  enrollPhrase,
  processSRSReview,
  getDuePhraseIds,
  getSRSStatistics,
  getLocalDateString
} from '../src/utils/srs.ts';

console.log('--- TEST: Spaced Repetition (SRS) Leitner System Integrity ---');

// 1. Leitner Intervals Check
assert.strictEqual(BOX_INTERVALS[1], 1, 'Box 1 must be 1 day');
assert.strictEqual(BOX_INTERVALS[2], 3, 'Box 2 must be 3 days');
assert.strictEqual(BOX_INTERVALS[3], 7, 'Box 3 must be 7 days');
assert.strictEqual(BOX_INTERVALS[4], 14, 'Box 4 must be 14 days');
assert.strictEqual(BOX_INTERVALS[5], 30, 'Box 5 must be 30 days');
console.log('✓ Leitner intervals verified: [1, 3, 7, 14, 30] days');

// 2. Date addition check
const baseDate = '2026-10-26';
assert.strictEqual(addDaysToDateString(baseDate, 1), '2026-10-27');
assert.strictEqual(addDaysToDateString(baseDate, 3), '2026-10-29');
assert.strictEqual(addDaysToDateString(baseDate, 7), '2026-11-02');
console.log('✓ Date projection verified');

// 3. Enrollment
const today = getLocalDateString();
let items = {};
items = enrollPhrase(items, 'td-01', today);
assert(items['td-01'], 'Item should be enrolled');
assert.strictEqual(items['td-01'].box, 1, 'Initial box must be 1');
assert.strictEqual(items['td-01'].nextReviewDate, today, 'Newly enrolled item is due immediately');
assert.strictEqual(items['td-01'].repetitions, 0);

// Double enrollment should be no-op
const itemsAfterReEnroll = enrollPhrase(items, 'td-01', today);
assert.strictEqual(Object.keys(itemsAfterReEnroll).length, 1);
console.log('✓ Phrase enrollment verified');

// 4. Due filter
let due = getDuePhraseIds(items, today);
assert.strictEqual(due.length, 1);
assert.strictEqual(due[0], 'td-01');
console.log('✓ Due queue query verified');

// 5. Reviewing rating "good" advances box
const reviewedGood = processSRSReview(items['td-01'], 'good', today);
assert.strictEqual(reviewedGood.box, 2, 'Box 1 + good -> Box 2');
assert.strictEqual(reviewedGood.intervalDays, 3);
assert.strictEqual(reviewedGood.repetitions, 1);
assert.strictEqual(reviewedGood.lastReviewedDate, today);
assert(reviewedGood.nextReviewDate > today, 'Next review date must be in future');

// Update map and check due queue
items['td-01'] = reviewedGood;
due = getDuePhraseIds(items, today);
assert.strictEqual(due.length, 0, 'Reviewed item should not be due today anymore');
console.log('✓ Rating "good" successfully advanced box and scheduled next review');

// 6. Rating "again" resets box to 1
const reviewedAgain = processSRSReview(reviewedGood, 'again', today);
assert.strictEqual(reviewedAgain.box, 1, 'Stumbling must reset to Box 1');
assert.strictEqual(reviewedAgain.intervalDays, 1);
assert.strictEqual(reviewedAgain.repetitions, 2);
console.log('✓ Rating "again" resets item to Box 1');

// 7. Successive good ratings graduate phrase to Mastered (Box 5)
let current = reviewedAgain;
current = processSRSReview(current, 'good', today); // Box 2
current = processSRSReview(current, 'good', today); // Box 3
current = processSRSReview(current, 'good', today); // Box 4
current = processSRSReview(current, 'good', today); // Box 5 (Mastered)
assert.strictEqual(current.box, 5, 'Must reach Box 5');
assert.strictEqual(current.intervalDays, 30, 'Mastered interval must be 30 days');

// Further good should cap at Box 5
current = processSRSReview(current, 'good', today);
assert.strictEqual(current.box, 5, 'Must cap at Box 5');
console.log('✓ Graduation to Box 5 (Mastered) verified');

// 8. Rating "easy" jumps 2 boxes
let easyTest = { phraseId: 'pt-05', box: 1, nextReviewDate: today, intervalDays: 1, repetitions: 0 };
easyTest = processSRSReview(easyTest, 'easy', today);
assert.strictEqual(easyTest.box, 3, 'Box 1 + easy -> Box 3');
assert.strictEqual(easyTest.intervalDays, 7);
console.log('✓ Rating "easy" jumps 2 boxes');

// 9. Statistics Calculation
const mockMap = {
  p1: { phraseId: 'p1', box: 1, nextReviewDate: today, intervalDays: 1, repetitions: 0 },
  p2: { phraseId: 'p2', box: 2, nextReviewDate: '2099-01-01', intervalDays: 3, repetitions: 1 },
  p3: { phraseId: 'p3', box: 5, nextReviewDate: '2099-01-01', intervalDays: 30, repetitions: 5 }
};
const stats = getSRSStatistics(mockMap, today);
assert.strictEqual(stats.total, 3);
assert.strictEqual(stats.due, 1);
assert.strictEqual(stats.learning, 1);
assert.strictEqual(stats.reviewing, 1);
assert.strictEqual(stats.mastered, 1);
assert.strictEqual(stats.boxCounts[1], 1);
assert.strictEqual(stats.boxCounts[2], 1);
assert.strictEqual(stats.boxCounts[3], 0);
assert.strictEqual(stats.boxCounts[4], 0);
assert.strictEqual(stats.boxCounts[5], 1);
console.log('✓ Statistics aggregation verified');

console.log('\n✓ PASS: All Spaced Repetition (SRS) Leitner rules, schedules, and queues verified!');
