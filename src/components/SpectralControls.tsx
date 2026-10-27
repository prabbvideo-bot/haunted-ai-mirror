import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Camera,
  Sliders,
  Volume2,
  VolumeX,
  Eye,
  Flame,
  Ghost,
} from 'lucide-react';
import { FilterSettings, AudioSettings } from '../types/spectral';

interface SpectralControlsProps {
  onCommune: () => void;
  onSnapshot: () => void;
  onOpenGrimoire: () => void;
  grimoireCount: number;
  isAnalyzing: boolean;
  filterSettings: FilterSettings;
  onUpdateFilterSettings: (settings: Partial<FilterSettings>) => void;
  audioSettings: AudioSettings;
  onUpdateAudioSettings: (settings: Partial<AudioSettings>) => void;
}

export const SpectralControls: React.FC<SpectralControlsProps> = ({
  onCommune,
  onSnapshot,
  onOpenGrimoire,
  grimoireCount,
  isAnalyzing,
  filterSettings,
  onUpdateFilterSettings,
  audioSettings,
  onUpdateAudioSettings,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4 mt-2">
      {/* Primary Victorian Brass Action Strip */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {/* Main Commune Button */}
        <button
          onClick={onCommune}
          disabled={isAnalyzing}
          className="relative group px-6 sm:px-8 py-3 rounded-sm overflow-hidden transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-lg active:scale-95"
          style={{
            background:
              'linear-gradient(180deg, #382d1c 0%, #1e180e 50%, #0f0c07 100%)',
            border: '2px solid #8c6d3b',
            boxShadow: '0 0 15px rgba(184, 151, 88, 0.25)',
          }}
        >
          {/* Subtle Gilded Highlight line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-amber-400/50" />
          <div className="flex items-center gap-2.5 text-amber-200">
            <Sparkles className={`w-4 h-4 text-amber-400 ${isAnalyzing ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
            <span className="font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-amber-300">
              {isAnalyzing ? 'Reading Visage...' : 'Commune with Mirror'}
            </span>
          </div>
        </button>

        {/* Capture Reflection Snapshot */}
        <button
          onClick={onSnapshot}
          className="p-3 bg-[#120f18] border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-700/60 rounded-sm transition-colors cursor-pointer flex items-center gap-2 text-xs font-cinzel tracking-wider uppercase"
          title="Preserve this spectral reflection in the Grimoire"
        >
          <Camera className="w-4 h-4 text-stone-400" />
          <span className="hidden sm:inline">Capture</span>
        </button>

        {/* Open Book of Omens (Grimoire) */}
        <button
          onClick={onOpenGrimoire}
          className="relative p-3 bg-[#120f18] border border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-700/60 rounded-sm transition-colors cursor-pointer flex items-center gap-2 text-xs font-cinzel tracking-wider uppercase"
          title="Open Grimoire of Past Revelations"
        >
          <BookOpen className="w-4 h-4 text-amber-500/80" />
          <span className="hidden sm:inline">Book of Omens</span>
          {grimoireCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] bg-red-950 text-red-200 border border-red-800 rounded-full font-mono tabular-nums">
              {grimoireCount}
            </span>
          )}
        </button>

        {/* Tuning / Veil Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 border rounded-sm transition-colors cursor-pointer flex items-center gap-2 text-xs font-cinzel tracking-wider uppercase ${
            showSettings
              ? 'bg-amber-950/40 border-amber-600 text-amber-300'
              : 'bg-[#120f18] border-stone-800 text-stone-400 hover:text-stone-200'
          }`}
          title="Tune spectral apparition filters and voice"
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">The Veil</span>
        </button>

        {/* Audio Mute/Unmute toggle */}
        <button
          onClick={() =>
            onUpdateAudioSettings({ ambientDrone: !audioSettings.ambientDrone })
          }
          className={`p-3 border rounded-sm transition-colors cursor-pointer flex items-center justify-center ${
            audioSettings.ambientDrone
              ? 'bg-[#14101a] border-stone-800 text-teal-400'
              : 'bg-[#120f18] border-stone-800 text-stone-600'
          }`}
          title={audioSettings.ambientDrone ? 'Mute ambient sound' : 'Enable ambient sound'}
        >
          {audioSettings.ambientDrone ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expandable Veil Configuration Drawer */}
      {showSettings && (
        <div className="w-full bg-[#0d0c12] border border-stone-800/90 rounded-md p-4 sm:p-5 shadow-2xl text-stone-300 animate-ink-bleed">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-800">
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Ghost className="w-3.5 h-3.5 text-teal-400" />
              Tuning the Spectral Glass
            </h4>
            <span className="text-[10px] font-garamond italic text-stone-500">
              Adjust apparition intensity & acoustic resonance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-cinzel">
            {/* Ectoplasm Mist Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Ectoplasm Mist</span>
                <span className="font-mono tabular-nums text-teal-300">
                  {Math.round(filterSettings.ectoplasmIntensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={filterSettings.ectoplasmIntensity}
                onChange={(e) =>
                  onUpdateFilterSettings({
                    ectoplasmIntensity: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-teal-400 bg-stone-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Antique Tarnish Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Silvering Decay</span>
                <span className="font-mono tabular-nums text-amber-300">
                  {Math.round(filterSettings.antiqueTarnish * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={filterSettings.antiqueTarnish}
                onChange={(e) =>
                  onUpdateFilterSettings({
                    antiqueTarnish: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-amber-500 bg-stone-900 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Ghost Voice Persona */}
            <div className="flex flex-col gap-1.5">
              <label className="text-stone-400 text-[11px]">Phantom Voice</label>
              <select
                value={audioSettings.voiceName}
                onChange={(e) =>
                  onUpdateAudioSettings({
                    voiceName: e.target.value as AudioSettings['voiceName'],
                  })
                }
                className="bg-[#14121a] border border-stone-800 text-stone-200 text-xs px-2 py-1.5 rounded-xs outline-none focus:border-amber-600"
              >
                <option value="Charon">Charon (Deep Ancient Dread)</option>
                <option value="Fenrir">Fenrir (Resonant Phantom)</option>
                <option value="Kore">Kore (Sorrowful Spirit)</option>
                <option value="Zephyr">Zephyr (Whispering Shade)</option>
              </select>
            </div>

            {/* Ghost Trails Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-stone-400 hover:text-stone-200">
              <input
                type="checkbox"
                checked={filterSettings.ghostAfterimage}
                onChange={(e) =>
                  onUpdateFilterSettings({ ghostAfterimage: e.target.checked })
                }
                className="accent-teal-400 w-3.5 h-3.5"
              />
              <span>Ethereal Afterimage Trails</span>
            </label>

            {/* Burning Eye Embers Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-stone-400 hover:text-stone-200">
              <input
                type="checkbox"
                checked={filterSettings.eyeEmbers}
                onChange={(e) =>
                  onUpdateFilterSettings({ eyeEmbers: e.target.checked })
                }
                className="accent-amber-400 w-3.5 h-3.5"
              />
              <span>Soul Ember Sparks (Eyes)</span>
            </label>

            {/* Chromatic Aberration Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-stone-400 hover:text-stone-200">
              <input
                type="checkbox"
                checked={filterSettings.chromaticAberration}
                onChange={(e) =>
                  onUpdateFilterSettings({
                    chromaticAberration: e.target.checked,
                  })
                }
                className="accent-red-400 w-3.5 h-3.5"
              />
              <span>Chromatic Lens Fringe</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
