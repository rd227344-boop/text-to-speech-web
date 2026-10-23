import React, { useState } from 'react';
import { Square, Sparkles, Volume2, Globe, Music } from 'lucide-react';

export default function App() {
  const [text, setText] = useState<string>(
    'Welcome to Voiceify AI. Turn your ideas into a powerful voiceover in seconds.'
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!text.trim()) return;

    if (!('speechSynthesis' in window)) {
      setErrorMsg('Speech synthesis is not supported in this browser.');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setErrorMsg(null);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setErrorMsg(null); // Ignore minor warning triggers on mobile
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-[#111116] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-rose-400/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-amber-300/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-lg shadow-lg">
            🎙️
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
            VOICE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/70 font-medium">
          <a href="#" className="hover:text-white transition">Product</a>
          <a href="#" className="hover:text-white transition">Voices</a>
          <a href="#" className="hover:text-white transition">Use Cases</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
        </div>

        <button className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition shadow-xl cursor-pointer">
          Get Started
        </button>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 pt-10 pb-16 flex flex-col items-center text-center my-auto">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-medium text-white/90 mb-8 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>AI Voice Generation • Free & Unlimited</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Create Studio Quality <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/50">
            AI Voices in Seconds.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-white/60 max-w-2xl font-normal leading-relaxed mb-12">
          Generate realistic voiceovers for videos, ads, apps, podcasts, and customer support using advanced neural voice technology. Fast, scalable, and incredibly human.
        </p>

        {/* Floating Glassmorphism Text Box Card */}
        <div className="w-full max-w-3xl rounded-3xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 sm:p-6 text-left relative transition-all">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-white placeholder-white/40 text-base sm:text-lg focus:outline-none resize-none font-normal leading-relaxed"
            placeholder="Type or paste your text script here..."
          />

          {errorMsg && (
            <p className="text-rose-400 text-xs mb-3 font-medium">{errorMsg}</p>
          )}

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/80 backdrop-blur-md">
                <Globe className="w-3.5 h-3.5 text-white/60" />
                <span>Neural Voice</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-white/80 backdrop-blur-md">
                <Music className="w-3.5 h-3.5 text-white/60" />
                <span>Professional</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              {isSpeaking ? (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition shadow-lg cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!text.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 disabled:opacity-50 transition shadow-lg cursor-pointer"
                >
                  <span>Generate Voice</span>
                  <Volume2 className="w-3.5 h-3.5 fill-black" />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-white/40 mt-4">
          No credit card required • Unlimited free generations • Instant Playback
        </p>

        {/* Footer Sponsor Logos */}
        <div className="mt-16 w-4/5 max-w-4xl pt-8 border-t border-white/10">
          <p className="text-xs text-white/40 mb-6 uppercase tracking-wider font-semibold">
            Trusted by creators from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all text-xs font-bold tracking-widest text-white/80">
            <span>ATTENTIVE</span>
            <span>COINBASE</span>
            <span>OUTREACH</span>
            <span>UPWORK</span>
            <span>DOCUSIGN</span>
            <span>NETFLIX</span>
          </div>
        </div>
      </main>
    </div>
  );
}
