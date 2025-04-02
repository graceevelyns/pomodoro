'use client';

import { useEffect, useState } from 'react';

const alertAudio = typeof Audio !== 'undefined' ? new Audio('/sound/chime.mp3') : null;

const TIMER_TYPES = {
  focus: 30 * 60,
  break: 5 * 60,
  rest: 15 * 60,
};

export default function Timer() {
  const [mode, setMode] = useState<'focus' | 'break' | 'rest'>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_TYPES[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState({ x: 900, y: 90 });

  const [bgAudio, setBgAudio] = useState<HTMLAudioElement | null>(null);
  const [bgTrack, setBgTrack] = useState('/sound/lofi.mp3');
  const [isBgPlaying, setIsBgPlaying] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customEmbed, setCustomEmbed] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            alertAudio?.play();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
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

  useEffect(() => {
    if (bgAudio) bgAudio.pause();

    if (!bgTrack) return;

    const newAudio = new Audio(bgTrack);
    newAudio.loop = true;
    newAudio.volume = 0.5;
    setBgAudio(newAudio);

    if (isBgPlaying) {
      newAudio.play().catch(() => console.warn('Audio playback failed'));
    }
  }, [bgTrack]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const processAudioLink = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      const videoId = videoIdMatch?.[1];
      if (videoId) {
        setCustomEmbed(`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1`);
        setBgTrack('');
        return;
      }
    }

    if (url.includes('spotify.com')) {
      const embedUrl = url.replace('/track/', '/embed/track/');
      setCustomEmbed(embedUrl);
      setBgTrack('');
      return;
    }

    setCustomEmbed(null);
    setBgTrack(url);
    setIsBgPlaying(true);
  };

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
      className="bg-zinc-900 text-white rounded-xl p-6 shadow-xl w-full max-w-md select-none"
    >
      {/* Tabs */}
      <div className="flex justify-around mb-4">
        {(['focus', 'break', 'rest'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-md transition ${
              mode === m
                ? 'bg-zinc-800 font-semibold'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="text-6xl font-mono text-center mb-6 tracking-wider">
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(TIMER_TYPES[mode]);
          }}
          className="text-white hover:text-gray-300 text-xl"
        >
          🔄
        </button>
      </div>

      {/* Ambient Sound Section */}
      <div className="mt-6 text-sm text-zinc-300">
        <div className="mb-2 font-semibold">Ambient Sound</div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {[
            { label: 'Lofi', src: '/sound/lofi.mp3' },
            { label: 'Rain', src: '/sound/rain.mp3' },
            { label: 'Cafe', src: '/sound/cafe.mp3' },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => {
                setCustomEmbed(null);
                setBgTrack(s.src);
                setIsBgPlaying(true);
              }}
              className="bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
            >
              {s.label}
            </button>
          ))}

          <button
            onClick={() => {
              bgAudio?.pause();
              setIsBgPlaying(false);
              setCustomEmbed(null);
            }}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            Mute
          </button>
        </div>

        {/* Custom link input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Paste YouTube / Spotify / .mp3 link..."
            className="flex-1 px-2 py-1 bg-zinc-800 text-white border border-zinc-600 rounded"
          />
          <button
            onClick={() => {
              if (customUrl.trim()) processAudioLink(customUrl.trim());
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Set
          </button>
        </div>
      </div>

      {/* Embed player for YouTube / Spotify */}
      {customEmbed && (
        <div className="mt-4">
          {customEmbed.includes('youtube') ? (
            <iframe
              width="100%"
              height="80"
              src={customEmbed}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded"
            ></iframe>
          ) : (
            <iframe
              src={customEmbed}
              width="100%"
              height="80"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="rounded"
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
}