'use client';

import { useEffect, useState } from 'react';

const TIMER_TYPES = {
  focus: 30 * 60,
  break: 5 * 60,
  rest: 15 * 60,
};

export default function Timer() {
  const [mode, setMode] = useState<'focus' | 'break' | 'rest'>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_TYPES[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState({ x: 900, y: 90 }); // default spot

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    setTimeLeft(TIMER_TYPES[mode]);
    setIsRunning(false);
  }, [mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Drag logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = position;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setPosition({ x: x + dx, y: y + dy });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: 'grab',
      }}
      className="bg-gray-800 rounded-xl p-6 shadow-md w-full max-w-md select-none"
    >
      {/* Tabs */}
      <div className="flex justify-around mb-4 text-white">
        {(['focus', 'break', 'rest'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-t-md ${
              mode === m ? 'bg-gray-900 font-bold' : 'bg-gray-700'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="text-5xl font-mono text-center mb-4">
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(TIMER_TYPES[mode]);
          }}
          className="text-white hover:text-gray-300"
        >
          🔄
        </button>
      </div>
    </div>
  );
}