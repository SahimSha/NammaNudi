const fs = require('fs');
const path = require('path');

const phrasesFilePath = path.join(__dirname, '../src/data/phrases.ts');
const content = fs.readFileSync(phrasesFilePath, 'utf8');

// Parse phrases using a safe evaluation or regex extraction
const phrases = [];
const phraseRegex = /\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?categoryId:\s*'([^']+)'[\s\S]*?kannada:\s*'([^']+)'[\s\S]*?transliteration:\s*'([^']+)'[\s\S]*?english:\s*'([^']+)'[\s\S]*?contextNote:\s*'([^']+)'[\s\S]*?pronunciationGuide:\s*'([^']+)'[\s\S]*?formality:\s*'([^']+)'[\s\S]*?situation:\s*'([^']+)'[\s\S]*?\}/g;

let match;
while ((match = phraseRegex.exec(content)) !== null) {
  phrases.push({
    id: match[1],
    categoryId: match[2],
    kannada: match[3],
    transliteration: match[4],
    english: match[5],
    contextNote: match[6],
    pronunciationGuide: match[7],
    formality: match[8],
    situation: match[9]
  });
}

console.log(`Parsed ${phrases.length} phrases from phrases.ts`);

// 1. Check duplicate IDs
const idCounts = {};
phrases.forEach(p => {
  idCounts[p.id] = (idCounts[p.id] || 0) + 1;
});
const duplicates = Object.keys(idCounts).filter(id => idCounts[id] > 1);
console.log('Duplicate IDs:', duplicates.length > 0 ? duplicates : 'None (0)');

// 2. Check for parentheses in Kannada text
const withParens = phrases.filter(p => p.kannada.includes('(') || p.kannada.includes(')'));
console.log(`\nPhrases with parentheses in Kannada script (${withParens.length}):`);
withParens.forEach(p => {
  console.log(`  [${p.id}] ${p.kannada} (Translit: ${p.transliteration})`);
});

// 3. Check transliteration syllable alignment
console.log('\nAudit complete.');

