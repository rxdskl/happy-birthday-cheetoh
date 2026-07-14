import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Eye, Edit3, RefreshCw, Volume2, HelpCircle } from 'lucide-react';
import { ComicConfig, DEFAULT_CONFIG } from './types';
import { decodeComicConfig, encodeComicConfig } from './utils';
import ComicCover from './components/ComicCover';
import ComicPage from './components/ComicPage';
import CreatorTerminal from './components/CreatorTerminal';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  const [config, setConfig] = useState<ComicConfig>(() => {
    // 1. First, check URL hash payload
    const hash = window.location.hash;
    if (hash && hash.includes('card=')) {
      const match = hash.match(/card=([^&]*)/);
      if (match && match[1]) {
        return decodeComicConfig(match[1]);
      }
    }

    // 2. Second, check localStorage autosave fallback
    const saved = localStorage.getItem('marvel_bday_config_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }

    return DEFAULT_CONFIG;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [comicOpened, setComicOpened] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'builder' | 'viewer'>(() => {
    const hash = window.location.hash;
    return (hash && hash.includes('card=')) ? 'viewer' : 'builder';
  });

  // Persist config to localStorage as user edits (autosave)
  useEffect(() => {
    localStorage.setItem('marvel_bday_config_v2', JSON.stringify(config));
  }, [config]);

  // Sync state if hash changes (e.g. user clicks browser back/forward or navigates)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('card=')) {
        const match = hash.match(/card=([^&]*)/);
        if (match && match[1]) {
          setConfig(decodeComicConfig(match[1]));
          setViewMode('viewer');
        }
      } else {
        setViewMode('builder');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenComic = () => {
    setComicOpened(true);
    setIsPlaying(true); // Triggers background music immediately on user click gesture!
  };

  const handleGoBackToCover = () => {
    setComicOpened(false);
  };

  const handleConfigChange = (newConfig: ComicConfig) => {
    setConfig(newConfig);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all panel text, stats, and configurations back to default Avengers script?')) {
      setConfig(DEFAULT_CONFIG);
      localStorage.removeItem('marvel_bday_config_v2');
    }
  };

  return (
    <div className="min-h-screen bg-[#e23636] halftone-pattern flex flex-col font-sans text-white paper-overlay">
      
      {/* Top Bar - Only shown in Workspace Builder mode */}
      {viewMode === 'builder' && (
        <header className="bg-zinc-950 border-b-4 border-black px-4 py-3 sticky top-0 z-40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="bg-red-600 px-3 py-1 font-comic-title text-xl text-white comic-border-thin rotate-[-1deg] tracking-wide">
              MARVEL
            </div>
            <div>
              <h1 className="font-comic-loud text-lg text-yellow-400 tracking-wider leading-none">
                BIRTHDAY STORYBOOK WORKSHOP
              </h1>
              <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-tight mt-0.5">
                Design a custom, music-backed Marvel comic for your friend's birthday!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Direct preview toggle */}
            <button
              onClick={() => {
                const b64 = encodeComicConfig(config);
                window.location.hash = `card=${b64}`;
                setViewMode('viewer');
                setComicOpened(false);
                setIsPlaying(false);
              }}
              className="flex-1 sm:flex-initial px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-comic-title text-xs tracking-wider rounded comic-border-thin shadow cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            >
              <Eye className="w-4 h-4" /> PREVIEW AS FRIEND &rarr;
            </button>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        
        {/* ==================== WORKSPACE BUILDER MODE ==================== */}
        {viewMode === 'builder' && (
          <div className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Configuration panels */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <CreatorTerminal 
                config={config} 
                onChange={handleConfigChange} 
                onReset={handleResetToDefault}
              />
            </div>

            {/* Right side: Live Preview Frame */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-4 items-center justify-center">
              <div className="w-full flex items-center justify-between border-b-2 border-black/30 pb-2">
                <span className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  LIVE PREVIEW: INSTANT CHANGES
                </span>
                <span className="text-[10px] bg-red-600/20 text-red-950 px-2 py-0.5 rounded font-mono font-bold">
                  {comicOpened ? 'STORY PANELS' : 'FRONT COVER'}
                </span>
              </div>

              {/* Simulated Mobile/Desktop comic container */}
              <div className="w-full bg-zinc-950/20 p-4 rounded-xl border-4 border-black backdrop-blur-xs flex items-center justify-center min-h-[500px] bento-shadow">
                <AnimatePresence mode="wait">
                  {!comicOpened ? (
                    <motion.div
                      key="preview-cover"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <ComicCover config={config} onOpen={handleOpenComic} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview-pages"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <ComicPage config={config} onGoBackToCover={handleGoBackToCover} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Music Player Mockup for preview */}
              {config.musicType !== 'none' && (
                <div className="w-full max-w-sm">
                  <div className="text-[10px] text-center font-mono text-zinc-800 uppercase tracking-widest mb-1.5 font-bold">
                    Mixtape Controller (Friend can control music)
                  </div>
                  <AudioPlayer 
                    musicType={config.musicType}
                    musicUrl={config.musicUrl}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    friendName={config.friendName}
                  />
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== THE FULLSCREEN VIEWER MODE (FRIEND'S PERSPECTIVE) ==================== */}
        {viewMode === 'viewer' && (
          <div className="flex-1 border-[12px] border-black m-2 md:m-6 bg-[#e23636] p-4 md:p-8 rounded-none min-h-[calc(100vh-2rem)] flex flex-col justify-start relative select-none">
            
            {/* Top Toolbar for returning to creator/sharing */}
            <div className="absolute top-4 right-4 z-50 flex gap-2">
              <button
                onClick={() => {
                  window.location.hash = '';
                  setViewMode('builder');
                  setIsPlaying(false);
                  setComicOpened(false);
                }}
                className="px-3.5 py-1.5 bg-zinc-950 text-white hover:bg-zinc-800 font-comic-title text-xs tracking-wider uppercase rounded-md comic-border-thin bento-shadow cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" /> Creator Mode
              </button>
            </div>

            {/* Bento Header */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b-8 border-black pb-5 bg-white p-5 bento-shadow-lg text-black mt-10 md:mt-0">
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-tighter text-black">
                  Issue #{config.age} &bull; Special Birthday Edition
                </span>
                <h1 
                  className="text-4xl md:text-6xl lg:text-7xl font-comic-title italic uppercase text-black leading-none mt-1.5"
                  style={{ textShadow: '4px 4px 0px #fde047' }}
                >
                  HBD: {config.friendName.toUpperCase()}
                </h1>
              </div>
              <div className="flex flex-col items-end mt-4 md:mt-0 w-full md:w-auto shrink-0">
                <div className="bg-black text-white px-4 py-1 text-xl md:text-2xl font-bold italic tracking-wide uppercase">
                  {config.age} YEARS HEROIC
                </div>
                <span className="text-zinc-600 font-extrabold text-[10px] uppercase tracking-wider mt-1 block">
                  Approved by the Birthday Code
                </span>
              </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full max-w-7xl mx-auto flex-1">
              
              {/* CELL 1: The Main Spotlight Comic Stage (col-span-8) */}
              <div className="lg:col-span-8 flex flex-col bg-[#fafaf7] border-4 border-black bento-shadow p-3 md:p-6 relative rounded-none">
                <div className="absolute -top-3 left-4 bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 border-2 border-black uppercase tracking-widest z-20">
                  Active Mission Intel
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {!comicOpened ? (
                      <motion.div
                        key="viewer-cover"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="w-full"
                      >
                        <ComicCover config={config} onOpen={handleOpenComic} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="viewer-pages"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="w-full"
                      >
                        <ComicPage config={config} onGoBackToCover={handleGoBackToCover} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT SIDE Bento Panels Stack (col-span-4) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* CELL 2: Mutant Attributes & Stats (Yellow background) */}
                <div className="bg-[#fde047] border-4 border-black bento-shadow p-5 text-black flex flex-col justify-between relative min-h-[220px]">
                  <div className="absolute -top-3 left-4 bg-black text-[#fde047] text-[10px] font-mono font-bold px-2 py-0.5 border-2 border-[#fde047] uppercase tracking-widest">
                    S.H.I.E.L.D Dossier
                  </div>
                  <div>
                    <h3 className="font-comic-title text-2xl tracking-wide text-black uppercase mb-2">
                      Mutant Intel
                    </h3>
                    <p className="font-comic-hand font-extrabold text-sm leading-relaxed uppercase border-b-2 border-black pb-2 mb-4">
                      "{config.panel2.description}"
                    </p>
                    <div className="flex flex-col gap-2.5">
                      {config.panel2.stats.slice(0, 3).map((stat, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-bold font-mono">
                          <span className="uppercase">{stat.name}</span>
                          <span className="font-black bg-black text-white px-2 py-0.5 text-[10px]">{stat.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t-2 border-black flex items-center justify-between text-[10px] font-bold font-mono">
                    <span>PRIMARY: {config.panel2.powerName.toUpperCase()}</span>
                    <span className="text-red-700 font-extrabold">STATUS: LEGENDARY</span>
                  </div>
                </div>

                {/* CELL 3: Dynamic Speech Quote Soundbite (White background) */}
                <div className="bg-white border-4 border-black bento-shadow p-5 text-black flex flex-col justify-between relative min-h-[160px] halftone-pattern-light">
                  <div className="absolute -top-3 left-4 bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 border-2 border-black uppercase tracking-widest">
                    Soundbite
                  </div>
                  <div className="pt-2">
                    <p className="font-comic-hand font-extrabold text-sm leading-relaxed text-zinc-900 uppercase">
                      "{comicOpened ? config.panel3.bubbleText : config.panel1.bubbleText}"
                    </p>
                  </div>
                  <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase text-right mt-4">
                    &mdash; {config.friendName.toUpperCase()}
                  </div>
                </div>

                {/* CELL 4: Background Song Player (Deep blue background) */}
                {config.musicType !== 'none' && (
                  <div className="bg-[#005a9c] border-4 border-black bento-shadow p-5 text-white flex flex-col justify-between relative min-h-[180px]">
                    <div className="absolute -top-3 left-4 bg-[#fde047] text-black text-[10px] font-mono font-bold px-2 py-0.5 border-2 border-black uppercase tracking-widest">
                      Cassette Mixtape
                    </div>
                    <div>
                      <h4 className="font-comic-loud text-xl tracking-wider text-yellow-300 uppercase mb-2">
                        THE BIRTHDAY TRACK
                      </h4>
                      <p className="text-xs font-mono text-zinc-200 uppercase leading-snug">
                        Listen to the vintage comic-theme soundtrack curated for this celebration!
                      </p>
                    </div>
                    <div className="mt-4">
                      <AudioPlayer 
                        musicType={config.musicType}
                        musicUrl={config.musicUrl}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        friendName={config.friendName}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* CELL 5: Birthday Reward Mission Link (Bottom strip) */}
            {config.endButtonUrl && (
              <div className="mt-8 bg-black border-4 border-black bento-shadow p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-7xl mx-auto">
                <div className="flex flex-col text-center md:text-left">
                  <span className="text-[#fde047] font-comic-loud text-2xl tracking-wider uppercase">
                    Mission Completed!
                  </span>
                  <p className="text-xs font-mono text-zinc-400 uppercase tracking-wide mt-1">
                    Unmask the exclusive birthday surprise from your team
                  </p>
                </div>
                <a
                  href={config.endButtonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white font-comic-title text-lg tracking-wider border-2 border-white bento-shadow uppercase transition-all duration-200 cursor-pointer text-center whitespace-nowrap"
                  style={{ textShadow: '1px 1px 0px #000' }}
                >
                  {config.endButtonText || 'CLAIM PRESENT'} &rarr;
                </a>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Simple Footer info */}
      <footer className="bg-zinc-950 border-t-4 border-black py-2.5 px-4 text-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider shrink-0">
        MARVEL &copy; 2026 COMIC CARDS INC. DESIGNED SECURELY IN THE WORKSPACE.
      </footer>

    </div>
  );
}
