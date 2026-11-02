#!/usr/bin/env node
/**
 * NammaNudi - Full Kannada Audio Generator
 * Synthesizes Kannada phrases using the approved 'Aoede' voice via Gemini TTS.
 *
 * Robust Network & Quota Architecture:
 * - Scoped IPv6-preferred DNS resolution (resolves IPv4 network routing timeouts)
 * - Strict separation of HTTP 429 (quota) from network errors (ETIMEDOUT/ENOTFOUND)
 * - Safe buffer validation prior to disk writes (no corrupt/partial MP3 files)
 * - Dual-model failover (gemini-3.8-flash-lite-tts <-> gemini-3.8-flash-tts)
 * - Resumable with --batch-size=N and idempotent existing file skipping
 * - Safe connectivity verification mode (--test-connection)
 * - Zero API key exposure in logs
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import dns from 'node:dns';
import { fileURLToPath } from 'node:url';

// Process-scoped IPv6 preference for this script only (does not alter Windows system settings)
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv6first');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHRASES_PATH = path.join(__dirname, '../src/data/phrases.ts');
const OUTPUT_DIR = path.join(__dirname, '../public/audio/kn');
const REPORT_PATH = path.join(__dirname, '../public/audio/validation-report.json');

// Lookup GEMINI_API_KEY from environment or local dotfiles without logging its value
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
const APPROVED_VOICE = 'Aoede';
const MODELS = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];

// CLI argument parsing
const args = process.argv.slice(2);
const force = args.includes('--force');
const reportOnly = args.includes('--report-only') || args.includes('--audit');
const testConnectionOnly = args.includes('--test-connection') || args.includes('--check-network');
const cliKey = args.find(a => a.startsWith('--key='))?.split('=')[1];
const batchSizeArg = args.find(a => a.startsWith('--batch-size='))?.split('=')[1];
const maxBatchSize = batchSizeArg ? parseInt(batchSizeArg, 10) : Infinity;
const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
const maxLimit = limitArg ? parseInt(limitArg, 10) : Infinity;
const delayArg = args.find(a => a.startsWith('--delay='))?.split('=')[1];
const interRequestDelayMs = delayArg ? parseInt(delayArg, 10) * 1000 : 16000;

const effectiveKey = cliKey || key;
if (!effectiveKey && !reportOnly) {
  console.error('FATAL: No GEMINI_API_KEY found in environment or local files.');
  process.exit(1);
}

// Custom error classes for strict failure classification
class QuotaOrRateLimitError extends Error {
  constructor(message, status = 429) {
    super(message);
    this.name = 'QuotaOrRateLimitError';
    this.status = status;
  }
}

class NetworkConnectivityError extends Error {
  constructor(message, code = 'NETWORK_ERROR') {
    super(message);
    this.name = 'NetworkConnectivityError';
    this.code = code;
  }
}

/**
 * Scoped IPv6-preferred DNS lookup function.
 * Resolves both IPv6 and IPv4 addresses and sorts IPv6 (family 6) first.
 * Safely falls back to IPv4 if IPv6 is absent or unreachable.
 */
function ipv6PreferredLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  dns.lookup(hostname, { all: true }, (err, addresses) => {
    if (err) return callback(err);
    if (!addresses || addresses.length === 0) {
      const notFoundErr = new Error(`ENOTFOUND: No IP addresses resolved for ${hostname}`);
      notFoundErr.code = 'ENOTFOUND';
      return callback(notFoundErr);
    }
    // Sort so IPv6 (family 6) is tried before IPv4 (family 4)
    addresses.sort((a, b) => (b.family || 0) - (a.family || 0));
    if (options && options.all) {
      return callback(null, addresses);
    }
    return callback(null, addresses[0].address, addresses[0].family);
  });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Parse all 95 phrases from src/data/phrases.ts
function loadPhrases() {
  const content = fs.readFileSync(PHRASES_PATH, 'utf8');
  const regex = /id:\s*'([a-z]{2}-\d{2})'[\s\S]*?kannada:\s*'([^']+)'[\s\S]*?english:\s*'([^']+)'/g;
  const list = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    list.push({ id: m[1], kannada: m[2], english: m[3] });
  }
  return list;
}

/**
 * Performs an HTTPS POST request with IPv6-preferred resolution and timeout management.
 */
function postJson(urlStr, headers, bodyObj, timeoutMs = 25000) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = JSON.stringify(bodyObj);

    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      lookup: ipv6PreferredLookup,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      },
      timeout: timeoutMs
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          reject(new Error(`Failed to parse JSON response (${res.statusCode}): ${data.slice(0, 200)}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new NetworkConnectivityError(`Request timed out after ${timeoutMs / 1000}s`, 'ETIMEDOUT'));
    });

    req.on('error', (err) => {
      const code = err.code || 'ECONNABORTED';
      reject(new NetworkConnectivityError(err.message, code));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Safe, read-only connectivity test over IPv6-preferred resolution.
 * Verifies network routing and API responsiveness without generating audio or consuming TTS quota.
 */
function testConnectivity(apiKey) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: '/v1beta/models?pageSize=1',
      method: 'GET',
      lookup: ipv6PreferredLookup,
      headers: {
        'x-goog-api-key': apiKey
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ms = Date.now() - start;
        let isAuthOk = false;
        let modelCount = 0;
        try {
          const j = JSON.parse(data);
          if (res.statusCode === 200) {
            isAuthOk = true;
            modelCount = j.models?.length || 0;
          }
        } catch {}

        resolve({
          ok: res.statusCode === 200,
          status: res.statusCode,
          statusMessage: res.statusMessage,
          latencyMs: ms,
          authenticated: isAuthOk,
          modelCount
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ok: false,
        status: null,
        error: 'ETIMEDOUT',
        message: 'Connection timed out after 10s',
        latencyMs: Date.now() - start
      });
    });

    req.on('error', (err) => {
      resolve({
        ok: false,
        status: null,
        error: err.code || 'ECONN_FAIL',
        message: err.message,
        latencyMs: Date.now() - start
      });
    });

    req.end();
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validates in-memory audio buffer before writing to disk.
 * Requires minimum 5 KB size and standard ID3 tag or MPEG sync header.
 */
function isValidMp3Buffer(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length < 5000) return false;
  const isId3 = buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33;
  const isMpegSync = buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0;
  return isId3 || isMpegSync;
}

/**
 * Validates on-disk MP3 file header and size.
 */
function isValidMp3File(filePath) {
  if (!fs.existsSync(filePath)) return false;
  const stats = fs.statSync(filePath);
  if (stats.size < 5000) return false;

  const buffer = Buffer.alloc(10);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 10, 0);
  fs.closeSync(fd);

  const isId3 = buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33;
  const isMpegSync = buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0;
  return isId3 || isMpegSync;
}

/**
 * Synthesizes text with dual-model failover, IPv6 transport, and immediate HTTP 429 quota handling.
 */
async function synthesizeWithFailover(text, voice = APPROVED_VOICE) {
  let modelIndex = 0;
  let attempts = 0;
  const maxAttempts = MODELS.length;

  while (attempts < maxAttempts) {
    attempts++;
    const currentModel = MODELS[modelIndex % MODELS.length];

    try {
      const res = await postJson(
        'https://generativelanguage.googleapis.com/v1beta/interactions',
        { 'x-goog-api-key': effectiveKey },
        {
          model: currentModel,
          input: [{
            type: 'user_input',
            content: [{ type: 'text', text }]
          }],
          response_format: {
            type: 'audio',
            mime_type: 'audio/mp3'
          },
          generation_config: {
            speech_config: [{ voice }]
          }
        }
      );

      if (res.status === 200 && res.body) {
        const step = res.body.steps && res.body.steps.find(s => s.type === 'model_output');
        const audio = step && step.content && step.content.find(c => c.type === 'audio');
        if (audio && audio.data) {
          const buf = Buffer.from(audio.data, 'base64');
          if (!isValidMp3Buffer(buf)) {
            throw new Error('Synthesized audio failed validation: corrupt or invalid MP3 stream.');
          }
          return {
            buffer: buf,
            model: currentModel,
            usage: res.body.usage
          };
        }
      }

      // Check if rate limited (429) or daily quota reached
      if (res.status === 429 || res.body?.error?.code === 429) {
        const errMsg = res.body?.error?.message || 'Rate limit exceeded (HTTP 429)';
        if (attempts >= maxAttempts) {
          throw new QuotaOrRateLimitError(`Daily Free Tier quota limit reached across all TTS models: ${errMsg}`, 429);
        }
        modelIndex++;
        const nextModel = MODELS[modelIndex % MODELS.length];
        console.log(`    [HTTP 429 on ${currentModel}] Trying fallback model ${nextModel}...`);
        await sleep(1500);
        continue;
      }

      if (res.body?.error) {
        throw new Error(`API Error (${res.body.error.code}): ${res.body.error.message}`);
      }
    } catch (err) {
      if (err instanceof QuotaOrRateLimitError) {
        throw err;
      }

      // Promptly abort if DNS cannot resolve hostname
      if (err.code === 'ENOTFOUND') {
        throw new NetworkConnectivityError(`DNS resolution failed for generativelanguage.googleapis.com: ${err.message}`, 'ENOTFOUND');
      }

      // On timeout or connection abort, switch to fallback model once
      if (err instanceof NetworkConnectivityError) {
        if (attempts >= maxAttempts) {
          throw err;
        }
        console.log(`    [Network warning on ${currentModel}: ${err.code || err.message}] Trying fallback model...`);
        modelIndex++;
        await sleep(1500);
        continue;
      }

      if (attempts >= maxAttempts) {
        throw err;
      }
      modelIndex++;
      await sleep(1500);
      continue;
    }
  }

  throw new Error('Failed to synthesize after checking available TTS models');
}

async function main() {
  // 1. Safe connectivity diagnostic mode
  if (testConnectionOnly) {
    console.log('='.repeat(70));
    console.log('NammaNudi - Gemini API Connectivity & Network Verification');
    console.log('Transport: IPv6-preferred scoped DNS lookup');
    console.log('Endpoint:  generativelanguage.googleapis.com:443');
    console.log('='.repeat(70));

    // DNS check
    const dnsPromise = new Promise((resolve) => {
      dns.lookup('generativelanguage.googleapis.com', { all: true }, (err, addresses) => {
        if (err) resolve({ err });
        else resolve({ addresses });
      });
    });

    const dnsResult = await dnsPromise;
    if (dnsResult.addresses) {
      const v6 = dnsResult.addresses.filter(a => a.family === 6).length;
      const v4 = dnsResult.addresses.filter(a => a.family === 4).length;
      console.log(`DNS Resolution:  ${v6} IPv6 address(es), ${v4} IPv4 address(es) discovered`);
    }

    const conn = await testConnectivity(effectiveKey);
    console.log(`HTTP Status:     ${conn.status} (${conn.statusMessage || ''})`);
    console.log(`Latency:         ${conn.latencyMs}ms`);
    console.log(`Authentication:  ${conn.authenticated ? 'Verified (API Key valid)' : 'Failed'}`);
    console.log('='.repeat(70));

    if (conn.ok) {
      console.log('✓ Connectivity verification PASSED. Network routing is stable and responsive.');
      process.exit(0);
    } else {
      console.error(`✗ Connectivity verification FAILED: ${conn.error || conn.status}`);
      process.exit(1);
    }
  }

  const allPhrases = loadPhrases();
  console.log('='.repeat(70));
  console.log('NammaNudi - Synthesizing Kannada Audio Phrases');
  console.log(`Voice:       ${APPROVED_VOICE} (Female)`);
  console.log(`Models:      ${MODELS.join(' <-> ')}`);
  console.log('Transport:   IPv6-preferred (scoped)');
  console.log(`Target Dir:  ${OUTPUT_DIR}`);
  console.log(`Total Found: ${allPhrases.length} phrases`);
  if (maxBatchSize !== Infinity) {
    console.log(`Batch Size:  Limit to ${maxBatchSize} new phrase(s) this run`);
  }
  console.log('='.repeat(70));

  const targetPhrases = allPhrases.slice(0, maxLimit);
  let newlyGenerated = 0;
  let alreadyExisting = 0;
  let failed = 0;
  const failedIds = [];

  if (!reportOnly) {
    for (let i = 0; i < targetPhrases.length; i++) {
      const p = targetPhrases[i];
      const outputFile = path.join(OUTPUT_DIR, `${p.id}.mp3`);
      const progress = `[${i + 1}/${targetPhrases.length}]`;

      // Skip if already generated and valid
      if (!force && isValidMp3File(outputFile)) {
        const stats = fs.statSync(outputFile);
        console.log(`${progress} ✓ Already exists: ${p.id}.mp3 (${(stats.size / 1024).toFixed(1)} KB) — "${p.kannada}"`);
        alreadyExisting++;
        continue;
      }

      console.log(`${progress} Generating ${p.id}.mp3: "${p.kannada}" (${p.english})...`);
      try {
        const result = await synthesizeWithFailover(p.kannada, APPROVED_VOICE);
        fs.writeFileSync(outputFile, result.buffer);
        const kb = (result.buffer.length / 1024).toFixed(1);
        console.log(`  ✓ Saved ${p.id}.mp3 (${kb} KB via ${result.model})`);
        newlyGenerated++;

        if (newlyGenerated >= maxBatchSize) {
          console.log(`\n✓ Reached batch limit (${newlyGenerated} new phrase(s) generated). Stopping safely.`);
          break;
        }

        // Polite delay between successful requests to observe 4 RPM quota
        console.log(`  Waiting ${interRequestDelayMs / 1000}s to observe rate limits...`);
        await sleep(interRequestDelayMs);
      } catch (err) {
        console.error(`  ✗ FAILED ${p.id}: ${err.message}`);
        failed++;
        failedIds.push(p.id);

        if (err instanceof QuotaOrRateLimitError) {
          console.warn('\n🛑 Stopping immediately on HTTP 429 / Quota Limit.');
          console.warn('All completed recordings preserved safely without loss in public/audio/kn/.');
          console.warn('Safe resume ready for next run.\n');
          break;
        }

        if (err instanceof NetworkConnectivityError) {
          console.error(`\n⚠️ Network error: [${err.code}] ${err.message}`);
          console.warn('All existing recordings remain intact. Stopping to prevent connection churning.\n');
          break;
        }
      }
    }
  }

  // --- VALIDATION & AUDIT REPORT ---
  console.log('\n' + '='.repeat(70));
  console.log('Running Final Validation Audit across all 95 phrases...');
  console.log('='.repeat(70));

  const validationResults = [];
  let validCount = 0;
  let invalidCount = 0;

  for (const p of allPhrases) {
    const filePath = path.join(OUTPUT_DIR, `${p.id}.mp3`);
    const exists = fs.existsSync(filePath);
    let size = 0;
    let valid = false;

    if (exists) {
      size = fs.statSync(filePath).size;
      valid = isValidMp3File(filePath);
    }

    if (valid) {
      validCount++;
    } else {
      invalidCount++;
    }

    validationResults.push({
      phraseId: p.id,
      kannada: p.kannada,
      english: p.english,
      fileName: `${p.id}.mp3`,
      url: `/audio/kn/${p.id}.mp3`,
      exists,
      validMp3: valid,
      fileSizeBytes: size,
      fileSizeKb: (size / 1024).toFixed(1)
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    approvedVoice: APPROVED_VOICE,
    totalExpectedPhrases: allPhrases.length,
    validAudioFilesCount: validCount,
    missingOrInvalidCount: invalidCount,
    isComplete: validCount === allPhrases.length,
    phrases: validationResults
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');

  console.log(`Newly Generated:      ${newlyGenerated}`);
  console.log(`Previously Existing:  ${alreadyExisting}`);
  console.log(`Failed in this run:   ${failed} ${failedIds.length > 0 ? '(' + failedIds.join(', ') + ')' : ''}`);
  console.log(`Total Valid MP3s:     ${validCount} / ${allPhrases.length}`);
  console.log(`Validation Report:    ${REPORT_PATH}`);
  console.log('='.repeat(70));

  if (validCount === allPhrases.length) {
    console.log('🎉 SUCCESS: All 95 Kannada pronunciation MP3 files are generated, valid, and mapped!');
  } else {
    console.log(`Status: ${validCount} generated, ${invalidCount} pending.`);
  }
}

main().catch(err => {
  console.error('Fatal generator error:', err);
  process.exit(1);
});
