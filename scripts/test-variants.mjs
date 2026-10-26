import assert from 'node:assert';
import { PHRASES } from '../src/data/phrases.ts';

console.log('--- TEST: Context-Aware Kannada Variants & Sociolinguistic Integrity ---');

const phrasesWithVariants = PHRASES.filter(p => Array.isArray(p.variants) && p.variants.length > 0);
console.log(`Found ${phrasesWithVariants.length} phrases enriched with Context-Aware variants.`);
assert(phrasesWithVariants.length >= 8, 'At least 8 key everyday phrases must have context-aware variants');

let totalVariants = 0;
const validFormalities = new Set(['polite', 'casual', 'formal']);

for (const phrase of phrasesWithVariants) {
  console.log(`\nValidating Phrase [${phrase.id}]: ${phrase.kannada} ("${phrase.english}")`);
  assert(phrase.variants.length >= 2, `Phrase ${phrase.id} must have at least 2 variants`);

  let hasRecommended = false;
  const variantIds = new Set();

  for (const v of phrase.variants) {
    totalVariants++;
    assert(v.id && !variantIds.has(v.id), `Variant ID must be unique: ${v.id}`);
    variantIds.add(v.id);

    assert(validFormalities.has(v.formality), `Invalid formality: ${v.formality}`);
    assert(v.kannada && v.kannada.trim().length > 0, `Variant ${v.id} missing Kannada text`);
    assert(/[\u0C80-\u0CFF]/.test(v.kannada), `Variant ${v.id} must contain Kannada script: ${v.kannada}`);
    assert(v.transliteration && v.transliteration.trim().length > 0, `Variant ${v.id} missing transliteration`);
    assert(v.english && v.english.trim().length > 0, `Variant ${v.id} missing English`);
    assert(v.usageContext && v.usageContext.length >= 10, `Variant ${v.id} must provide descriptive usageContext`);

    if (v.isRecommendedDefault) {
      hasRecommended = true;
    }

    console.log(`  - [${v.formality.toUpperCase()}] ${v.kannada} (${v.transliteration}) => "${v.english}"`);
  }

  assert(hasRecommended, `Phrase ${phrase.id} must specify an isRecommendedDefault variant`);
}

console.log('\n========================================');
console.log(`Total phrases with variants: ${phrasesWithVariants.length}`);
console.log(`Total variants defined: ${totalVariants}`);
console.log('✓ PASS: All context-aware phrase variants, scripts, and social registers verified!');

