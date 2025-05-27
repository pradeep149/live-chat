import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

if (!process.env.OPENAI_API_KEY)
  throw new Error("Missing OPENAI_API_KEY in .env");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

const history = [
  {
    role: "system",
    content:
      "You are a helpful assistant Keep every reply under 100 words or 8 sentences, talk like a regular human being",
  },
];

app.post("/api/chat", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "No text provided" });

    /* -------- ChatGPT call -------- */
    const openaiResp = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [...history, { role: "user", content: text }],
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        timeout: 30000,
      }
    );

    let gptReply = openaiResp.data.choices[0].message.content.trim();

    history.push({ role: "user", content: text });
    history.push({ role: "assistant", content: gptReply });

    const fastapiUrl =
      process.env.FASTAPI_URL ||
      "https://phkipjalknwbtb-8000.proxy.runpod.net/run-model-stream";

    const runpodResp = await axios.post(
      fastapiUrl,
      { text: gptReply },
      { timeout: 30000 }
    );

    res.status(200).json({
      gpt_reply: gptReply,
      forwarded: true,
      id: runpodResp.data.id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal error" });
  }
});

app.get("/", (_req, res) => res.send("Node gateway running"));
app.listen(PORT, () => console.log(`Gateway on port ${PORT}`));
