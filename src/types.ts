export type EngineMode = 'gemini' | 'browser';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  description: string;
  tone: string;
  recommendedFor: string;
}

export interface ToneOption {
  id: string;
  label: string;
  description: string;
}

export interface SampleText {
  id: string;
  category: string;
  title: string;
  text: string;
  suggestedVoice?: string;
  suggestedTone?: string;
  isMultiSpeaker?: boolean;
}

export interface SpeakerConfig {
  name: string;
  voice: string;
}

export interface TTSHistoryItem {
  id: string;
  text: string;
  voice: string;
  engine: EngineMode;
  audioUrl?: string; // object URL or base64 data URL
  audioBase64?: string;
  durationSeconds: number;
  createdAt: number;
  tone?: string;
}

export interface TTSResponse {
  audioBase64: string;
  mimeType: string;
  sampleRate: number;
  durationSeconds: number;
  voice: string;
  error?: string;
}
