export type SupportedLang = 'nepali' | 'hindi' | 'bengali' | 'english';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public isAvailable(): boolean {
    return this.synth !== null;
  }

  public speak(text: string, lang: SupportedLang = 'nepali', onEnd?: () => void): boolean {
    if (!this.synth) return false;

    try {
      this.synth.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Slightly slower for clarity in noisy carriage
      utterance.pitch = 1.0;

      const voice = this.getBestVoice(lang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        // Fallback lang codes
        switch (lang) {
          case 'nepali':
            utterance.lang = 'hi-IN'; // Closest Devanagari TTS widely available
            break;
          case 'hindi':
            utterance.lang = 'hi-IN';
            break;
          case 'bengali':
            utterance.lang = 'bn-IN';
            break;
          case 'english':
          default:
            utterance.lang = 'en-IN';
            break;
        }
      }

      if (onEnd) {
        utterance.onend = () => onEnd();
        utterance.onerror = () => onEnd();
      }

      this.synth.speak(utterance);
      return true;
    } catch {
      return false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  private getBestVoice(lang: SupportedLang): SpeechSynthesisVoice | undefined {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }

    const langPreferences: Record<SupportedLang, string[]> = {
      nepali: ['ne-NP', 'ne', 'hi-IN', 'hi'],
      hindi: ['hi-IN', 'hi'],
      bengali: ['bn-IN', 'bn-BD', 'bn'],
      english: ['en-IN', 'en-GB', 'en-US', 'en']
    };

    const targetPrefixes = langPreferences[lang];

    for (const prefix of targetPrefixes) {
      const match = this.voices.find(v => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
      if (match) return match;
    }

    return undefined;
  }
}

export const speechService = new SpeechService();

