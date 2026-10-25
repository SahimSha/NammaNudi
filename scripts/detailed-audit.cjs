const fs = require('fs');
const path = require('path');

const phrasesFilePath = path.join(__dirname, '../src/data/phrases.ts');
const categoriesFilePath = path.join(__dirname, '../src/data/categories.ts');

const phrasesContent = fs.readFileSync(phrasesFilePath, 'utf8');
const categoriesContent = fs.readFileSync(categoriesFilePath, 'utf8');

// Extract category IDs
const categoryIds = [];
const catRegex = /id:\s*'([^']+)'/g;
let cMatch;
while ((cMatch = catRegex.exec(categoriesContent)) !== null) {
  categoryIds.push(cMatch[1]);
}
console.log('Valid Category IDs:', categoryIds);

// Extract phrases
const phraseRegex = /\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?categoryId:\s*'([^']+)'[\s\S]*?kannada:\s*'([^']+)'[\s\S]*?transliteration:\s*'([^']+)'[\s\S]*?english:\s*'([^']+)'[\s\S]*?contextNote:\s*'([^']+)'[\s\S]*?pronunciationGuide:\s*'([^']+)'[\s\S]*?formality:\s*'([^']+)'[\s\S]*?situation:\s*'([^']+)'[\s\S]*?\}/g;

let match;
const phrases = [];
while ((match = phraseRegex.exec(phrasesContent)) !== null) {
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

console.log(`Auditing all ${phrases.length} phrases...`);

let errorsFound = 0;

// 1. Category validation
phrases.forEach(p => {
  if (!categoryIds.includes(p.categoryId)) {
    console.error(`ERROR: Phrase ${p.id} has invalid categoryId: "${p.categoryId}"`);
    errorsFound++;
  }
});

// 2. Field completeness
phrases.forEach(p => {
  const fields = ['id', 'categoryId', 'kannada', 'transliteration', 'english', 'contextNote', 'pronunciationGuide', 'formality', 'situation'];
  fields.forEach(f => {
    if (!p[f] || p[f].trim() === '') {
      console.error(`ERROR: Phrase ${p.id} has empty field: ${f}`);
      errorsFound++;
    }
  });
});

// 3. Formality level validation
const validFormalities = ['polite', 'casual', 'formal'];
phrases.forEach(p => {
  if (!validFormalities.includes(p.formality)) {
    console.error(`ERROR: Phrase ${p.id} has invalid formality: "${p.formality}"`);
    errorsFound++;
  }
});

// 4. Duplicate Kannada text
const kannadaTexts = {};
phrases.forEach(p => {
  if (kannadaTexts[p.kannada]) {
    console.warn(`DUPLICATE KANNADA: "${p.kannada}" in ${kannadaTexts[p.kannada]} and ${p.id}`);
    errorsFound++;
  } else {
    kannadaTexts[p.kannada] = p.id;
  }
});

// 5. Duplicate English meaning
const englishTexts = {};
phrases.forEach(p => {
  if (englishTexts[p.english]) {
    console.warn(`DUPLICATE ENGLISH: "${p.english}" in ${englishTexts[p.english]} and ${p.id}`);
    errorsFound++;
  } else {
    englishTexts[p.english] = p.id;
  }
});

console.log(`\nAudit finished with ${errorsFound} structural errors detected.`);

