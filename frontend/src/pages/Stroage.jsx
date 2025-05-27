import React, { useState, useRef } from "react";

const NODE_BASE = import.meta.env.VITE_BACKEND_URL;
const FASTAPI_BASE = import.meta.env.VITE_FASTAPI_URL;

const CHAT = `${NODE_BASE}/api/chat`;
const STREAM = `${FASTAPI_BASE}/stream-chunks`;
const CHUNK = (f) => `${FASTAPI_BASE}/chunks/${f}`;
const STOP = `${FASTAPI_BASE}/stop-watcher`;

export default function LiveVideoStream() {
  const [logs, setLogs] = useState("Idle");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [canStop, setCanStop] = useState(false);

  const videoRef = useRef();
  const esRef = useRef(null);
  const alive = useRef(false); // ‼️ new: true while a stream is active

  let ms, sb;
  let pending = [];
  let offset = 0;

  /* --------- helpers ------------------------------------------------- */
  const log = (m) =>
    setLogs(
      (p) =>
        `[${new Date().toLocaleTimeString("en-GB", {
          hour12: false,
        })}] ${m}\n` + p
    );

  const append = (buf) => {
    if (!alive.current || !sb) return; // ‼️ guard
    if (sb.updating || pending.length) pending.push(buf);
    else {
      sb.timestampOffset = offset;
      sb.appendBuffer(buf);
    }
  };

  let expected = 0;
  const waiting = new Map();
  const parseIdx = (name) => Number(name.match(/chunk_(\d+)\.mp4/)[1]);

  const tryFlush = () => {
    if (!alive.current || !sb) return; // ‼️ guard
    while (waiting.has(expected) && !sb.updating) {
      const buf = waiting.get(expected);
      waiting.delete(expected);
      sb.timestampOffset = offset;
      sb.appendBuffer(buf);
      expected += 1;
    }
  };

  /* --------- chunk fetch --------------------------------------------- */
  const fetchChunk = (name) => {
    const idx = parseIdx(name);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", CHUNK(name), true);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      if (!alive.current) return; // ignore late chunks
      if (xhr.status === 200) {
        const buf = xhr.response;
        log(`chunk ${idx} ${Math.round(buf.byteLength / 1024)} KB`);
        waiting.set(idx, buf);
        tryFlush();
      } else {
        log(`${name} ${xhr.status}`);
      }
    };
    xhr.send();
  };

  /* --------- SourceBuffer events ------------------------------------- */
  const onUpdateEnd = () => {
    if (!alive.current || !sb) return;
    offset = sb.buffered.end(sb.buffered.length - 1);
    tryFlush();
    if (sb.buffered.length && videoRef.current.paused)
      videoRef.current.play().catch(() => {});
  };

  /* --------- SSE ------------------------------------------------------ */
  const openSSE = () => {
    esRef.current = new EventSource(STREAM);
    esRef.current.addEventListener("chunk", (e) => fetchChunk(e.data.trim()));
    esRef.current.addEventListener("end", closeAll);
    esRef.current.onerror = () => log("SSE error");
  };

  /* --------- teardown ------------------------------------------------- */
  const closeAll = () => {
    alive.current = false; // flip flag so late events are ignored
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

  /* --------- start / stop -------------------------------------------- */
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

  /* --------- UI ------------------------------------------------------- */
  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-100 rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Live Video Stream
      </h2>

      <video
        ref={videoRef}
        className="w-1/2 mx-auto rounded shadow mb-4"
        playsInline
        controls
      />

      <div className="flex gap-3 mb-4">
        <input
          className="flex-1 border rounded px-2 py-1"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          onClick={start}
          disabled={busy}
        >
          Start
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
          onClick={stop}
          disabled={!canStop}
        >
          Stop
        </button>
      </div>

      <pre className="bg-white border p-2 h-56 overflow-auto whitespace-pre-wrap">
        {logs}
      </pre>
    </div>
  );
}
