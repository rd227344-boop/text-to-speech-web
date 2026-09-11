import React from 'react';
import { Volume2, Sparkles, Laptop, History, Info } from 'lucide-react';
import { EngineMode } from '../types';

interface HeaderProps {
  engineMode: EngineMode;
  setEngineMode: (mode: EngineMode) => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  engineMode,
  setEngineMode,
  historyCount,
  onOpenHistory,
  onOpenInfo,
}) => {
  return (
    <header id="app-header" className="border-b border-[#1F1F1F] bg-[#0F0F0F]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white shadow-[0_0_12px_rgba(14,165,233,0.3)]">
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white flex items-center gap-1.5">
                Text to Speech
                <span className="text-sky-500 font-light text-xs">AI</span>
              </h1>
              <p className="text-[11px] text-[#888888] tracking-wide">Neural voice synthesis & tone architecture</p>
            </div>
          </div>

          {/* Quick actions for mobile */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              id="mobile-history-btn"
              onClick={onOpenHistory}
              className="p-2 rounded-xl bg-[#141414] border border-[#222222] text-[#CCCCCC] hover:text-white relative"
              title="Speech History"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-sky-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Engine Switcher and Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-[#141414] border border-[#222222] text-xs font-medium">
            <button
              id="mode-gemini-btn"
              onClick={() => setEngineMode('gemini')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                engineMode === 'gemini'
                  ? 'bg-[#1F1F1F] text-white border border-sky-500/40 shadow-sm font-semibold'
                  : 'text-[#888888] hover:text-[#CCCCCC]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Neural Voice</span>
            </button>
            <button
              id="mode-browser-btn"
              onClick={() => setEngineMode('browser')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                engineMode === 'browser'
                  ? 'bg-[#1F1F1F] text-white border border-sky-500/40 shadow-sm font-semibold'
                  : 'text-[#888888] hover:text-[#CCCCCC]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5 text-sky-400" />
              <span>Browser Speech</span>
            </button>
          </div>

          {/* History Button (Desktop) */}
          <button
            id="desktop-history-btn"
            onClick={onOpenHistory}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#141414] border border-[#222222] text-xs font-medium text-[#CCCCCC] hover:text-white hover:bg-[#1A1A1A] hover:border-[#2A2A2A] transition-colors relative"
          >
            <History className="w-3.5 h-3.5 text-[#888888]" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-full text-[10px] font-mono font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* About / Guide Button */}
          <button
            id="app-info-btn"
            onClick={onOpenInfo}
            className="p-2 rounded-xl bg-[#141414] border border-[#222222] text-[#888888] hover:text-white hover:bg-[#1A1A1A] hover:border-[#2A2A2A] transition-colors"
            title="About & Guide"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
