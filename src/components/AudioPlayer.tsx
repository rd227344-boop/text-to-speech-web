import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Repeat,
  Sparkles,
} from 'lucide-react';
import { formatTime, downloadAudioFile } from '../utils/audio';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioPlayerProps {
  audioUrl: string | null;
  audioBlob: Blob | null;
  voiceName: string;
  tone?: string;
  duration?: number;
  textSnippet?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioBlob,
  voiceName,
  tone,
  duration = 0,
  textSnippet,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  // Sync duration when prop updates
  useEffect(() => {
    if (duration > 0) {
      setTotalDuration(duration);
    }
  }, [duration]);

  // Handle URL change
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.playbackRate = playbackRate;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Playback error:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setTotalDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const handleDownload = () => {
    if (audioBlob) {
      const filename = `speech-${voiceName.toLowerCase()}-${Date.now()}.wav`;
      downloadAudioFile(audioBlob, filename);
    } else if (audioUrl) {
      const filename = `speech-${voiceName.toLowerCase()}-${Date.now()}.wav`;
      downloadAudioFile(audioUrl, filename);
    }
  };

  if (!audioUrl) {
    return null;
  }

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div id="audio-player-card" className="bg-[#141414] border border-[#222222] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
      {/* Hidden native audio tag */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        loop={isLooping}
        preload="auto"
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Generated Audio Performance</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A] text-sky-400 border border-[#2A2A2A] font-mono">
                Voice: {voiceName}
              </span>
              {tone && tone !== 'Default / Natural' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A] text-[#888888] border border-[#2A2A2A] font-mono">
                  {tone}
                </span>
              )}
            </div>
            {textSnippet && (
              <p className="text-xs text-[#777777] line-clamp-1 mt-0.5 max-w-lg font-sans">
                &ldquo;{textSnippet}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Download WAV button */}
        <button
          id="download-wav-btn"
          type="button"
          onClick={handleDownload}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-transparent text-sky-400 border border-sky-500/30 hover:bg-sky-500/10 text-xs font-semibold transition-all active:scale-95"
          title="Download audio as uncompressed WAV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audio (.wav)</span>
        </button>
      </div>

      {/* Audio Waveform Visualizer */}
      <div className="bg-[#0A0A0A] rounded-xl p-3.5 border border-[#1F1F1F]">
        <AudioVisualizer isPlaying={isPlaying} barCount={40} />
      </div>

      {/* Scrubber and Timing */}
      <div className="flex flex-col gap-1.5">
        <input
          id="audio-scrubber-bar"
          type="range"
          min="0"
          max={totalDuration || 100}
          step="0.05"
          value={currentTime}
          onChange={handleSeek}
          className="w-full accent-sky-500 cursor-pointer h-1.5 bg-[#222222] rounded-full appearance-none"
        />
        <div className="flex items-center justify-between text-xs text-[#666666] font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Left: Play/Pause/Replay/Loop */}
        <div className="flex items-center gap-2.5">
          {/* Restart */}
          <button
            id="audio-restart-btn"
            type="button"
            onClick={handleRestart}
            className="p-3 rounded-xl bg-[#1A1A1A] hover:bg-[#222222] text-[#888888] hover:text-white border border-[#2A2A2A] transition-colors"
            title="Restart playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Primary Play/Pause Button */}
          <button
            id="audio-play-pause-btn"
            type="button"
            onClick={togglePlayPause}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-white hover:bg-sky-50 text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all transform active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          {/* Loop toggle */}
          <button
            id="audio-loop-toggle-btn"
            type="button"
            onClick={() => setIsLooping(!isLooping)}
            className={`p-3 rounded-xl border transition-colors ${
              isLooping
                ? 'bg-sky-500/10 text-sky-400 border-sky-500/40'
                : 'bg-[#1A1A1A] text-[#888888] hover:text-white border-[#2A2A2A] hover:bg-[#222222]'
            }`}
            title={isLooping ? 'Looping enabled' : 'Looping disabled'}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Playback Speed Buttons */}
        <div className="flex items-center gap-1 bg-[#1A1A1A] p-1 rounded-xl border border-[#2A2A2A]">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#666666] px-2 font-bold">Speed</span>
          {speedOptions.map((speed) => (
            <button
              key={speed}
              id={`speed-btn-${speed.toString().replace('.', '_')}`}
              type="button"
              onClick={() => handleRateChange(speed)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                playbackRate === speed
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-[#888888] hover:text-white hover:bg-[#222222]'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Right: Volume control */}
        <div className="flex items-center gap-2">
          <button
            id="audio-mute-toggle-btn"
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-xl text-[#888888] hover:text-white transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#CCCCCC]" />
            )}
          </button>
          <input
            id="audio-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 accent-sky-500 cursor-pointer h-1 bg-[#222222] rounded-full appearance-none"
          />
        </div>
      </div>
    </div>
  );
};
