import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Shield, Award, Users, Star, Flame } from 'lucide-react';
import { ComicConfig } from '../types';

interface ComicPageProps {
  config: ComicConfig;
  onGoBackToCover: () => void;
}

export default function ComicPage({ config, onGoBackToCover }: ComicPageProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 4;

  const [statsAnimated, setStatsAnimated] = useState<boolean>(false);

  // Trigger stats animation when landing on page 2
  useEffect(() => {
    if (currentPage === 2) {
      setStatsAnimated(false);
      const timer = setTimeout(() => setStatsAnimated(true), 150);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else {
      onGoBackToCover();
    }
  };

  // Helper for sound effect badges
  const renderSoundBadge = (text: string, colorClass: string, rotation: string) => {
    return (
      <motion.div
        whileHover={{ scale: 1.2, rotate: rotation.includes('-') ? '5deg' : '-5deg' }}
        className={`px-4 py-2 font-comic-title text-xl text-white comic-border comic-shadow cursor-pointer tracking-wider uppercase select-none ${colorClass} ${rotation}`}
      >
        {text}
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#fafaf7] comic-border comic-shadow rounded-sm relative overflow-hidden paper-overlay flex flex-col justify-between min-h-[600px] select-none">
      
      {/* Page Header (Issue / Name indicator) */}
      <div className="bg-black text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-mono border-b-4 border-black">
        <span className="font-bold text-yellow-400 font-comic-loud text-xs tracking-wider uppercase">
          {config.heroTitle} ISSUE #{config.age}
        </span>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full border border-white ${
                currentPage === i + 1 ? 'bg-red-500' : 'bg-zinc-700'
              }`}
            ></div>
          ))}
        </div>
        <span className="font-bold text-zinc-300">
          PAGE {currentPage} OF {totalPages}
        </span>
      </div>

      {/* Main Page Area with AnimatePresence */}
      <div className="flex-1 p-4 flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* ==================== PAGE 1: THE ORIGIN ==================== */}
          {currentPage === 1 && (
            <motion.div
              key="page-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between gap-4"
            >
              {/* Narration Box */}
              <div className="bg-yellow-100 p-3 comic-border-thin shadow-sm relative halftone-pattern-light">
                <div className="absolute -top-2 left-4 bg-black text-white text-[9px] font-bold px-2 py-0.5 font-mono uppercase tracking-wider">
                  NARRATION PANEL
                </div>
                <p className="font-comic-hand text-sm leading-relaxed text-zinc-900 font-extrabold uppercase pt-1">
                  {config.panel1.description}
                </p>
              </div>

              {/* Central Action Graphic */}
              <div className="flex-1 flex items-center justify-center relative my-4">
                {config.panel1.image ? (
                  /* Custom Comic Picture Frame */
                  <div className="w-64 h-48 relative border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center rotate-[-1deg]">
                    <img 
                      src={config.panel1.image} 
                      alt="Custom Origin" 
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-yellow-400 border-t-2 border-black text-black py-0.5 text-center font-comic-loud text-xs uppercase tracking-wider">
                      ★ ORIGIN ACCIDENT ★
                    </div>
                  </div>
                ) : (
                  /* Pop art explosion (Wikimedia public domain SVG) */
                  <div className="w-56 h-56 relative flex items-center justify-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Pop_Art_Explosion.svg" 
                      alt="BAM" 
                      className="w-full h-full object-contain absolute select-none"
                      referrerPolicy="no-referrer"
                    />
                    {/* Friend's Name directly on top of the explosion */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 0.95, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="z-10 font-comic-title text-4xl text-center text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-none select-none tracking-wider rotate-[-6deg]"
                      style={{
                        textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000',
                      }}
                    >
                      HAPPY<br />
                      BDAY<br />
                      <span className="text-yellow-300 text-5xl">{config.friendName.toUpperCase()}!</span>
                    </motion.div>
                  </div>
                )}

                {/* Floating Sound effects */}
                <div className="absolute top-2 left-2 rotate-[-15deg] z-10">
                  {renderSoundBadge('POW!', 'bg-red-500', '')}
                </div>
                <div className="absolute bottom-2 right-2 rotate-[15deg] z-10">
                  {renderSoundBadge('KRAK!', 'bg-blue-600', '')}
                </div>
              </div>

              {/* Custom Speech Bubble */}
              <div className="flex justify-end pr-4 mt-2">
                <div className="bg-white p-3 rounded-2xl comic-border-thin max-w-[280px] relative shadow-md bubble-tail-bottom">
                  <p className="font-comic-hand text-xs font-black text-zinc-900 uppercase leading-snug">
                    "{config.panel1.bubbleText}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== PAGE 2: HERO DOSSIER ==================== */}
          {currentPage === 2 && (
            <motion.div
              key="page-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between gap-4"
            >
              {/* S.H.I.E.L.D. Header */}
              <div className="bg-zinc-900 text-white p-2 flex items-center gap-2 comic-border-thin shadow-sm">
                <Shield className="w-5 h-5 text-blue-400" />
                <div className="leading-none flex-1">
                  <div className="text-[9px] text-zinc-400 font-mono font-bold">S.H.I.E.L.D. DOSSIER SECURITY LEVEL 10</div>
                  <div className="font-comic-loud text-xs tracking-wider text-yellow-400 uppercase">SUBJECT: {config.friendName}</div>
                </div>
              </div>

              {/* Special power explanation */}
              <div className="bg-white p-2.5 comic-border-thin shadow-sm font-comic-hand text-xs text-zinc-800 leading-normal uppercase">
                <span className="font-extrabold text-blue-600 block mb-1">🔥 CORE MUTATION:</span>
                "{config.panel2.description}"
              </div>

              {/* Character Power Stats */}
              <div className="bg-amber-50 p-3 comic-border-thin shadow-sm halftone-pattern-light flex-1 flex flex-col gap-2.5 justify-center">
                <div className="text-[10px] font-mono text-zinc-600 font-extrabold border-b border-zinc-300 pb-1 flex items-center justify-between">
                  <span>MUTANT SCAN RESULTS:</span>
                  <span className="text-red-600">GENE EX-99 ACTIVE</span>
                </div>

                <div className={config.panel2.image ? "grid grid-cols-12 gap-3 items-center" : "flex flex-col gap-2"}>
                  {config.panel2.image && (
                    <div className="col-span-5 flex flex-col items-center gap-1.5">
                      <div className="w-full aspect-[3/4] border-2 border-black bg-zinc-950 overflow-hidden relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <img 
                          src={config.panel2.image} 
                          alt="Mutant Mugshot" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-1 left-1 bg-red-600 text-white font-mono text-[7px] font-bold px-1 py-0.2 border border-black uppercase tracking-tighter rotate-[-5deg]">
                          MUTANT EX-99
                        </div>
                      </div>
                      <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase text-center block leading-none">
                        S.H.I.E.L.D. MUGSHOT
                      </span>
                    </div>
                  )}

                  <div className={config.panel2.image ? "col-span-7 flex flex-col gap-1.5 justify-center" : "flex flex-col gap-2"}>
                    {config.panel2.stats.map((stat, idx) => (
                      <div key={idx} className="flex flex-col gap-0.5">
                        <div className="flex justify-between items-center text-[10px] font-bold font-mono">
                          <span className="text-zinc-800 tracking-tight uppercase leading-none">{stat.name}</span>
                          <span className="text-zinc-950 font-black leading-none">{stat.value}%</span>
                        </div>
                        {/* Stat Bar Outer */}
                        <div className="w-full bg-zinc-200 h-2.5 comic-border-thin rounded-sm overflow-hidden p-0.5">
                          {/* Stat Bar Inner with motion */}
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: statsAnimated ? `${stat.value}%` : '0%' }}
                            transition={{ duration: 0.8, delay: idx * 0.08, ease: 'easeOut' }}
                            className={`h-full ${stat.color || 'bg-red-500'} rounded-xs`}
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Power Banner */}
              <div className="bg-red-500 text-white p-1.5 comic-border-thin shadow-xs rotate-[-1deg] text-center font-comic-title text-xs tracking-wider leading-none select-none">
                🔋 PRIMARY POWER: {config.panel2.powerName.toUpperCase()}
              </div>
            </motion.div>
          )}

          {/* ==================== PAGE 3: AVENGERS RECRUIT ==================== */}
          {currentPage === 3 && (
            <motion.div
              key="page-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between gap-4"
            >
              {/* Narration box */}
              <div className="bg-yellow-100 p-2.5 comic-border-thin shadow-sm relative halftone-pattern-light">
                <p className="font-comic-hand text-xs leading-relaxed text-zinc-900 font-extrabold uppercase">
                  {config.panel3.description}
                </p>
              </div>

              {/* Avengers Team Frame */}
              <div className="flex-1 border-4 border-black bg-zinc-950 rounded-xs relative overflow-hidden flex items-center justify-center min-h-[160px]">
                {/* Real Avengers cover or custom picture */}
                <img
                  src={config.panel3.image || "https://upload.wikimedia.org/wikipedia/en/5/5e/TheAvengers1.jpg"}
                  alt={config.panel3.image ? "Custom Team Picture" : "The Avengers"}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top select-none opacity-90 brightness-95"
                />

                {/* Star Overlay graphic */}
                <div className="absolute top-2 left-2 bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[8px] font-mono font-bold comic-border-thin z-10">
                  {config.panel3.image ? '★ THE ULTIMATE TEAM ASSEMBLED ★' : '★ APPROVED TEAM ASSEMBLE ★'}
                </div>

                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-[8px] font-mono rounded z-10">
                  {config.panel3.image ? 'S.H.I.E.L.D. DECLASSIFIED' : 'The Avengers Vol. 1 (1963)'}
                </div>
              </div>

              {/* Captain America & Iron Man welcome speech bubble */}
              <div className="flex justify-start pl-4">
                <div className="bg-white p-3 rounded-2xl comic-border-thin max-w-[280px] relative shadow-md bubble-tail-bottom">
                  <div className="text-[8px] font-mono text-zinc-400 font-bold mb-0.5 uppercase">THE AVENGERS INVITATION:</div>
                  <p className="font-comic-hand text-xs font-black text-zinc-900 uppercase leading-snug">
                    "{config.panel3.bubbleText}"
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== PAGE 4: SPLASH PAGE CELEBRATION ==================== */}
          {currentPage === 4 && (
            <motion.div
              key="page-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between gap-4 text-center items-center py-2"
            >
              {/* Massive Title */}
              <div className="w-full">
                <motion.h2 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl font-comic-title text-red-600 tracking-wide leading-none"
                  style={{
                    textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000',
                  }}
                >
                  {config.panel4.title.toUpperCase()}
                </motion.h2>
                <div className="text-yellow-500 font-comic-loud text-2xl tracking-wider select-none">
                  {config.friendName.toUpperCase()} IS RECRUITED!
                </div>
              </div>

              {/* Custom Splash Image */}
              {config.panel4.image && (
                <div className="w-56 h-32 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex items-center justify-center my-1 rotate-[1deg] shrink-0">
                  <img 
                    src={config.panel4.image} 
                    alt="Custom Celebration" 
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Story conclusion */}
              <div className="bg-yellow-100 p-3.5 comic-border-thin shadow-sm text-center font-comic-hand text-xs font-extrabold uppercase leading-relaxed max-w-[340px] mx-auto halftone-pattern-light">
                {config.panel4.description}
              </div>

              {/* Action Badges in grid */}
              <div className="flex gap-4 items-center justify-center py-1">
                {renderSoundBadge('BOOM!', 'bg-yellow-400 text-black', 'rotate-[-6deg]')}
                {renderSoundBadge('SMASH!', 'bg-red-600 text-white', 'rotate-[6deg]')}
                {renderSoundBadge('BAM!', 'bg-blue-600 text-white', 'rotate-[-12deg]')}
              </div>

              {/* The special customizable user link! */}
              {config.endButtonUrl && (
                <div className="w-full px-4 mt-2">
                  <div className="text-[10px] font-mono font-extrabold text-zinc-600 mb-1.5 uppercase tracking-wider">
                    🎁 EXCLUSIVE COMPLETED MISSION REWARD RECEIVED:
                  </div>
                  <motion.a
                    href={config.endButtonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.06, rotate: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="block w-full py-4 bg-red-600 hover:bg-red-500 text-white font-comic-title text-xl tracking-wider rounded-lg comic-border comic-shadow text-center shadow-lg cursor-pointer leading-tight"
                    style={{
                      textShadow: '1px 1px 0px #000'
                    }}
                  >
                    🚀 {config.endButtonText.toUpperCase()} 🚀
                  </motion.a>
                  <p className="text-[9px] text-zinc-500 font-mono mt-2 uppercase">
                    Links to: {config.endButtonUrl.substring(0, 45)}...
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Comic Page Turn Navigation Buttons */}
      <div className="p-3 bg-zinc-900 border-t-4 border-black flex justify-between gap-4 items-center select-none shrink-0">
        <button
          onClick={handlePrev}
          className="flex-1 px-4 py-2.5 bg-zinc-800 text-white hover:bg-zinc-700 font-comic-title text-sm tracking-wider comic-border-thin cursor-pointer shadow-sm flex items-center justify-center gap-1 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> 
          {currentPage === 1 ? 'COVER' : 'PREV PANEL'}
        </button>

        <div className="text-[10px] font-mono text-zinc-400 font-bold text-center shrink-0 hidden sm:block">
          S.H.I.E.L.D. AGENT INTEL DIRECTIVE
        </div>

        <button
          onClick={currentPage === totalPages ? onGoBackToCover : handleNext}
          className={`flex-1 px-4 py-2.5 font-comic-title text-sm tracking-wider comic-border-thin cursor-pointer shadow-sm flex items-center justify-center gap-1 transition-all ${
            currentPage === totalPages 
              ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
              : 'bg-red-600 text-white hover:bg-red-500'
          }`}
        >
          {currentPage === totalPages ? 'START OVER' : 'NEXT PANEL'}
          {currentPage === totalPages ? null : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}
