import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Square,
  Sparkles,
  History,
  Info,
  Globe,
  Music,
  User,
  Sliders,
  Copy,
  Trash2,
  BookOpen,
  MessageSquare,
  Mic
} from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string;
  lang: string;
  pitch: number;
  rate: number;
}

const CHARACTERS: Character[] = [
  { id: 'narration', name: 'Kabir (Storyteller)', role: 'Deep & Expressive', lang: 'hi', pitch: 0.9, rate: 0.9 },
  { id: 'news', name: 'Ananya (News Anchor)', role: 'Clear & Formal', lang: 'hi', pitch: 1.0, rate: 1.05 },
  { id: 'gamer', name: 'Echo (Streamer)', role: 'Fast & High Energy', lang: 'en', pitch: 1.15, rate: 1.15 },
  { id: 'assistant', name: 'Aria (AI Assistant)', role: 'Polite & Smooth', lang: 'en', pitch: 1.05, rate: 1.0 }
];

const STYLES = [
  { id: 'default', label: 'Default / Natural', pitch: 1.0, rate: 1.0 },
  { id: 'cheerful', label: 'Friendly & Cheerful', pitch: 1.2, rate: 1.05 },
  { id: 'soothing', label: 'Calm & Soothing', pitch: 0.85, rate: 0.85 },
  { id: 'formal', label: 'Professional & Formal', pitch: 1.0, rate: 0.95 },
  { id: 'dramatic', label: 'Dramatic Storyteller', pitch: 0.75, rate: 0.8 },
  { id: 'energetic', label: 'Energetic & Fast', pitch: 1.25, rate: 1.2 }
];

const SAMPLE_SCRIPTS = [
  'नियम नहीं, कहीं कोई कसाव नहीं, हर जगह एक स्वच्छन्द खुलाव, एक बिखरी हुई-सी अनियमितता। बनारस की गलियों से भी पतली गलियाँ और लखनऊ की सड़कों से चौड़ी सड़कें।',
  'Welcome to the next generation of artificial intelligence voice synthesis. Ultra fast, highly natural, and completely customized.',
  'What is up gaming squad! Today we are diving straight into intense survival gameplay.'
];

export default function App() {
  const [text, setText] = useState<string>(SAMPLE_SCRIPTS[0]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedChar, setSelectedChar] = useState<string>('narration');
  const [selectedStyle, setSelectedStyle] = useState<string>('soothing');
  
  const [pitch, setPitch] = useState<number>(0.85);
  const [rate, setRate] = useState<number>(0.85);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

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

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleStyleSelect = (styleObj: typeof STYLES[0]) => {
    setSelectedStyle(styleObj.id);
    setPitch(styleObj.pitch);
    setRate(styleObj.rate);
  };

  const handleCharSelect = (charId: string) => {
    setSelectedChar(charId);
    const char = CHARACTERS.find(c => c.id === charId);
    if (char) {
      setPitch(char.pitch);
      setRate(char.rate);
      const match = voices.find(v => v.lang.toLowerCase().startsWith(char.lang));
      if (match) setSelectedVoice(match.name);
    }
  };

  const filteredVoices = voices.filter(v => {
    if (selectedLang === 'all') return true;
    return v.lang.toLowerCase().startsWith(selectedLang.toLowerCase());
  });

  const handleGenerate = () => {
    if (!text.trim()) return;

    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voiceObj = voices.find(v => v.name === selectedVoice);
    if (voiceObj) utterance.voice = voiceObj;

    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => {
      setIsSpeaking(true);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e0f12] text-[#e1e4ea] font-sans flex flex-col items-center p-3 sm:p-6 pb-24">
      <div className="max-w-3xl w-full flex flex-col gap-5">
        
        {/* Top Header */}
        <header className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-wide">Text to Speech</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">AI</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Neural voice synthesis & tone architecture</p>
            </div>
          </div>

          <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition cursor-pointer">
            <History className="w-4 h-4" />
          </button>
        </header>

        {/* Engine Switcher */}
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-1.5 flex-1">
            <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-semibold shadow-inner cursor-pointer">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Neural Voice</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-transparent text-slate-400 text-xs font-medium hover:text-white transition cursor-pointer">
              <Globe className="w-3.5 h-3.5" />
              <span>Browser Speech</span>
            </button>
          </div>
          <button className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Main Text Input Card */}
        <div className="rounded-3xl bg-[#14161d] border border-white/10 p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
          
          {/* Card Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">INPUT TEXT SCRIPT</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-500">{charCount} chars • {wordCount} words</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setText(SAMPLE_SCRIPTS[Math.floor(Math.random() * SAMPLE_SCRIPTS.length)])}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium text-slate-300 hover:bg-white/10 transition cursor-pointer"
              >
                <BookOpen className="w-3 h-3 text-cyan-400" />
                <span>Sample Scripts</span>
              </button>
              
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition cursor-pointer"
                title="Copy Text"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setText('')}
                className="px-2 py-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer uppercase tracking-wider"
              >
                CLEAR
              </button>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full bg-transparent text-white placeholder-slate-600 text-sm sm:text-base leading-relaxed focus:outline-none resize-none font-sans"
            placeholder="Type or paste your text here..."
          />

          {/* Vocal Tone & Style */}
          <div className="pt-3 border-t border-white/5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>VOCAL TONE & STYLE</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {STYLES.map((style) => {
                const isActive = selectedStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => handleStyleSelect(style)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
                      isActive
                        ? 'bg-cyan-500/20 border-cyan-400/80 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {style.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Neural Voice Architecture Panel */}
        <div className="rounded-3xl bg-[#14161d] border border-white/10 p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-3">
            <Mic className="w-3.5 h-3.5 text-cyan-400" />
            <span>NEURAL VOICE ARCHITECTURE</span>
          </div>

          {/* Characters Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CHARACTERS.map((char) => {
              const isActive = selectedChar === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => handleCharSelect(char.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/15 border-cyan-400/80 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  <User className={`w-4 h-4 mb-2 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{char.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{char.role}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Voice & Language Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none w-full cursor-pointer"
              >
                <option value="all" className="bg-[#14161d]">All Languages</option>
                <option value="hi" className="bg-[#14161d]">Hindi (हिन्दी)</option>
                <option value="en" className="bg-[#14161d]">English</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              <Music className="w-4 h-4 text-cyan-400 shrink-0" />
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none w-full cursor-pointer truncate"
              >
                {filteredVoices.map((v) => (
                  <option key={v.name} value={v.name} className="bg-[#14161d]">
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Generate / Stop Action Button */}
        <div className="flex justify-end pt-2">
          {isSpeaking ? (
            <button
              onClick={handleStop}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition shadow-lg cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop Speech</span>
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!text.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-cyan-400 text-black font-extrabold text-sm hover:bg-cyan-300 disabled:opacity-50 transition shadow-xl shadow-cyan-400/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Generate Voice</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
