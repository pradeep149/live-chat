// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/mongodb.js";
// import OpenAI from "openai";
// import path from "path";
// import { fileURLToPath } from "url";
// import { pipeline } from "stream";
// import fs from "fs";
// import { promisify } from "util";

// dotenv.config();

// const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const publicDir = path.join(__dirname, "public");
// app.use(cors());
// app.use(express.json());

// const openai = new OpenAI();
// const backendUrl = process.env.BACKEND_URL;

// if (!fs.existsSync(publicDir)) {
//   fs.mkdirSync(publicDir, { recursive: true });
// }

// const streamPipeline = promisify(pipeline);

// app.use("/public", express.static(publicDir));

// app.post("/api/tts", async (req, res) => {
//   const { text } = req.body;
//   if (!text) return res.status(400).json({ error: "No text provided" });

//   try {
//     const response = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: "sage",
//       input: text,
//       response_format: "wav",
//     });

//     const fileName = `audio_${Date.now()}.wav`;
//     const filePath = path.join(publicDir, fileName);

//     const fileStream = fs.createWriteStream(filePath);
//     await streamPipeline(response.body, fileStream);

//     res.json({ audioUrl: `${backendUrl}/public/${fileName}` });
//   } catch (error) {
//     console.error("TTS Error:", error);
//     res.status(500).json({ error: "Error generating audio" });
//   }
// });

// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// app.get("/api/test", (req, res) => {
//   res.json({ message: "Backend is connected to Frontend!" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import OpenAI from "openai";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import path from "path";
import { fileURLToPath } from "url";
import { pipeline, Readable } from "stream";
import fs from "fs";
import { promisify } from "util";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const backendUrl = process.env.BACKEND_URL;

const openai = new OpenAI();

const clientEmailGc = process.env.CLIENT_EMAIL_GC;
const privateKeyGc =
  process.env.PRIVATE_KEY_GC &&
  process.env.PRIVATE_KEY_GC.replace(/\\n/g, "\n");

const gcClient = new TextToSpeechClient({
  credentials: { client_email: clientEmailGc, private_key: privateKeyGc },
});

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
const streamPipeline = promisify(pipeline);
app.use("/public", express.static(publicDir));

app.post("/api/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "sage",
      input: text,
      response_format: "wav",
    });

    const fileName = `audio_${Date.now()}.wav`;
    const filePath = path.join(publicDir, fileName);
    const fileStream = fs.createWriteStream(filePath);
    await streamPipeline(response.body, fileStream);

    res.json({ audioUrl: `${backendUrl}/public/${fileName}` });
  } catch (err) {
    console.error("OpenAI TTS Error:", err);
    res.status(500).json({ error: "Error generating audio" });
  }
});

app.post("/api/tts-gc", async (req, res) => {
  const { text, langCode = "en-US", gender = "FEMALE", pitch = 1.2 } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const request = {
      input: { text },
      voice: { languageCode: langCode, ssmlGender: gender },
      audioConfig: { audioEncoding: "LINEAR16", pitch },
    };

    const [response] = await gcClient.synthesizeSpeech(request);
    if (!response.audioContent)
      return res.status(500).json({ error: "No audio content" });

    const fileName = `audio_${Date.now()}.wav`;
    const filePath = path.join(publicDir, fileName);

    const bufferStream = Readable.from(response.audioContent);
    const fileStream = fs.createWriteStream(filePath);

    await streamPipeline(bufferStream, fileStream);

    res.json({ audioUrl: `${backendUrl}/public/${fileName}` });
  } catch (err) {
    console.error("Google TTS Error:", err);
    res.status(500).json({ error: "Error generating audio" });
  }
});

app.get("/", (_req, res) => res.send("API is running..."));
app.get("/api/test", (_req, res) =>
  res.json({ message: "Backend is connected to Frontend!" })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
