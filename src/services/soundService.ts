// Pure client-side Web Audio API synthesizer for DHR B-Class Steam Locomotives
// Generates authentic twin-chime steam whistle and chuffing without external audio files.

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playSteamWhistle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Twin chime frequencies of British colonial steam locos (~440 Hz & 554 Hz - A4 and C#5)
    const freqs = [440, 554, 880];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Slight pitch wobble characteristic of steam pressure
      osc.frequency.linearRampToValueAtTime(freq + (idx === 0 ? 8 : -6), now + 0.8);
      osc.frequency.linearRampToValueAtTime(freq, now + 1.4);

      // Envelope
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + 0.12);
      gain.gain.setValueAtTime(0.18 / (idx + 1), now + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.6);
    });

    // Add white noise steam rush
    this.playSteamHiss(ctx, now, 1.5, 0.08);
  }

  private playSteamHiss(ctx: AudioContext, startTime: number, duration: number, volume: number) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Highpass filter to mimic steam hiss
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2200, startTime);
    filter.Q.setValueAtTime(1.5, startTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.1);
    gain.gain.setValueAtTime(volume, startTime + duration - 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  public playTrackClack() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Rhythmic double wheel clack on jointed rails (click-clack)
    [0, 0.12].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now + offset);
      osc.frequency.exponentialRampToValueAtTime(40, now + offset + 0.08);

      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.09);
    });
  }
}

export const soundService = new SoundService();

