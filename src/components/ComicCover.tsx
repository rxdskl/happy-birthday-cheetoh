import React from 'react';
import { motion } from 'motion/react';
import { ComicConfig, COVER_TEMPLATES, ComicCoverTemplate } from '../types';

interface ComicCoverProps {
  config: ComicConfig;
  onOpen: () => void;
}

export default function ComicCover({ config, onOpen }: ComicCoverProps) {
  // Find current cover template
  const coverTemplate = COVER_TEMPLATES.find(t => t.id === config.coverId) || COVER_TEMPLATES[0];

  return (
    <div className="w-full max-w-lg mx-auto bg-white comic-border comic-shadow rounded-sm relative overflow-hidden paper-overlay select-none">
      {/* Top Banner: Price, Date, Logo */}
      <div className="flex border-b-4 border-black bg-zinc-900 text-white font-mono text-xs items-center divide-x-4 divide-black">
        <div className="px-3 py-1 bg-red-600 text-white font-black uppercase text-center font-comic-loud text-lg tracking-widest flex items-center justify-center">
          MARVEL
        </div>
        <div className="px-3 py-2 flex-1 flex flex-col justify-center leading-none">
          <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-bold">Approved by</span>
          <span className="font-comic-loud text-sm tracking-wide text-amber-400">BIRTHDAY COMICS GROUP</span>
        </div>
        <div className="px-3 py-2 text-center flex flex-col justify-center leading-none">
          <span className="text-[9px] text-zinc-400 uppercase font-bold">PRICE</span>
          <span className="font-bold text-emerald-400">PRICELESS</span>
        </div>
        <div className="px-3 py-2 text-center flex flex-col justify-center leading-none">
          <span className="text-[9px] text-zinc-400 uppercase font-bold">ISSUE NO.</span>
          <span className="font-extrabold text-white text-sm">#{config.age}</span>
        </div>
      </div>

      {/* Comic Book Banner / Title Box */}
      <div className="p-4 bg-amber-50 border-b-4 border-black relative halftone-pattern-light">
        {/* Retro Series Tag */}
        <div className="text-[10px] text-zinc-700 font-extrabold tracking-widest uppercase text-center mb-1 bg-yellow-300 comic-border-thin py-0.5 inline-block px-2 rotate-[-1deg]">
          ★ THE ALL-NEW CELEBRATION SENSATION! ★
        </div>

        {/* Huge Loud Comic Book Title */}
        <motion.h1 
          initial={{ scale: 0.9, rotate: -3 }}
          animate={{ scale: [0.95, 1.02, 0.98, 1.01, 1], rotate: [-3, -1, -4, -2, -3] }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl font-comic-title text-center text-red-600 tracking-wide mt-2 select-none"
          style={{
            textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 4px 4px 10px rgba(0,0,0,0.4)',
            letterSpacing: '0.05em'
          }}
        >
          {config.heroTitle || `THE INCREDIBLE ${config.friendName}`.toUpperCase()}
        </motion.h1>

        {/* Subtitle banner */}
        <div className="text-center font-comic-loud text-zinc-800 text-sm tracking-wider mt-3 bg-white p-1 comic-border-thin shadow-sm">
          {coverTemplate.subTitle}
        </div>
      </div>

      {/* Main Comic Art Section */}
      <div className="relative border-b-4 border-black bg-zinc-950 aspect-[3/4] flex items-center justify-center overflow-hidden">
        {/* Real Comic Image */}
        <img
          src={coverTemplate.coverImage}
          alt={coverTemplate.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top select-none transition-transform duration-700 hover:scale-105"
        />

        {/* Speech/Action Badges Floating on the image */}
        {/* Badge 1: Age Sticker */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 right-4 bg-yellow-400 text-black font-comic-title p-3 rounded-full comic-border border-dashed comic-shadow rotate-12 text-center leading-none flex flex-col items-center justify-center w-16 h-16 cursor-pointer hover:rotate-6 transition-all"
        >
          <span className="text-[10px] font-bold">AGE</span>
          <span className="text-2xl font-black">{config.age}</span>
        </motion.div>

        {/* Badge 2: Sound Effect graphic "POW!" style */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute bottom-4 left-4 bg-red-600 text-white font-comic-title px-4 py-2.5 comic-border comic-shadow rotate-[-12deg] flex flex-col leading-none select-none badge-hover-shake cursor-pointer"
        >
          <span className="text-xs text-yellow-300 font-extrabold tracking-widest">IT'S A</span>
          <span className="text-2xl text-yellow-200 uppercase font-black tracking-wider">SMASH!</span>
        </motion.div>

        {/* Badge 3: Special message bubble */}
        <div className="absolute top-1/4 left-3 max-w-[150px] bg-white text-zinc-900 px-3 py-2 rounded-xl comic-border-thin text-xs font-comic-hand leading-snug rotate-[4deg] shadow-lg bubble-tail-bottom">
          HE IS NOT A MYTH! HE IS REAL, AND TODAY IS HIS BIG DAY!
        </div>
      </div>

      {/* Bottom section: Barcode, Open Comic Trigger */}
      <div className="p-4 bg-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4 halftone-pattern-light">
        {/* Fake Retro Comic Barcode */}
        <div className="flex flex-col items-center justify-center p-1 bg-white comic-border-thin leading-none shrink-0 rotate-1 select-none">
          <div className="flex gap-0.5 h-8">
            <div className="w-0.5 bg-black"></div>
            <div className="w-1 bg-black"></div>
            <div className="w-0.5 bg-black"></div>
            <div className="w-0.5 bg-black"></div>
            <div className="w-1 bg-black"></div>
            <div className="w-1 bg-black"></div>
            <div className="w-0.5 bg-black"></div>
            <div className="w-1 bg-black"></div>
            <div className="w-0.5 bg-black"></div>
            <div className="w-1 bg-black"></div>
            <div className="w-0.5 bg-black"></div>
            <div className="w-0.5 bg-black"></div>
            <div className="w-1 bg-black"></div>
          </div>
          <span className="text-[7px] font-mono font-bold mt-1 tracking-widest">07132026 {config.age}</span>
        </div>

        {/* Dynamic description of comic origins */}
        <div className="flex-1 text-center sm:text-left leading-tight text-xs font-mono text-zinc-700 font-bold max-w-[200px]">
          {coverTemplate.historicalDesc}
        </div>

        {/* Action Trigger Button */}
        <motion.button
          onClick={onOpen}
          id="btn-open-comic"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto px-6 py-3.5 bg-yellow-400 text-black font-comic-title text-xl tracking-wider rounded-lg comic-border comic-shadow cursor-pointer hover:bg-yellow-300 hover:text-black transition-all flex items-center justify-center gap-2 animate-pulse"
        >
          OPEN COMIC BOOK &rarr;
        </motion.button>
      </div>
    </div>
  );
}
