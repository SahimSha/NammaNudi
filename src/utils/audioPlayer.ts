export interface AudioPlayerCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error | MediaError | string) => void;
}

class AudioPlayerService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlayingInternal: boolean = false;

  public play(url: string, callbacks?: AudioPlayerCallbacks): boolean {
    // Stop any existing playback first
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

      audio.onerror = () => {
        this.isPlayingInternal = false;
        this.cleanup(audio);
        callbacks?.onError?.(audio.error || 'Audio playback error');
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          this.isPlayingInternal = false;
          this.cleanup(audio);
          callbacks?.onError?.(err);
        });
      }

      return true;
    } catch (err) {
      this.isPlayingInternal = false;
      callbacks?.onError?.(err instanceof Error ? err.message : 'Failed to initialize audio');
      return false;
    }
  }

  public stop() {
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

  private cleanup(audio: HTMLAudioElement) {
    audio.onplay = null;
    audio.onended = null;
    audio.onerror = null;
    if (this.currentAudio === audio) {
      this.currentAudio = null;
    }
  }

  public isPlaying(): boolean {
    return this.isPlayingInternal || (this.currentAudio ? !this.currentAudio.paused : false);
  }
}

export const audioPlayerService = new AudioPlayerService();
