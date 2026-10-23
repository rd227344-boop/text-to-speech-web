```react
import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Square,
  Sparkles,
  Globe,
  Sliders,
  UserCheck,
  Zap,
  RotateCcw,
  Copy,
  Check,
  Play,
  Flame,
  Radio,
  Gamepad2,
  Bot,
  Sparkle,
  Mic,
  VolumeX,
  Languages
} from 'lucide-react';

// Character Preset Definition
interface CharacterPreset {
  id: string;
  name: string;
  role: string;
  icon: any;
  pitch: number;
  rate: number;
  preferredLang: string; // 'hi' or 'en' preference hint
  description: string;
}

// Sample Script Presets
const SAMPLE_SCRIPTS = [
  {
    label: ' Hindi Story',
    text: 'एक समय की बात है, एक घने जंगल में एक समझदार बूढ़ा उल्लू रहता था। वह दिन-रात लोगों की मदद करता था और अपनी बुद्धिमत्ता के लिए पूरे राज्य में प्रसिद्ध था।'
  },
  {
    label: ' Tech News',
    text: 'Welcome back to Tech Daily! Today we are exploring the latest breakthroughs in Artificial Intelligence, Neural Processing Units, and quantum computing.'
  },
  {
    label: ' Gaming Intro',
    text: 'Welcome to the Battle Royale arena, Warriors! Prepare your gear, assemble your squad, and get ready for the ultimate victory!'
  },
  {
    label: ' Friendly Assistant',
    text: 'Hello there! How can I assist you today? Feel free to ask me anything about your schedule, travel plans, or weather updates.'
  }
];

// Character Roles
const CHARACTERS: CharacterPreset[] = [
  {
    id: 'storyteller',
    name: 'Kavya / Storyteller',
    role: 'Deep & Expressive',
    icon: Sparkle,
    pitch: 0.9,
    rate: 0.9,
    preferredLang: 'hi',
    description: 'Perfect for narration, bedtime stories, and audiobooks.'
  },
  {
    id: 'news_anchor',
    name: 'Alex / News Anchor',
    role: 'Crisp & Professional',
    icon: Radio,
    pitch: 1.0,
    rate: 1.05,
    preferredLang: 'en',
    description: 'Clear articulation suited for news, reports, and tutorials.'
  },
  {
    id: 'gamer',
    name: 'Blaze / Gamer',
    role: 'Energetic & Fast',
    icon: Gamepad2,
    pitch: 1.2,
    rate: 1.25,
    preferredLang: 'en',
    description: 'High energy voice for action, gaming commentary, and ads.'
  },
  {
    id: 'assistant',
    name: 'Aria / AI Assistant',
    role: 'Calm & Friendly',
    icon: Bot,
    pitch: 1.1,
    rate: 1.0,
    preferredLang: 'en',
    description: 'Gentle, clear tone for customer service and virtual guides.'
  },
  {
    id: 'dramatic',
    name: 'Vikram / Anime Hero',
    role: 'Intense & Bold',
    icon: Flame,
    pitch: 0.8,
    rate: 0.95,
    preferredLang: 'hi',
    description: 'Impactful tone for movie trailers, anime, and drama.'
  }
];

// Voice Style / Emotion Filters
const EMOTIONS = [
  { id: 'professional', label: 'Professional', pitchMod: 0, rateMod: 0 },
  { id: 'energetic', label: 'Energetic ⚡', pitchMod: 0.15, rateMod: 0.2 },
  { id: 'calm', label: 'Calm 🌿', pitchMod: -0.1, rateMod: -0.15 },
  { id: 'dramatic', label: 'Dramatic 🎭', pitchMod: -0.2, rateMod: -0.1 },
  { id: 'cheerful', label: 'Cheerful ✨', pitchMod: 0.2, rateMod: 0.1 }
];

export default function App() {
  const [text, setText] = useState<string>(SAMPLE_SCRIPTS[0].text);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('storyteller');
  const [selectedEmotion, setSelectedEmotion] = useState<string>('professional');

  // Controls State
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);

  // Status & Utility States
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load Browser Voices
  useEffect(() => {
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) {
        setErrorMsg('Speech synthesis is not supported in this browser.');
        return;
      }
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (availableVoices.length > 0 && !selectedVoice) {
        // Pick a default voice preferably matching Hindi or English
        const defaultV =
          availableVoices.find((v) => v.lang.startsWith('hi')) ||
          availableVoices.find((v) => v.lang.startsWith('en')) ||
          availableVoices[0];
        setSelectedVoice(defaultV.name);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Handle Character Preset Selection
  const applyCharacterPreset = (charId: string) => {
    setSelectedCharacter(charId);
    const char = CHARACTERS.find((c) => c.id === charId);
    if (!char) return;

    setPitch(char.pitch);
    setRate(char.rate);

    // Auto-select a voice matching character preference if possible
    if (voices.length > 0) {
      const preferredVoice = voices.find((v) => v.lang.startsWith(char.preferredLang));
      if (preferredVoice) {
        setSelectedVoice(preferredVoice.name);
      }
    }
  };

  // Compute final pitch & rate based on emotion mods
  const getFinalAudioSettings = () => {
    const emotionObj = EMOTIONS.find((e) => e.id === selectedEmotion);
    const pitchMod = emotionObj ? emotionObj.pitchMod : 0;
    const rateMod = emotionObj ? emotionObj.rateMod : 0;

    const finalPitch = Math.min(Math.max(pitch + pitchMod, 0.5), 2.0);
    const finalRate = Math.min(Math.max(rate + rateMod, 0.5), 2.0);

    return { finalPitch, finalRate };
  };

  // Speak Text
  const handleGenerate = () => {
    if (!text.trim()) return;

    if (!('speechSynthesis' in window)) {
      setErrorMsg('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voiceObj = voices.find((v) => v.name === selectedVoice);
    if (voiceObj) {
      utterance.voice = voiceObj;
    }

    const { finalPitch, finalRate } = getFinalAudioSettings();
    utterance.pitch = finalPitch;
    utterance.rate = finalRate;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setErrorMsg(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.error('TTS Error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop Playback
  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Copy Text
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract unique language list
  const availableLanguages = Array.from(new Set(voices.map((v) => v.lang.split('-')[0]))).sort();

  // Filter voices by language selection
  const filteredVoices = voices.filter((v) => {
    if (selectedLanguage === 'all') return true;
    return v.lang.startsWith(selectedLanguage);
  });

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Glowing Dynamic Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-rose-500/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Header / Navbar */}
      <nav className="relative z-10 max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
            🎙️
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
              VOICEIFY AI
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Studio Pro
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition flex items-center gap-1.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Voice Studio</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-cyan-300">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>Multi-Character & Emotion Voice Generator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Realistic <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-300 to-rose-400">AI Characters & Voices</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Choose a character persona, adjust voice emotions, or customize pitch and speed for videos, stories, and podcasts.
          </p>
        </div>

        {/* SECTION 1: Character Personas Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Select AI Character Persona</span>
            </h2>
            <span className="text-xs text-white/40">Auto-adjusts voice profile</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CHARACTERS.map((char) => {
              const Icon = char.icon;
              const isSelected = selectedCharacter === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => applyCharacterPreset(char.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between backdrop-blur-xl relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-500/20 to-purple-600/20 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white/70'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {char.name}
                    </h3>
                    <p className="text-[10px] text-white/50 truncate font-medium">{char.role}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Text Script Input & Presets */}
        <div className="rounded-3xl bg-white/5 border border-white/15 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl relative space-y-4">
          
          {/* Preset Buttons & Utility Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-white/50 font-medium mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
              </span>
              {SAMPLE_SCRIPTS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(preset.text)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-white/80 transition cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
                title="Copy Text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setText('')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer"
                title="Clear Text"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-white placeholder-white/30 text-sm sm:text-base focus:outline-none resize-none font-normal leading-relaxed"
            placeholder="Type or paste your text script here in Hindi, English, or any language..."
          />

          {errorMsg && <p className="text-rose-400 text-xs font-medium">{errorMsg}</p>}

          {/* Active Visualizer Waveform */}
          {isSpeaking && (
            <div className="flex items-center justify-center gap-1 h-8 py-1 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <span className="text-xs text-cyan-300 font-semibold mr-2 animate-pulse">Generating Speech Audio...</span>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-400 rounded-full animate-bounce"
                  style={{
                    height: `${Math.floor(Math.random() * 18) + 8}px`,
                    animationDelay: `${i * 0.08}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Primary Action Button Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
            
            {/* Emotion / Voice Style Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
              <span className="text-xs text-white/50 font-medium shrink-0 mr-1">Emotion:</span>
              {EMOTIONS.map((emo) => (
                <button
                  key={emo.id}
                  onClick={() => setSelectedEmotion(emo.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer shrink-0 ${
                    selectedEmotion === emo.id
                      ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                  }`}
                >
                  {emo.label}
                </button>
              ))}
            </div>

            {/* Play / Stop Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              {isSpeaking ? (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition shadow-lg shadow-rose-500/30 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop Playback</span>
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!text.trim()}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 hover:opacity-95 text-black font-extrabold text-xs disabled:opacity-40 transition shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Generate Voice</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Detailed Voice & Parameter Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Language & Voice Selection */}
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Language & Voice Selector</span>
            </h3>

            <div className="space-y-3">
              {/* Language Filter */}
              <div>
                <label className="text-[11px] text-white/50 block mb-1 font-medium">Filter by Language</label>
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-[#181822] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="all">🌍 All Languages ({voices.length} voices available)</option>
                    {availableLanguages.map((langCode) => (
                      <option key={langCode} value={langCode}>
                        {langCode.toUpperCase()} Language Group
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specific Voice Pick */}
              <div>
                <label className="text-[11px] text-white/50 block mb-1 font-medium">Available System Voices</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-[#181822] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cyan-400 cursor-pointer"
                >
                  {filteredVoices.length === 0 ? (
                    <option value="">No voices found for selected filter</option>
                  ) : (
                    filteredVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} — [{v.lang}]
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Audio Sliders (Speed, Pitch, Volume) */}
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Voice Tuning Controls</span>
            </h3>

            <div className="space-y-3">
              {/* Speed / Rate Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-white/70 mb-1 font-medium">
                  <span>Speed (Rate)</span>
                  <span className="text-cyan-300 font-bold">{rate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-white/10 rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              {/* Pitch Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-white/70 mb-1 font-medium">
                  <span>Pitch</span>
                  <span className="text-purple-300 font-bold">{pitch.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-purple-400 bg-white/10 rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              {/* Volume Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-white/70 mb-1 font-medium">
                  <span>Volume</span>
                  <span className="text-rose-300 font-bold">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-rose-400 bg-white/10 rounded-lg h-1.5 cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center pt-6 border-t border-white/10 text-xs text-white/40">
          Powered by Browser Neural Speech Synthesis Engine • Free & Unlimited Generation
        </div>

      </main>
    </div>
  );
}
```
