import React, { useState, useEffect } from 'react';
import { Square, Sparkles, Volume2, Globe, Music, User, Sliders, Play, RotateCcw } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  pitch: number;
  rate: number;
  langPref: string;
  description: string;
}

const CHARACTERS: Character[] = [
  {
    id: 'storyteller',
    name: 'Kabir',
    role: 'Storyteller',
    avatar: '📖',
    pitch: 0.9,
    rate: 0.9,
    langPref: 'hi',
    description: 'Deep, expressive voice for narration and kahaniyan.'
  },
  {
    id: 'anchor',
    name: 'Ananya',
    role: 'News Anchor',
    avatar: '🎙️',
    pitch: 1.0,
    rate: 1.05,
    langPref: 'hi',
    description: 'Clear, authoritative tone for news and announcements.'
  },
  {
    id: 'gamer',
    name: 'Echo Gamer',
    role: 'Streamer / Gamer',
    avatar: '🎮',
    pitch: 1.15,
    rate: 1.15,
    langPref: 'en',
    description: 'High energy, fast-paced voice for gaming highlights.'
  },
  {
    id: 'assistant',
    name: 'Aria AI',
    role: 'Virtual Assistant',
    avatar: '🤖',
    pitch: 1.05,
    rate: 1.0,
    langPref: 'en',
    description: 'Polite, calm, and professional AI voice.'
  },
  {
    id: 'anime',
    name: 'Ryu',
    role: 'Anime Hero',
    avatar: '⚔️',
    pitch: 1.25,
    rate: 1.1,
    langPref: 'ja',
    description: 'Dramatic and intense hero character voice.'
  }
];

const PRESET_SCRIPTS = [
  {
    label: 'Hindi Story',
    text: 'Ek samay ki baat hai, ek door ke gaon mein ek chalak lomdi rehti thi. Usko har din naye adventurous kaam karna pasand tha.'
  },
  {
    label: 'Tech News',
    text: 'Welcome to today’s tech update. Artificial intelligence technology is evolving rapidly, enabling hyper-realistic neural voice synthesis.'
  },
  {
    label: 'Gaming Intro',
    text: 'What is up guys, welcome back to the channel! Today we are going for an incredible clutch in Free Fire MAX. Smash that like button!'
  }
];

export default function App() {
  const [text, setText] = useState<string>(PRESET_SCRIPTS[0].text);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedChar, setSelectedChar] = useState<string>('storyteller');
  const [selectedStyle, setSelectedStyle] = useState<string>('Dramatic');
  
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        const pref = available.find(v => v.lang.startsWith('hi')) || available.find(v => v.lang.startsWith('en')) || available[0];
        setSelectedVoice(pref.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoice]);

  const applyCharacterPreset = (charId: string) => {
    const char = CHARACTERS.find(c => c.id === charId);
    if (!char) return;
    setSelectedChar(charId);
    setPitch(char.pitch);
    setRate(char.rate);

    const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(char.langPref));
    if (matchingVoice) {
      setSelectedVoice(matchingVoice.name);
    }
  };

  const filteredVoices = voices.filter(v => {
    if (selectedLang === 'all') return true;
    return v.lang.toLowerCase().startsWith(selectedLang.toLowerCase());
  });

  const handleGenerate = () => {
    if (!text.trim()) return;

    if (!('speechSynthesis' in window)) {
      setErrorMsg('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const vObj = voices.find(v => v.name === selectedVoice);
    if (vObj) utterance.voice = vObj;

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setErrorMsg(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20">
            🎙️
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
            VOICEIFY <span className="text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/30">PRO</span>
          </span>
        </div>

        <button className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 transition shadow-lg shadow-white/10 cursor-pointer">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-medium text-cyan-300 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Character • Multi-Language AI Voice Generator</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-center tracking-tight max-w-3xl leading-tight mb-4">
          Create Studio AI Voices with <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Custom Characters</span>
        </h1>

        <p className="text-xs sm:text-sm text-white/50 text-center max-w-xl mb-8">
          Select character personas, tweak emotion tones, adjust speech pitch, and generate instant neural voiceovers.
        </p>

        {/* Character Personas Selector */}
        <div className="w-full max-w-4xl mb-6">
          <label className="text-xs font-bold text-white/60 mb-3 block uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" /> Select AI Character Persona
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CHARACTERS.map((char) => {
              const isSelected = selectedChar === char.id;
              const cardClass = isSelected
                ? "p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between bg-gradient-to-b from-cyan-500/20 to-purple-600/20 border-cyan-400/60 shadow-lg shadow-cyan-500/20 cursor-pointer"
                : "p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer";

              return (
                <div
                  key={char.id}
                  onClick={() => applyCharacterPreset(char.id)}
                  className={cardClass}
                >
                  <div className="text-2xl mb-2">{char.avatar}</div>
                  <div>
                    <h3 className="font-bold text-xs text-white mb-0.5">{char.name}</h3>
                    <p className="text-[10px] text-cyan-300/80 font-medium">{char.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Editor Card */}
        <div className="w-full max-w-4xl rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl p-5 sm:p-7 relative">
          
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-white/10">
            <span className="text-xs text-white/40 font-medium">Quick Scripts:</span>
            {PRESET_SCRIPTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setText(preset.text)}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-white/80 transition cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-white placeholder-white/30 text-base focus:outline-none resize-none font-normal leading-relaxed"
            placeholder="Type or paste script here..."
          />

          {errorMsg && (
            <p className="text-rose-400 text-xs mb-3 font-medium">{errorMsg}</p>
          )}

          {/* Controls Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10 my-2">
            
            {/* Left: Language & Voice Filters */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-white/70">Language Filter:</span>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="bg-black/40 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer flex-1"
                >
                  <option value="all">All Languages</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="en">English</option>
                  <option value="ja">Japanese</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-semibold text-white/70">System Voice:</span>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="bg-black/40 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none cursor-pointer flex-1 truncate"
                >
                  {filteredVoices.length === 0 ? (
                    <option value="">No voice found</option>
                  ) : (
                    filteredVoices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Right: Sliders (Speed & Pitch) */}
            <div className="flex flex-col gap-2.5 bg-black/20 p-3 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 font-medium">Speed / Rate: {rate}x</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-28 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 font-medium">Pitch / Pitch Tone: {pitch}</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-28 accent-purple-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Visualizer & Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
            
            {/* Active Wave Visualizer */}
            <div className="flex items-center gap-1.5 h-6">
              {isSpeaking ? (
                <>
                  <div className="w-1 bg-cyan-400 h-full animate-bounce rounded-full" />
                  <div className="w-1 bg-purple-400 h-3/4 animate-bounce rounded-full delay-100" />
                  <div className="w-1 bg-pink-400 h-full animate-bounce rounded-full delay-200" />
                  <div className="w-1 bg-cyan-400 h-1/2 animate-bounce rounded-full delay-300" />
                  <span className="text-[11px] text-cyan-300 ml-2 font-medium">Speaking...</span>
                </>
              ) : (
                <span className="text-[11px] text-white/30">Ready to speak</span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              {isSpeaking ? (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition shadow-lg cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop Speech</span>
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!text.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-extrabold text-xs hover:opacity-90 disabled:opacity-50 transition shadow-xl cursor-pointer"
                >
                  <span>Generate Voice</span>
                  <Volume2 className="w-4 h-4 fill-black" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-white/30 mt-4">
          Browser Native Neural Speech Engine • 100% Free & Unlimited
        </p>
      </main>
    </div>
  );
}
