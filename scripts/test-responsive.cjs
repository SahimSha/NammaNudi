/**
 * Automated Responsive Design & Mobile-First Audit Suite for NammaNudi
 * Verifies mobile touch targets, viewport clipping prevention, word-breaking,
 * scroll containment, and responsive layout classes across all components.
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

console.log('--- TEST: Responsive Design & Mobile-First Layout Audit ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

// 1. Audit App.tsx Shell
const appContent = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf-8');
assert(
  appContent.includes('overflow-x-hidden'),
  'App.tsx has overflow-x-hidden to prevent accidental horizontal viewport scrolling on mobile'
);
assert(
  appContent.includes('px-3 sm:px-6'),
  'App.tsx uses fluid mobile padding (px-3 sm:px-6) for 320px-430px viewports'
);

// 2. Audit Header.tsx Navigation & Drawer
const headerContent = fs.readFileSync(path.join(srcDir, 'components', 'Header.tsx'), 'utf-8');
assert(
  headerContent.includes('isMobileMenuOpen'),
  'Header.tsx implements mobile menu drawer state'
);
assert(
  headerContent.includes('Menu') && headerContent.includes('X'),
  'Header.tsx has responsive mobile menu toggle icons (Menu / X)'
);
assert(
  headerContent.includes('min-h-[44px]'),
  'Header.tsx mobile menu items enforce accessible touch targets (>= 44px)'
);

// 3. Audit PhraseCard.tsx
const phraseCardContent = fs.readFileSync(path.join(srcDir, 'components', 'PhraseCard.tsx'), 'utf-8');
assert(
  phraseCardContent.includes('flex flex-wrap items-center justify-between gap-2'),
  'PhraseCard.tsx action bar wraps gracefully (flex-wrap) on 320px devices'
);
assert(
  phraseCardContent.includes('break-words'),
  'PhraseCard.tsx Kannada text has break-words to avoid clipping on narrow screens'
);
assert(
  phraseCardContent.includes('min-h-[36px]'),
  'PhraseCard.tsx buttons enforce touch targets'
);

// 4. Audit PhraseDetailModal.tsx
const detailModalContent = fs.readFileSync(path.join(srcDir, 'components', 'PhraseDetailModal.tsx'), 'utf-8');
assert(
  detailModalContent.includes('max-h-[calc(100dvh'),
  'PhraseDetailModal.tsx bounds modal within dynamic viewport height (100dvh)'
);
assert(
  detailModalContent.includes('overflow-y-auto flex-1'),
  'PhraseDetailModal.tsx provides scrollable content body with fixed header/footer'
);
assert(
  detailModalContent.includes('min-h-[44px]'),
  'PhraseDetailModal.tsx buttons enforce 44px touch targets'
);

// 5. Audit ShowToSpeakModal.tsx
const showToSpeakContent = fs.readFileSync(path.join(srcDir, 'components', 'ShowToSpeakModal.tsx'), 'utf-8');
assert(
  showToSpeakContent.includes('overflow-y-auto'),
  'ShowToSpeakModal.tsx has overflow-y-auto for landscape/short mobile viewports'
);
assert(
  showToSpeakContent.includes('break-words'),
  'ShowToSpeakModal.tsx gigantic Kannada text has break-words to prevent overflow'
);
assert(
  showToSpeakContent.includes('min-h-[48px]'),
  'ShowToSpeakModal.tsx central audio button has >= 48px touch height'
);

// 6. Audit PronunciationPracticeModal.tsx
const practiceModalContent = fs.readFileSync(path.join(srcDir, 'components', 'PronunciationPracticeModal.tsx'), 'utf-8');
assert(
  practiceModalContent.includes('max-h-[calc(100dvh'),
  'PronunciationPracticeModal.tsx uses 100dvh dynamic height containment'
);
assert(
  practiceModalContent.includes('overflow-y-auto flex-1'),
  'PronunciationPracticeModal.tsx has internal scrolling to keep action buttons visible'
);
assert(
  practiceModalContent.includes('min-h-[44px]'),
  'PronunciationPracticeModal.tsx controls enforce accessible touch targets'
);

// 7. Audit DailyMissionCard.tsx
const dailyMissionContent = fs.readFileSync(path.join(srcDir, 'components', 'DailyMissionCard.tsx'), 'utf-8');
assert(
  dailyMissionContent.includes('flex flex-col sm:flex-row sm:items-center justify-between'),
  'DailyMissionCard.tsx header and tasks stack on narrow 320px screens'
);

// 8. Audit SavedPage.tsx (SRS Leitner Schedule)
const savedPageContent = fs.readFileSync(path.join(srcDir, 'pages', 'SavedPage.tsx'), 'utf-8');
assert(
  savedPageContent.includes('grid grid-cols-5 gap-1 sm:gap-2'),
  'SavedPage.tsx Leitner 5-box overview uses compact gap-1 on mobile to prevent clipping'
);
assert(
  savedPageContent.includes('min-h-[64px]'),
  'SavedPage.tsx SRS rating buttons enforce comfortable touch areas'
);

// 9. Audit ConversationSimulatorPage.tsx
const convoContent = fs.readFileSync(path.join(srcDir, 'pages', 'ConversationSimulatorPage.tsx'), 'utf-8');
assert(
  convoContent.includes('flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5'),
  'ConversationSimulatorPage.tsx reply action buttons stack full-width on mobile'
);

// 10. Audit ProgressPage.tsx
const progressContent = fs.readFileSync(path.join(srcDir, 'pages', 'ProgressPage.tsx'), 'utf-8');
assert(
  progressContent.includes('grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4'),
  'ProgressPage.tsx 4 primary metric cards scale fluidly from mobile to desktop'
);

// 11. Audit QuizPage.tsx
const quizContent = fs.readFileSync(path.join(srcDir, 'pages', 'QuizPage.tsx'), 'utf-8');
assert(
  quizContent.includes('flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5'),
  'QuizPage.tsx explanation and next question action bar stacks cleanly on mobile'
);

console.log('========================================');
console.log(`Total Responsive Checks: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log('✓ PASS: All responsive design, touch targets, and viewport constraints verified!');
