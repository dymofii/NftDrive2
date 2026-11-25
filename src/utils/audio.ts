class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensureCtx(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    endFreq: number,
    duration: number,
    type: OscillatorType,
    gainVal: number,
    delay = 0
  ) {
    const ctx = this.ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playGrab() {
    this.playTone(260, 340, 0.07, 'triangle', 0.08);
  }

  playBuy() {
    this.playTone(440, 587, 0.09, 'sine', 0.11, 0);
    this.playTone(659, 880, 0.14, 'triangle', 0.1, 0.06);
  }

  playMerge() {
    this.playTone(392, 523, 0.12, 'triangle', 0.11, 0);
    this.playTone(523, 659, 0.12, 'triangle', 0.11, 0.07);
    this.playTone(784, 1046, 0.22, 'sine', 0.12, 0.14);
  }

  playBoost() {
    this.playTone(190, 340, 0.11, 'sawtooth', 0.055, 0);
    this.playTone(720, 960, 0.09, 'sine', 0.07, 0.04);
  }

  playSell() {
    this.playTone(587, 440, 0.11, 'sine', 0.09, 0);
    this.playTone(880, 659, 0.12, 'triangle', 0.07, 0.05);
  }

  playUpgrade() {
    this.playTone(523, 659, 0.1, 'sine', 0.1, 0);
    this.playTone(659, 987, 0.16, 'sine', 0.1, 0.07);
  }

  playError() {
    this.playTone(180, 130, 0.14, 'sawtooth', 0.06, 0);
  }

  playMilestone() {
    [523, 659, 784, 1046].forEach((note, idx) => {
      this.playTone(note, note, 0.24, 'triangle', 0.1, idx * 0.08);
    });
  }

  playCatchStart() {
    this.playTone(320, 480, 0.09, 'triangle', 0.08, 0);
  }

  playCatchFail() {
    this.playTone(260, 130, 0.22, 'sawtooth', 0.07, 0);
  }
}

export const soundEngine = new SoundEngine();
