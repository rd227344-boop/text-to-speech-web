/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Sparkles,
  Play,
  Square,
  Loader2,
  AlertCircle,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { Header } from './components/Header';
import { TextInputArea } from './components/TextInputArea';
import { VoiceSelector } from './components/VoiceSelector';
import { BrowserSpeechControls } from './components/BrowserSpeechControls';
import { AudioPlayer } from './components/AudioPlayer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { InfoModal } from './components/InfoModal';
import {
  EngineMode,
  SpeakerConfig,
  TTSHistoryItem,
  SampleText,
  TTSResponse,
} from './types';
import { base64ToBlob, WebSpeechController } from './utils/audio';

const STORAGE_KEY = 'tts_app_history_v1';

export default function App() {
  const [engineMode, setEngineMode] = useState<EngineMode>('gemini');
  const [text, setText] = useState<string>(
    'Welcome to Text to Speech. Type any sentence or script here to generate crystal-clear, lifelike spoken audio in seconds.'
  );
  const [selectedVoice, setSelectedVoice] = useState<string>('Kore');
  const [tone, setTone] = useState<string>('Default / Natural');
  const [isMultiSpeaker, setIsMultiSpeaker] = useState<boolean>(false);
  const [speaker1, setSpeaker1] = useState<SpeakerConfig>({
    name: 'Alex',
    voice: 'Kore',
  });
  const [speaker2, setSpeaker2] = useState<SpeakerConfig>({
    name: 'Jordan',
    voice: 'Puck',
  });

  // Generation & Player State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentAudioBlob, setCurrentAudioBlob] = useState<Blob | null>(null);
  const [currentDuration, setCurrentDuration] = useState<number>(0);
  const [currentPlayedVoice, setCurrentPlayedVoice] = useState<string>('Kore');
  const [currentPlayedTone, setCurrentPlayedTone] = useState<string>('');
  const [currentTextSnippet, setCurrentTextSnippet] = useState<string>('');

  // History State
  const [history, setHistory] = useState<TTSHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Browser Speech Engine State
  const speechControllerRef = useRef<WebSpeechController>(new WebSpeechController());
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoiceURI, setSelectedBrowserVoiceURI] = useState<string>('');
  const [browserRate, setBrowserRate] = useState<number>(1.0);
  const [browserPitch, setBrowserPitch] = useState<number>(1.0);
  const [browserVolume, setBrowserVolume] = useState<number>(1.0);
  const [isBrowserSpeaking, setIsBrowserSpeaking] = useState<boolean>(false);

  // Load Browser Voices
  useEffect(() => {
    const updateVoices = () => {
      const voices = speechControllerRef.current.getVoices();
      if (voices && voices.length > 0) {
        setBrowserVoices(voices);
        if (!selectedBrowserVoiceURI) {
          const defaultVoice = voices.find((v) => v.default) || voices[0];
          setSelectedBrowserVoiceURI(defaultVoice.voiceURI);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, [selectedBrowserVoiceURI]);

  // Save history to localStorage
  useEffect(() => {
    try {
      // Clean history to avoid storing huge Base64 strings in localStorage if large
      const trimmedHistory = history.slice(0, 30).map((item) => ({
        ...item,
        audioBase64: undefined, // keep lightweight
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    } catch (e) {
      console.warn('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Apply Sample Script
  const handleApplySample = (sample: SampleText) => {
    setText(sample.text);
    if (sample.suggestedVoice) {
      setSelectedVoice(sample.suggestedVoice);
    }
    if (sample.suggestedTone) {
      setTone(sample.suggestedTone);
    }
    if (sample.isMultiSpeaker) {
      setIsMultiSpeaker(true);
    } else {
      setIsMultiSpeaker(false);
    }
    setErrorMessage(null);
  };

  // Convert via Gemini AI
  const handleGenerateGeminiTTS = async () => {
    if (!text.trim()) {
      setErrorMessage('Please enter some text before converting to speech.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voice: selectedVoice,
          tone: tone,
          multiSpeaker: isMultiSpeaker,
          speaker1: isMultiSpeaker ? speaker1 : undefined,
          speaker2: isMultiSpeaker ? speaker2 : undefined,
        }),
      });

      const data: TTSResponse = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to synthesize speech.');
      }

      const audioBlob = base64ToBlob(data.audioBase64, data.mimeType || 'audio/wav');
      const audioUrl = URL.createObjectURL(audioBlob);

      setCurrentAudioBlob(audioBlob);
      setCurrentAudioUrl(audioUrl);
      setCurrentDuration(data.durationSeconds || 0);
      setCurrentPlayedVoice(data.voice || selectedVoice);
      setCurrentPlayedTone(tone);
      setCurrentTextSnippet(text.trim().substring(0, 100));

      // Add to history
      const historyItem: TTSHistoryItem = {
        id: `tts-${Date.now()}`,
        text: text.trim(),
        voice: data.voice || selectedVoice,
        engine: 'gemini',
        audioUrl: audioUrl,
        audioBase64: data.audioBase64,
        durationSeconds: data.durationSeconds || 0,
        createdAt: Date.now(),
        tone: tone,
      };

      setHistory((prev) => [historyItem, ...prev]);
    } catch (err: any) {
      console.error('Generation Error:', err);
      setErrorMessage(
        err.message ||
          'Failed to generate speech. Please check your text or switch to Browser Speech mode.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Browser Speech
  const handleStartBrowserSpeech = () => {
    if (!text.trim()) {
      setErrorMessage('Please enter text to speak.');
      return;
    }

    setErrorMessage(null);
    const selectedVoiceObj =
      browserVoices.find((v) => v.voiceURI === selectedBrowserVoiceURI) || null;

    speechControllerRef.current.speak(text.trim(), {
      voice: selectedVoiceObj,
      rate: browserRate,
      pitch: browserPitch,
      volume: browserVolume,
      onStart: () => setIsBrowserSpeaking(true),
      onEnd: () => setIsBrowserSpeaking(false),
      onError: (err) => {
        console.error('Browser speech error:', err);
        setIsBrowserSpeaking(false);
      },
    });
  };

  const handleStopBrowserSpeech = () => {
    speechControllerRef.current.stop();
    setIsBrowserSpeaking(false);
  };

  // History Actions
  const handlePlayHistoryItem = (item: TTSHistoryItem) => {
    setText(item.text);
    if (item.audioBase64) {
      const blob = base64ToBlob(item.audioBase64, 'audio/wav');
      const url = URL.createObjectURL(blob);
      setCurrentAudioBlob(blob);
      setCurrentAudioUrl(url);
    } else if (item.audioUrl) {
      setCurrentAudioUrl(item.audioUrl);
    }
    setCurrentDuration(item.durationSeconds);
    setCurrentPlayedVoice(item.voice);
    setCurrentPlayedTone(item.tone || '');
    setCurrentTextSnippet(item.text.substring(0, 100));
    setShowHistoryDrawer(false);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <Header
        engineMode={engineMode}
        setEngineMode={setEngineMode}
        historyCount={history.length}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onOpenInfo={() => setShowInfoModal(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Error notification banner */}
        {errorMessage && (
          <div
            id="error-banner"
            className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-300 text-xs sm:text-sm flex items-start gap-3 shadow-lg"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Speech Generation Notice</p>
              <p className="mt-0.5 leading-relaxed text-[#CCCCCC]">{errorMessage}</p>
            </div>
            {engineMode === 'gemini' && (
              <button
                id="switch-to-browser-btn"
                type="button"
                onClick={() => {
                  setEngineMode('browser');
                  setErrorMessage(null);
                }}
                className="px-3 py-1.5 bg-rose-900/40 hover:bg-rose-900/80 border border-rose-800/60 rounded-xl text-xs font-semibold text-rose-200 transition-colors"
              >
                Use Browser Speech
              </button>
            )}
          </div>
        )}

        {/* Top Grid: Text Input Area */}
        <TextInputArea
          text={text}
          setText={setText}
          tone={tone}
          setTone={setTone}
          engineMode={engineMode}
          isGenerating={isGenerating}
          onApplySample={handleApplySample}
          isMultiSpeaker={isMultiSpeaker}
          setIsMultiSpeaker={setIsMultiSpeaker}
        />

        {/* Engine Voice & Tuning Controls */}
        {engineMode === 'gemini' ? (
          <VoiceSelector
            selectedVoice={selectedVoice}
            onSelectVoice={setSelectedVoice}
            isMultiSpeaker={isMultiSpeaker}
            setIsMultiSpeaker={setIsMultiSpeaker}
            speaker1={speaker1}
            setSpeaker1={setSpeaker1}
            speaker2={speaker2}
            setSpeaker2={setSpeaker2}
          />
        ) : (
          <BrowserSpeechControls
            voices={browserVoices}
            selectedVoiceURI={selectedBrowserVoiceURI}
            setSelectedVoiceURI={setSelectedBrowserVoiceURI}
            rate={browserRate}
            setRate={setBrowserRate}
            pitch={browserPitch}
            setPitch={setBrowserPitch}
            volume={browserVolume}
            setVolume={setBrowserVolume}
          />
        )}

        {/* Convert / Generate Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#141414] border border-[#222222] shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              {engineMode === 'gemini' ? (
                <Sparkles className="w-5 h-5 text-sky-400" />
              ) : (
                <Laptop className="w-5 h-5 text-sky-400" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                {engineMode === 'gemini'
                  ? 'Gemini Neural Voice Engine'
                  : 'Browser Speech Synthesis Engine'}
              </div>
              <p className="text-xs text-[#888888] font-mono">
                {engineMode === 'gemini'
                  ? `Selected voice: ${isMultiSpeaker ? '2-Speaker Dialogue' : selectedVoice} • 24kHz Studio Audio`
                  : `Real-time client-side speech • ${browserVoices.length} voices ready`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {engineMode === 'gemini' ? (
              <button
                id="generate-speech-btn"
                type="button"
                onClick={handleGenerateGeminiTTS}
                disabled={isGenerating || !text.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-[#1A1A1A] disabled:text-[#555555] disabled:border disabled:border-[#2A2A2A] text-white font-bold text-sm shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all transform active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing Audio...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Convert to Speech</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isBrowserSpeaking ? (
                  <button
                    id="stop-browser-speech-btn"
                    type="button"
                    onClick={handleStopBrowserSpeech}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg transition-all"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop Speaking</span>
                  </button>
                ) : (
                  <button
                    id="start-browser-speech-btn"
                    type="button"
                    onClick={handleStartBrowserSpeech}
                    disabled={!text.trim()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white hover:bg-sky-50 disabled:bg-[#1A1A1A] disabled:text-[#555555] text-black font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Speak Now</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Audio Player for Generated Speech */}
        {currentAudioUrl && (
          <AudioPlayer
            audioUrl={currentAudioUrl}
            audioBlob={currentAudioBlob}
            voiceName={currentPlayedVoice}
            tone={currentPlayedTone}
            duration={currentDuration}
            textSnippet={currentTextSnippet}
          />
        )}
      </main>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        history={history}
        onPlayItem={handlePlayHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Info / Guide Modal */}
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </div>
  );
      }
                
