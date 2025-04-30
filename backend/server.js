import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream";
import fs from "fs";
import { promisify } from "util";
import axios from "axios";
import FormData from "form-data";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

const allowedOrigins = ["https://text-to-video-app-one.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

const openai = new OpenAI();
const backendUrl = process.env.BACKEND_URL;

const gcClient = new TextToSpeechClient({
  credentials: {
    client_email: process.env.CLIENT_EMAIL_GC,
    private_key: process.env.PRIVATE_KEY_GC?.replace(/\\n/g, "\n"),
  },
});

const streamPipeline = promisify(pipeline);

app.use("/public", express.static(publicDir));

app.post("/api/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.sendStatus(400);

  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "sage",
    input: text,
    response_format: "wav",
  });

  const file = `audio_${Date.now()}.wav`;
  const out = fs.createWriteStream(path.join(publicDir, file));
  await streamPipeline(response.body, out);

  res.json({ audioUrl: `${backendUrl}/public/${file}` });
});

app.post("/api/tts-gc", async (req, res) => {
  const { text, langCode = "en-US", gender = "FEMALE", pitch = 1.2 } = req.body;
  if (!text) return res.sendStatus(400);

  const [tts] = await gcClient.synthesizeSpeech({
    input: { text },
    voice: { languageCode: langCode, ssmlGender: gender },
    audioConfig: { audioEncoding: "LINEAR16", pitch },
  });
  if (!tts.audioContent) return res.sendStatus(500);

  const form = new FormData();
  form.append("file", tts.audioContent, {
    filename: `tts.wav`,
    contentType: "audio/wav",
  });

  await axios.post(
    "https://phkipjalknwbtb-8000.proxy.runpod.net/run-model-stream",
    form,
    {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    }
  );

  res.json({ ok: true });
});

app.get("/", (_, res) => res.send("API OK"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
