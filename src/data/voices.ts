import { VoiceOption, ToneOption, SampleText } from '../types';

export const GEMINI_VOICES: VoiceOption[] = [
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'Female',
    description: 'Clear, balanced, and naturally warm voice suited for narration and everyday reading.',
    tone: 'Warm & Articulate',
    recommendedFor: 'Articles, Explanations, Assistants',
  },
  {
    id: 'Puck',
    name: 'Puck',
    gender: 'Male',
    description: 'Engaging, friendly, and lively tone with natural cadence.',
    tone: 'Friendly & Dynamic',
    recommendedFor: 'Podcasts, Storytelling, Guides',
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: 'Male',
    description: 'Deep, resonant, and calm presence with steady delivery.',
    tone: 'Deep & Authoritative',
    recommendedFor: 'Documentaries, Audiobooks, Announcements',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: 'Male',
    description: 'Energetic, crisp, and assertive voice for impactful messages.',
    tone: 'Crisp & Confident',
    recommendedFor: 'Presentations, Commercials, Prompts',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'Female',
    description: 'Gentle, soft, and soothing voice with relaxed pacing.',
    tone: 'Soothing & Gentle',
    recommendedFor: 'Meditation, Bedtime Stories, E-learning',
  },
  {
    id: 'Aoede',
    name: 'Aoede',
    gender: 'Female',
    description: 'Bright, melodic, and highly expressive acoustic timbre.',
    tone: 'Bright & Melodic',
    recommendedFor: 'Creative Writing, Poetry, Dramatic Reading',
  },
];

export const TONE_OPTIONS: ToneOption[] = [
  { id: 'Default / Natural', label: 'Default / Natural', description: 'Standard balanced speech cadence.' },
  { id: 'Friendly and Cheerful', label: 'Friendly & Cheerful', description: 'Upbeat, warm, and inviting delivery.' },
  { id: 'Calm and Soothing', label: 'Calm & Soothing', description: 'Relaxed pacing and gentle timbre.' },
  { id: 'Professional and Formal', label: 'Professional & Formal', description: 'Clear, crisp, and business-ready presentation.' },
  { id: 'Dramatic and Engaging', label: 'Dramatic Storyteller', description: 'Expressive emphasis and captivating theatrical pace.' },
  { id: 'Fast and Energetic', label: 'Energetic & Fast', description: 'Brisk, punchy, high-tempo cadence.' },
];

export const SAMPLE_TEXTS: SampleText[] = [
  {
    id: 'sample-1',
    category: 'Narration',
    title: 'The Wonders of the Universe',
    text: 'Look up at the night sky. Each twinkling star is a sun of its own, carrying ancient light across trillions of kilometers to reach your eyes. In this vast cosmic ocean, our Earth is a fragile oasis of life, spinning quietly through the endless silence of space.',
    suggestedVoice: 'Charon',
    suggestedTone: 'Dramatic and Engaging',
  },
  {
    id: 'sample-2',
    category: 'Product & Tech',
    title: 'Welcome Announcement',
    text: 'Good morning, and welcome to your new voice workstation. All your custom audio settings and speech configurations have been calibrated to perfection. Ready whenever you are.',
    suggestedVoice: 'Kore',
    suggestedTone: 'Professional and Formal',
  },
  {
    id: 'sample-3',
    category: 'Meditation',
    title: 'Mindful Breathing',
    text: 'Take a gentle, deep breath in through your nose... hold it for just a moment... and slowly release through your mouth. Feel the tension melt away from your shoulders as you settle into the present moment.',
    suggestedVoice: 'Zephyr',
    suggestedTone: 'Calm and Soothing',
  },
  {
    id: 'sample-4',
    category: 'Dialogue',
    title: 'Coffee Shop Catch-up (Multi-Speaker)',
    text: 'Alex: Hey Jordan! Did you get a chance to check out that new sound design project?\nJordan: Absolutely! The voice synthesis fidelity is unbelievable. It sounds completely natural.',
    suggestedVoice: 'Puck',
    suggestedTone: 'Friendly and Cheerful',
    isMultiSpeaker: true,
  },
  {
    id: 'sample-5',
    category: 'Storytelling',
    title: 'The Hidden Forest Path',
    text: 'Beyond the old stone bridge lay a forgotten path woven with silver moss and ancient oaks. With every step, the whisper of the evening wind seemed to hum a song that no mortal had heard for a hundred years.',
    suggestedVoice: 'Aoede',
    suggestedTone: 'Dramatic and Engaging',
  },
];
