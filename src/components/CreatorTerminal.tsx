import React, { useState } from 'react';
import { Copy, Check, ShieldAlert, Sparkles, HelpCircle, FileEdit, Volume2, Image, BarChart2, Share2, Upload, Trash2 } from 'lucide-react';
import { ComicConfig, COVER_TEMPLATES, HeroStat } from '../types';
import { encodeComicConfig, extractYoutubeId, compressImage } from '../utils';

interface CreatorTerminalProps {
  config: ComicConfig;
  onChange: (newConfig: ComicConfig) => void;
  onReset: () => void;
}

export default function CreatorTerminal({ config, onChange, onReset }: CreatorTerminalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'audio' | 'story' | 'stats'>('details');

  // Handle simple string/number updates
  const updateField = (field: keyof ComicConfig, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  // Handle deep updates inside story panel structures
  const updatePanel1 = (field: 'description' | 'bubbleText', value: string) => {
    onChange({
      ...config,
      panel1: {
        ...config.panel1,
        [field]: value
      }
    });
  };

  const updatePanel3 = (field: 'description' | 'bubbleText', value: string) => {
    onChange({
      ...config,
      panel3: {
        ...config.panel3,
        [field]: value
      }
    });
  };

  const updatePanel4 = (field: 'title' | 'description', value: string) => {
    onChange({
      ...config,
      panel4: {
        ...config.panel4,
        [field]: value
      }
    });
  };

  const updatePanel2Description = (value: string) => {
    onChange({
      ...config,
      panel2: {
        ...config.panel2,
        description: value
      }
    });
  };

  const updatePanel2Power = (value: string) => {
    onChange({
      ...config,
      panel2: {
        ...config.panel2,
        powerName: value
      }
    });
  };

  // Update specific stats
  const updateStatValue = (index: number, val: number) => {
    const updatedStats = [...config.panel2.stats];
    updatedStats[index] = { ...updatedStats[index], value: val };
    onChange({
      ...config,
      panel2: {
        ...config.panel2,
        stats: updatedStats
      }
    });
  };

  const handleImageUpload = async (panelKey: 'panel1' | 'panel2' | 'panel3' | 'panel4', file: File) => {
    try {
      const dataUrl = await compressImage(file);
      if (panelKey === 'panel1') {
        onChange({ ...config, panel1: { ...config.panel1, image: dataUrl } });
      } else if (panelKey === 'panel2') {
        onChange({ ...config, panel2: { ...config.panel2, image: dataUrl } });
      } else if (panelKey === 'panel3') {
        onChange({ ...config, panel3: { ...config.panel3, image: dataUrl } });
      } else if (panelKey === 'panel4') {
        onChange({ ...config, panel4: { ...config.panel4, image: dataUrl } });
      }
    } catch (e) {
      console.error('Error uploading/compressing image:', e);
    }
  };

  const handleImageRemove = (panelKey: 'panel1' | 'panel2' | 'panel3' | 'panel4') => {
    if (panelKey === 'panel1') {
      const p = { ...config.panel1 };
      delete p.image;
      onChange({ ...config, panel1: p });
    } else if (panelKey === 'panel2') {
      const p = { ...config.panel2 };
      delete p.image;
      onChange({ ...config, panel2: p });
    } else if (panelKey === 'panel3') {
      const p = { ...config.panel3 };
      delete p.image;
      onChange({ ...config, panel3: p });
    } else if (panelKey === 'panel4') {
      const p = { ...config.panel4 };
      delete p.image;
      onChange({ ...config, panel4: p });
    }
  };

  const renderImageUploader = (panelKey: 'panel1' | 'panel2' | 'panel3' | 'panel4', label: string) => {
    const currentImage = panelKey === 'panel2' ? config.panel2.image : config[panelKey].image;
    
    return (
      <div className="flex flex-col gap-1.5 mt-2.5 border-t border-zinc-850 pt-2.5">
        <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase flex items-center gap-1">
          <Image className="w-3 h-3 text-yellow-500" /> {label}
        </label>
        
        <div className="flex items-center gap-3 bg-zinc-900 p-2.5 rounded border border-zinc-800">
          {currentImage ? (
            <div className="relative w-16 h-16 rounded border-2 border-yellow-400 bg-black overflow-hidden shrink-0">
              <img src={currentImage} alt="Uploaded preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleImageRemove(panelKey)}
                className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 hover:bg-red-500 text-white rounded-full cursor-pointer transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded border-2 border-dashed border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-500 shrink-0">
              <Upload className="w-5 h-5" />
            </div>
          )}
          
          <div className="flex-1 flex flex-col gap-1">
            <span className="text-[10px] font-mono text-zinc-400">
              {currentImage ? 'Custom picture active!' : 'Choose a custom image (funny photo, memory, screenshot).'}
            </span>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] font-bold rounded cursor-pointer border border-zinc-700 transition-colors flex items-center gap-1">
                <Upload className="w-3 h-3 text-yellow-400" />
                {currentImage ? 'REPLACE' : 'UPLOAD PHOTO'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleImageUpload(panelKey, file);
                    }
                  }}
                  className="hidden"
                />
              </label>
              {currentImage && (
                <button
                  type="button"
                  onClick={() => handleImageRemove(panelKey)}
                  className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-400 font-mono text-[10px] font-bold rounded cursor-pointer border border-red-900 transition-colors"
                >
                  REMOVE
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const generateShareLink = (): string => {
    const b64 = encodeComicConfig(config);
    const origin = window.location.origin + window.location.pathname;
    return `${origin}#card=${b64}`;
  };

  const handleCopyShare = () => {
    const link = generateShareLink();
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="w-full bg-zinc-950 text-white border-4 border-black p-4 rounded-md shadow-2xl relative select-none">
      
      {/* S.H.I.E.L.D. Creator Dashboard Header */}
      <div className="border-b-4 border-black pb-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-red-600 rounded">
            <ShieldAlert className="w-6 h-6 text-yellow-300 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-comic-loud tracking-wider text-yellow-400 leading-none">
              S.H.I.E.L.D. COMIC GENERATOR
            </h2>
            <span className="text-[10px] font-mono font-bold text-zinc-400">
              MISSION DIRECTIVE: DESIGN THE ULTIMATE BIRTHDAY SITE
            </span>
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-2 py-1 bg-zinc-800 text-xs font-mono font-bold text-zinc-300 hover:bg-zinc-700 comic-border-thin cursor-pointer rounded"
        >
          RESET TO DEFAULT SCRIPT
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b-2 border-zinc-800 gap-1 mb-4 text-xs font-mono overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-3 py-1.5 rounded-t-sm font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'details' ? 'bg-zinc-800 text-yellow-400 border-t-2 border-yellow-400' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Image className="w-3.5 h-3.5" /> Details & Cover
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`px-3 py-1.5 rounded-t-sm font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'audio' ? 'bg-zinc-800 text-yellow-400 border-t-2 border-yellow-400' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" /> 2. BGM Favorite Song
        </button>
        <button
          onClick={() => setActiveTab('story')}
          className={`px-3 py-1.5 rounded-t-sm font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'story' ? 'bg-zinc-800 text-yellow-400 border-t-2 border-yellow-400' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" /> 3. Panels Script
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3 py-1.5 rounded-t-sm font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'stats' ? 'bg-zinc-800 text-yellow-400 border-t-2 border-yellow-400' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" /> 4. Mutant Stats
        </button>
      </div>

      {/* TABS CONTAINER */}
      <div className="min-h-[280px]">
        
        {/* ==================== TAB 1: BASIC DETAILS & COVERS ==================== */}
        {activeTab === 'details' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Friend's Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold text-zinc-300">FRIEND'S FIRST NAME:</label>
                <input
                  type="text"
                  maxLength={18}
                  value={config.friendName}
                  onChange={(e) => updateField('friendName', e.target.value)}
                  className="bg-zinc-900 border-2 border-zinc-700 px-3 py-1.5 font-mono text-sm text-white focus:border-yellow-400 outline-none rounded"
                  placeholder="e.g. Alex"
                />
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold text-zinc-300">AGE (COMIC ISSUE NUMBER):</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={config.age}
                  onChange={(e) => updateField('age', Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-zinc-900 border-2 border-zinc-700 px-3 py-1.5 font-mono text-sm text-white focus:border-yellow-400 outline-none rounded"
                />
              </div>

              {/* Cover title */}
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-mono font-bold text-zinc-300">COMIC BOOK MAIN HEADER TITLE:</label>
                <input
                  type="text"
                  maxLength={30}
                  value={config.heroTitle}
                  onChange={(e) => updateField('heroTitle', e.target.value.toUpperCase())}
                  className="bg-zinc-900 border-2 border-zinc-700 px-3 py-1.5 font-comic-title text-sm tracking-wider text-yellow-400 focus:border-yellow-400 outline-none rounded"
                  placeholder="e.g. THE INCREDIBLE ALEX"
                />
              </div>
            </div>

            {/* Cover Pickers (REAL MARVEL COVERS) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-bold text-zinc-300">
                SELECT HISTORIC MARVEL COMIC COVER (REAL COMICS ONLY - NOT AI):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COVER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => updateField('coverId', tpl.id)}
                    className={`p-1 border-2 rounded text-left flex flex-col gap-1 relative overflow-hidden transition-all group ${
                      config.coverId === tpl.id ? 'border-yellow-400 bg-zinc-850' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                    }`}
                  >
                    <div className="aspect-[3/4] bg-black rounded-sm overflow-hidden relative">
                      <img
                        src={tpl.coverImage}
                        alt={tpl.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                      {config.coverId === tpl.id && (
                        <div className="absolute top-1 right-1 bg-yellow-400 text-black px-1 py-0.5 rounded text-[8px] font-mono font-bold">
                          ACTIVE
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold font-mono text-center block w-full truncate text-zinc-300 group-hover:text-white">
                      {tpl.title.split(' ')[1] || tpl.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: BACKGROUND MUSIC ==================== */}
        {activeTab === 'audio' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 text-xs text-zinc-300 leading-relaxed font-mono">
              ⚡ <strong className="text-yellow-400">FAVORITE SONG BACKING SOUNDTRACK:</strong> Paste any song or soundtrack they love. You can search YouTube and paste the URL below! It runs behind an integrated cassette mixer widget.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Soundtrack Type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold text-zinc-300">MUSIC SOURCE TYPE:</label>
                <select
                  value={config.musicType}
                  onChange={(e) => updateField('musicType', e.target.value as any)}
                  className="bg-zinc-900 border-2 border-zinc-700 px-3 py-2 font-mono text-sm text-white focus:border-yellow-400 outline-none rounded cursor-pointer"
                >
                  <option value="youtube">YouTube (URL or 11-char Video ID)</option>
                  <option value="mp3">Direct Audio (.mp3 URL link)</option>
                  <option value="none">No Background Music</option>
                </select>
              </div>

              {/* Music link */}
              {config.musicType !== 'none' && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-mono font-bold text-zinc-300">
                    {config.musicType === 'youtube' ? 'YOUTUBE URL OR VIDEO ID:' : 'DIRECT MP3 FILE URL LINK:'}
                  </label>
                  <input
                    type="text"
                    value={config.musicUrl}
                    onChange={(e) => updateField('musicUrl', e.target.value)}
                    className="bg-zinc-900 border-2 border-zinc-700 px-3 py-1.5 font-mono text-sm text-white focus:border-yellow-400 outline-none rounded"
                    placeholder={
                      config.musicType === 'youtube'
                        ? 'e.g. https://www.youtube.com/watch?v=8MgnYm0Gv2k'
                        : 'e.g. https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                    }
                  />
                </div>
              )}
            </div>

            {/* YouTube Presets list */}
            {config.musicType === 'youtube' && (
              <div className="flex flex-col gap-2 bg-zinc-900/60 p-2.5 rounded border border-zinc-800">
                <span className="text-[10px] font-mono font-bold text-zinc-400">QUICK MUSIC PRESETS:</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <button
                    onClick={() => updateField('musicUrl', '8MgnYm0Gv2k')}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-left border border-zinc-700 hover:text-yellow-400 cursor-pointer"
                  >
                    🎵 Classic Avengers Orchestral Theme
                  </button>
                  <button
                    onClick={() => updateField('musicUrl', 'SUtziaEcyGg')}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-left border border-zinc-700 hover:text-yellow-400 cursor-pointer"
                  >
                    🕷️ Vintage Spider-Man cartoon theme
                  </button>
                  <button
                    onClick={() => updateField('musicUrl', 'g_6n787D6Ww')}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-left border border-zinc-700 hover:text-yellow-400 cursor-pointer"
                  >
                    🌌 Guardians of Galaxy - Hooked on Feeling
                  </button>
                  <button
                    onClick={() => updateField('musicUrl', '3zF5O1Lp_pY')}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-left border border-zinc-700 hover:text-yellow-400 cursor-pointer"
                  >
                    🎸 Happy Birthday Rock/Metal Heavy cover
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: STORY PANELS SCRIPTING ==================== */}
        {activeTab === 'story' && (
          <div className="flex flex-col gap-4 animate-fadeIn max-h-[380px] overflow-y-auto pr-1">
            
            {/* Panel 1 Origin script */}
            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 flex flex-col gap-2">
              <span className="text-xs font-bold font-mono text-yellow-400 uppercase">PAGE 1: THE ORIGIN ACCIDENT</span>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400">NARRATIVE LOG:</label>
                <textarea
                  rows={2}
                  value={config.panel1.description}
                  onChange={(e) => updatePanel1('description', e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs rounded text-white focus:border-yellow-400 outline-none resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400">SPEECH BUBBLE DIALOGUE:</label>
                <input
                  type="text"
                  value={config.panel1.bubbleText}
                  onChange={(e) => updatePanel1('bubbleText', e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 px-2 py-1.5 font-mono text-xs rounded text-white focus:border-yellow-400 outline-none"
                />
              </div>
              {renderImageUploader('panel1', 'PAGE 1 HERO/ACCIDENT PICTURE')}
            </div>

            {/* Panel 2 Core Mutant Power text */}
            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 flex flex-col gap-2">
              <span className="text-xs font-bold font-mono text-yellow-400 uppercase">PAGE 2: MUTANT POWER & CLASSIFICATION</span>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400">PRIMARY WEAPON/POWER NAME:</label>
                <input
                  type="text"
                  value={config.panel2.powerName}
                  onChange={(e) => updatePanel2Power(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 px-2 py-1.5 font-mono text-xs rounded text-white focus:border-yellow-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400">MUTANT REPORT SCIENTIFIC LOG:</label>
                <textarea
                  rows={2}
                  value={config.panel2.description}
                  onChange={(e) => updatePanel2Description(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs rounded text-white focus:border-yellow-400 outline-none resize-none"
                />
              </div>
              {renderImageUploader('panel2', 'PAGE 2 PROFILE HERO DOSSIER PICTURE')}
            </div>

            {/* Panel 3 Avengers Recruitment script */}
            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 flex flex-col gap-2">
              <span className="text-xs font-bold font-mono text-yellow-400 uppercase">PAGE 3: AVENGERS RECRUITMENT CALL</span>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400">NARRATION LOG:</label>
                <textarea
                  rows={2}
                  value={config.panel3.description}
                  onChange={(e) => updatePanel3('description', e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs rounded text-white focus:border-yellow-400 outline-none resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400">AVENGERS WELCOMING SPEECH:</label>
                <input
                  type="text"
                  value={config.panel3.bubbleText}
                  onChange={(e) => updatePanel3('bubbleText', e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 px-2 py-1.5 font-mono text-xs rounded text-white focus:border-yellow-400 outline-none"
                />
              </div>
              {renderImageUploader('panel3', 'PAGE 3 MISSION/AVENGERS PICTURE')}
            </div>

            {/* Panel 4 Splash Celebration script & Link at end */}
            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 flex flex-col gap-2">
              <span className="text-xs font-bold font-mono text-yellow-400 uppercase">PAGE 4: VICTORY CELEBRATION SPLASH</span>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400">MAIN CELEBRATORY HEADING:</label>
                <input
                  type="text"
                  value={config.panel4.title}
                  onChange={(e) => updatePanel4('title', e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 px-2 py-1.5 font-mono text-xs rounded text-white focus:border-yellow-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400">CLOSING WISHES SCRIPT:</label>
                <textarea
                  rows={2}
                  value={config.panel4.description}
                  onChange={(e) => updatePanel4('description', e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 p-2 font-mono text-xs rounded text-white focus:border-yellow-400 outline-none resize-none"
                />
              </div>
              {renderImageUploader('panel4', 'PAGE 4 SPLASH CELEBRATION PICTURE')}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: SUPERHERO POWER STATS ==================== */}
        {activeTab === 'stats' && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="bg-zinc-900 p-3 rounded border border-zinc-800 text-xs text-zinc-300 font-mono">
              🧪 <strong className="text-yellow-400">MUTANT ATTRIBUTES PANEL:</strong> Calibrate the values of your friend's superhero status indicators shown on the dossier card page.
            </div>

            <div className="flex flex-col gap-3">
              {config.panel2.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300 font-bold uppercase">{stat.name}:</span>
                    <span className="text-yellow-400 font-black">{stat.value}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stat.value}
                      onChange={(e) => updateStatValue(idx, parseInt(e.target.value))}
                      className="flex-1 accent-red-600 h-2 bg-zinc-800 rounded-md cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* FOOTER ACTION PANEL: SPECIAL CUSTOM LINK CONFIG */}
      <div className="mt-4 p-3 bg-zinc-900 border-2 border-zinc-800 rounded flex flex-col gap-2.5">
        <span className="text-xs font-bold font-mono text-red-500 uppercase flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" /> 5. CONFIGURE BIRTHDAY COMPLETED ACTION LINK
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Target URL link */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono text-zinc-400 font-bold">TARGET ACTION LINK DESTINATION URL:</label>
            <input
              type="text"
              value={config.endButtonUrl}
              onChange={(e) => updateField('endButtonUrl', e.target.value)}
              className="bg-zinc-950 border border-zinc-700 px-2 py-1 text-xs font-mono text-emerald-400 focus:border-yellow-400 outline-none rounded"
              placeholder="e.g. https://example.com/gift"
            />
          </div>

          {/* Button description text */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono text-zinc-400 font-bold">BUTTON TEXT DESCRIPTION LABEL:</label>
            <input
              type="text"
              value={config.endButtonText}
              onChange={(e) => updateField('endButtonText', e.target.value)}
              className="bg-zinc-950 border border-zinc-700 px-2 py-1 text-xs font-mono text-white focus:border-yellow-400 outline-none rounded"
              placeholder="e.g. CLAIM PRESENT!"
            />
          </div>
        </div>
      </div>

      {/* EXPORT AND SHARE SECTION */}
      <div className="mt-5 border-t-2 border-zinc-800 pt-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900 p-3.5 comic-border-thin rounded">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-yellow-400 font-comic-loud text-md tracking-wider uppercase leading-none">
              READY TO SHARE WITH {config.friendName.toUpperCase()}?
            </h3>
            <p className="text-[10px] font-mono text-zinc-300 mt-1 uppercase leading-snug">
              Generates a secure, compressed URL containing your customized pages and fave music. It loads directly on any screen!
            </p>
          </div>

          <button
            onClick={handleCopyShare}
            id="btn-copy-share"
            className="w-full sm:w-auto px-5 py-3 bg-yellow-400 text-black font-comic-title text-sm tracking-wider uppercase comic-border-thin comic-shadow cursor-pointer hover:bg-yellow-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-700 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'COPIED LINK!' : 'COPY SHARE LINK'}
          </button>
        </div>

        {/* Feedback info when copied */}
        {copied && (
          <div className="p-2 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 text-[10px] font-mono text-center uppercase tracking-wider animate-fadeIn">
            🎉 MISSION SUCCESS! The secure URL has been saved to your clipboard. Send it to {config.friendName} so they can see their comic!
          </div>
        )}
      </div>

    </div>
  );
}
