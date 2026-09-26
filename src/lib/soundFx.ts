"use client";

class SoundFxEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private enabled: boolean = true;

  // Master volume level
  private masterVolume: number = 1.8;

  private initCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // 1. Warm limiter compressor
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-10, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.08, this.ctx.currentTime);

        // 2. Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
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

  // 1. TACTILE HAPTIC "THUD / WHEEL CLICK" (Replaces harsh mechanical tick)
  // Deep, rounded acoustic dial click like a high-end camera wheel
  playMechanicalTick() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    const out = this.getOutputNode();
    if (!ctx || !out) return;

    try {
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Warm triangle wave: starts at 190Hz, quickly drops to 45Hz
      osc.type = "triangle";
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.022);

      // Lowpass filter to shave off any piercing high frequencies
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(out);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {}
  }

  // 2. WARM VELVET "BUBBLE POP" (Replaces ear-piercing glass chime)
  // Organic, smooth liquid-drop tap for button touches
  playCinematicPop() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    const out = this.getOutputNode();
    if (!ctx || !out) return;

    try {
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Pure sine glide from 480Hz down to 240Hz
      osc.type = "sine";
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.045);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(700, now);

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(out);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // 3. CINEMATIC SUB-BASS WHOOSH (Drawer & Swipes)
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
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(36, now + 0.28);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.65, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(out);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // 4. CINEMATIC LOW SWELL (Play & Trailer)
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
      osc.frequency.setValueAtTime(60, now);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(130, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(65, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.55, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(out);

      osc.start(now);
      osc.stop(now + 0.48);
    } catch {}
  }

  // Fallback aliases
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
