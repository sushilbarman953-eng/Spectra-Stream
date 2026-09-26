"use client";

class SoundFxEngine {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private enabled: boolean = true;

  // Master volume boost multiplier (1.0 = normal, 2.5 = high punch for mobile speakers)
  private masterVolume: number = 3.0;

  private initCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // 1. Master Dynamics Compressor (Prevents clipping/distortion when loud)
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-12, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.1, this.ctx.currentTime);

        // 2. Master Gain Booster
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

        // Chain: Source -> MasterGain -> Compressor -> Speakers
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);

        // Generate noise buffer for mechanical clicks
        const bufferSize = this.ctx.sampleRate * 0.04;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getOutputNode() {
    return this.masterGain || this.ctx?.destination;
  }

  // 1. HIGH-VOLUME MECHANICAL GEAR TICK (Wheel Dragging)
  playMechanicalTick() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    const out = this.getOutputNode();
    if (!ctx || !out) return;

    try {
      const now = ctx.currentTime;

      // Layer A: Punchy Noise Transient (amplified tooth impact)
      if (this.noiseBuffer) {
        const noise = ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(2800, now);
        noiseFilter.Q.setValueAtTime(2.5, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.65, now); // Increased from 0.22
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(out);

        noise.start(now);
        noise.stop(now + 0.02);
      }

      // Layer B: Resonant Pitched Snap
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.022);

      oscGain.gain.setValueAtTime(0.55, now); // Increased from 0.18
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

      osc.connect(oscGain);
      oscGain.connect(out);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {}
  }

  // 2. HIGH-VOLUME CINEMATIC WHOOSH (Fullscreen Drawer & Swipes)
  playCinematicWhoosh() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    const out = this.getOutputNode();
    if (!ctx || !out) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.7, now + 0.09); // Increased from 0.25
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(out);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  // 3. HIGH-VOLUME CINEMATIC POP (Button taps & Poster selections)
  playCinematicPop() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    const out = this.getOutputNode();
    if (!ctx || !out) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc2.type = "sine";

      osc.frequency.setValueAtTime(1046.5, now); // C6
      osc2.frequency.setValueAtTime(1318.5, now); // E6

      gain.gain.setValueAtTime(0.45, now); // Increased from 0.16
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(out);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.22);
      osc2.stop(now + 0.22);
    } catch {}
  }

  // 4. HIGH-VOLUME CINEMATIC SWELL (Play Button & Trailer launches)
  playCinematicSwell() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    const out = this.getOutputNode();
    if (!ctx || !out) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(65, now);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.22);
      filter.frequency.exponentialRampToValueAtTime(70, now + 0.48);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 0.16); // Increased from 0.2
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(out);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  // Fallbacks
  playGlassTap() {
    this.playCinematicPop();
  }

  playTick() {
    this.playMechanicalTick();
  }

  playTabShift() {
    this.playCinematicWhoosh();
  }
}

export const soundFx = new SoundFxEngine();
