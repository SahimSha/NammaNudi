import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import dns from 'node:dns';
import { fileURLToPath } from 'node:url';

if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv6first');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Look up GEMINI_API_KEY from environment or common .env locations
function getGeminiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const envPaths = [
    path.join(__dirname, '../.env.local'),
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../../SIH 2026/SenTrix/backend/.env'),
    path.join(__dirname, '../../AttendX/.env')
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const match = fs.readFileSync(p, 'utf8').match(/GEMINI_API_KEY=([^\r\n]+)/);
      if (match) return match[1].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return null;
}

const key = getGeminiKey();
if (!key) {
  console.error('No GEMINI_API_KEY found.');
  process.exit(1);
}

const TEST_PHRASES = [
  {
    id: 'td-01',
    kannada: 'ಇಲ್ಲಿಗೆ ಹೇಗೆ ಹೋಗುವುದು?',
    transliteration: 'Illige hege hoguvudu?',
    english: 'How do I go here? / How to reach here?'
  },
  {
    id: 'fd-01',
    kannada: 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ.',
    transliteration: 'Ondu masala dose matthu bisi filter coffee kodi.',
    english: 'One masala dosa and hot filter coffee please.'
  },
  {
    id: 'bs-01',
    kannada: 'ನಮಸ್ಕಾರ! ಹೇಗಿದ್ದೀರಾ?',
    transliteration: 'Namaskara! Hegiddeera?',
    english: 'Hello! How are you?'
  }
];

const OUTPUT_DIR = path.join(__dirname, '../public/audio/test-samples');
const CANONICAL_DIR = path.join(__dirname, '../public/audio/kn');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(CANONICAL_DIR)) fs.mkdirSync(CANONICAL_DIR, { recursive: true });

function postJson(urlStr, headers, bodyObj) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = JSON.stringify(bodyObj);
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      },
      timeout: 30000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch {
          reject(new Error(`Failed to parse JSON response (${res.statusCode}): ${data.slice(0, 200)}`));
        }
      });
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout after 30s'));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function synthesizeWithRetry(text, voice = 'Kore', maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const data = await postJson(
      'https://generativelanguage.googleapis.com/v1beta/interactions',
      { 'x-goog-api-key': key },
      {
        model: 'gemini-3.8-flash-tts',
        input: [{
          type: 'user_input',
          content: [{
            type: 'text',
            text
          }]
        }],
        response_format: {
          type: 'audio',
          mime_type: 'audio/mp3'
        },
        generation_config: {
          speech_config: [
            { voice }
          ]
        }
      }
    );

    if (data.error) {
      if (data.error.code === 429 || data.error.message?.includes('Rate limit exceeded')) {
        console.log(`    [Rate limit 3 RPM hit] Waiting 22s before retry (attempt ${attempt}/${maxRetries})...`);
        await sleep(22000);
        continue;
      }
      throw new Error(`API Error (${data.error.code}): ${data.error.message}`);
    }

    const step = data.steps && data.steps.find(s => s.type === 'model_output');
    const audio = step && step.content && step.content.find(c => c.type === 'audio');
    if (!audio || !audio.data) {
      throw new Error('No audio content returned in model_output step');
    }

    return {
      buffer: Buffer.from(audio.data, 'base64'),
      usage: data.usage
    };
  }
  throw new Error(`Failed after ${maxRetries} rate limit retries`);
}

async function run() {
  console.log('Testing Gemini 3.8 Flash TTS on 3 Representative Kannada Phrases:');
  console.log('================================================================');

  const voices = [
    { name: 'Kore', label: 'Female (Clear, Firm)' },
    { name: 'Aoede', label: 'Female (Breezy, Warm)' },
    { name: 'Puck', label: 'Male (Upbeat, Conversational)' }
  ];

  for (const phrase of TEST_PHRASES) {
    console.log(`\nSynthesizing: [${phrase.id}] ${phrase.kannada}`);
    console.log(`Transliteration: "${phrase.transliteration}"`);
    console.log(`English: "${phrase.english}"`);

    for (const v of voices) {
      const filename = `${phrase.id}-${v.name.toLowerCase()}.mp3`;
      const filePath = path.join(OUTPUT_DIR, filename);

      if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
        const kb = (fs.statSync(filePath).size / 1024).toFixed(1);
        console.log(`  ✓ Existing: ${filename} (${kb} KB) — Voice: ${v.name}`);
        continue;
      }

      console.log(`  Generating ${filename} (Voice: ${v.name}, ${v.label})...`);
      const res = await synthesizeWithRetry(phrase.kannada, v.name);
      fs.writeFileSync(filePath, res.buffer);
      const kb = (res.buffer.length / 1024).toFixed(1);
      console.log(`  ✓ Created:  ${filename} (${kb} KB, audio tokens: ${res.usage?.output_tokens_by_modality?.[0]?.tokens})`);

      // Sleep 21s between calls to respect Free Tier 3 RPM limit
      await sleep(21000);
    }

    // Also copy Kore (recommended female voice) to public/audio/kn/<id>.mp3 for in-app test
    const koreSource = path.join(OUTPUT_DIR, `${phrase.id}-kore.mp3`);
    const canonicalTarget = path.join(CANONICAL_DIR, `${phrase.id}.mp3`);
    if (fs.existsSync(koreSource)) {
      fs.copyFileSync(koreSource, canonicalTarget);
      console.log(`  -> Placed in public/audio/kn/${phrase.id}.mp3 for direct in-app Listen button testing.`);
    }
  }

  console.log('\n================================================================');
  console.log('Complete! All 3 test phrases generated across all 3 voices.');
  console.log(`Sample files location:     ${OUTPUT_DIR}`);
  console.log(`In-app test files:         ${CANONICAL_DIR}`);
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
