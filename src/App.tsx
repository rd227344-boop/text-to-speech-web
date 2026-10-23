```react
import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Download,
  Sparkles,
  ChevronDown,
  Globe,
  Mic,
  Sliders,
  Check,
  Zap,
  ArrowRight,
  Shield,
  RefreshCw,
  Copy,
  SlidersHorizontal,
  VolumeX,
  AudioWaveform as Waveform
} from 'lucide-react';

// Edge Neural & Browser TTS Voices
const VOICE_PRESETS = [
  { id: 'hi-IN-MadhurNeural', name: 'Madhur', gender: 'Male', lang: 'Hindi (India)', flag: '🇮🇳', accent: 'hi-IN' },
  { id: 'hi-IN-SwaraNeural', name: 'Swara', gender: 'Female', lang: 'Hindi (India)', flag: '🇮🇳', accent: 'hi-IN' },
  { id: 'en-US-AvaNeural', name: 'Ava', gender: 'Female', lang: 'English (US)', flag: '🇺🇸', accent: 'en-US' },
  { id: 'en-US-GuyNeural', name: 'Guy', gender: 'Male', lang: 'English (US)', flag: '🇺🇸', accent: 'en-US' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia', gender: 'Female', lang: 'English (UK)', flag: '🇬🇧', accent: 'en-GB' },
  { id: 'es-ES-ElviraNeural', name: 'Elvira', gender: 'Female', lang: 'Spanish (Spain)', flag: '🇪🇸', accent: 'es-ES' },
  { id: 'fr-FR-DeniseNeural', name: 'Denise', gender: 'Female', lang: 'French (France)', flag: '🇫🇷', accent: 'fr-FR' },
];

const TONE_PRESETS = [
  { id: 'professional', name: 'Professional', desc: 'Authoritative & Clear' },
  { id: 'conversational', name: 'Conversational', desc: 'Casual & Natural' },
  { id: 'news', name: 'News Anchor', desc: 'Formal & Direct' },
  { id: 'friendly', name: 'Friendly', desc: 'Upbeat & Cheerful' },
  { id: 'dramatic', name: 'Storytelling', desc: 'Expressive & Deep' }
];

const SAMPLE_SCRIPTS = [
  { label: 'Hindi Ad', text: 'वॉइसली एआई में आपका स्वागत है। अपने विचारों को कुछ ही सेकंड में प्राकृतिक और सजीव आवाज़ में बदलें।' },
  { label: 'English Promo', text: 'Welcome to Voicely AI. Turn your ideas into a powerful, studio-quality voiceover in just a few seconds.' },
  { label: 'Podcast Intro', text: 'Hey everyone, welcome back to the channel! In today\'s episode, we are exploring the future of generative AI.' }
];

export default function App() {
  const [text, setText] = useState('Welcome to Voicely AI. Turn your ideas into a powerful studio-quality voiceover in seconds...');
  const [selectedVoice, setSelectedVoice] = useState(VOICE_PRESETS[0]);
  const [selectedTone, setSelectedTone] = useState(TONE_PRESETS[0]);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  
  // UI Dropdowns State
  const [openVoiceDropdown, setOpenVoiceDropdown] = useState(false);
  const [openToneDropdown, setOpenToneDropdown] = useState(false);
  const [openSpeedDropdown, setOpenSpeedDropdown] = useState(false);

  // Audio Playback & Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up Audio Object URL
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle Netlify Edge TTS Backend Generation
  const handleGenerateAndPlay = async () => {
    if (!text.trim()) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If audio is already generated for current text, re-play it
    if (audioUrl && audioRef.current && !isGenerating) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/.netlify/functions/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoice.id,
        }),
      });

      if (!res.ok) {
        throw new Error('TTS generation failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setAudioBlob(blob);
      setAudioUrl(url);

      // Create or update audio element
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }

      const audio = audioRef.current;
      audio.playbackRate = speed;

      audio.ontimeupdate = () => {
        if (audio.duration) {
          setPlaybackProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackProgress(100);
      };

      audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Audio Generation Error:', err);
      alert('Audio generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadMP3 = () => {
    if (!audioBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(audioBlob);
    a.download = `voiceover-${Date.now()}.mp3`;
    a.click();
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative font-sans text-slate-800 antialiased selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
      
      {/* Soft Pastel Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-[#A8E6CF] via-[#FFD3B6] via-[#FFAAA5] to-[#FF8B94] opacity-90 transition-all duration-1000">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/50 to-pink-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200/50 to-teal-300/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-gradient-to-bl from-purple-300/30 to-rose-200/50 rounded-full blur-3xl" />
      </div>

      {/* Modern Glassmorphic Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/20 border-b border-white/30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              VOICE<span className="text-orange-600">.</span>AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-700">
            <a href="#product" className="hover:text-slate-950 transition-colors">Product</a>
            <a href="#voices" className="hover:text-slate-950 transition-colors">Voices</a>
            <a href="#pricing" className="hover:text-slate-950 transition-colors">Pricing</a>
          </nav>

          <button className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md hover:shadow-xl active:scale-95">
            Get Started Free
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-12 pb-24 flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 border border-white/60 backdrop-blur-xl shadow-sm mb-6 text-xs font-semibold text-slate-800">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          <span>Unlimited AI Neural Voice Generation</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Hero Header */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-slate-900 tracking-tight leading-[1.15] max-w-3xl mb-6">
          Create Studio Quality <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            AI Voices in Seconds.
          </span>
        </h1>

        <p className="text-base md:text-lg text-center text-slate-600 max-w-2xl leading-relaxed mb-10 font-normal">
          Generate ultra-realistic voiceovers for videos, ads, apps, and podcasts using high-fidelity Microsoft Edge Neural TTS models.
        </p>

        {/* Glassmorphic Generator Card */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-white/60 via-orange-100/40 to-white/60 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000" />

          <div className="relative w-full rounded-2xl md:rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-6 md:p-8 flex flex-col gap-6">
            
            {/* Presets */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Samples:
                </span>
                {SAMPLE_SCRIPTS.map((script, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setText(script.text);
                      setAudioUrl(null);
                    }}
                    className="px-3 py-1 rounded-lg bg-white/50 hover:bg-white/80 border border-white/60 text-xs font-medium text-slate-700 transition-all shrink-0"
                  >
                    {script.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopyText}
                className="p-1.5 rounded-lg bg-white/50 hover:bg-white/80 text-slate-600 text-xs flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Prompt Textarea */}
            <div className="relative min-h-[140px]">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setAudioUrl(null);
                }}
                placeholder="Type or paste your script here..."
                className="w-full h-full min-h-[140px] bg-transparent text-slate-900 text-base md:text-lg font-normal placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                maxLength={3000}
              />
              <div className="absolute bottom-1 right-1 text-xs text-slate-400 font-mono">
                {text.length}/3000
              </div>
            </div>

            {/* Controls Bar */}
            <div className="pt-4 border-t border-slate-200/40 flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Voice Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOpenVoiceDropdown(!openVoiceDropdown)}
                    className="px-3.5 py-2 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-sm text-xs font-medium text-slate-800 flex items-center gap-2 transition-all"
                  >
                    <span className="text-base">{selectedVoice.flag}</span>
                    <span>{selectedVoice.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {openVoiceDropdown && (
                    <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl z-50 p-1.5 flex flex-col gap-0.5 animate-in fade-in">
                      {VOICE_PRESETS.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVoice(v);
                            setOpenVoiceDropdown(false);
                            setAudioUrl(null);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-all ${
                            selectedVoice.id === v.id ? 'bg-orange-50 text-orange-900 font-semibold' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{v.flag}</span>
                            <span>{v.name}</span>
                          </div>
                          {selectedVoice.id === v.id && <Check className="w-3.5 h-3.5 text-orange-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Speed Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setOpenSpeedDropdown(!openSpeedDropdown)}
                    className="px-3.5 py-2 rounded-full bg-white/70 hover:bg-white border border-white/80 shadow-sm text-xs font-medium text-slate-800 flex items-center gap-2 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-slate-500" />
                    <span>{speed}x Speed</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {openSpeedDropdown && (
                    <div className="absolute left-0 mt-2 w-36 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl z-50 p-1.5 flex flex-col gap-0.5 animate-in fade-in">
                      {[0.75, 1.0, 1.25, 1.5].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSpeed(s);
                            setOpenSpeedDropdown(false);
                            if (audioRef.current) audioRef.current.playbackRate = s;
                          }}
                          className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-all ${
                            speed === s ? 'bg-orange-50 text-orange-900 font-semibold' : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span>{s}x</span>
                          {speed === s && <Check className="w-3.5 h-3.5 text-orange-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Convert / Play Button */}
              <button
                onClick={handleGenerateAndPlay}
                disabled={isGenerating || !text.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-medium text-xs md:text-sm shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ml-auto"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <span>Generate Voice</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>

            {/* Audio Waveform Player */}
            {audioUrl && (
              <div className="mt-2 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 shadow-sm flex flex-col sm:flex-row items-center gap-4 animate-in fade-in">
                <button
                  onClick={handleGenerateAndPlay}
                  className="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>

                <div className="flex-1 w-full flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <Volume2 className="w-3.5 h-3.5 text-orange-600" />
                      {selectedVoice.name} Neural Voice
                    </span>
                    <span>{Math.round(playbackProgress)}%</span>
                  </div>
                  
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-100"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleDownloadMP3}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs flex items-center gap-1.5 font-medium transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download MP3</span>
                </button>
              </div>
            )}

          </div>
        </div>

        <p className="mt-4 text-xs text-slate-600 font-medium text-center">
          No credit card required • Powered by Microsoft Neural Edge Engine
        </p>

      </main>

    </div>
  );
}
```
