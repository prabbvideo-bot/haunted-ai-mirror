import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  HelpCircle,
  Eye,
  Flame,
  Info,
} from 'lucide-react';
import { HauntedMirror } from './components/HauntedMirror';
import { CandleSconce } from './components/CandleSconce';
import { IncantationBar } from './components/IncantationBar';
import { SpectralControls } from './components/SpectralControls';
import { GrimoireModal } from './components/GrimoireModal';
import {
  FilterSettings,
  AudioSettings,
  SpectralAnalysis,
  GrimoireEntry,
} from './types/spectral';
import { hauntedAudio } from './utils/hauntedAudio';

export default function App() {
  // Atmospheric lighting state (candle sconces)
  const [leftCandleLit, setLeftCandleLit] = useState(true);
  const [rightCandleLit, setRightCandleLit] = useState(true);

  // Filter settings for canvas shaders
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    ectoplasmIntensity: 0.7,
    chromaticAberration: true,
    antiqueTarnish: 0.55,
    eyeEmbers: true,
    darkVignette: 0.65,
    ghostAfterimage: true,
    spectralTint: 'ectoplasm',
  });

  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    masterVolume: 0.6,
    ambientDrone: true,
    soundEffects: true,
    voiceName: 'Charon',
  });

  // Communion & Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [analysis, setAnalysis] = useState<SpectralAnalysis | null>(null);
  const [lastSpokenInquiry, setLastSpokenInquiry] = useState<string>('');
  const [pendingSnapshot, setPendingSnapshot] = useState<string | null>(null);

  // Grimoire Archive state
  const [grimoireEntries, setGrimoireEntries] = useState<GrimoireEntry[]>(() => {
    try {
      const saved = localStorage.getItem('haunted_mirror_grimoire');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isGrimoireOpen, setIsGrimoireOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Synchronize audio ambient drone
  useEffect(() => {
    if (audioSettings.ambientDrone) {
      hauntedAudio.startAmbientDrone();
    } else {
      hauntedAudio.stopAmbientDrone();
    }
    return () => {
      hauntedAudio.stopAmbientDrone();
    };
  }, [audioSettings.ambientDrone]);

  // Synchronize audio volume
  useEffect(() => {
    hauntedAudio.setMasterVolume(audioSettings.masterVolume);
  }, [audioSettings.masterVolume]);

  // Save Grimoire to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'haunted_mirror_grimoire',
        JSON.stringify(grimoireEntries)
      );
    } catch (e) {
      console.warn('Could not save grimoire to storage:', e);
    }
  }, [grimoireEntries]);

  // Receive snapshot frame from mirror
  const handleCaptureFrame = useCallback((base64: string) => {
    setPendingSnapshot(base64);
  }, []);

  // Request AI voice speech and play
  const playProphecyVoice = useCallback(
    async (verse: string) => {
      if (!verse) return;
      setIsSpeaking(true);
      try {
        const res = await fetch('/api/spectral/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: verse,
            voiceName: audioSettings.voiceName,
          }),
        });
        const data = await res.json();
        if (data.audioBase64) {
          await hauntedAudio.playSpeech(data.audioBase64);
        } else {
          // Fallback speech synthesis if offline
          await hauntedAudio.speakFallback(verse);
        }
      } catch (err) {
        console.warn('Voice synthesis error:', err);
        await hauntedAudio.speakFallback(verse);
      } finally {
        setIsSpeaking(false);
      }
    },
    [audioSettings.voiceName]
  );

  // Initiate Communion (Face & Expression Perception + Prophecy Generation)
  const handleCommune = useCallback(
    async (customInquiry?: string) => {
      if (isAnalyzing) return;
      setIsAnalyzing(true);
      hauntedAudio.playWhisperChime();

      const inquiry = customInquiry || lastSpokenInquiry;
      if (customInquiry) {
        setLastSpokenInquiry(customInquiry);
      }

      try {
        const payload: any = {
          speechText: inquiry,
          history: grimoireEntries.map((e) => e.prophecyVerse).slice(-3),
        };

        if (pendingSnapshot) {
          payload.imageBase64 = pendingSnapshot;
        }

        const res = await fetch('/api/spectral/commune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result: SpectralAnalysis = await res.json();
        setAnalysis(result);

        // Sound the funeral bell toll
        hauntedAudio.playToll();

        // Inscribe in Grimoire
        const newEntry: GrimoireEntry = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          expression: result.expression,
          spectralClassification: result.spectralClassification,
          prophecyVerse: result.prophecyVerse,
          hiddenWarning: result.hiddenWarning,
          auraColor: result.auraColor,
          imageSnapshot: pendingSnapshot || undefined,
          spokenInquiry: inquiry || undefined,
        };

        setGrimoireEntries((prev) => [newEntry, ...prev.slice(0, 24)]);

        // Voice playback
        playProphecyVoice(result.prophecyVerse);
      } catch (error) {
        console.error('Error during communion:', error);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [isAnalyzing, lastSpokenInquiry, grimoireEntries, pendingSnapshot, playProphecyVoice]
  );

  // Snapshot preserved manually
  const handleManualSnapshot = useCallback(() => {
    if (!pendingSnapshot) return;
    hauntedAudio.playWhisperChime();
    const newEntry: GrimoireEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      expression: analysis?.expression || 'Shadowed Portrait',
      spectralClassification:
        analysis?.spectralClassification || 'The Preserved Visage',
      prophecyVerse:
        analysis?.prophecyVerse ||
        'A frozen moment in the silvered deep,\nWhere waking souls and phantoms sleep.',
      hiddenWarning:
        analysis?.hiddenWarning ||
        'The glass holds memory longer than the flesh.',
      auraColor: analysis?.auraColor || '#5eead4',
      imageSnapshot: pendingSnapshot,
      spokenInquiry: lastSpokenInquiry || undefined,
    };
    setGrimoireEntries((prev) => [newEntry, ...prev]);
  }, [pendingSnapshot, analysis, lastSpokenInquiry]);

  // Compute room light level for shader pass
  const roomLightLevel =
    (leftCandleLit ? 0.5 : 0) + (rightCandleLit ? 0.5 : 0);

  return (
    <div className="min-h-screen bg-[#070608] text-stone-200 flex flex-col justify-between relative overflow-x-hidden selection:bg-amber-950 selection:text-amber-200">
      {/* Subtle Victorian Damask wallpaper texture background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#261d15 1px, transparent 1px), radial-gradient(#15121c 1px, #070608 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Top Bar Header following Top Bar Contract */}
      <header className="relative z-20 flex items-center justify-between gap-8 px-6 py-4 border-b border-stone-800/80 bg-[#0a080f]/90 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h1 className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.18em] text-amber-300/90 whitespace-nowrap shrink-0">
            The Haunted Mirror
          </h1>
        </div>

        {/* Zone 2: Clean single-line text indicators */}
        <div className="hidden md:flex items-center gap-4 text-xs font-garamond italic text-stone-400">
          <span>Victorian Parlor</span>
          <span aria-hidden="true">·</span>
          <span>Ectoplasm Vision</span>
          <span aria-hidden="true">·</span>
          <span>Anno 1888</span>
        </div>

        {/* Zone 3: Primary utility action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="p-2 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer rounded-xs"
            title="How to commune with the mirror"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsGrimoireOpen(true)}
            className="px-3.5 py-1.5 text-xs font-cinzel tracking-wider uppercase bg-stone-900 border border-amber-800/60 text-amber-300 rounded-xs hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Omens ({grimoireEntries.length})</span>
          </button>
        </div>
      </header>

      {/* Help Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0f0c14] border border-amber-900/60 p-6 rounded-md max-w-md shadow-2xl text-stone-300 space-y-4">
            <h3 className="font-cinzel text-base text-amber-300 uppercase tracking-widest pb-2 border-b border-stone-800">
              Communing with the Mirror
            </h3>
            <ul className="text-xs font-garamond italic space-y-2 leading-relaxed text-stone-400">
              <li>
                <strong className="text-amber-400 font-cinzel not-italic">1. Face Reflection:</strong> Allow camera access so the spirit can observe your expression and emotional demeanor.
              </li>
              <li>
                <strong className="text-amber-400 font-cinzel not-italic">2. The Whispered Rite:</strong> Tap the microphone icon or whisper invocations like "Mirror, mirror, who walks beside me?".
              </li>
              <li>
                <strong className="text-amber-400 font-cinzel not-italic">3. The Prophecy:</strong> Tap "Commune with Mirror" to receive custom Victorian Gothic poetic riddles and hear the spectral voice.
              </li>
              <li>
                <strong className="text-amber-400 font-cinzel not-italic">4. Candlelight & Filters:</strong> Click either candle to snuff or relight the flame, altering room shadow and spectral intensity.
              </li>
            </ul>
            <button
              onClick={() => setShowGuide(false)}
              className="w-full mt-4 py-2 bg-stone-900 border border-stone-700 text-stone-200 font-cinzel text-xs uppercase tracking-wider hover:bg-stone-800"
            >
              Return to the Glass
            </button>
          </div>
        </div>
      )}

      {/* Main Parlor Room Viewport */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 max-w-6xl mx-auto w-full">
        {/* Center Stage: Sconces & Mirror Trio */}
        <div className="relative w-full flex items-center justify-center gap-2 sm:gap-6 md:gap-10">
          {/* Left Candle Sconce */}
          <div className="hidden sm:block shrink-0">
            <CandleSconce
              side="left"
              isLit={leftCandleLit}
              onToggle={() => {
                setLeftCandleLit(!leftCandleLit);
                hauntedAudio.playWhisperChime();
              }}
            />
          </div>

          {/* Centerpiece Haunted Mirror */}
          <div className="flex-1 flex justify-center">
            <HauntedMirror
              filterSettings={filterSettings}
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              isSpeaking={isSpeaking}
              roomLightLevel={roomLightLevel}
              onReplaySpeech={() => {
                if (analysis?.prophecyVerse) {
                  playProphecyVoice(analysis.prophecyVerse);
                }
              }}
              onCaptureFrame={handleCaptureFrame}
            />
          </div>

          {/* Right Candle Sconce */}
          <div className="hidden sm:block shrink-0">
            <CandleSconce
              side="right"
              isLit={rightCandleLit}
              onToggle={() => {
                setRightCandleLit(!rightCandleLit);
                hauntedAudio.playWhisperChime();
              }}
            />
          </div>
        </div>

        {/* Spoken Incantation and Speech Bar */}
        <div className="w-full mt-4">
          <IncantationBar
            onCommuneWithText={(inquiry) => handleCommune(inquiry)}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Victorian Brass Interaction Strip & Veil Controls */}
        <SpectralControls
          onCommune={() => handleCommune()}
          onSnapshot={handleManualSnapshot}
          onOpenGrimoire={() => setIsGrimoireOpen(true)}
          grimoireCount={grimoireEntries.length}
          isAnalyzing={isAnalyzing}
          filterSettings={filterSettings}
          onUpdateFilterSettings={(newSettings) =>
            setFilterSettings((prev) => ({ ...prev, ...newSettings }))
          }
          audioSettings={audioSettings}
          onUpdateAudioSettings={(newSettings) =>
            setAudioSettings((prev) => ({ ...prev, ...newSettings }))
          }
        />
      </main>

      {/* Grimoire Archive Modal */}
      <GrimoireModal
        isOpen={isGrimoireOpen}
        onClose={() => setIsGrimoireOpen(false)}
        entries={grimoireEntries}
        onPlaySpeech={playProphecyVoice}
        onClearGrimoire={() => setGrimoireEntries([])}
      />

      {/* Subtle Parlor Footer */}
      <footer className="relative z-10 py-3 text-center text-[11px] font-garamond italic text-stone-600 border-t border-stone-900/60">
        <span>The Haunted Mirror · Powered by Gemini Multimodal Vision & Spectral TTS</span>
      </footer>
    </div>
  );
}
