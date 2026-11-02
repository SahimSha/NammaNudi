export interface AudioPlayerCallbacks {
  onLoading?: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error | MediaError | string) => void;
}

class AudioPlayerService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlayingInternal: boolean = false;
  private isLoadingInternal: boolean = false;
  private currentUrl: string | null = null;

  public play(url: string, callbacks?: AudioPlayerCallbacks): boolean {
    // Stop any existing playback first
    this.stop();

    try {
      this.isLoadingInternal = true;
      this.currentUrl = url;
      callbacks?.onLoading?.();

      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onplay = () => {
        this.isLoadingInternal = false;
        this.isPlayingInternal = true;
        callbacks?.onStart?.();
      };

      audio.onended = () => {
        this.isLoadingInternal = false;
        this.isPlayingInternal = false;
        this.cleanup(audio);
        callbacks?.onEnd?.();
      };

      audio.onerror = () => {
        this.isLoadingInternal = false;
        this.isPlayingInternal = false;
        this.cleanup(audio);
        callbacks?.onError?.(audio.error || 'Audio playback error');
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          this.isLoadingInternal = false;
          this.isPlayingInternal = false;
          this.cleanup(audio);
          callbacks?.onError?.(err);
        });
      }

      return true;
    } catch (err) {
      this.isLoadingInternal = false;
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
    this.isLoadingInternal = false;
    this.isPlayingInternal = false;
    this.currentUrl = null;
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

  public isLoading(): boolean {
    return this.isLoadingInternal;
  }

  public getCurrentUrl(): string | null {
    return this.currentUrl;
  }
}

export const audioPlayerService = new AudioPlayerService();
