import React from 'react';
import { X, Volume2, Download, Trash2, Calendar, Sparkles } from 'lucide-react';
import { GrimoireEntry } from '../types/spectral';

interface GrimoireModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: GrimoireEntry[];
  onPlaySpeech: (text: string) => void;
  onClearGrimoire: () => void;
}

export const GrimoireModal: React.FC<GrimoireModalProps> = ({
  isOpen,
  onClose,
  entries,
  onPlaySpeech,
  onClearGrimoire,
}) => {
  if (!isOpen) return null;

  const downloadEntryAsText = (entry: GrimoireEntry) => {
    const content = `THE HAUNTED MIRROR — REVELATION FROM THE VEIL
======================================================
Date: ${new Date(entry.timestamp).toLocaleString()}
Visage Classification: ${entry.spectralClassification}
Detected Demeanor: ${entry.expression}
Inquiry: "${entry.spokenInquiry || 'Silent mortal gaze'}"

PROPHECY:
${entry.prophecyVerse}

OMEN / WARNING:
${entry.hiddenWarning}
======================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omen-${entry.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-ink-bleed">
      {/* Antique Book Outer Frame */}
      <div
        className="relative w-full max-w-3xl max-h-[85vh] rounded-md shadow-2xl overflow-hidden flex flex-col"
        style={{
          background: '#0d0a0f',
          border: '3px solid #6b5327',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.95), inset 0 0 30px rgba(184, 151, 88, 0.1)',
        }}
      >
        {/* Leather Binding Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#1c140d] via-[#2a1d12] to-[#1c140d] border-b border-amber-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="font-cinzel text-base tracking-[0.2em] uppercase font-bold text-amber-200">
              The Book of Omens & Revelations
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {entries.length > 0 && (
              <button
                onClick={onClearGrimoire}
                className="text-[11px] font-cinzel text-stone-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Burn these recorded omens"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Burn Omens</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer rounded-xs hover:bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Parchment Pages Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-stone-500">
              <span className="font-cinzel text-sm uppercase tracking-widest text-stone-400 mb-1">
                The Pages are Blank
              </span>
              <p className="font-garamond italic text-xs max-w-sm">
                Commune with the mirror or capture your reflection to inscribe prophecies into this sacred grimoire.
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="relative rounded-sm p-4 sm:p-5 border border-stone-800/90 bg-[#120f17] shadow-lg flex flex-col md:flex-row gap-4 items-start"
              >
                {/* Polaroid Snapshot if available */}
                {entry.imageSnapshot && (
                  <div className="w-28 sm:w-36 shrink-0 bg-stone-900 p-1.5 pb-4 rounded-xs border border-stone-700 shadow-md transform -rotate-1">
                    <img
                      src={entry.imageSnapshot}
                      alt="Cursed Portrait"
                      className="w-full aspect-[4/3] object-cover rounded-2xs filter sepia-[0.3] contrast-[1.1]"
                    />
                    <div className="text-[9px] font-garamond italic text-stone-400 text-center mt-1">
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                )}

                {/* Text Revelation */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-stone-800">
                      <div>
                        <span className="font-cinzel text-xs font-bold text-amber-300 tracking-wider uppercase">
                          {entry.spectralClassification}
                        </span>
                        <span className="text-stone-500 font-garamond italic text-xs ml-2">
                          · {entry.expression}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-600" />
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Spoken inquiry */}
                    {entry.spokenInquiry && (
                      <div className="text-xs font-garamond italic text-stone-400 mb-2">
                        Inquiry: "{entry.spokenInquiry}"
                      </div>
                    )}

                    {/* Prophecy Verse */}
                    <blockquote className="font-playfair italic text-stone-200 text-sm leading-relaxed whitespace-pre-line my-2 pl-3 border-l border-amber-700/50">
                      {entry.prophecyVerse}
                    </blockquote>

                    {/* Warning Omen */}
                    {entry.hiddenWarning && (
                      <div className="mt-2 text-xs font-garamond text-red-300/80">
                        <span className="text-red-500 font-cinzel text-[10px] uppercase tracking-wider font-semibold mr-1.5">
                          Omen:
                        </span>
                        {entry.hiddenWarning}
                      </div>
                    )}
                  </div>

                  {/* Action Affordances */}
                  <div className="flex items-center gap-3 pt-3 mt-3 border-t border-stone-900 text-xs">
                    <button
                      onClick={() => onPlaySpeech(entry.prophecyVerse)}
                      className="flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer font-cinzel text-[11px] tracking-wider uppercase"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      Listen
                    </button>
                    <button
                      onClick={() => downloadEntryAsText(entry)}
                      className="flex items-center gap-1.5 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer font-cinzel text-[11px] tracking-wider uppercase"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Preserve
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
