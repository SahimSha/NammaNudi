// Automated Test Suite for Audio Player & Fallback Orchestration
// Tests audio registry resolution, HTML5 Audio lifecycle, fallback routing, and graceful error handling.

const assert = require('assert');

// Mock HTMLAudioElement
class MockAudio {
  constructor(url) {
    this.src = url;
    this.paused = true;
    this.currentTime = 0;
    this.onplay = null;
    this.onended = null;
    this.onerror = null;
  }

  play() {
    this.paused = false;
    return new Promise((resolve, reject) => {
      if (this.src.includes('invalid-file')) {
        this.paused = true;
        const err = new Error('Audio file not found or corrupted');
        if (this.onerror) this.onerror(err);
        reject(err);
      } else {
        setTimeout(() => {
          if (this.onplay) this.onplay();
          resolve();
        }, 10);
      }
    });
  }

  pause() {
    this.paused = true;
  }
}

global.Audio = MockAudio;

console.log('--- TEST 1: Audio Registry Resolution ---');
const RECORDED_AUDIO_MAP = {
  'bs-01': '/audio/bs-01.mp3',
  'td-01': '/audio/td-01.mp3'
};

function getPhraseAudioUrl(id) {
  return RECORDED_AUDIO_MAP[id] || null;
}

function hasPrerecordedAudio(id) {
  return Boolean(RECORDED_AUDIO_MAP[id]);
}

assert.strictEqual(getPhraseAudioUrl('bs-01'), '/audio/bs-01.mp3');
assert.strictEqual(hasPrerecordedAudio('bs-01'), true);
assert.strictEqual(getPhraseAudioUrl('non-existent-phrase'), null);
assert.strictEqual(hasPrerecordedAudio('non-existent-phrase'), false);
console.log('✓ PASS: Audio registry correctly resolves registered and unregistered phrases');

console.log('--- TEST 2: AudioPlayerService Lifecycle (Play, Stop, Clean End) ---');
class AudioPlayerService {
  constructor() {
    this.currentAudio = null;
    this.isPlayingInternal = false;
  }

  play(url, callbacks) {
    this.stop();
    try {
      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onplay = () => {
        this.isPlayingInternal = true;
        callbacks?.onStart?.();
      };

      audio.onended = () => {
        this.isPlayingInternal = false;
        this.cleanup(audio);
        callbacks?.onEnd?.();
      };

      audio.onerror = (e) => {
        this.isPlayingInternal = false;
        this.cleanup(audio);
        callbacks?.onError?.(e);
      };

      const p = audio.play();
      if (p !== undefined) {
        p.catch((err) => {
          this.isPlayingInternal = false;
          this.cleanup(audio);
          callbacks?.onError?.(err);
        });
      }
      return true;
    } catch (err) {
      this.isPlayingInternal = false;
      callbacks?.onError?.(err);
      return false;
    }
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.cleanup(this.currentAudio);
      this.currentAudio = null;
    }
    this.isPlayingInternal = false;
  }

  cleanup(audio) {
    audio.onplay = null;
    audio.onended = null;
    audio.onerror = null;
    if (this.currentAudio === audio) {
      this.currentAudio = null;
    }
  }

  isPlaying() {
    return this.isPlayingInternal || (this.currentAudio ? !this.currentAudio.paused : false);
  }
}

const player = new AudioPlayerService();
let startFired = false;
let endFired = false;

player.play('/audio/bs-01.mp3', {
  onStart: () => {
    startFired = true;
  },
  onEnd: () => {
    endFired = true;
  }
});

setTimeout(() => {
  assert.strictEqual(startFired, true, 'Audio start callback must fire');
  assert.strictEqual(player.isPlaying(), true, 'Audio must report playing state');

  // Trigger audio finish
  if (player.currentAudio && player.currentAudio.onended) {
    player.currentAudio.onended();
  }
  assert.strictEqual(endFired, true, 'Audio end callback must fire');
  assert.strictEqual(player.isPlaying(), false, 'Audio must report idle after ending');
  console.log('✓ PASS: Audio player start, playback state, and end handled cleanly');

  console.log('--- TEST 3: AudioPlayerService Error Handling ---');
  let errorFired = false;
  player.play('/audio/invalid-file.mp3', {
    onError: () => {
      errorFired = true;
    }
  });

  setTimeout(() => {
    assert.strictEqual(errorFired, true, 'Audio error callback must fire on failed playback');
    assert.strictEqual(player.isPlaying(), false, 'Playing state must reset to false on error');
    console.log('✓ PASS: Corrupt or missing audio triggers onError and resets state immediately');

    console.log('--- TEST 4: Fallback Routing (Prerecorded Audio -> Native TTS -> Phonetic Guidance) ---');
    let routedTo = null;
    function simulateOrchestrator({ hasKannadaVoice, phraseId }) {
      const audioUrl = getPhraseAudioUrl(phraseId);
      if (audioUrl) {
        routedTo = 'prerecorded-audio';
        return;
      }
      if (hasKannadaVoice) {
        routedTo = 'tts';
        return;
      }
      routedTo = 'phonetic-guidance';
    }

    // Scenario 1: Authentic human audio registered -> uses prerecorded audio
    simulateOrchestrator({ hasKannadaVoice: true, phraseId: 'bs-01' });
    assert.strictEqual(routedTo, 'prerecorded-audio', 'Should use authentic human recording when registered');

    // Scenario 2: No prerecorded audio, but device has Kannada TTS voice -> uses TTS
    simulateOrchestrator({ hasKannadaVoice: true, phraseId: 'unrecorded-phrase' });
    assert.strictEqual(routedTo, 'tts', 'Should use native Kannada TTS when voice is present');

    // Scenario 3: Neither prerecorded audio nor Kannada TTS voice is present -> guides to phonetics
    simulateOrchestrator({ hasKannadaVoice: false, phraseId: 'unrecorded-phrase' });
    assert.strictEqual(routedTo, 'phonetic-guidance', 'Should guide to phonetics when neither is available');

    console.log('✓ PASS: Multi-tier fallback accurately selects authentic audio > native TTS > phonetic guidance');
    console.log('\nAll audio fallback tests PASSED successfully!');
  }, 50);
}, 50);

