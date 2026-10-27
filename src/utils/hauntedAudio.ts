/**
 * Procedural Web Audio engine for Victorian Gothic haunted atmosphere
 * Synthesizes ambient sub-bass drone, eerie drafts, tolling church bells,
 * and plays spoken spectral prophecies.
 */

class HauntedAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private noiseNode: AudioNode | null = null;
  private isDronePlaying = false;
  private currentAudioElement: HTMLAudioElement | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.droneGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    if (!this.ctx || !this.masterGain) return;
    const clamped = Math.max(0, Math.min(1, vol));
    this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
  }

  public startAmbientDrone() {
    this.initContext();
    if (this.isDronePlaying || !this.ctx || !this.droneGain) return;

    try {
      // Sub-bass binaural drone (55Hz & 55.4Hz)
      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc2.type = 'sine';
      this.osc1.frequency.setValueAtTime(54.6, this.ctx.currentTime);
      this.osc2.frequency.setValueAtTime(55.4, this.ctx.currentTime);

      // Lowpass filter to muffle harsh harmonics into an ominous vibration
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      this.osc1.connect(filter);
      this.osc2.connect(filter);
      filter.connect(this.droneGain);

      this.osc1.start();
      this.osc2.start();

      // Atmospheric draft / wind noise generator
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99 * b0 + white * 0.05;
        b1 = 0.95 * b1 + white * 0.05;
        b2 = 0.85 * b2 + white * 0.05;
        output[i] = (b0 + b1 + b2) * 0.3;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(3, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.droneGain);

      noiseSource.start();
      this.noiseNode = noiseSource;
      this.isDronePlaying = true;
    } catch (e) {
      console.warn('Could not start procedural ambient drone:', e);
    }
  }

  public stopAmbientDrone() {
    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
        this.osc1 = null;
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
        this.osc2 = null;
      }
      if (this.noiseNode) {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
    } catch (e) {
      // Ignore cleanup error
    }
    this.isDronePlaying = false;
  }

  /**
   * Resonates an antique funeral / church bell toll
   */
  public playToll() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [185, 370, 555, 925];
      const gains = [0.25, 0.15, 0.08, 0.04];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 4);
      });
    } catch (e) {
      console.warn('Error playing toll:', e);
    }
  }

  /**
   * Whispered soul chime when user initiates communion
   */
  public playWhisperChime() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 1.2);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch (e) {
      console.warn('Error playing chime:', e);
    }
  }

  /**
   * Plays base64 WAV audio generated from Gemini TTS
   */
  public async playSpeech(base64Audio: string): Promise<void> {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }

    return new Promise((resolve) => {
      try {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        this.currentAudioElement = audio;
        audio.volume = 0.9;
        audio.onended = () => {
          this.currentAudioElement = null;
          resolve();
        };
        audio.onerror = () => {
          this.currentAudioElement = null;
          resolve();
        };
        audio.play().catch(() => {
          resolve();
        });
      } catch (e) {
        console.warn('Speech playback failed:', e);
        resolve();
      }
    });
  }

  /**
   * Fallback spectral speech synthesizer using Web Speech API if offline
   */
  public speakFallback(text: string): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.78;
        utterance.pitch = 0.55; // Low spectral pitch
        utterance.volume = 0.85;

        // Try to pick an English voice with rich resonance
        const voices = window.speechSynthesis.getVoices();
        const britishOrDeep = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('uk') ||
              v.name.toLowerCase().includes('great') ||
              v.name.toLowerCase().includes('male') ||
              v.name.toLowerCase().includes('daniel'))
        );
        if (britishOrDeep) {
          utterance.voice = britishOrDeep;
        }

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        resolve();
      }
    });
  }

  public stopAllSpeech() {
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const hauntedAudio = new HauntedAudioEngine();
