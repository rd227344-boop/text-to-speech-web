import React from 'react';
import { X, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="info-modal-card"
        className="w-full max-w-lg bg-[#0F0F0F] border border-[#222222] rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Speech Synthesis Guide</h3>
              <p className="text-xs text-[#888888]">Architecture & neural voice controls</p>
            </div>
          </div>
          <button
            id="close-info-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-transparent hover:border-[#2A2A2A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 text-xs text-[#CCCCCC] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Gemini Neural Voice Engine</span>
            </div>
            <p className="text-[#888888]">
              Powered by Google's state-of-the-art speech synthesis model (<code className="text-sky-400 font-mono">gemini-3.1-flash-tts-preview</code>) with acoustic intonation, expressive realism, and crystal-clear 24kHz audio.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <h4 className="font-bold text-[#888888] text-[11px] uppercase tracking-[0.2em]">Features & Controls</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Expressive Studio Voices:</strong> Kore, Puck, Charon, Fenrir, Zephyr, and Aoede.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Emotion & Tone Directing:</strong> Natural, Cheerful, Calm, Storyteller, or Energetic deliveries.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Multi-Speaker Dialogue:</strong> Assign distinct voice personas to script characters (e.g. <code className="text-sky-400 font-mono">Alex:</code> and <code className="text-sky-400 font-mono">Jordan:</code>).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Master Player & Waveform:</strong> Animated audio waves, variable playback rates (0.75x–2.0x), looping, and uncompressed WAV downloads.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Client-Side Fallback:</strong> Instant local browser speech synthesis with real-time rate, pitch, and voice controls.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#1F1F1F] flex justify-end">
          <button
            id="understand-info-btn"
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-sky-50 text-black rounded-xl text-xs font-bold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
