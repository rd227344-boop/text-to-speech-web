import React, { useState } from 'react';
import { Clipboard, Trash2, BookOpen, Wand2, Sparkles, MessageSquare } from 'lucide-react';
import { SAMPLE_TEXTS, TONE_OPTIONS } from '../data/voices';
import { SampleText, EngineMode } from '../types';

interface TextInputAreaProps {
  text: string;
  setText: (text: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  engineMode: EngineMode;
  isGenerating: boolean;
  onApplySample: (sample: SampleText) => void;
  isMultiSpeaker: boolean;
  setIsMultiSpeaker: (val: boolean) => void;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({
  text,
  setText,
  tone,
  setTone,
  engineMode,
  isGenerating,
  onApplySample,
  isMultiSpeaker,
  setIsMultiSpeaker,
}) => {
  const [showSamplesMenu, setShowSamplesMenu] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setText(clipboardText);
      }
    } catch (err) {
      console.warn('Clipboard read permission denied or unavailable');
    }
  };

  const handleClear = () => {
    setText('');
  };

  const handleInsertDialogueTemplate = () => {
    setIsMultiSpeaker(true);
    setText(
      `Alex: Hello Jordan, have you listened to the new speech model output?\nJordan: Yes, the intonation and emotional depth sound genuinely human!`
    );
  };

  return (
    <div id="text-input-card" className="bg-[#141414] border border-[#222222] rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
      {/* Header bar of textarea */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#888888] font-bold">Input Text Script</h2>
          <div className="h-4 w-px bg-[#222222]"></div>
          <span className="text-[11px] font-mono tracking-wider text-[#666666]">
            {charCount.toLocaleString()} chars • {wordCount} words
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Samples Dropdown */}
          <div className="relative">
            <button
              id="samples-dropdown-btn"
              type="button"
              onClick={() => setShowSamplesMenu(!showSamplesMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-xs font-medium text-[#CCCCCC] hover:text-white transition-colors border border-[#2A2A2A]"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Sample Scripts</span>
            </button>

            {showSamplesMenu && (
              <div
                id="samples-dropdown-menu"
                className="absolute right-0 top-full mt-2 w-80 bg-[#141414] border border-[#222222] rounded-2xl shadow-2xl z-40 py-2 overflow-hidden backdrop-blur-md"
              >
                <div className="px-4 py-2 text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em] border-b border-[#1F1F1F]">
                  Preset Script Library
                </div>
                {SAMPLE_TEXTS.map((sample) => (
                  <button
                    key={sample.id}
                    id={`sample-item-${sample.id}`}
                    type="button"
                    onClick={() => {
                      onApplySample(sample);
                      setShowSamplesMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-[#1A1A1A] flex flex-col gap-1 transition-colors border-b border-[#1A1A1A]/50 last:border-0"
                  >
                    <span className="font-medium text-white flex items-center justify-between">
                      {sample.title}
                      <span className="text-[10px] text-sky-400 font-mono px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A]">
                        {sample.category}
                      </span>
                    </span>
                    <span className="text-[11px] text-[#777777] line-clamp-1">{sample.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dialogue button (Gemini only) */}
          {engineMode === 'gemini' && (
            <button
              id="dialogue-template-btn"
              type="button"
              onClick={handleInsertDialogueTemplate}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                isMultiSpeaker
                  ? 'bg-sky-500/10 border-sky-500/40 text-sky-300'
                  : 'bg-[#1A1A1A] border-[#2A2A2A] text-[#CCCCCC] hover:text-white hover:bg-[#222222]'
              }`}
              title="Insert a two-person conversation format"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Dialogue</span>
            </button>
          )}

          {/* Paste button */}
          <button
            id="paste-text-btn"
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-xs font-medium text-[#CCCCCC] hover:text-white transition-colors border border-[#2A2A2A]"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5 text-[#888888]" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {/* Clear button */}
          {text.length > 0 && (
            <button
              id="clear-text-btn"
              type="button"
              onClick={handleClear}
              className="text-xs text-sky-400 hover:text-sky-300 transition-colors uppercase tracking-wider font-bold px-2 py-1"
              title="Clear workspace"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative group">
        <textarea
          id="speech-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isGenerating}
          rows={6}
          placeholder="Paste or type your script here..."
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 sm:p-6 text-[#E0E0E0] placeholder-[#444444] focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all font-sans text-base sm:text-lg leading-relaxed resize-y min-h-[150px] max-h-[420px]"
        />

        {/* Bottom tags */}
        <div className="absolute bottom-4 right-5 hidden sm:flex items-center gap-2 pointer-events-none">
          <div className="px-3 py-1 bg-[#141414]/90 rounded-full border border-[#2A2A2A] text-[10px] uppercase font-mono tracking-wider text-[#888888]">
            {engineMode === 'gemini' ? '24kHz Studio' : 'Web Speech'}
          </div>
          <div className="px-3 py-1 bg-[#141414]/90 rounded-full border border-[#2A2A2A] text-[10px] uppercase font-mono tracking-wider text-[#888888]">
            TTS-V3
          </div>
        </div>
      </div>

      {/* Tone selection and multi-speaker indicators */}
      {engineMode === 'gemini' && !isMultiSpeaker && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] uppercase tracking-widest text-[#666666] font-bold">Vocal Tone & Style</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {TONE_OPTIONS.map((t) => (
              <button
                key={t.id}
                id={`tone-option-${t.id.replace(/\s+/g, '-').toLowerCase()}`}
                type="button"
                onClick={() => setTone(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  tone === t.id
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/40 shadow-sm'
                    : 'bg-[#1A1A1A] text-[#888888] hover:text-[#CCCCCC] border border-[#222222] hover:border-[#2A2A2A]'
                }`}
                title={t.description}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isMultiSpeaker && (
        <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-xs text-[#CCCCCC] flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)] shrink-0 mt-1.5"></div>
          <p className="leading-relaxed">
            <strong className="text-white font-medium">Dialogue Script Active:</strong> Label each line with speaker prefixes (such as{' '}
            <code className="bg-[#141414] px-1.5 py-0.5 rounded border border-[#2A2A2A] font-mono text-sky-400">Alex: ...</code> and{' '}
            <code className="bg-[#141414] px-1.5 py-0.5 rounded border border-[#2A2A2A] font-mono text-sky-400">Jordan: ...</code>) for alternating dual-voice synthesis.
          </p>
        </div>
      )}
    </div>
  );
};
