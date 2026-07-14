import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { extractYoutubeId } from '../utils';

// Extend window interface for YouTube API
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface AudioPlayerProps {
  musicType: 'youtube' | 'mp3' | 'none';
  musicUrl: string;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  friendName: string;
}

export default function AudioPlayer({
  musicType,
  musicUrl,
  isPlaying,
  setIsPlaying,
  friendName
}: AudioPlayerProps) {
  const [volume, setVolume] = useState<number>(50);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isApiReady, setIsApiReady] = useState<boolean>(false);
  const [songTitle, setSongTitle] = useState<string>('FAV BIRTHDAY MIX');

  // References
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytContainerId = 'youtube-hidden-player';

  // 1. Handle YouTube API Loading
  useEffect(() => {
    if (musicType !== 'youtube' || !musicUrl) return;

    const loadYoutubeApi = () => {
      // Check if already loaded
      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        initYoutubePlayer();
        return;
      }

      // If not loaded, inject script
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Set global callback
      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    };

    loadYoutubeApi();

    // If API is already ready in subsequent renders, initialize
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      initYoutubePlayer();
    }
  }, [musicType, musicUrl]);

  // 2. Initialize YouTube Player
  const initYoutubePlayer = () => {
    const videoId = extractYoutubeId(musicUrl);
    if (!videoId) return;

    // Destroy existing player if any
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch (e) {
        console.error('Error destroying YT player:', e);
      }
      ytPlayerRef.current = null;
    }

    try {
      ytPlayerRef.current = new window.YT.Player(ytContainerId, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            if (isPlaying) {
              event.target.playVideo();
            }
            // Extract title if available
            try {
              const data = event.target.getVideoData();
              if (data && data.title) {
                setSongTitle(data.title);
              }
            } catch (err) {}
          },
          onStateChange: (event: any) => {
            // If ended, loop it
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    } catch (e) {
      console.error('Failed to create YouTube player:', e);
    }
  };

  // Re-initialize YT player when video ID or ready status changes
  useEffect(() => {
    if (isApiReady && musicType === 'youtube' && musicUrl) {
      initYoutubePlayer();
    }
  }, [isApiReady, musicUrl]);

  // 3. Handle HTML5 Audio Player
  useEffect(() => {
    if (musicType !== 'mp3' || !musicUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    // Initialize HTML5 Audio
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = volume / 100;
    audioRef.current = audio;

    setSongTitle('FAVORITE BIRTHDAY SONG');

    if (isPlaying) {
      audio.play().catch(e => {
        console.log('Autoplay blocked by browser. User interaction needed.', e);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [musicType, musicUrl]);

  // 4. Coordinate Playback State with isPlaying Prop
  useEffect(() => {
    if (musicType === 'youtube' && ytPlayerRef.current) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.playVideo();
        } else {
          ytPlayerRef.current.pauseVideo();
        }
      } catch (err) {}
    } else if (musicType === 'mp3' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, musicType]);

  // 5. Volume and Mute adjustments
  useEffect(() => {
    const targetVolume = isMuted ? 0 : volume;
    if (musicType === 'youtube' && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.setVolume(targetVolume);
      } catch (e) {}
    } else if (musicType === 'mp3' && audioRef.current) {
      audioRef.current.volume = targetVolume / 100;
    }
  }, [volume, isMuted, musicType]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  if (musicType === 'none') {
    return null;
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-amber-50 comic-border p-3 rounded-lg comic-shadow paper-overlay flex flex-col gap-2 select-none relative overflow-hidden">
      {/* Hidden container for YouTube Iframe player */}
      <div id={ytContainerId} className="absolute left-0 top-0 -z-10 opacity-0 pointer-events-none w-0 h-0"></div>

      {/* Cassette Top Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-1.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono">
          <Music className="w-4 h-4 text-red-600 animate-pulse" />
          <span className="bg-red-600 text-white px-1 py-0.5 comic-border-thin text-[10px] uppercase font-comic-loud tracking-wider">
            HQ Audio
          </span>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 font-bold">
          {isPlaying ? '● PLAYING' : '■ STOPPED'}
        </div>
      </div>

      {/* Mixtape Cassette Graphic */}
      <div className="bg-zinc-800 rounded p-2.5 comic-border-thin flex flex-col gap-2 relative">
        {/* Handwritten Label Tape */}
        <div className="bg-white comic-border-thin px-2 py-1 text-center font-comic-hand text-sm text-zinc-800 rotate-[-1deg] shadow-sm truncate font-bold">
          📼 {friendName}'s FAV BIRTHDAY TRACK
        </div>

        {/* Cassette Reels Window */}
        <div className="bg-zinc-900 comic-border-thin py-1 px-4 rounded flex items-center justify-between w-3/4 mx-auto gap-4 relative">
          {/* Left Wheel */}
          <div className="relative">
            <div 
              className={`w-10 h-10 rounded-full border-4 border-dashed border-zinc-500 bg-zinc-700 flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
            >
              <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-zinc-500"></div>
            </div>
          </div>

          {/* Cassette Center Window label */}
          <div className="flex-1 text-center text-[10px] font-mono text-amber-500 font-semibold uppercase tracking-tight overflow-hidden truncate max-w-[80px]">
            {songTitle.substring(0, 15)}...
          </div>

          {/* Right Wheel */}
          <div className="relative">
            <div 
              className={`w-10 h-10 rounded-full border-4 border-dashed border-zinc-500 bg-zinc-700 flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
            >
              <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-zinc-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-3 mt-1 px-1">
        {/* Play/Pause Trigger */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          id="btn-play-pause"
          className={`p-2.5 rounded-md comic-border-thin comic-shadow cursor-pointer transition-all active:translate-x-1 active:translate-y-1 active:shadow-none hover:scale-105 flex items-center justify-center ${
            isPlaying ? 'bg-amber-400 text-black' : 'bg-red-500 text-white'
          }`}
          title={isPlaying ? 'Pause' : 'Play Favorite Song'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        {/* Volume Dial and Icon */}
        <div className="flex-1 flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 hover:text-red-600 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-zinc-600" /> : <Volume2 className="w-4 h-4 text-zinc-800" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full accent-red-600 cursor-pointer h-1 bg-zinc-300 rounded-lg appearance-none"
            title="Adjust volume"
          />
        </div>
      </div>
    </div>
  );
}
