import assert from 'node:assert';
import { CONVERSATION_SCENARIOS } from '../src/data/conversations.ts';

console.log('--- TEST: Conversation Scenarios Structure & Graph Integrity ---');

console.log(`Loaded ${CONVERSATION_SCENARIOS.length} conversation scenarios.`);
assert(CONVERSATION_SCENARIOS.length >= 5, 'Must contain at least 5 realistic scenarios');

const expectedCategories = ['food-dining', 'public-transport', 'travel-directions', 'shopping-markets'];
const presentCategories = new Set(CONVERSATION_SCENARIOS.map(s => s.category));

for (const exp of expectedCategories) {
  assert(presentCategories.has(exp), `Expected category "${exp}" to be represented`);
}

let totalStepsCount = 0;
let totalChoicesCount = 0;

for (const scenario of CONVERSATION_SCENARIOS) {
  console.log(`\nValidating Scenario: [${scenario.id}] ${scenario.title} (${scenario.kannadaTitle})`);
  assert(scenario.id && scenario.id.trim().length > 0, 'Scenario ID is required');
  assert(scenario.title && scenario.title.trim().length > 0, 'Scenario Title is required');
  assert(scenario.kannadaTitle && scenario.kannadaTitle.trim().length > 0, 'Kannada Title is required');
  assert(scenario.initialStepId, `Scenario ${scenario.id} must define initialStepId`);
  assert(scenario.steps[scenario.initialStepId], `Initial step ${scenario.initialStepId} must exist in scenario.steps`);

  const stepIds = Object.keys(scenario.steps);
  assert(stepIds.length >= 3, `Scenario ${scenario.id} should have at least 3 steps for depth, found ${stepIds.length}`);

  for (const [stepId, step] of Object.entries(scenario.steps)) {
    totalStepsCount++;
    assert.strictEqual(step.id, stepId, `Step id mismatch: ${step.id} vs ${stepId}`);
    assert(step.kannada && step.kannada.trim().length > 0, `Step ${stepId} missing Kannada text`);
    assert(step.transliteration && step.transliteration.trim().length > 0, `Step ${stepId} missing transliteration`);
    assert(step.english && step.english.trim().length > 0, `Step ${stepId} missing English text`);
    assert(Array.isArray(step.choices) && step.choices.length >= 2, `Step ${stepId} must offer at least 2 choices`);

    let hasOptimal = false;
    for (const choice of step.choices) {
      totalChoicesCount++;
      assert(choice.id, `Step ${stepId} has choice without id`);
      assert(choice.kannada, `Step ${stepId} choice ${choice.id} missing Kannada`);
      assert(choice.transliteration, `Step ${stepId} choice ${choice.id} missing transliteration`);
      assert(choice.english, `Step ${stepId} choice ${choice.id} missing English`);
      assert(choice.feedback, `Step ${stepId} choice ${choice.id} missing feedback`);

      if (choice.isOptimal) hasOptimal = true;

      if (choice.nextStepId !== null) {
        assert(scenario.steps[choice.nextStepId], `Choice ${choice.id} in step ${stepId} points to non-existent step: "${choice.nextStepId}"`);
      }
    }
    assert(hasOptimal, `Step ${stepId} must have at least one optimal choice`);
  }

  // Verify optimal walkthrough path reaches completion
  let currentStepId = scenario.initialStepId;
  const visited = new Set();
  let completed = false;
  let stepsTaken = 0;

  while (currentStepId && stepsTaken < 20) {
    stepsTaken++;
    visited.add(currentStepId);
    const step = scenario.steps[currentStepId];
    const optimalChoice = step.choices.find(c => c.isOptimal) || step.choices[0];
    if (optimalChoice.nextStepId === null) {
      completed = true;
      break;
    }
    currentStepId = optimalChoice.nextStepId;
  }

  assert(completed, `Scenario ${scenario.id} optimal path did not complete within reasonable steps`);
  console.log(`  ✓ Graph intact: completed in ${stepsTaken} optimal turns (${stepIds.length} total states)`);
}

console.log(`\n========================================`);
console.log(`Total Scenarios: ${CONVERSATION_SCENARIOS.length}`);
console.log(`Total Dialogue Steps: ${totalStepsCount}`);
console.log(`Total Interactive Choices: ${totalChoicesCount}`);
console.log(`✓ PASS: Conversation Scenarios dialogue tree & linguistic integrity verified!`);
