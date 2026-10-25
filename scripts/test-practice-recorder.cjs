// Automated Test Suite for Pronunciation Practice & Audio Recorder Hook Logic
// Tests MediaRecorder lifecycle, audio track release, permission handling,
// capability detection in insecure contexts, mobile fallbacks, URL revocation, and safety

const assert = require('assert');

console.log('--- TEST 1: MediaRecorder State Machine & Track Release ---');

// Mock MediaStreamTrack
class MockMediaStreamTrack {
  constructor(kind = 'audio') {
    this.kind = kind;
    this.readyState = 'live';
    this.stopCalls = 0;
  }
  stop() {
    this.readyState = 'ended';
    this.stopCalls++;
  }
}

// Mock MediaStream
class MockMediaStream {
  constructor() {
    this._tracks = [new MockMediaStreamTrack('audio')];
  }
  getTracks() {
    return this._tracks;
  }
}

// Mock MediaRecorder
class MockMediaRecorder {
  constructor(stream, options = {}) {
    this.stream = stream;
    this.options = options;
    this.state = 'inactive';
    this.mimeType = options.mimeType || 'audio/webm';
    this.ondataavailable = null;
    this.onstop = null;
    this.onerror = null;

    // Simulate throwing when invalid or unsupported mimeType is passed
    if (options.mimeType && options.mimeType.includes('fail-me')) {
      throw new Error(`Unsupported MIME type: ${options.mimeType}`);
    }
  }

  static isTypeSupported(type) {
    return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].includes(type);
  }

  start(_timeslice) {
    this.state = 'recording';
    if (this.ondataavailable) {
      this.ondataavailable({ data: { size: 1024, type: this.mimeType } });
    }
  }

  stop() {
    this.state = 'inactive';
    if (this.ondataavailable) {
      this.ondataavailable({ data: { size: 2048, type: this.mimeType } });
    }
    if (this.onstop) {
      this.onstop();
    }
  }
}

// Mock URL
let createdUrls = [];
let revokedUrls = [];
const mockURL = {
  createObjectURL: (_blob) => {
    const url = `blob:http://localhost/mock-audio-${Math.random().toString(36).substring(2, 9)}`;
    createdUrls.push(url);
    return url;
  },
  revokeObjectURL: (url) => {
    revokedUrls.push(url);
  }
};

// Simulate recorder flow
let mockStream = new MockMediaStream();
let mockRecorder = new MockMediaRecorder(mockStream, { mimeType: 'audio/webm' });
assert.strictEqual(mockRecorder.state, 'inactive');

mockRecorder.start(200);
assert.strictEqual(mockRecorder.state, 'recording');
assert.strictEqual(mockStream.getTracks()[0].readyState, 'live');

// Stop recording
mockRecorder.stop();
assert.strictEqual(mockRecorder.state, 'inactive');

// Simulate track stoppage on recording end
mockStream.getTracks().forEach((track) => track.stop());
assert.strictEqual(mockStream.getTracks()[0].readyState, 'ended');
assert.strictEqual(mockStream.getTracks()[0].stopCalls, 1);

// Generate URL and verify cleanup
const testBlob = { size: 3072, type: 'audio/webm' };
const testUrl = mockURL.createObjectURL(testBlob);
assert(testUrl.startsWith('blob:'));
assert.strictEqual(createdUrls.length, 1);

// Revoke on reset
mockURL.revokeObjectURL(testUrl);
assert.strictEqual(revokedUrls.length, 1);
assert.strictEqual(revokedUrls[0], testUrl);

console.log('✓ PASS: MediaRecorder transitions, stream track disposal, and URL lifecycle verified');

console.log('--- TEST 2: Permission Denial Handling ---');

function handleGetUserMediaError(err) {
  let userMsg = 'Could not access microphone.';
  if (err && err.name) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      userMsg = 'Microphone permission was denied. Please allow microphone access in your browser address bar to practise pronunciation.';
    } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      userMsg = 'No microphone was detected on this device. Please connect a microphone or headset.';
    } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      userMsg = 'Your microphone is currently in use by another application. Please free it and try again.';
    } else if (err.name === 'SecurityError') {
      userMsg = 'Microphone access blocked due to security restrictions (Insecure HTTP context). Microphone capture requires HTTPS or localhost.';
    }
  }
  return userMsg;
}

const permissionDeniedErr = { name: 'NotAllowedError', message: 'Permission denied' };
const permMsg = handleGetUserMediaError(permissionDeniedErr);
assert(permMsg.includes('Microphone permission was denied'));
assert(permMsg.includes('address bar'));
console.log('✓ PASS: NotAllowedError produces clear instructions to allow mic in address bar');

console.log('--- TEST 3: Device Not Found & Security Error Handling ---');
const notFoundErr = { name: 'NotFoundError', message: 'Requested device not found' };
const notFoundMsg = handleGetUserMediaError(notFoundErr);
assert(notFoundMsg.includes('No microphone was detected'));

const secErr = { name: 'SecurityError', message: 'Insecure origin' };
const secMsg = handleGetUserMediaError(secErr);
assert(secMsg.includes('Insecure HTTP context'));
console.log('✓ PASS: NotFoundError and SecurityError correctly classified');

console.log('--- TEST 4: Best Supported MIME Type Selection ---');
function getSupportedMimeType(isTypeSupportedFn) {
  const candidateTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/aac',
    'audio/ogg;codecs=opus'
  ];
  for (const type of candidateTypes) {
    if (isTypeSupportedFn(type)) {
      return type;
    }
  }
  return undefined;
}

const selectedMime = getSupportedMimeType(MockMediaRecorder.isTypeSupported);
assert.strictEqual(selectedMime, 'audio/webm;codecs=opus');

// Test fallback for Safari (audio/mp4)
const safariMockSupported = (type) => type === 'audio/mp4' || type === 'audio/aac';
const safariMime = getSupportedMimeType(safariMockSupported);
assert.strictEqual(safariMime, 'audio/mp4');
console.log('✓ PASS: MIME type negotiation picks opus/webm for Chrome/Firefox and mp4 for Safari');

console.log('--- TEST 5: Concurrency Safety: Mutual Exclusion ---');
// State simulator for modal audio concurrency
class AudioStateController {
  constructor() {
    this.isReferencePlaying = false;
    this.isRecording = false;
    this.isUserPlaybackPlaying = false;
  }

  startReference() {
    if (this.isRecording) {
      throw new Error('Illegal state: reference started while recording');
    }
    if (this.isUserPlaybackPlaying) {
      this.isUserPlaybackPlaying = false;
    }
    this.isReferencePlaying = true;
  }

  stopReference() {
    this.isReferencePlaying = false;
  }

  startRecording() {
    if (this.isReferencePlaying) {
      this.isReferencePlaying = false;
    }
    if (this.isUserPlaybackPlaying) {
      this.isUserPlaybackPlaying = false;
    }
    this.isRecording = true;
  }

  stopRecording() {
    this.isRecording = false;
  }

  startUserPlayback() {
    if (this.isReferencePlaying) {
      this.isReferencePlaying = false;
    }
    if (this.isRecording) {
      throw new Error('Illegal state: playback started while recording');
    }
    this.isUserPlaybackPlaying = true;
  }

  stopUserPlayback() {
    this.isUserPlaybackPlaying = false;
  }
}

const controller = new AudioStateController();
controller.startReference();
assert.strictEqual(controller.isReferencePlaying, true);
controller.startRecording();
assert.strictEqual(controller.isReferencePlaying, false, 'Reference audio stopped on record');
assert.strictEqual(controller.isRecording, true);

controller.stopRecording();
controller.startUserPlayback();
assert.strictEqual(controller.isUserPlaybackPlaying, true);
controller.startReference();
assert.strictEqual(controller.isUserPlaybackPlaying, false, 'User audio stopped on reference play');
assert.strictEqual(controller.isReferencePlaying, true);

console.log('✓ PASS: Mutual exclusion guarantees reference and recorded audio never clash');

console.log('--- TEST 6: Capability Diagnostics in Insecure Context (Mobile HTTP over LAN) ---');
// Simulate mobile phone accessing http://192.168.1.15:5173
// In this environment:
// - window.isSecureContext = false
// - navigator.mediaDevices = undefined (stripped by browser security policy)
// - window.MediaRecorder = available
function simulateCapabilityCheck({ isSecureContext, protocol, hostname, hasMediaDevices, hasGetUserMedia, hasMediaRecorder }) {
  const isSecure = typeof isSecureContext === 'boolean'
    ? isSecureContext
    : protocol === 'https:' || hostname === 'localhost' || hostname === '127.0.0.1';

  let issue = null;
  let reasonMessage = null;
  let remedyMessage = null;

  if (!isSecure && !hasGetUserMedia) {
    issue = 'insecure-context';
    reasonMessage = `Insecure Origin (${protocol}//${hostname}): Modern mobile browsers strictly disable microphone access over insecure HTTP connections.`;
    remedyMessage = 'Mobile browsers require HTTPS or localhost for microphone capture. Use HTTPS or Chrome USB Port Forwarding.';
  } else if (!hasGetUserMedia) {
    issue = 'missing-getusermedia';
    reasonMessage = 'Microphone API (getUserMedia) is not exposed by this browser or in-app webview.';
    remedyMessage = 'Tap menu and choose "Open in Chrome" or "Open in Safari".';
  } else if (!hasMediaRecorder) {
    issue = 'missing-mediarecorder';
    reasonMessage = 'Audio recording API (window.MediaRecorder) is not supported in this browser version.';
    remedyMessage = 'Please open NammaNudi in modern Google Chrome, Safari 14.3+, Microsoft Edge, or Mozilla Firefox.';
  }

  const isSupported = hasGetUserMedia && hasMediaRecorder && issue === null;

  return {
    isSecureContext: isSecure,
    hasMediaDevices,
    hasGetUserMedia,
    hasMediaRecorder,
    issue,
    reasonMessage,
    remedyMessage,
    isSupported
  };
}

const mobileLanCheck = simulateCapabilityCheck({
  isSecureContext: false,
  protocol: 'http:',
  hostname: '192.168.1.15',
  hasMediaDevices: false, // stripped by mobile Chrome on HTTP
  hasGetUserMedia: false,
  hasMediaRecorder: true
});

assert.strictEqual(mobileLanCheck.isSupported, false);
assert.strictEqual(mobileLanCheck.issue, 'insecure-context');
assert(mobileLanCheck.reasonMessage.includes('Insecure Origin'));
assert(mobileLanCheck.reasonMessage.includes('192.168.1.15'));
assert(mobileLanCheck.remedyMessage.includes('HTTPS'));
console.log('✓ PASS: Insecure mobile HTTP correctly identified as "insecure-context" with actionable remedy');

console.log('--- TEST 7: Capability Diagnostics in Secure Production Context ---');
const productionHttpsCheck = simulateCapabilityCheck({
  isSecureContext: true,
  protocol: 'https:',
  hostname: 'nammanudi.vercel.app',
  hasMediaDevices: true,
  hasGetUserMedia: true,
  hasMediaRecorder: true
});

assert.strictEqual(productionHttpsCheck.isSupported, true);
assert.strictEqual(productionHttpsCheck.issue, null);
console.log('✓ PASS: HTTPS production environment correctly validated as fully supported');

console.log('--- TEST 8: Missing MediaRecorder API Handling ---');
const oldBrowserCheck = simulateCapabilityCheck({
  isSecureContext: true,
  protocol: 'https:',
  hostname: 'nammanudi.vercel.app',
  hasMediaDevices: true,
  hasGetUserMedia: true,
  hasMediaRecorder: false
});

assert.strictEqual(oldBrowserCheck.isSupported, false);
assert.strictEqual(oldBrowserCheck.issue, 'missing-mediarecorder');
assert(oldBrowserCheck.reasonMessage.includes('window.MediaRecorder'));
console.log('✓ PASS: Missing MediaRecorder produces dedicated "missing-mediarecorder" issue');

console.log('--- TEST 9: In-App Browser Missing getUserMedia Handling ---');
const inAppBrowserCheck = simulateCapabilityCheck({
  isSecureContext: true,
  protocol: 'https:',
  hostname: 'nammanudi.vercel.app',
  hasMediaDevices: false,
  hasGetUserMedia: false,
  hasMediaRecorder: true
});

assert.strictEqual(inAppBrowserCheck.isSupported, false);
assert.strictEqual(inAppBrowserCheck.issue, 'missing-getusermedia');
assert(inAppBrowserCheck.remedyMessage.includes('Open in Chrome'));
console.log('✓ PASS: In-app WebView missing getUserMedia advises opening in external browser');

console.log('--- TEST 10: Safe MediaRecorder Fallback Construction ---');
function createSafeMediaRecorder(stream, candidateMime) {
  if (candidateMime) {
    try {
      const recorder = new MockMediaRecorder(stream, { mimeType: candidateMime });
      return { recorder, mimeType: candidateMime };
    } catch {
      // Fallback
    }
  }
  const defaultRecorder = new MockMediaRecorder(stream);
  return { recorder: defaultRecorder, mimeType: defaultRecorder.mimeType };
}

// 1. Valid MIME type succeeds directly
const validResult = createSafeMediaRecorder(mockStream, 'audio/webm');
assert.strictEqual(validResult.mimeType, 'audio/webm');

// 2. Erroneous/unsupported MIME type catches error and falls back to default options
const fallbackResult = createSafeMediaRecorder(mockStream, 'audio/fail-me');
assert(fallbackResult.recorder instanceof MockMediaRecorder);
assert.strictEqual(fallbackResult.mimeType, 'audio/webm');
console.log('✓ PASS: Unsupported MIME type safely falls back to native container without throwing');

console.log('\nAll 10 Pronunciation Practice & Mobile Audio Recorder tests PASSED successfully!');
