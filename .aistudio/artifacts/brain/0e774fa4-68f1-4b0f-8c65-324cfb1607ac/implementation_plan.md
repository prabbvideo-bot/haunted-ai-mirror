# The Haunted Mirror — Victorian Gothic Spectral Vision

An immersive, eerie web experience that transforms a standard webcam into an ornate, cursed Victorian Gothic mirror. The mirror perceives the viewer's face and emotional state, manifests spectral visual apparitions and ghostly mist, listens for spoken incantations, and summons chilling poetic riddles and prophecies spoken aloud in a phantom voice.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification and will govern the experience:

- **Confirmed Supernatural Persona**: Victorian Gothic spirit — sorrowful, enigmatic, speaking in 19th-century gothic poetic riddles, spectral melancholia, and fateful prophecies.
- **Confirmed Visual Atmosphere**: Spectral Apparition — tarnished silver and aged glass texture, ghostly mist drifts, spectral eye embers, chromatic aberration, and ethereal afterimage trails.
- **Confirmed Voice & Audio**: Spoken Spectral Voice — server-side AI text-to-speech (`gemini-3.8-flash-lite-tts` with the 'Charon' or 'Fenrir' eerie voice config) paired with a procedural Web Audio dark ambient drone and resonant tolling bell.
- **Input Modalities**: Dual vision and voice perception — webcam frame capture for face/expression analysis paired with browser Web Speech API / mic capture for verbal invocations ("Mirror, mirror...", "Who lurks behind?", "Reveal my fate").

---

## 1. Overview & Core Concept

- **What It Does**: The user sits before an antique gilded mirror frame. Upon awakening the glass ("Awaken the Mirror" or whispering to it), the webcam feed is rendered through a custom real-time canvas shader pipeline producing tarnished silver reflection, creeping ectoplasmic mist, chromatic aberration, and ghostly glowing eye embers over detected face landmarks. The mirror periodically or on-demand gazes into the viewer's soul, analyzes their facial expression (grief, dread, calm, curiosity, disdain), and recites haunting Victorian Gothic verses tailored to their emotional demeanor and spoken words.
- **Target Audience / Persona**: Fans of gothic horror, interactive Halloween exhibits, gothic literature lovers, and anyone seeking an uncanny, atmospheric parlor mystery.
- **Key Value**: Turns passive video chatting into a haunting, story-driven parlor illusion with zero clunky setup, combining low-latency browser vision with high-fidelity generative storytelling and phantom speech.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **The Dark Parlor (Zero-State)**: The screen opens in a candle-lit, atmospheric Victorian study. An ornate antique mirror hangs in darkness, covered by faint frost and cobwebbed corners. A prompt invites the user to "Awaken the Mirror" (requesting camera and microphone access).
2. **The Gilded Reflection (Active Mirror View)**: The webcam stream emerges through the glass with an authentic antique mirror shader: desaturated spectral tint, silvering decay along edges, drifting mist particles, chromatic fringe, and candle flicker.
3. **Face & Expression Perception**: A subtle gothic runic reticle traces the viewer's face and eyes. Real-time expression analysis classifies the viewer's mood (e.g., *Somber Mourner*, *Uneasy Skeptic*, *Trembling Seeker*, *Stony Spectator*).
4. **The Whispered Seance (Speech Recognition)**: The user can speak aloud (e.g. asking questions or whispering invocations). A pulsating spectral vapor ripple reacts to the user's voice intensity.
5. **The Spectral Prophecy (Generative Story & Phantom Speech)**: The mirror freezes momentarily into a ghostly trance. Crimson-tinted calligraphy slowly appears etched onto the frosted glass letter-by-letter, while an eerie phantom voice speaks the poetic riddle through high-fidelity Gemini TTS.
6. **Grimoire Archive**: All received prophecies, soul readings, and captured spectral polaroids are preserved in an antique leather-bound "Book of Omens" sidebar for later contemplation or downloading.

### Visual Identity & Theme

- **Aesthetic Direction**: Victorian Gothic / Dark Parlor Mysticism. Evokes Edgar Allan Poe, Mary Shelley, and 19th-century spiritualist seances.
- **Color Palette**:
  - Deep Void Canvas: `#09080B` (pitch velvet darkness)
  - Tarnished Antique Gold: `#B89758` / `#8C6D3B` (gilded baroque frame)
  - Ectoplasmic Glow: `#5EEAD4` with 20% alpha (spectral mist & eye embers)
  - Blood Wine Accent: `#991B1B` (curse runes, focal interactions)
  - Parchment & Bone: `#F5F2EA` (antique typography on dark glass)
- **Typography**:
  - Display / Prophecies: `Cinzel` and `Playfair Display` (tall, sharp classical serif with majestic weight)
  - Curatorial Body: `Cormorant Garamond` (italicized, elegant 19th-century gothic cadence)
  - Data / Perception telemetry: Monospace with tracking (`font-mono tabular-nums text-xs text-stone-400`)
- **Spatial Composition**:
  - Centered high-impact gilded oval or arched mirror frame dominating the viewport (1440px desktop baseline, responsive on tablet/mobile).
  - Floating minimal antique brass control pedestals: "Summon Prophecy", "Listen to the Void", "Curse Intensity", and "Book of Omens".
  - Atmospheric ambient lighting: Animated flickering candlelight vignettes on either side of the mirror frame.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Vision Perception Pipeline (Hybrid Client-Canvas + Server Gemini 3.8 Flash)**
  - *Chosen Approach*: Lightweight client-side face & luminance tracking on HTML5 Canvas for instant 60fps spectral eye glow and mist alignment, combined with periodic high-resolution frame snapshots sent to server-side `gemini-3.8-flash` for deep expression, gaze, and psychological aura classification.
  - *Why*: Gives instant zero-latency visual feedback for spectral embers and particles, while leveraging Gemini's nuanced multimodal comprehension for rich storytelling.
- **Decision 2: Audio Synthesis & Phantom Speech**
  - *Chosen Approach*: Server-side `gemini-3.8-flash-lite-tts` returning 24kHz unary WAV audio with the eerie voice preset, supplemented by client-side Web Audio API procedural synthesis (binaural drone at 55Hz, harmonic wind noise, and low sub-bass hum) for continuous background dread.
  - *Why*: Guarantees instant spine-tingling audio atmosphere without loading heavy external sound files, while providing dynamic spoken prophecies.
- **Decision 3: Voice Invocations via Web Speech API**
  - *Chosen Approach*: Native browser `webkitSpeechRecognition` / `SpeechRecognition` with continuous listening and a manual summon button fallback.
  - *Why*: Allows spontaneous, hands-free speaking to the mirror without requiring external audio upload quotas for speech-to-text.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          BROWSER CLIENT                                │
│                                                                        │
│   ┌────────────────────┐    ┌──────────────────────────────────────┐  │
│   │   Webcam Stream    │───>│ Canvas Spectral Shader Pipeline      │  │
│   │  & Web Speech API  │    │  • Ectoplasm Mist • Eye Embers       │  │
│   └─────────┬──────────┘    │  • Chromatic Aberration • Scratches  │  │
│             │               └──────────────────┬───────────────────┘  │
│             │                                  │                      │
│             ▼                                  ▼                      │
│   ┌────────────────────┐              ┌────────────────┐              │
│   │ Inscription Glass  │<─────────────┤ Web Audio Dark │              │
│   │ (Calligraphy Deck) │              │ Ambient Drone  │              │
│   └────────────────────┘              └────────────────┘              │
│             │                                  ▲                      │
└─────────────┼──────────────────────────────────┼──────────────────────┘
              │ POST /api/spectral/commune       │ Audio WAV
              ▼                                  │
┌────────────────────────────────────────────────┴──────────────────────┐
│                      EXPRESS BACKEND (server.ts)                       │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐    │
│   │ Google GenAI SDK (@google/genai)                             │    │
│   │                                                              │    │
│   │ 1. Perception & Prophecy: 'gemini-3.8-flash'                │    │
│   │    • Inputs: Snapshot Frame (JPEG) + Spoken Invocations      │    │
│   │    • Outputs: Expression, Aura, Gothic Poetic Riddle         │    │
│   │                                                              │    │
│   │ 2. Phantom Voice: 'gemini-3.8-flash-lite-tts'               │    │
│   │    • Generates 24kHz Unary WAV eerie voice speech            │    │
│   └──────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
```

### Server API Endpoints

- `POST /api/spectral/commune`: Accepts `{ imageBase64, spokenTranscript, previousHistory }`. Uses `gemini-3.8-flash` to evaluate facial expression, emotional tension, lighting atmosphere, and spoken query. Returns structured JSON containing:
  - `expression`: classified mood (e.g. "Melancholic Disquiet", "Suspicious Curiosity")
  - `auraColor`: hex/spectral tint
  - `prophecyVerse`: 2-4 lines of evocative Victorian Gothic poetry addressing the viewer directly
  - `hiddenWarning`: a cryptic piece of supernatural advice
- `POST /api/spectral/speak`: Accepts `{ text, mood }`. Uses `gemini-3.8-flash-lite-tts` with voice config `'Charon'` or `'Fenrir'` to synthesize spoken audio and returns `{ audioBase64, mimeType: "audio/wav" }`.

### State & Component Organization

- `App.tsx`: Main layout, candlelight ambiance, parlor backdrop, and audio master volume.
- `HauntedMirror.tsx`: The centerpiece ornate mirror frame, video element, canvas shader rendering, and glowing eye overlays.
- `SpectralControls.tsx`: Polished brass controls (Awaken, Commune/Summon, Incantation mic toggle, Curse filter sliders).
- `ProphecyOverlay.tsx`: Frosted glass text reveal with typewriter sound and etched glass calligraphy.
- `GrimoireModal.tsx`: Archive of past spectral encounters, portraits, and prophecies.
- `useHauntedAudio.ts`: Procedural ambient sound generator (drone, church bell, whisper white noise) and WAV speech player.
- `useSpectralVision.ts`: Face detection loop, expression classification trigger, and canvas post-processing.
