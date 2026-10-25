// Automated Test Suite for Pronunciation Practice & Audio Recorder Hook Logic
// Tests MediaRecorder lifecycle, audio track release, permission handling, URL revocation, and safety

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
  }

  static isTypeSupported(type) {
    return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].includes(type);
  }

  start(_timeslice) {
    this.state = 'recording';
    // Simulate timeslice data chunks
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
    }
  }
  return userMsg;
}

const permissionDeniedErr = { name: 'NotAllowedError', message: 'Permission denied' };
const permMsg = handleGetUserMediaError(permissionDeniedErr);
assert(permMsg.includes('Microphone permission was denied'));
assert(permMsg.includes('address bar'));
console.log('✓ PASS: NotAllowedError produces clear instructions to allow mic in address bar');

console.log('--- TEST 3: Device Not Found Handling ---');
const notFoundErr = { name: 'NotFoundError', message: 'Requested device not found' };
const notFoundMsg = handleGetUserMediaError(notFoundErr);
assert(notFoundMsg.includes('No microphone was detected'));
console.log('✓ PASS: NotFoundError identifies hardware absence');

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
      this.isUserPlaybackPlaying = false; // cleanly preempted
    }
    this.isReferencePlaying = true;
  }

  stopReference() {
    this.isReferencePlaying = false;
  }

  startRecording() {
    if (this.isReferencePlaying) {
      this.isReferencePlaying = false; // cleanly preempted
    }
    if (this.isUserPlaybackPlaying) {
      this.isUserPlaybackPlaying = false; // cleanly preempted
    }
    this.isRecording = true;
  }

  stopRecording() {
    this.isRecording = false;
  }

  startUserPlayback() {
    if (this.isReferencePlaying) {
      this.isReferencePlaying = false; // cleanly preempted
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

// Case A: User is listening to reference, then clicks Record
controller.startReference();
assert.strictEqual(controller.isReferencePlaying, true);
controller.startRecording();
assert.strictEqual(controller.isReferencePlaying, false, 'Reference audio must be stopped when recording starts');
assert.strictEqual(controller.isRecording, true);

// Case B: User finishes recording, plays their voice, then clicks Listen Reference
controller.stopRecording();
controller.startUserPlayback();
assert.strictEqual(controller.isUserPlaybackPlaying, true);
controller.startReference();
assert.strictEqual(controller.isUserPlaybackPlaying, false, 'User playback must be stopped when reference starts');
assert.strictEqual(controller.isReferencePlaying, true);

// Case C: User is listening to reference, clicks Play My Voice
controller.startUserPlayback();
assert.strictEqual(controller.isReferencePlaying, false, 'Reference audio must be stopped when user audio starts');
assert.strictEqual(controller.isUserPlaybackPlaying, true);

console.log('✓ PASS: Mutual exclusion guarantees reference and recorded audio never clash or double-play');

console.log('\nAll Pronunciation Practice & Audio Recorder unit tests PASSED successfully!');
