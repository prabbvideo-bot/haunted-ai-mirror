export interface SpectralAnalysis {
  faceDetected: boolean;
  expression: string;
  auraColor: string;
  spectralClassification: string;
  prophecyVerse: string;
  hiddenWarning: string;
  fallback?: boolean;
  error?: string;
}

export interface GrimoireEntry {
  id: string;
  timestamp: number;
  expression: string;
  spectralClassification: string;
  prophecyVerse: string;
  hiddenWarning: string;
  auraColor: string;
  imageSnapshot?: string;
  spokenInquiry?: string;
}

export interface FilterSettings {
  ectoplasmIntensity: number; // 0 to 1
  chromaticAberration: boolean;
  antiqueTarnish: number; // 0 to 1
  eyeEmbers: boolean;
  darkVignette: number; // 0 to 1
  ghostAfterimage: boolean;
  spectralTint: 'ectoplasm' | 'crimson' | 'sepia' | 'shadow';
}

export interface AudioSettings {
  masterVolume: number;
  ambientDrone: boolean;
  soundEffects: boolean;
  voiceName: 'Charon' | 'Fenrir' | 'Kore' | 'Zephyr';
}
