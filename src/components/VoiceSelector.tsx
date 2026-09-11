import React from 'react';
import { Check, Mic, Users } from 'lucide-react';
import { GEMINI_VOICES } from '../data/voices';
import { SpeakerConfig } from '../types';

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  isMultiSpeaker: boolean;
  setIsMultiSpeaker: (val: boolean) => void;
  speaker1: SpeakerConfig;
  setSpeaker1: (config: SpeakerConfig) => void;
  speaker2: SpeakerConfig;
  setSpeaker2: (config: SpeakerConfig) => void;
  onPreviewVoice?: (voiceId: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  isMultiSpeaker,
  setIsMultiSpeaker,
  speaker1,
  setSpeaker1,
  speaker2,
  setSpeaker2,
}) => {
  return (
    <div id="voice-selector-card" className="bg-[#141414] border border-[#222222] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-sky-400" />
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#888888] font-bold">Neural Voice Architecture</h2>
        </div>

        {/* Multi-speaker toggle */}
        <button
          id="toggle-multi-speaker-btn"
          type="button"
          onClick={() => setIsMultiSpeaker(!isMultiSpeaker)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            isMultiSpeaker
              ? 'bg-sky-500/10 text-sky-300 border-sky-500/40'
              : 'bg-[#1A1A1A] text-[#888888] hover:text-white border-[#2A2A2A] hover:bg-[#222222]'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span>{isMultiSpeaker ? 'Single Voice Mode' : '2-Speaker Dialogue'}</span>
        </button>
      </div>

      {!isMultiSpeaker ? (
        /* Single Voice Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {GEMINI_VOICES.map((v) => {
            const isSelected = selectedVoice === v.id;
            return (
              <button
                key={v.id}
                id={`voice-card-${v.id.toLowerCase()}`}
                type="button"
                onClick={() => onSelectVoice(v.id)}
                className={`relative flex flex-col text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-[#1A1A1A] border-sky-500/70 shadow-[0_0_15px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/40'
                    : 'bg-[#1A1A1A] border-[#222222] hover:border-[#333333] hover:bg-[#1E1E1E]'
                }`}
              >
                {/* Top Row: Name, Gender & Selected Indicator */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2.5">
                    {isSelected ? (
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[#333333]"></div>
                    )}
                    <span className="font-medium text-sm text-white">{v.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#141414] border border-[#2A2A2A] font-mono text-[#888888]">
                      {v.gender}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Tone badge */}
                <span className="text-xs text-sky-400 font-mono mb-1.5">{v.tone}</span>

                {/* Description */}
                <p className="text-xs text-[#888888] line-clamp-2 leading-relaxed mb-3">{v.description}</p>

                {/* Best for footer */}
                <div className="mt-auto pt-2.5 border-t border-[#222222] text-[10px] text-[#666666] font-mono flex items-center justify-between">
                  <span>Target:</span>
                  <span className="text-[#999999] truncate ml-1">{v.recommendedFor}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* Multi-Speaker Dialogue Setup */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Speaker 1 Card */}
          <div className="p-5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">Speaker 1</span>
              </div>
              <span className="text-[10px] font-mono text-[#666666]">PRIMARY VOICE</span>
            </div>

            <div>
              <label htmlFor="speaker1-name-input" className="block text-[11px] uppercase tracking-wider text-[#888888] font-bold mb-1.5">
                Speaker Label in Script
              </label>
              <input
                id="speaker1-name-input"
                type="text"
                value={speaker1.name}
                onChange={(e) => setSpeaker1({ ...speaker1, name: e.target.value })}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-sky-500/60"
                placeholder="e.g. Alex"
              />
            </div>

            <div>
              <label htmlFor="speaker1-voice-select" className="block text-[11px] uppercase tracking-wider text-[#888888] font-bold mb-1.5">
                Assigned Voice Profile
              </label>
              <select
                id="speaker1-voice-select"
                value={speaker1.voice}
                onChange={(e) => setSpeaker1({ ...speaker1, voice: e.target.value })}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500/60 cursor-pointer"
              >
                {GEMINI_VOICES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-[#141414] text-white">
                    {v.name} ({v.gender} - {v.tone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Speaker 2 Card */}
          <div className="p-5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">Speaker 2</span>
              </div>
              <span className="text-[10px] font-mono text-[#666666]">SECONDARY VOICE</span>
            </div>

            <div>
              <label htmlFor="speaker2-name-input" className="block text-[11px] uppercase tracking-wider text-[#888888] font-bold mb-1.5">
                Speaker Label in Script
              </label>
              <input
                id="speaker2-name-input"
                type="text"
                value={speaker2.name}
                onChange={(e) => setSpeaker2({ ...speaker2, name: e.target.value })}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#555555] focus:outline-none focus:border-sky-500/60"
                placeholder="e.g. Jordan"
              />
            </div>

            <div>
              <label htmlFor="speaker2-voice-select" className="block text-[11px] uppercase tracking-wider text-[#888888] font-bold mb-1.5">
                Assigned Voice Profile
              </label>
              <select
                id="speaker2-voice-select"
                value={speaker2.voice}
                onChange={(e) => setSpeaker2({ ...speaker2, voice: e.target.value })}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500/60 cursor-pointer"
              >
                {GEMINI_VOICES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-[#141414] text-white">
                    {v.name} ({v.gender} - {v.tone})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
