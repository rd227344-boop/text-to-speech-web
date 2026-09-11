import React from 'react';
import { X, Play, Trash2, Download, Clock, Volume2, Sparkles } from 'lucide-react';
import { TTSHistoryItem } from '../types';
import { formatTime, downloadAudioFile } from '../utils/audio';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: TTSHistoryItem[];
  onPlayItem: (item: TTSHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onPlayItem,
  onDeleteItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="history-drawer-panel"
        className="w-full max-w-md bg-[#0F0F0F] border-l border-[#1F1F1F] h-full flex flex-col shadow-2xl p-6 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Speech Generation History</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888888]">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                id="clear-all-history-btn"
                type="button"
                onClick={onClearHistory}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium px-2.5 py-1 rounded-lg hover:bg-sky-500/10 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              id="close-history-drawer-btn"
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#888888] hover:text-white hover:bg-[#1A1A1A] border border-transparent hover:border-[#2A2A2A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 text-center text-[#555555] gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-[#141414] border border-[#222222] flex items-center justify-center text-[#444444]">
                <Volume2 className="w-6 h-6 stroke-1 text-[#666666]" />
              </div>
              <p className="text-xs font-medium text-[#888888] uppercase tracking-wider">No voice history recorded</p>
              <p className="text-xs text-[#555555] max-w-xs">Generated audio clips will be saved here for instant playback.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                id={`history-item-${item.id}`}
                className="bg-[#141414] border border-[#222222] rounded-xl p-4 flex flex-col gap-2.5 hover:border-[#333333] transition-colors"
              >
                {/* Meta details */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div> {item.voice}
                    </span>
                    {item.tone && item.tone !== 'Default / Natural' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#888888] text-[10px] font-mono">
                        {item.tone}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[#666666]">{formatTime(item.durationSeconds)}</span>
                </div>

                {/* Text excerpt */}
                <p className="text-xs text-[#CCCCCC] line-clamp-2 leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[#1F1F1F]">
                  <span className="text-[10px] font-mono text-[#555555]">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`play-history-btn-${item.id}`}
                      type="button"
                      onClick={() => onPlayItem(item)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-500/30 hover:border-sky-500 text-xs font-semibold transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play</span>
                    </button>

                    {item.audioUrl && (
                      <button
                        id={`download-history-btn-${item.id}`}
                        type="button"
                        onClick={() =>
                          downloadAudioFile(
                            item.audioUrl!,
                            `speech-${item.voice.toLowerCase()}-${item.id}.wav`
                          )
                        }
                        className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-[#1A1A1A] transition-colors"
                        title="Download WAV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      id={`delete-history-btn-${item.id}`}
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-[#666666] hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
