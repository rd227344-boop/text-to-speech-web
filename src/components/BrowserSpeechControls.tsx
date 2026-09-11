import React from 'react';
import { Sliders, Volume2, Gauge, Activity } from 'lucide-react';

interface BrowserSpeechControlsProps {
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string;
  setSelectedVoiceURI: (uri: string) => void;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
}

export const BrowserSpeechControls: React.FC<BrowserSpeechControlsProps> = ({
  voices,
  selectedVoiceURI,
  setSelectedVoiceURI,
  rate,
  setRate,
  pitch,
  setPitch,
  volume,
  setVolume,
}) => {
  return (
    <div id="browser-speech-card" className="bg-[#141414] border border-[#222222] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-400" />
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#888888] font-bold">Browser Speech Parameters</h2>
        </div>
        <span className="text-[10px] text-[#888888] bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1 rounded-full font-mono uppercase tracking-wider">
          {voices.length} System Voices Detected
        </span>
      </div>

      {/* Voice Selection */}
      <div>
        <label htmlFor="browser-voice-select" className="block text-[11px] uppercase tracking-wider text-[#888888] font-bold mb-2">
          Select Local System Voice
        </label>
        <select
          id="browser-voice-select"
          value={selectedVoiceURI}
          onChange={(e) => setSelectedVoiceURI(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500/60 font-sans cursor-pointer"
        >
          {voices.length === 0 ? (
            <option value="">Default System Voice</option>
          ) : (
            voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI} className="bg-[#141414] text-white">
                {voice.name} ({voice.lang}) {voice.default ? '★ Default' : ''}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Sliders Grid: Speed, Pitch, Volume */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        {/* Speed / Rate */}
        <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#222222] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888888] flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-sky-400" /> Speed (Rate)
            </span>
            <span className="font-mono text-sky-400 font-bold">{rate.toFixed(1)}x</span>
          </div>
          <input
            id="browser-rate-slider"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer h-1 bg-[#222222] rounded-full appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#666666] font-mono">
            <span>0.5x</span>
            <span>1.0x (Normal)</span>
            <span>2.0x</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#222222] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888888] flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-sky-400" /> Pitch
            </span>
            <span className="font-mono text-sky-400 font-bold">{pitch.toFixed(1)}</span>
          </div>
          <input
            id="browser-pitch-slider"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer h-1 bg-[#222222] rounded-full appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#666666] font-mono">
            <span>0.5 (Low)</span>
            <span>1.0 (Normal)</span>
            <span>2.0 (High)</span>
          </div>
        </div>

        {/* Volume */}
        <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#222222] flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#888888] flex items-center gap-1.5 font-medium">
              <Volume2 className="w-3.5 h-3.5 text-sky-400" /> Volume
            </span>
            <span className="font-mono text-sky-400 font-bold">{Math.round(volume * 100)}%</span>
          </div>
          <input
            id="browser-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer h-1 bg-[#222222] rounded-full appearance-none"
          />
          <div className="flex justify-between text-[10px] text-[#666666] font-mono">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
