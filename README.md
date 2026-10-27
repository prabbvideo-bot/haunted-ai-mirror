# The Haunted Mirror — Victorian Gothic Spectral Vision

An eerie, immersive web application that turns any standard webcam and microphone into an ornate, cursed 1888 Victorian Gothic mirror. The mirror perceives the viewer's face and emotional state, manifests spectral visual effects, and generates chilling poetic riddles spoken in a phantom voice.

Built for the **Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine**.

---

## Features

- **Antique Mirror Shaders (Canvas 2D)**: Real-time 60fps video processing with silvering decay, ectoplasm mist, chromatic aberration, and ghost afterimages.
- **Soul Ember Sparks**: Pinpoints the viewer's gaze and renders burning spectral flame embers in the pupils.
- **Victorian Gothic Storytelling (`gemini-3.8-flash`)**: Composes bespoke poetic riddles and hidden omens based on facial expression and spoken words.
- **Spectral Voice Synthesis (`gemini-3.8-flash-lite-tts`)**: Delivers spoken prophecies in an eerie phantom voice (*Charon*, *Fenrir*, *Kore*, *Zephyr*).
- **Procedural Web Audio Engine**: Synthesizes continuous 55Hz binaural dark ambient drone and funeral bell tolls.
- **Speech Recognition (Web Speech API)**: Whisper invocations directly to the glass.
- **Book of Omens (Grimoire)**: Preserves past revelations and polaroid portraits with audio replay and parchment download.
- **Interactive Candle Sconces**: Click candles to snuff or rekindle flames, dynamically shifting room illumination.

---

## Deploying to Render

This repository includes both **`render.yaml`** (Render Blueprint) and a production **`Dockerfile`**.

### Method 1: Render Blueprint (Recommended)

1. Push this repository to your GitHub or GitLab account.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** > **Blueprint**.
3. Connect your repository. Render will automatically detect `render.yaml`.
4. In the environment variables section, set your secret:
   - `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio.
5. Click **Apply**. Render will build and deploy the web service.

### Method 2: Manual Web Service on Render

1. Click **New +** > **Web Service**.
2. Connect your repository.
3. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free or Starter
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
5. Click **Deploy Web Service**.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# 3. Start development server
npm run dev

# 4. Open http://localhost:3000
```
