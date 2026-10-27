import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, MessageSquareQuote, Sparkles } from 'lucide-react';

interface IncantationBarProps {
  onCommuneWithText: (spokenInquiry: string) => void;
  isAnalyzing: boolean;
}

export const IncantationBar: React.FC<IncantationBarProps> = ({
  onCommuneWithText,
  isAnalyzing,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Failed to start recognition:', err);
      }
    }
  }, [isListening]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!transcript.trim() || isAnalyzing) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    onCommuneWithText(transcript.trim());
    setTranscript('');
  };

  const sampleIncantations = [
    'Mirror, mirror, who walks beside me?',
    'What omen awaits my soul before midnight?',
    'Gaze into my reflection and speak my hidden truth.',
    'Are there phantoms in this quiet room?',
  ];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-2">
      {/* Voice Inquiry Bar */}
      <form
        onSubmit={handleSubmit}
        className="w-full relative flex items-center bg-[#0d0b11] border border-stone-800/80 rounded-md p-1.5 shadow-xl focus-within:border-amber-600/60 transition-colors"
      >
        {/* Mic Toggle Button */}
        {speechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-red-950/80 text-red-300 border border-red-700/60 animate-pulse'
                : 'text-stone-400 hover:text-amber-300 hover:bg-stone-900'
            }`}
            title={isListening ? 'Cease listening' : 'Whisper to the mirror'}
          >
            {isListening ? (
              <Mic className="w-4 h-4 text-red-400" />
            ) : (
              <MicOff className="w-4 h-4 text-stone-500" />
            )}
          </button>
        )}

        {/* Input field */}
        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={
            isListening
              ? 'The mirror listens to your whisper...'
              : 'Whisper an incantation or question to the glass...'
          }
          disabled={isAnalyzing}
          className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm font-garamond italic text-stone-200 placeholder:text-stone-600 outline-none"
        />

        {/* Submit Incantation */}
        <button
          type="submit"
          disabled={!transcript.trim() || isAnalyzing}
          className="px-3 py-1.5 bg-stone-900 border border-amber-800/40 text-amber-400 text-xs font-cinzel uppercase tracking-wider rounded-xs hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          <Send className="w-3 h-3" />
          <span className="hidden sm:inline">Inquire</span>
        </button>
      </form>

      {/* Suggested Spoken Incantations */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
        <span className="text-[10px] font-cinzel uppercase tracking-widest text-stone-500 mr-1 flex items-center gap-1">
          <MessageSquareQuote className="w-3 h-3 text-amber-600/70" />
          Invocations:
        </span>
        {sampleIncantations.map((incantation, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setTranscript(incantation);
              onCommuneWithText(incantation);
            }}
            disabled={isAnalyzing}
            className="text-[11px] font-garamond italic text-stone-400 hover:text-amber-300 hover:border-amber-700/50 px-2 py-0.5 rounded-xs bg-[#110f17] border border-stone-800 transition-colors cursor-pointer"
          >
            "{incantation}"
          </button>
        ))}
      </div>
    </div>
  );
};
