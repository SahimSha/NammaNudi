#!/usr/bin/env node
/**
 * NammaNudi Kannada Audio Generator
 * Generates authentic, device-independent MP3 audio files for all 95 phrases
 * using Google Cloud Text-to-Speech (or Gemini 3.8 Flash TTS).
 *
 * Usage:
 *   node scripts/generate-kannada-audio.mjs [--engine=gcp|gemini] [--voice=kn-IN-Neural2-A] [--force]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHRASES_PATH = path.join(__dirname, '../src/data/phrases.ts');
const OUTPUT_DIR = path.join(__dirname, '../public/audio/kn');

// Parse CLI flags
const args = process.argv.slice(2);
const force = args.includes('--force');
const engineArg = args.find(a => a.startsWith('--engine='))?.split('=')[1]?.toLowerCase();
const voiceArg = args.find(a => a.startsWith('--voice='))?.split('=')[1];
const keyArg = args.find(a => a.startsWith('--key='))?.split('=')[1];
const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
const limit = limitArg ? parseInt(limitArg, 10) : Infinity;

// Helper to look up key from env or .env files
function findEnvValue(keyName, candidateFiles = []) {
  if (process.env[keyName]) return process.env[keyName].trim();

  const files = [
    path.join(__dirname, '../.env.local'),
    path.join(__dirname, '../.env'),
    ...candidateFiles
  ];

  for (const file of files) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const match = content.match(new RegExp(`(?:^|\\n)\\s*${keyName}\\s*=\\s*([^\\r\\n]+)`));
        if (match && match[1]) {
          return match[1].trim().replace(/^['"]|['"]$/g, '');
        }
      } catch {}
    }
  }
  return null;
}

// 1. Resolve GCP Key and Gemini Key
const gcpKey = keyArg ||
  findEnvValue('GOOGLE_TTS_API_KEY') ||
  findEnvValue('GOOGLE_CLOUD_API_KEY') ||
  findEnvValue('GOOGLE_API_KEY') ||
  findEnvValue('GOOGLE_MAPS_API_KEY', [
    path.join(__dirname, '../../skans-ai/.env'),
    path.join(__dirname, '../../AttendX/.env')
  ]);

const geminiKey = findEnvValue('GEMINI_API_KEY', [
  path.join(__dirname, '../../SIH 2026/SenTrix/backend/.env'),
  path.join(__dirname, '../../AttendX/.env')
]);

const engine = engineArg || (gcpKey ? 'gcp' : (geminiKey ? 'gemini' : 'gcp'));
const voiceName = voiceArg || (engine === 'gcp' ? 'kn-IN-Neural2-A' : 'Kore');

console.log('='.repeat(60));
console.log('NammaNudi Kannada Audio Generator');
console.log('='.repeat(60));
console.log(`Engine:      ${engine.toUpperCase()}`);
console.log(`Voice:       ${voiceName}`);
console.log(`Output Dir:  ${OUTPUT_DIR}`);
console.log(`Force Mode:  ${force ? 'YES' : 'NO'}`);
console.log('='.repeat(60));

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse phrases from src/data/phrases.ts
function extractPhrases() {
  const content = fs.readFileSync(PHRASES_PATH, 'utf8');
  // Match phrase objects containing id and kannada
  const regex = /id:\s*'([a-z]{2}-\d{2})'[\s\S]*?kannada:\s*'([^']+)'/g;
  const list = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    list.push({ id: m[1], kannada: m[2] });
  }
  return list;
}

const phrases = extractPhrases();
console.log(`Found ${phrases.length} phrases in src/data/phrases.ts.\n`);

if (phrases.length !== 95) {
  console.warn(`WARNING: Expected 95 phrases, found ${phrases.length}. Check phrases.ts parser.`);
}

// Helper to delay between API requests
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Google Cloud Text-to-Speech Synthesizer
async function synthesizeGCP(text, voice) {
  if (!gcpKey) {
    throw new Error('Google Cloud API Key is missing. Pass --key=YOUR_KEY or set GOOGLE_TTS_API_KEY.');
  }

  const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${gcpKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: {
        languageCode: 'kn-IN',
        name: voice
      },
      audioConfig: {
        audioEncoding: 'MP3',
        sampleRateHertz: 24000,
        speakingRate: 0.95 // slightly measured pace for language learners
      }
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`GCP TTS Error (${data.error.code}): ${data.error.message}`);
  }

  if (!data.audioContent) {
    throw new Error('No audioContent returned by Google Cloud TTS');
  }

  return Buffer.from(data.audioContent, 'base64');
}

// Gemini 3.8 Flash TTS Synthesizer
async function synthesizeGemini(text, voice) {
  if (!geminiKey) {
    throw new Error('Gemini API Key is missing. Set GEMINI_API_KEY in .env.local.');
  }

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/interactions';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiKey
    },
    body: JSON.stringify({
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
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Gemini TTS Error (${data.error.code}): ${data.error.message}`);
  }

  const step = data.steps && data.steps.find(s => s.type === 'model_output');
  const audioPart = step && step.content && step.content.find(c => c.type === 'audio');

  if (!audioPart || !audioPart.data) {
    throw new Error('No audio data returned by Gemini 3.8 Flash TTS');
  }

  return Buffer.from(audioPart.data, 'base64');
}

// Main execution loop
async function main() {
  let successCount = 0;
  let skippedCount = 0;
  let failCount = 0;

  const totalToProcess = Math.min(phrases.length, limit);
  for (let i = 0; i < totalToProcess; i++) {
    const { id, kannada } = phrases[i];
    const outputFile = path.join(OUTPUT_DIR, `${id}.mp3`);
    const progress = `[${i + 1}/${totalToProcess}]`;

    // Skip if already generated and non-empty
    if (!force && fs.existsSync(outputFile)) {
      const stats = fs.statSync(outputFile);
      if (stats.size > 1000) {
        console.log(`${progress} Skipping ${id}.mp3 (${(stats.size / 1024).toFixed(1)} KB) — already exists.`);
        skippedCount++;
        continue;
      }
    }

    try {
      let buffer;
      if (engine === 'gcp') {
        buffer = await synthesizeGCP(kannada, voiceName);
      } else {
        buffer = await synthesizeGemini(kannada, voiceName);
      }

      fs.writeFileSync(outputFile, buffer);
      const kb = (buffer.length / 1024).toFixed(1);
      console.log(`${progress} ✓ Generated ${id}.mp3 (${kb} KB) — "${kannada}"`);
      successCount++;

      // Polite rate-limiting pause
      await sleep(250);
    } catch (err) {
      console.error(`${progress} ✗ FAILED ${id}: ${err.message}`);
      failCount++;

      // If GCP returned 403 PERMISSION_DENIED / SERVICE_DISABLED, prompt user and exit gracefully
      if (err.message.includes('SERVICE_DISABLED') || err.message.includes('403')) {
        console.error('\n' + '!'.repeat(60));
        console.error('CRITICAL: Cloud Text-to-Speech API is disabled for this project.');
        console.error('To enable it:');
        console.error('1. Visit https://console.developers.google.com/apis/api/texttospeech.googleapis.com/overview?project=923105469554');
        console.error('2. Click "ENABLE".');
        console.error('3. Re-run this generator script.');
        console.error('Alternatively, run with Gemini TTS:');
        console.error('   node scripts/generate-kannada-audio.mjs --engine=gemini');
        console.error('!'.repeat(60) + '\n');
        process.exitCode = 1;
        return;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Generation Summary:');
  console.log(`- Newly Generated: ${successCount}`);
  console.log(`- Already Existed: ${skippedCount}`);
  console.log(`- Failed:          ${failCount}`);
  console.log(`- Total Files:     ${fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp3')).length} / 95`);
  console.log('='.repeat(60));
}

main().catch((err) => {
  console.error('Unhandled generator error:', err);
  process.exit(1);
});
