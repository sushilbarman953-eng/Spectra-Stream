"use client";

class SoundFxEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 1.8;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spectra_sound_enabled");
      this.enabled = saved !== null ? saved === "true" : true;
    }
  }

  isEnabled() {
    return this.enabled;
  }

  setEnabled(state: boolean) {
    this.enabled = state;
    if (typeof window !== "undefined") {
      localStorage.setItem("spectra_sound_enabled", String(state));
      window.dispatchEvent(new Event("spectra_sound_preference_changed"));
    }
  }

  private initCtx() {
    if (typeof window === "undefined" || !this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-10, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.08, this.ctx.currentTime);

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

  playMechanicalTick() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    const out = this.getOutputNode();
    if (!ctx || !out) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(out);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  playCinematicPop() {
    if (!this.enabled) return;
    const ctx = this.initCtx();
    const out = this.getOutputNode();
    if (!ctx || !out) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(out);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

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
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.22);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(out);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  playCinematicSwell() {
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
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(out);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  playTabShift() {
    this.playCinematicWhoosh();
  }

  playGlassTap() {
    this.playCinematicPop();
  }
}

export const soundFx = new SoundFxEngine();
