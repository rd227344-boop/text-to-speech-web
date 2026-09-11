import React, { useEffect, useState } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  barCount = 28,
}) => {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 15)
  );

  useEffect(() => {
    if (!isPlaying) {
      setHeights(Array.from({ length: barCount }, () => 15));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, (_, index) => {
          // Generate a smooth wave-like variation
          const base = 20 + Math.sin(Date.now() / 150 + index * 0.4) * 25;
          const randomJitter = Math.random() * 45;
          return Math.min(100, Math.max(15, Math.floor(base + randomJitter)));
        })
      );
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className="flex items-center justify-center gap-[3px] h-10 px-2 w-full overflow-hidden">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-75 ${
            isPlaying
              ? 'bg-gradient-to-t from-sky-600 via-sky-400 to-sky-200 shadow-[0_0_8px_rgba(14,165,233,0.4)]'
              : 'bg-[#222222]'
          }`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
};
