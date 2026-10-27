import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RefreshCw, Eye, Sparkles, Volume2 } from 'lucide-react';
import { FilterSettings, SpectralAnalysis } from '../types/spectral';

interface HauntedMirrorProps {
  filterSettings: FilterSettings;
  analysis: SpectralAnalysis | null;
  isAnalyzing: boolean;
  isSpeaking: boolean;
  roomLightLevel: number; // 0 to 1 based on candle sconces
  onReplaySpeech: () => void;
  onCaptureFrame: (base64: string) => void;
}

export const HauntedMirror: React.FC<HauntedMirrorProps> = ({
  filterSettings,
  analysis,
  isAnalyzing,
  isSpeaking,
  roomLightLevel,
  onReplaySpeech,
  onCaptureFrame,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedEyes, setDetectedEyes] = useState<{ x: number; y: number }[]>([]);
  const [revealedChars, setRevealedChars] = useState<number>(0);

  // Ectoplasm mist particle positions
  const mistPhaseRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Initialize webcam
  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam media devices are not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setHasPermission(true);
        };
      }
    } catch (err: any) {
      console.warn('Webcam initialization failed:', err);
      setHasPermission(false);
      setErrorMessage(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera access was denied. Please allow camera permissions in your browser bar.'
          : 'Unable to access camera. Please check your video device settings.'
      );
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [startCamera]);

  // Typewriter effect for prophecy verse etched into glass
  useEffect(() => {
    if (!analysis?.prophecyVerse) {
      setRevealedChars(0);
      return;
    }

    setRevealedChars(0);
    const text = analysis.prophecyVerse;
    const interval = setInterval(() => {
      setRevealedChars((prev) => {
        if (prev < text.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [analysis?.prophecyVerse]);

  // Main canvas shader rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Off-screen canvas for afterimage trails
    if (!trailCanvasRef.current) {
      trailCanvasRef.current = document.createElement('canvas');
      trailCanvasRef.current.width = 640;
      trailCanvasRef.current.height = 480;
    }
    const trailCanvas = trailCanvasRef.current;
    const trailCtx = trailCanvas.getContext('2d');

    let localDetectedEyes: { x: number; y: number }[] = [];

    const render = () => {
      mistPhaseRef.current += 0.015;
      const phase = mistPhaseRef.current;

      const w = canvas.width || 640;
      const h = canvas.height || 480;

      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        // Draw into trail canvas with slight fade for ghost afterimage
        if (trailCtx) {
          if (filterSettings.ghostAfterimage) {
            trailCtx.globalCompositeOperation = 'destination-out';
            trailCtx.fillStyle = 'rgba(0, 0, 0, 0.12)';
            trailCtx.fillRect(0, 0, w, h);
            trailCtx.globalCompositeOperation = 'source-over';
            trailCtx.globalAlpha = 0.88;
            // Mirror image horizontally for authentic mirror reflection
            trailCtx.save();
            trailCtx.translate(w, 0);
            trailCtx.scale(-1, 1);
            trailCtx.drawImage(video, 0, 0, w, h);
            trailCtx.restore();
          } else {
            trailCtx.clearRect(0, 0, w, h);
            trailCtx.save();
            trailCtx.translate(w, 0);
            trailCtx.scale(-1, 1);
            trailCtx.drawImage(video, 0, 0, w, h);
            trailCtx.restore();
          }
        }

        // Draw base video from trail
        ctx.clearRect(0, 0, w, h);
        ctx.globalAlpha = 1.0;
        ctx.drawImage(trailCanvas, 0, 0, w, h);

        // Chromatic aberration passes
        if (filterSettings.chromaticAberration) {
          const shift = Math.sin(phase * 4) * 4 + 2;
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = 0.35;
          // Red channel offset left
          ctx.drawImage(trailCanvas, -shift, 0, w, h);
          // Cyan channel offset right
          ctx.drawImage(trailCanvas, shift, 0, w, h);
          ctx.globalCompositeOperation = 'source-over';
        }

        // Apply spectral coloration & desaturation
        ctx.globalCompositeOperation = 'color';
        let tintColor = 'rgba(94, 234, 212, 0.45)'; // default ectoplasm
        if (filterSettings.spectralTint === 'crimson') {
          tintColor = 'rgba(185, 28, 28, 0.4)';
        } else if (filterSettings.spectralTint === 'sepia') {
          tintColor = 'rgba(217, 119, 6, 0.35)';
        } else if (filterSettings.spectralTint === 'shadow') {
          tintColor = 'rgba(120, 113, 108, 0.5)';
        } else if (analysis?.auraColor) {
          tintColor = `${analysis.auraColor}40`;
        }
        ctx.fillStyle = tintColor;
        ctx.fillRect(0, 0, w, h);

        // Contrast and darkness pass
        ctx.globalCompositeOperation = 'multiply';
        const darkness = 0.55 + (1 - roomLightLevel) * 0.3;
        ctx.fillStyle = `rgba(18, 16, 22, ${darkness})`;
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = 'source-over';

        // Approximate eye positions based on center-anchor + breathing motion
        // (Default centered humanoid head placement in mirror)
        const eyeY = h * 0.42 + Math.sin(phase * 1.5) * 4;
        const leftEyeX = w * 0.41;
        const rightEyeX = w * 0.59;
        localDetectedEyes = [
          { x: leftEyeX, y: eyeY },
          { x: rightEyeX, y: eyeY },
        ];
        setDetectedEyes(localDetectedEyes);

        // Spectral Eye Embers (burning soul sparks in pupils)
        if (filterSettings.eyeEmbers) {
          localDetectedEyes.forEach((eye, index) => {
            const flicker = Math.sin(phase * 8 + index) * 3;
            const emberRadius = Math.max(2, 6 + flicker);

            // Outer flame wisp
            const grad = ctx.createRadialGradient(
              eye.x,
              eye.y,
              1,
              eye.x,
              eye.y,
              emberRadius * 3.5
            );
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            grad.addColorStop(0.3, analysis?.auraColor || 'rgba(94, 234, 212, 0.9)');
            grad.addColorStop(0.7, 'rgba(153, 27, 27, 0.4)');
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(eye.x, eye.y, emberRadius * 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Core hot spark
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(eye.x, eye.y, 2, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // Ectoplasmic mist drifts
        if (filterSettings.ectoplasmIntensity > 0.1) {
          const mistAlpha = filterSettings.ectoplasmIntensity * 0.45;
          ctx.globalCompositeOperation = 'screen';

          for (let i = 0; i < 4; i++) {
            const mx = (w * 0.25 * i + Math.sin(phase + i) * 60) % w;
            const my = (h * 0.3 * (i % 3) + Math.cos(phase * 0.8 + i) * 50) % h;
            const mGrad = ctx.createRadialGradient(mx, my, 10, mx, my, 160);
            mGrad.addColorStop(0, `rgba(94, 234, 212, ${mistAlpha})`);
            mGrad.addColorStop(0.5, `rgba(45, 212, 191, ${mistAlpha * 0.4})`);
            mGrad.addColorStop(1, 'transparent');

            ctx.fillStyle = mGrad;
            ctx.fillRect(0, 0, w, h);
          }
          ctx.globalCompositeOperation = 'source-over';
        }

        // Antique mirror silvering tarnish & decay
        if (filterSettings.antiqueTarnish > 0) {
          const tarnish = filterSettings.antiqueTarnish;
          ctx.fillStyle = `rgba(10, 8, 12, ${tarnish * 0.6})`;

          // Oxidized border decay
          const borderThickness = 28 * tarnish;
          ctx.lineWidth = borderThickness;
          ctx.strokeStyle = `rgba(20, 16, 24, ${tarnish * 0.85})`;
          ctx.strokeRect(0, 0, w, h);

          // Dark spotting / oxidation specks
          ctx.fillStyle = `rgba(15, 12, 18, ${tarnish * 0.75})`;
          ctx.beginPath();
          ctx.arc(35, 45, 18 * tarnish, 0, Math.PI * 2);
          ctx.arc(w - 40, 50, 24 * tarnish, 0, Math.PI * 2);
          ctx.arc(48, h - 55, 30 * tarnish, 0, Math.PI * 2);
          ctx.arc(w - 55, h - 45, 22 * tarnish, 0, Math.PI * 2);
          ctx.fill();
        }

        // Heavy dark vignette
        if (filterSettings.darkVignette > 0) {
          const vigGrad = ctx.createRadialGradient(
            w / 2,
            h / 2,
            w * 0.28,
            w / 2,
            h / 2,
            w * 0.65
          );
          vigGrad.addColorStop(0, 'transparent');
          vigGrad.addColorStop(1, `rgba(4, 3, 6, ${filterSettings.darkVignette * 0.95})`);
          ctx.fillStyle = vigGrad;
          ctx.fillRect(0, 0, w, h);
        }
      } else {
        // Fallback when waiting for webcam
        ctx.fillStyle = '#0a090e';
        ctx.fillRect(0, 0, w, h);

        const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 220);
        grad.addColorStop(0, 'rgba(45, 212, 191, 0.08)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [filterSettings, roomLightLevel, analysis?.auraColor]);

  // Method to extract clean JPEG base64 for communion
  const triggerCapture = useCallback(() => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.82);
      onCaptureFrame(dataUrl);
    } catch (e) {
      // Ignore
    }
  }, [onCaptureFrame]);

  // Periodic frame capture to keep snapshot fresh for communion
  useEffect(() => {
    const interval = setInterval(() => {
      triggerCapture();
    }, 1500);
    return () => clearInterval(interval);
  }, [triggerCapture]);

  // Immediately capture when analysis begins
  useEffect(() => {
    if (isAnalyzing) {
      triggerCapture();
    }
  }, [isAnalyzing, triggerCapture]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-3 sm:p-6"
    >
      {/* Hidden processing video */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="hidden"
        width={640}
        height={480}
      />

      {/* Ornate Victorian Gilded Frame Container */}
      <div className="relative group">
        {/* Outer Baroque Gilded Trim Border */}
        <div
          className="relative rounded-t-[180px] rounded-b-[40px] p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(184,151,88,0.15)] transition-all duration-700"
          style={{
            background:
              'radial-gradient(ellipse at 50% 15%, #d4af37 0%, #8c6d3b 35%, #45341a 70%, #20170a 100%)',
            border: '4px solid #6b5327',
          }}
        >
          {/* Decorative Crown Finial Relief on top */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-28 h-10 flex items-center justify-center">
            <svg viewBox="0 0 100 40" className="w-24 h-10 text-amber-500/90 drop-shadow-md">
              <path
                d="M50 2 L56 16 L72 8 L66 24 L86 20 L76 36 L24 36 L14 20 L34 24 L28 8 L44 16 Z"
                fill="currentColor"
                stroke="#3f2e13"
                strokeWidth="1.5"
              />
              <circle cx="50" cy="8" r="3" fill="#991b1b" />
            </svg>
          </div>

          {/* Inner Inset Silver/Ebony Bevel */}
          <div
            className="relative rounded-t-[160px] rounded-b-[28px] p-2 shadow-inner overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1b1611 0%, #0c0a08 100%)',
              border: '2px solid rgba(184, 151, 88, 0.4)',
            }}
          >
            {/* The Glass Canvas Viewport */}
            <div className="relative w-[310px] sm:w-[480px] md:w-[560px] lg:w-[620px] aspect-[3/4] max-h-[72vh] rounded-t-[150px] rounded-b-[20px] overflow-hidden bg-[#070609] shadow-2xl flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="w-full h-full object-cover select-none"
              />

              {/* Spectral Scanning Reticle / Face Aura HUD */}
              {isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[2px] transition-all">
                  <div className="w-48 h-64 rounded-full border border-teal-400/40 animate-pulse flex items-center justify-center">
                    <div className="w-40 h-56 rounded-full border border-teal-300/20" />
                  </div>
                  <div className="mt-4 px-4 py-1.5 bg-black/80 border border-teal-500/40 text-teal-300 font-cinzel text-xs tracking-widest uppercase animate-pulse">
                    Gazing into the Soul...
                  </div>
                </div>
              )}

              {/* Frosted Glass Inscription Deck (Prophecy Verse) */}
              {analysis?.prophecyVerse && (
                <div className="absolute inset-x-4 bottom-6 sm:inset-x-8 sm:bottom-8 p-4 sm:p-5 rounded-lg bg-black/75 backdrop-blur-md border border-stone-700/60 shadow-2xl animate-ink-bleed">
                  {/* Victorian Label */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 text-[11px] font-cinzel text-amber-500/90 tracking-widest uppercase">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{analysis.spectralClassification || 'Spectral Oracle'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 font-garamond italic">
                        Mood: {analysis.expression}
                      </span>
                      {onReplaySpeech && (
                        <button
                          onClick={onReplaySpeech}
                          className="p-1 hover:text-white transition-colors cursor-pointer text-stone-400"
                          title="Replay phantom voice"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-teal-400 animate-bounce' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Poetic Verse inscribed */}
                  <p className="font-playfair text-stone-100 italic text-sm sm:text-base leading-relaxed whitespace-pre-line tracking-wide drop-shadow-sm">
                    {analysis.prophecyVerse.slice(0, revealedChars)}
                    {revealedChars < analysis.prophecyVerse.length && (
                      <span className="inline-block w-1.5 h-4 bg-teal-400/80 animate-pulse ml-0.5" />
                    )}
                  </p>

                  {/* Hidden Warning / Omen */}
                  {revealedChars >= analysis.prophecyVerse.length && analysis.hiddenWarning && (
                    <div className="mt-3 pt-2 border-t border-stone-800/80 flex items-start gap-2 text-xs font-garamond text-red-300/90 tracking-wider">
                      <span className="text-red-500 font-bold uppercase font-cinzel text-[10px] tracking-widest shrink-0 mt-0.5">
                        Omen:
                      </span>
                      <span className="italic">{analysis.hiddenWarning}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Camera permission prompt or failure overlay */}
              {hasPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/90 text-stone-300">
                  <Camera className="w-10 h-10 text-stone-600 mb-3" />
                  <h3 className="font-cinzel text-base text-stone-200 mb-2">
                    The Glass is Blinded
                  </h3>
                  <p className="text-xs text-stone-400 max-w-xs mb-4 font-garamond italic">
                    {errorMessage || 'Camera access is required for the mirror to gaze upon your visage.'}
                  </p>
                  <button
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-900 border border-amber-600/60 text-amber-300 text-xs font-cinzel uppercase tracking-wider rounded-sm hover:bg-stone-800 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Awaken Glass
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
