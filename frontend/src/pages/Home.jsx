import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const NODE_BASE = import.meta.env.VITE_BACKEND_URL;
const FASTAPI_BASE = import.meta.env.VITE_FASTAPI_URL;

const CHAT = `${NODE_BASE}/api/chat`;
const STREAM = `${FASTAPI_BASE}/stream-chunks`;
const CHUNK = (f) => `${FASTAPI_BASE}/chunks/${f}`;
const STOP = `${FASTAPI_BASE}/stop-watcher`;

export default function LiveVideoStream() {
  const [logs, setLogs] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [canStop, setCanStop] = useState(false);

  const videoRef = useRef();
  const esRef = useRef(null);
  const alive = useRef(false);

  let ms,
    sb,
    pending = [],
    offset = 0,
    expected = 0;

  const waiting = new Map();
  const parseIdx = (n) => Number(n.match(/chunk_(\d+)\.mp4/)[1]);

  const log = (m) =>
    setLogs(
      (p) =>
        `[${new Date().toLocaleTimeString("en-GB", {
          hour12: false,
        })}] ${m}\n` + p
    );

  const append = (buf) => {
    if (!alive.current || !sb) return;
    if (sb.updating || pending.length) pending.push(buf);
    else {
      sb.timestampOffset = offset;
      sb.appendBuffer(buf);
    }
  };

  const tryFlush = () => {
    if (!alive.current || !sb) return;
    while (waiting.has(expected) && !sb.updating) {
      const buf = waiting.get(expected);
      waiting.delete(expected);
      sb.timestampOffset = offset;
      sb.appendBuffer(buf);
      expected += 1;
    }
  };

  const fetchChunk = (name) => {
    const idx = parseIdx(name);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", CHUNK(name), true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      if (!alive.current) return;
      if (xhr.status === 200) {
        const buf = xhr.response;
        log(`chunk ${idx} ${Math.round(buf.byteLength / 1024)} KB`);
        waiting.set(idx, buf);
        tryFlush();
      } else log(`${name} ${xhr.status}`);
    };
    xhr.send();
  };

  const onUpdateEnd = () => {
    if (!alive.current || !sb) return;
    offset = sb.buffered.end(sb.buffered.length - 1);
    tryFlush();
    if (sb.buffered.length && videoRef.current.paused)
      videoRef.current.play().catch(() => {});
  };

  const openSSE = () => {
    esRef.current = new EventSource(STREAM);
    esRef.current.addEventListener("chunk", (e) => fetchChunk(e.data.trim()));
    esRef.current.addEventListener("end", closeAll);
    esRef.current.onerror = () => log("SSE error");
  };

  const closeAll = () => {
    alive.current = false;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    if (ms && ms.readyState === "open") ms.endOfStream();
    pending = [];
    offset = 0;
    setBusy(false);
    setCanStop(false);
    log("Stream ended");
  };

  const start = async () => {
    if (!text.trim()) return alert("Enter text");
    setBusy(true);
    log("Sending text …");
    try {
      const rsp = await fetch(CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!rsp.ok) throw Error("chat failed");

      alive.current = true;
      expected = 0;
      waiting.clear();
      ms = new MediaSource();
      videoRef.current.src = URL.createObjectURL(ms);
      ms.addEventListener("sourceopen", () => {
        const mime = [
          'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
          "video/mp4",
        ].find((t) => MediaSource.isTypeSupported(t));
        if (!mime) {
          log("No supported mime");
          setBusy(false);
          alive.current = false;
          return;
        }
        sb = ms.addSourceBuffer(mime);
        sb.mode = "segments";
        sb.addEventListener("updateend", onUpdateEnd);
        setCanStop(true);
        log("waiting first chunk …");
        openSSE();
      });
    } catch (e) {
      log("error " + e);
      setBusy(false);
      alive.current = false;
    }
  };

  const stop = () => {
    fetch(STOP).catch(() => {});
    closeAll();
    log("Stopped");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto mt-14 max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/20 via-white/10 to-white/5 p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
    >
      <h2 className="mb-10 bg-gradient-to-r from-teal-400 via-sky-500 to-indigo-600 bg-clip-text text-center text-5xl font-black tracking-tight text-transparent drop-shadow-lg">
        SyncTalk Live
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-8 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl ring-2 ring-white/10"
      >
        <video ref={videoRef} playsInline className="w-full" />
      </motion.div>

      <div className="mb-10 grid gap-4 sm:grid-cols-[1fr_auto_auto]">
        <input
          className="rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-lg placeholder-slate-400 backdrop-blur-lg focus:outline-none focus:ring-4 focus:ring-sky-400"
          placeholder="Type your prompt…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={start}
          disabled={busy}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:from-emerald-600 hover:to-sky-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-40"
        >
          Start
        </button>
        <button
          onClick={stop}
          disabled={!canStop}
          className="rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:from-pink-600 hover:to-fuchsia-700 focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-40"
        >
          Stop
        </button>
      </div>

      <div className="h-60 overflow-y-auto rounded-xl bg-black/80 p-5 shadow-inner ring-1 ring-white/10">
        <pre className="whitespace-pre-wrap text-sm text-green-400">{logs}</pre>
      </div>
    </motion.div>
  );
}
