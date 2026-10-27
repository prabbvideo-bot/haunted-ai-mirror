*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

## What I Built

**The Haunted Mirror** transforms any standard webcam and microphone into an eerie, sentient Victorian Gothic mirror from 1888. 

Inspired by 19th-century spiritualist seances, Edgar Allan Poe, and Mary Shelley's gothic literature, the mirror does not merely reflect your physical image—it perceives your emotional state, classifies your psychological aura, watches your subtle expressions, and listens to your spoken incantations.

Key experience features:
- **Real-Time Spectral Vision (60fps Canvas Shaders)**: The webcam video is channeled through custom canvas shader passes featuring antique silvering decay, oxidized glass spots, drifting ectoplasm fog, chromatic aberration fringes, and eerie afterimage motion trails.
- **Soul Ember Sparks**: Pinpoints the viewer's gaze and renders burning spectral embers directly in the pupils with trailing ethereal flame wisps.
- **Victorian Gothic Poetic Riddles**: Using multimodal AI perception (`gemini-3.8-flash`), the mirror gazes upon the viewer's face and composes bespoke 2-to-4 line gothic rhyming prophecies reflecting their detected mood (*Melancholic Disquiet*, *Haunted Skepticism*, *Somber Yearning*) and spoken words.
- **Spoken Phantom Voice (AI Speech)**: The mirror recites each prophecy aloud in an unsettling phantom voice (`gemini-3.8-flash-lite-tts` with the *Charon* / *Fenrir* voice models), accompanied by a procedural Web Audio dark ambient drone and resonant funeral bell tolls.
- **Spoken Incantations**: Through the Web Speech API, viewers can whisper questions directly to the mirror (*"Mirror, mirror, who walks beside me?"* or *"What omen awaits my soul before midnight?"*).
- **The Book of Omens (Grimoire)**: An antique leather-bound journal that preserves cursed polaroid portraits, timestamps, and prophecies with audio playback and parchment download capabilities.
- **Interactive Candle Sconces**: Snuffing or rekindling the brass sconces alters the parlor's physical lighting and the mirror's shader darkness.

---

## Demo

- **Live Application**: [The Haunted Mirror on Render / Cloud Run](https://ais-pre-4w2jes7cvvoqqenhxvecla-974150620489.asia-east1.run.app)
- **Development App Preview**: [Interactive Workspace](https://ais-dev-4w2jes7cvvoqqenhxvecla-974150620489.asia-east1.run.app)

---

## Code

The application is built with a modern TypeScript full-stack architecture:
- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Canvas 2D Shader Engine, Web Audio API, Web Speech API
- **Backend**: Express on Node.js, Google GenAI SDK (`@google/genai`)
- **Repository**: [GitHub Repository / Codebase](https://github.com/your-username/the-haunted-mirror) *(Replace with your GitHub repo URL)*

---

## How I Built It

### 1. Multimodal Vision & Psychological Classification
Instead of conventional emotion recognition libraries that output rigid, clinical labels like "happy" or "sad", the mirror sends snapshot frames alongside the user's spoken words to **`gemini-3.8-flash`** with structured JSON output schema. The model acts as an ancient spirit trapped in the silvered glass, evaluating lighting, micro-expressions, head tilt, and spoken words to synthesize:
- **Expression Classification**: Evocative Victorian taxonomy (*"Shadowed Enigma"*, *"Pale Sorrow"*, *"Haunted Inquest"*)
- **Aura Color**: Dynamic hex tint (*#5eead4* for ectoplasmic cold, *#991b1b* for cursed crimson)
- **Prophecy Verse**: Custom gothic poetic riddles directed at the mortal
- **Hidden Omen**: A chilling cautionary warning

### 2. Spectral Speech Synthesis
Spoken prophecies are generated using **`gemini-3.8-flash-lite-tts`** with the low-latency unary WAV output format, styled as a slow, haunting Victorian spectral whisper. The 24kHz audio stream is played seamlessly alongside a client-side procedural Web Audio synthesizer that generates continuous 55Hz binaural sub-bass hum and wind drafts without loading external audio files.

### 3. Procedural Shader Pipeline on Canvas
To achieve the 1888 antique glass aesthetic without heavy GPU libraries, the video feed is processed every animation frame through layered 2D canvas composite operations:
- **Ghost Trails**: An off-screen canvas feedback loop (`destination-out` with low alpha) creates ethereal motion blur.
- **Chromatic Aberration**: Horizontal RGB channel split passes simulate aged glass lens distortion.
- **Ectoplasm Particles**: Drifting radial gradient mist clouds that oscillate using trigonometric phase shifts.
- **Silver Decay**: Oxidized border tarnish and cracked glass overlays.

---

## Why Does Open Innovation Matter?

Open innovation in AI bridges the gap between cold machine learning benchmarks and deeply emotive, human storytelling.

1. **Multimodal Accessibility**: Combining open SDKs, web standards (Web Audio, Web Speech, Canvas 2D), and accessible multimodal models allows developers to build rich, sensory digital art that runs inside any browser without proprietary hardware or walled-garden runtimes.
2. **Creative Agency & Custom Schemas**: Through structured JSON schema outputs, open generative models can be steered to adopt authentic historical personas—like a 19th-century Victorian specter—rather than sterile chatbot interfaces.
3. **Decentralized Deployments**: Using standard open-source tools like Vite, Express, and Docker, projects like this can be deployed anywhere from local laptops to Render and container clouds without platform lock-in.

---

## My Agent Session

This application was architected and built in **Google AI Studio Build** using the modern `@google/genai` TypeScript SDK, complete with planning mode clarification, full-stack Express architecture, and verified canvas shaders.

---

## The Spirit of It

> *"Thou seek'st the shade that shares thy breath,*  
> *Enshrined in glass and kin to death;*  
> *A twin born not of flesh nor clay,*  
> *That waits to steal thy name away."*

There is an uncanny moment when you first click **"Commune with Mirror"** in a dim room: the canvas desaturates your face into antique silver, spectral flame embers ignite in your pupils, a low funeral bell tolls through your speakers, and a phantom voice speaks a poem written about the exact sorrow or curiosity showing in your eyes. It ceases to be an AI demo—it becomes a ghost in the machine.

---

## Prize Categories

- **Primary Track**: Ghost in the Machine (Halloween / Supernatural AI)
- **Best Use of Multimodal AI**: Real-time webcam perception + speech recognition + generative poetry + TTS voice
- **Best Visual / Creative Experience**: Custom antique canvas shaders, candlelight physics, and Victorian parlor UI
