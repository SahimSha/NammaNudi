const fs = require('fs');

const phrasesContent = fs.readFileSync('./src/data/phrases.ts', 'utf-8');

// Parse phrase blocks
const idMatches = [...phrasesContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const kannadaMatches = [...phrasesContent.matchAll(/kannada:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const englishMatches = [...phrasesContent.matchAll(/english:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const categoryMatches = [...phrasesContent.matchAll(/categoryId:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const translitMatches = [...phrasesContent.matchAll(/transliteration:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);

console.log('=== PHRASE AUDIT RESULTS ===');
console.log(`Total phrases detected: ${idMatches.length}`);
console.log(`Kannada text count: ${kannadaMatches.length}`);
console.log(`English text count: ${englishMatches.length}`);
console.log(`Transliteration count: ${translitMatches.length}`);
console.log(`Category count: ${categoryMatches.length}`);

// Check unique IDs
const idSet = new Set();
const duplicateIds = [];
idMatches.forEach(id => {
  if (idSet.has(id)) duplicateIds.push(id);
  idSet.add(id);
});
console.log(`Unique IDs: ${idSet.size} / ${idMatches.length}`);
if (duplicateIds.length > 0) {
  console.error(`DUPLICATE IDs found:`, duplicateIds);
}

// Check unique Kannada phrases
const kannadaSet = new Set();
const duplicateKannada = [];
kannadaMatches.forEach(k => {
  if (kannadaSet.has(k)) duplicateKannada.push(k);
  kannadaSet.add(k);
});
console.log(`Unique Kannada texts: ${kannadaSet.size} / ${kannadaMatches.length}`);
if (duplicateKannada.length > 0) {
  console.warn(`Duplicate Kannada text:`, duplicateKannada);
}

// Distribution by category
const catCounts = {};
categoryMatches.forEach(c => {
  catCounts[c] = (catCounts[c] || 0) + 1;
});
console.log('\nCategory breakdown:');
for (const [cat, count] of Object.entries(catCounts)) {
  console.log(`  - ${cat}: ${count} phrases`);
}

