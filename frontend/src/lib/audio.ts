/**
 * Web Audio API Emergency Siren Simulator
 * Generates an authentic acoustic warning warble / whoop tone in-browser.
 */
class SirenPlayer {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: any = null;

  public start() {
    if (this.isPlaying) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);

      this.gainNode.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start();
      this.isPlaying = true;

      // Frequency modulation for emergency whoop (600Hz -> 1100Hz -> 600Hz)
      let freq = 600;
      let rising = true;

      this.intervalId = setInterval(() => {
        if (!this.audioCtx || !this.oscillator) return;
        if (rising) {
          freq += 35;
          if (freq >= 1150) rising = false;
        } else {
          freq -= 35;
          if (freq <= 550) rising = true;
        }
        this.oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      }, 50);

    } catch (err) {
      console.warn('Audio Context initialization error:', err);
    }
  }

  public stop() {
    if (!this.isPlaying) return;
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.audioCtx) {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch (e) {
      // ignore
    } finally {
      this.isPlaying = false;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const sirenEngine = typeof window !== 'undefined' ? new SirenPlayer() : null;
