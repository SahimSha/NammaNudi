const fs = require('fs');
const path = require('path');

const phrasesFilePath = path.join(__dirname, '../src/data/phrases.ts');
const categoriesFilePath = path.join(__dirname, '../src/data/categories.ts');
const readmeFilePath = path.join(__dirname, '../public/audio/README.md');

const phrasesContent = fs.readFileSync(phrasesFilePath, 'utf8');
const categoriesContent = fs.readFileSync(categoriesFilePath, 'utf8');

// Parse categories
const categories = [];
const catRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*kannadaName:\s*'([^']+)'/g;
let cMatch;
while ((cMatch = catRegex.exec(categoriesContent)) !== null) {
  categories.push({ id: cMatch[1], name: cMatch[2], kannadaName: cMatch[3] });
}

// Parse phrases
const phraseRegex = /\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?categoryId:\s*'([^']+)'[\s\S]*?kannada:\s*'([^']+)'[\s\S]*?transliteration:\s*'([^']+)'[\s\S]*?english:\s*'([^']+)'[\s\S]*?contextNote:\s*'([^']+)'[\s\S]*?pronunciationGuide:\s*'([^']+)'[\s\S]*?formality:\s*'([^']+)'[\s\S]*?situation:\s*'([^']+)'[\s\S]*?\}/g;

let pMatch;
const phrases = [];
while ((pMatch = phraseRegex.exec(phrasesContent)) !== null) {
  phrases.push({
    id: pMatch[1],
    categoryId: pMatch[2],
    kannada: pMatch[3],
    transliteration: pMatch[4],
    english: pMatch[5]
  });
}

console.log(`Parsed ${phrases.length} phrases across ${categories.length} categories.`);

// Build Catalog Markdown
let catalogMd = '';

categories.forEach(cat => {
  const catPhrases = phrases.filter(p => p.categoryId === cat.id && !p.id.startsWith('bs-'));
  catalogMd += `\n### ${cat.name} (${cat.kannadaName}) — \`${cat.id}\`\n`;
  catPhrases.forEach(p => {
    catalogMd += `- \`${p.id}.mp3\`: ${p.kannada} (${p.english})\n`;
  });
});

const bonusPhrases = phrases.filter(p => p.id.startsWith('bs-'));
if (bonusPhrases.length > 0) {
  catalogMd += `\n### Essential Kannada Everyday Survival Phrases — \`bonus-phrases\`\n`;
  bonusPhrases.forEach(p => {
    catalogMd += `- \`${p.id}.mp3\`: ${p.kannada} (${p.english})\n`;
  });
}

// Read current README up to section 5
const currentReadme = fs.readFileSync(readmeFilePath, 'utf8');
const section5Index = currentReadme.indexOf('## 5. Complete Phrase Catalog');
const headerSection = currentReadme.substring(0, section5Index);

const updatedReadme = `${headerSection}## 5. Complete Phrase Catalog (All ${phrases.length} Phrases)
${catalogMd}`;

fs.writeFileSync(readmeFilePath, updatedReadme, 'utf8');
console.log('Successfully updated public/audio/README.md with exact phrase IDs and canonical text!');
