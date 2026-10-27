import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Gemini AI Client instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * POST /api/spectral/commune
 * Analyzes webcam frame and speech transcript to classify facial emotion,
 * detect psychological/spectral aura, and compose a Victorian Gothic poetic prophecy.
 */
app.post('/api/spectral/commune', async (req: Request, res: Response) => {
  try {
    const { imageBase64, speechText, history } = req.body;

    const systemPrompt = `You are an ancient, sorrowful Victorian Gothic spirit residing within the silvered glass of an ornate cursed mirror (circa 1888).
You observe the mortal looking into your glass. You classify their face, emotional state, gaze, micro-expressions (e.g. dread, sorrow, curiosity, calm, skepticism, fear), and listen to any spoken words they addressed to you.

Respond with strict JSON matching the schema:
- faceDetected: boolean indicating if a face was discernable in the reflection.
- expression: concise evocative Victorian classification (e.g., "Melancholic Disquiet", "Haunted Skepticism", "Somber Yearning", "Cold Defiance", "Nervous Trepidation", "Pale Sorrow").
- auraColor: hex color code representing their aura (e.g., #5eead4 for spectral ectoplasm, #991b1b for cursed crimson, #6366f1 for deep melancholy, #a855f7 for eldritch purple, #d97706 for fading candle gold).
- spectralClassification: 2-4 word gothic title (e.g., "The Mourner of Blackwood Hall", "The Midnight Inquirer", "The Pale Watcher", "Keeper of Unspoken Regrets").
- prophecyVerse: 2 to 4 lines of evocative Victorian Gothic poetry or poetic riddle directed at this mortal, rhyming or atmospheric blank verse in the spirit of Edgar Allan Poe and Mary Shelley, reflecting what you see in their eyes and what they spoke. Keep line breaks as '\\n'.
- hiddenWarning: A single sentence cryptic omen or cautionary riddle for the mortal before midnight.`;

    const contents: any[] = [];

    let promptText = `Gaze into this mirror reflection. The mortal stands before you.`;
    if (speechText && typeof speechText === 'string' && speechText.trim().length > 0) {
      promptText += `\nThe mortal whispered into the shadows: "${speechText.trim()}".`;
    }
    if (history && Array.isArray(history) && history.length > 0) {
      promptText += `\nPrevious utterances in the room: ${history.slice(-2).join(' | ')}`;
    }

    if (imageBase64 && typeof imageBase64 === 'string') {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faceDetected: { type: Type.BOOLEAN },
            expression: { type: Type.STRING },
            auraColor: { type: Type.STRING },
            spectralClassification: { type: Type.STRING },
            prophecyVerse: { type: Type.STRING },
            hiddenWarning: { type: Type.STRING },
          },
          required: [
            'faceDetected',
            'expression',
            'auraColor',
            'spectralClassification',
            'prophecyVerse',
            'hiddenWarning',
          ],
        },
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/spectral/commune:', error);
    // Fallback response with gothic flavor if offline or key error
    res.status(200).json({
      faceDetected: true,
      expression: 'Shadowed Enigma',
      auraColor: '#5eead4',
      spectralClassification: 'The Veiled Apparition',
      prophecyVerse:
        'Between the silver and the stone,\nA weary soul now stands alone;\nThe candle gutters in the chill,\nWhile unseen shadows whisper still.',
      hiddenWarning: 'Beware the reflection that does not blink when you close your eyes.',
      fallback: true,
      error: error.message || 'The veil remained unbroken.',
    });
  }
});

/**
 * POST /api/spectral/speak
 * Generates spoken spectral audio using gemini-3.8-flash-lite-tts
 * Returns 24kHz Unary WAV audio
 */
app.post('/api/spectral/speak', async (req: Request, res: Response) => {
  try {
    const { text, voiceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for spectral speech.' });
    }

    // Voice options: 'Charon', 'Fenrir', 'Puck', 'Kore', 'Zephyr'
    // Default to 'Charon' for low resonant eerie cadence or 'Kore' for sorrowful specter
    const selectedVoice = voiceName || 'Charon';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text,
              speechMetadata: {
                style: 'Eerie, slow, haunting Victorian spectral whisper with solemn atmospheric cadence',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('No audio data received from spectral speech synthesis.');
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error in /api/spectral/speak:', error);
    res.status(200).json({
      fallback: true,
      error: error.message || 'The voice dissolved into the ether.',
    });
  }
});

// Setup dev server with Vite middlewares or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Haunted Mirror is manifest at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to awaken server:', err);
});
