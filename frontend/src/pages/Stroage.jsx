// import React, { useContext, useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactAudioPlayer from "react-audio-player";
// import AppContext from "../context/AppContext";
// import testAudio from "../assets/test1.wav";
// import testVideo from "../assets/test.mp4";

// function generateBotResponse(text) {
//   const lower = text.toLowerCase();
//   if (lower.includes("audio")) {
//     return { type: "audio", content: testAudio };
//   } else if (lower.includes("video")) {
//     return { type: "video", content: testVideo };
//   }
//   return { type: "text", content: "Here’s a sample text response." };
// }

// export default function PremiumChat() {
//   const { messages, addMessage } = useContext(AppContext);
//   const [input, setInput] = useState("");
//   const chatEndRef = useRef(null);
//   const textAreaRef = useRef(null);
//   const MAX_HEIGHT = 200;

//   useEffect(() => {
//     if (textAreaRef.current) {
//       textAreaRef.current.style.height = "auto";
//       textAreaRef.current.style.height =
//         Math.min(textAreaRef.current.scrollHeight, MAX_HEIGHT) + "px";
//     }
//   }, [input]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     const trimmed = input.trim();
//     if (!trimmed) return;
//     const userMsg = {
//       id: Date.now(),
//       role: "user",
//       type: "text",
//       content: trimmed,
//     };
//     addMessage(userMsg);
//     setInput("");
//     setTimeout(() => {
//       const botRes = generateBotResponse(trimmed);
//       const botMsg = { id: Date.now() + 1, role: "bot", ...botRes };
//       addMessage(botMsg);
//     }, 600);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const showLanding = messages.length === 0;

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-black to-black text-white">
//       <AnimatePresence>
//         {showLanding && (
//           <motion.div
//             key="landing"
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 40 }}
//             transition={{ duration: 0.4 }}
//             className="flex-grow flex flex-col items-center justify-center text-center px-4"
//           >
//             <h1 className="text-4xl md:text-6xl font-bold mb-4">
//               What can I help with?
//             </h1>
//             <p className="text-lg md:text-2xl text-gray-300 mb-8">
//               Ask anything and get instant answers
//             </p>
//             <div className="flex space-x-2">
//               <textarea
//                 ref={textAreaRef}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="w-72 max-h-52 overflow-y-auto px-6 py-4 rounded-xl bg-gray-800 text-white placeholder-gray-500 appearance-none focus:outline-none focus:ring-0 border-0 resize-none"
//                 placeholder="Type your message..."
//               />
//               <button
//                 onClick={sendMessage}
//                 className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-r-full focus:outline-none"
//               >
//                 Send
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       {!showLanding && (
//         <>
//           <div className="flex-grow overflow-y-auto p-4 mb-24">
//             <div className="max-w-3xl mx-auto space-y-4">
//               <AnimatePresence>
//                 {messages.map((msg) => (
//                   <motion.div
//                     key={msg.id}
//                     initial={{ opacity: 0, y: 5 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 5 }}
//                     transition={{ duration: 0.3 }}
//                     className={`flex ${
//                       msg.role === "user" ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     {msg.role === "user" ? (
//                       <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white px-4 py-3 rounded-lg rounded-tr-none max-w-xs break-words shadow-lg">
//                         {msg.content}
//                       </div>
//                     ) : (
//                       <div className="flex items-start space-x-3 max-w-xs break-words shadow-lg">
//                         <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center">
//                           <span className="text-xl font-bold">B</span>
//                         </div>
//                         <div className="bg-gray-800 text-white px-4 py-3 rounded-lg rounded-tl-none max-w-xs break-words shadow-lg">
//                           {msg.type === "text" && msg.content}
//                           {msg.type === "audio" && (
//                             <div className="mt-2">
//                               <ReactAudioPlayer
//                                 src={msg.content}
//                                 controls
//                                 preload="auto"
//                               />
//                             </div>
//                           )}
//                           {msg.type === "video" && (
//                             <video
//                               controls
//                               className="rounded-md max-w-full mt-2"
//                             >
//                               <source src={msg.content} type="video/mp4" />
//                               Your browser does not support video.
//                             </video>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//               <div ref={chatEndRef} />
//             </div>
//           </div>
//           <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-700 p-4">
//             <div className="max-w-3xl mx-auto flex items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-3 shadow-2xl">
//               <textarea
//                 ref={textAreaRef}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 className="flex-1 bg-transparent text-white placeholder-gray-400 appearance-none border-0 focus:outline-none focus:ring-0 resize-none max-h-52 overflow-y-auto"
//                 placeholder="Type your message..."
//                 rows="1"
//               />
//               <button
//                 onClick={sendMessage}
//                 className="ml-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full px-6 py-3 focus:outline-none"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// import React, { useState, useRef } from "react";

// const BASE_URL = "https://d4c2-195-26-233-92.ngrok-free.app";
// const RUN_STREAM = BASE_URL + "/run-model-stream";
// const NEXT_CHUNK = BASE_URL + "/next-chunk";
// const STOP_WATCHER = BASE_URL + "/stop-watcher";
// const TTS_ENDPOINT = "http://localhost:5000/api/tts"; // Update if needed
// const POLL_MS = 1000;

// const LiveVideoStream = () => {
//   const [logText, setLogText] = useState("Idle");
//   const [startDisabled, setStartDisabled] = useState(false);
//   const [stopDisabled, setStopDisabled] = useState(true);
//   const [inputText, setInputText] = useState("");
//   const videoRef = useRef();
//   let mediaSource;
//   let sourceBuffer;
//   let polling = false;
//   let timer = null;
//   let queue = [];

//   const ts = () => new Date().toLocaleTimeString("en-US", { hour12: false });
//   const log = (message) => {
//     console.log(message);
//     setLogText((prev) => `[${ts()}] ${message}\n` + prev);
//   };

//   const append = (buf) => {
//     if (sourceBuffer.updating || queue.length) {
//       queue.push(buf);
//     } else {
//       try {
//         sourceBuffer.appendBuffer(buf);
//       } catch (e) {
//         log("Error appending buffer: " + e);
//       }
//     }
//   };

//   const poll = () => {
//     if (!polling) {
//       log("Poll skipped because polling is false.");
//       return;
//     }
//     fetch(NEXT_CHUNK, {
//       mode: "cors",
//       headers: {
//         "ngrok-skip-browser-warning": "1",
//       },
//     })
//       .then(async (r) => {
//         const ct = r.headers.get("content-type") || "";
//         log(`${r.status} ${ct}`);
//         if (r.status === 200) {
//           if (ct.startsWith("video/")) {
//             const buf = await r.arrayBuffer();
//             log(`Received chunk: ${Math.round(buf.byteLength / 1024)} KB`);
//             append(buf);
//           } else if (ct.includes("application/json")) {
//             try {
//               const j = await r.json();
//               if (j.message === "streaming ended") {
//                 log("Stream ended by server.");
//                 if (mediaSource.readyState === "open")
//                   mediaSource.endOfStream();
//                 stopAll();
//                 return;
//               }
//             } catch (e) {
//               log("Error parsing JSON: " + e);
//             }
//           }
//         } else if (r.status === 204) {
//           log("No new chunk available (204).");
//         } else {
//           log(`Unexpected response: ${r.status}`);
//         }
//       })
//       .catch((e) => log("Error fetching chunk: " + e))
//       .finally(() => {
//         if (polling) {
//           timer = setTimeout(poll, POLL_MS);
//         } else {
//           log("Polling stopped.");
//         }
//       });
//   };

//   const stopAll = () => {
//     polling = false;
//     clearTimeout(timer);
//     timer = null;
//     setStopDisabled(true);
//     setStartDisabled(false);
//     fetch(STOP_WATCHER).catch(() => {});
//     log("Polling manually stopped.");
//   };

//   const handleStart = async () => {
//     if (!inputText.trim()) {
//       alert("Enter some text.");
//       return;
//     }
//     setStartDisabled(true);
//     log("Requesting TTS...");
//     try {
//       const ttsRes = await fetch(TTS_ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: inputText }),
//       });
//       if (!ttsRes.ok) {
//         log("TTS request failed.");
//         setStartDisabled(false);
//         return;
//       }
//       const { audioUrl } = await ttsRes.json();
//       log("TTS response received. Sending audio to run-model-stream...");

//       const audioResp = await fetch(audioUrl);
//       const audioBlob = await audioResp.blob();
//       const fd = new FormData();
//       fd.append("file", audioBlob, "tts-audio.wav");

//       const runStreamRes = await fetch(RUN_STREAM, {
//         method: "POST",
//         body: fd,
//       });
//       if (!runStreamRes.ok) {
//         log("run-model-stream failed.");
//         setStartDisabled(false);
//         return;
//       }
//       log("Server accepted. Setting up MediaSource Extensions (MSE)...");
//       mediaSource = new MediaSource();
//       videoRef.current.src = URL.createObjectURL(mediaSource);

//       mediaSource.addEventListener("sourceopen", () => {
//         const mimeTypes = [
//           'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
//           'video/mp4; codecs="avc1.64001E, mp4a.40.2"',
//           "video/mp4",
//         ];
//         const mime = mimeTypes.find((type) =>
//           MediaSource.isTypeSupported(type)
//         );
//         if (!mime) {
//           log("No supported MIME type found for MSE.");
//           return;
//         }
//         sourceBuffer = mediaSource.addSourceBuffer(mime);
//         sourceBuffer.mode = "segments";
//         sourceBuffer.addEventListener("updateend", () => {
//           if (queue.length && !sourceBuffer.updating) {
//             sourceBuffer.appendBuffer(queue.shift());
//           }
//           if (sourceBuffer.buffered.length > 0) {
//             sourceBuffer.timestampOffset = sourceBuffer.buffered.end(
//               sourceBuffer.buffered.length - 1
//             );
//           }
//           if (videoRef.current.paused) {
//             videoRef.current
//               .play()
//               .catch((e) => log("Error resuming playback: " + e));
//           }
//         });
//         polling = true;
//         poll();
//         setStopDisabled(false);
//         log("Waiting for first chunk...");
//         videoRef.current.play().catch((e) => log("Autoplay error: " + e));
//       });
//     } catch (error) {
//       log("Error: " + error);
//       setStartDisabled(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl w-full p-8 mx-auto mt-8 text-gray-800 bg-gray-100 rounded-xl shadow-md">
//       <h2 className="text-2xl font-semibold text-center mb-6">
//         Live Video Stream
//       </h2>
//       <video
//         ref={videoRef}
//         className="w-full rounded-lg shadow-lg mb-4"
//         controls
//         muted
//       />
//       <div className="flex gap-4 items-center mb-4">
//         <input
//           type="text"
//           value={inputText}
//           onChange={(e) => setInputText(e.target.value)}
//           placeholder="Enter text"
//           className="flex-1 px-2 py-1 border border-gray-300 rounded"
//         />
//         <button
//           onClick={handleStart}
//           disabled={startDisabled}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
//         >
//           Start Stream
//         </button>
//         <button
//           onClick={stopAll}
//           disabled={stopDisabled}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
//         >
//           Stop
//         </button>
//       </div>
//       <div className="bg-white border border-gray-300 p-2 text-sm max-h-56 overflow-auto whitespace-pre-line">
//         {logText}
//       </div>
//     </div>
//   );
// };

// export default LiveVideoStream;

// import React, { useState, useRef } from "react";

// const BASE = "https://ef13-195-26-233-92.ngrok-free.app";
// const RUN = BASE + "/run-model-stream";
// const NEXT = BASE + "/next-chunk";
// const STOP = BASE + "/stop-watcher";
// const TTS = "http://localhost:5000/api/tts";
// const POLL = 1000;

// export default function LiveVideoStream() {
//   const [logs, setLogs] = useState("Idle");
//   const [text, setText] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [canStop, setCanStop] = useState(false);
//   const vidRef = useRef();

//   let mediaSource, sourceBuf;
//   let queue = [];
//   let polling = false;
//   let timer = null;

//   const stamp = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
//   const log = (m) => setLogs((p) => `[${stamp()}] ${m}\n` + p);

//   const push = (buf) => {
//     if (sourceBuf.updating || queue.length) queue.push(buf);
//     else sourceBuf.appendBuffer(buf);
//   };

//   const poll = () => {
//     if (!polling) return;
//     fetch(NEXT, { headers: { "ngrok-skip-browser-warning": "1" } })
//       .then(async (r) => {
//         const ct = r.headers.get("content-type") || "";
//         log(`${r.status} ${ct}`);
//         if (r.status === 204) return;
//         if (ct.startsWith("video/")) {
//           const buf = await r.arrayBuffer();
//           log(`chunk ${Math.round(buf.byteLength / 1024)} KB`);
//           push(buf);
//           return;
//         }
//         if (ct.includes("application/json")) {
//           const { message } = await r.json();
//           if (message === "streaming ended") endStream();
//         }
//       })
//       .catch((e) => log("err " + e))
//       .finally(() => {
//         if (polling) timer = setTimeout(poll, POLL);
//       });
//   };

//   const endStream = () => {
//     polling = false;
//     clearTimeout(timer);
//     timer = null;
//     if (mediaSource.readyState === "open") mediaSource.endOfStream();
//     setBusy(false);
//     setCanStop(false);
//     log("Stream ended by server.");
//   };

//   const manualStop = () => {
//     fetch(STOP).catch(() => {});
//     polling = false;
//     clearTimeout(timer);
//     timer = null;
//     setBusy(false);
//     setCanStop(false);
//     log("Stopped by user.");
//   };

//   const start = async () => {
//     if (!text.trim()) {
//       alert("Enter text");
//       return;
//     }
//     setBusy(true);
//     log("Requesting TTS…");
//     try {
//       const tts = await fetch(TTS, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });
//       if (!tts.ok) throw new Error("TTS failed");
//       const { audioUrl } = await tts.json();
//       const blob = await (await fetch(audioUrl)).blob();
//       const fd = new FormData();
//       fd.append("file", blob, "tts.wav");
//       const rs = await fetch(RUN, { method: "POST", body: fd });
//       if (!rs.ok) throw new Error("/run-model-stream failed");

//       mediaSource = new MediaSource();
//       vidRef.current.src = URL.createObjectURL(mediaSource);

//       mediaSource.addEventListener("sourceopen", () => {
//         const mime = [
//           'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
//           'video/mp4; codecs="avc1.64001E, mp4a.40.2"',
//           "video/mp4",
//         ].find((t) => MediaSource.isTypeSupported(t));
//         if (!mime) {
//           log("No supported mime");
//           setBusy(false);
//           return;
//         }
//         sourceBuf = mediaSource.addSourceBuffer(mime);
//         sourceBuf.mode = "segments";
//         sourceBuf.addEventListener("updateend", () => {
//           if (queue.length && !sourceBuf.updating)
//             sourceBuf.appendBuffer(queue.shift());
//           if (sourceBuf.buffered.length && vidRef.current.paused) {
//             vidRef.current.play().catch((e) => log("play " + e));
//           }
//         });
//         log("Waiting for first chunk…");
//         polling = true;
//         setCanStop(true);
//         poll();
//       });
//     } catch (e) {
//       log("error " + e);
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-100 rounded-xl shadow">
//       <h2 className="text-2xl font-semibold text-center mb-4">
//         Live Video Stream
//       </h2>
//       <video
//         ref={vidRef}
//         className="w-full rounded shadow mb-4"
//         controls
//         muted
//       />
//       <div className="flex gap-3 mb-4">
//         <input
//           className="flex-1 border rounded px-2 py-1"
//           placeholder="Enter text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={start}
//           disabled={busy}
//         >
//           Start
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={manualStop}
//           disabled={!canStop}
//         >
//           Stop
//         </button>
//       </div>
//       <pre className="bg-white border p-2 h-56 overflow-auto whitespace-pre-wrap">
//         {logs}
//       </pre>
//     </div>
//   );
// }
// import React, { useState, useRef } from "react";

// const BASE = "https://e3a4-195-26-233-92.ngrok-free.app";
// const RUN = BASE + "/run-model-stream";
// const NEXT = BASE + "/next-chunk";
// const STOP = BASE + "/stop-watcher";
// const TTS = "http://localhost:5000/api/tts-gc";
// const POLL = 500;

// export default function LiveVideoStream() {
//   const [logs, setLogs] = useState("Idle");
//   const [text, setText] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [canStop, setCanStop] = useState(false);
//   const vidRef = useRef();

//   let mediaSource, sourceBuf;
//   let queue = [];
//   let polling = false;
//   let timer = null;

//   const stamp = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
//   const log = (m) => setLogs((p) => `[${stamp()}] ${m}\n` + p);

//   const push = (buf) => {
//     if (sourceBuf.updating || queue.length) queue.push(buf);
//     else {
//       if (sourceBuf.buffered.length)
//         sourceBuf.timestampOffset = sourceBuf.buffered.end(
//           sourceBuf.buffered.length - 1
//         );
//       sourceBuf.appendBuffer(buf);
//     }
//   };

//   const poll = () => {
//     if (!polling) return;
//     fetch(NEXT, { headers: { "ngrok-skip-browser-warning": "1" } })
//       .then(async (r) => {
//         const ct = r.headers.get("content-type") || "";
//         log(`${r.status} ${ct}`);
//         if (r.status === 204) return;
//         if (ct.startsWith("video/")) {
//           const buf = await r.arrayBuffer();
//           log(`chunk ${Math.round(buf.byteLength / 1024)} KB`);
//           push(buf);
//           return;
//         }
//         if (ct.includes("application/json")) {
//           const { message } = await r.json();
//           if (message === "streaming ended") endStream();
//         }
//       })
//       .catch((e) => log("err " + e))
//       .finally(() => {
//         if (polling) timer = setTimeout(poll, POLL);
//       });
//   };

//   const endStream = () => {
//     polling = false;
//     clearTimeout(timer);
//     timer = null;
//     if (mediaSource.readyState === "open") mediaSource.endOfStream();
//     setBusy(false);
//     setCanStop(false);
//     log("Stream ended by server.");
//   };

//   const manualStop = () => {
//     fetch(STOP).catch(() => {});
//     polling = false;
//     clearTimeout(timer);
//     timer = null;
//     setBusy(false);
//     setCanStop(false);
//     log("Stopped by user.");
//   };

//   const start = async () => {
//     if (!text.trim()) {
//       alert("Enter text");
//       return;
//     }
//     setBusy(true);
//     log("Requesting TTS…");
//     try {
//       const tts = await fetch(TTS, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });
//       if (!tts.ok) throw new Error("TTS failed");
//       const { audioUrl } = await tts.json();
//       const blob = await (await fetch(audioUrl)).blob();
//       const fd = new FormData();
//       fd.append("file", blob, "tts.wav");
//       const rs = await fetch(RUN, { method: "POST", body: fd });
//       if (!rs.ok) throw new Error("/run-model-stream failed");

//       mediaSource = new MediaSource();
//       vidRef.current.src = URL.createObjectURL(mediaSource);

//       mediaSource.addEventListener("sourceopen", () => {
//         const mime = [
//           'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
//           'video/mp4; codecs="avc1.64001E, mp4a.40.2"',
//           "video/mp4",
//         ].find((t) => MediaSource.isTypeSupported(t));
//         if (!mime) {
//           log("No supported mime");
//           setBusy(false);
//           return;
//         }
//         sourceBuf = mediaSource.addSourceBuffer(mime);
//         sourceBuf.mode = "segments";
//         sourceBuf.addEventListener("updateend", () => {
//           if (queue.length && !sourceBuf.updating) {
//             if (sourceBuf.buffered.length)
//               sourceBuf.timestampOffset = sourceBuf.buffered.end(
//                 sourceBuf.buffered.length - 1
//               );
//             sourceBuf.appendBuffer(queue.shift());
//           }
//           if (sourceBuf.buffered.length && vidRef.current.paused)
//             vidRef.current.play().catch((e) => log("play " + e));
//         });
//         log("Waiting for first chunk…");
//         polling = true;
//         setCanStop(true);
//         poll();
//       });
//     } catch (e) {
//       log("error " + e);
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-100 rounded-xl shadow">
//       <h2 className="text-2xl font-semibold text-center mb-4">
//         Live Video Stream
//       </h2>
//       <video
//         ref={vidRef}
//         className="w-1/2 mx-auto rounded shadow mb-4"
//         controls
//       />
//       <div className="flex gap-3 mb-4">
//         <input
//           className="flex-1 border rounded px-2 py-1"
//           placeholder="Enter text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={start}
//           disabled={busy}
//         >
//           Start
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={manualStop}
//           disabled={!canStop}
//         >
//           Stop
//         </button>
//       </div>
//       <pre className="bg-white border p-2 h-56 overflow-auto whitespace-pre-wrap">
//         {logs}
//       </pre>
//     </div>
//   );
// }
// import React, { useState, useRef } from "react";

// const BASE = "https://wise-cunning-wren.ngrok-free.app";
// const RUN = BASE + "/run-model-stream";
// const NEXT = BASE + "/next-chunk";
// const STOP = BASE + "/stop-watcher";
// const TTS = "http://localhost:5000/api/tts-gc";
// const POLL = 500;

// export default function LiveVideoStream() {
//   const [logs, setLogs] = useState("Idle");
//   const [text, setText] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [canStop, setCanStop] = useState(false);
//   const [looping, setLooping] = useState(false);
//   const vidRef = useRef();
//   const loopRef = useRef({ active: false, rafId: null });
//   const endedRef = useRef(null);

//   let mediaSource, sourceBuf;
//   let queue = [];
//   let polling = false;
//   let timer = null;

//   const stamp = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
//   const log = (m) => setLogs((p) => `[${stamp()}] ${m}\n` + p);

//   const push = (buf) => {
//     if (sourceBuf.updating || queue.length) queue.push(buf);
//     else {
//       if (sourceBuf.buffered.length)
//         sourceBuf.timestampOffset = sourceBuf.buffered.end(
//           sourceBuf.buffered.length - 1
//         );
//       sourceBuf.appendBuffer(buf);
//     }
//   };

//   const startTailLoop = () => {
//     const v = vidRef.current;
//     if (!v) return;
//     const dur = v.duration;
//     if (!dur || !isFinite(dur)) return;
//     const loopStart = Math.max(0, dur - 5);
//     const loopEnd = dur - 0.9;
//     const tick = () => {
//       if (!loopRef.current.active) return;
//       if (v.currentTime >= loopEnd) {
//         v.currentTime = loopStart + 0.01;
//         v.play().catch(() => {});
//       }
//       loopRef.current.rafId = requestAnimationFrame(tick);
//     };
//     loopRef.current = { active: true, rafId: null };
//     tick();
//     v.currentTime = loopStart;
//     v.play().catch(() => {});
//     setLooping(true);
//   };

//   const stopLoop = () => {
//     const { active, rafId } = loopRef.current;
//     if (active && rafId !== null) cancelAnimationFrame(rafId);
//     loopRef.current = { active: false, rafId: null };
//     if (endedRef.current && vidRef.current)
//       vidRef.current.removeEventListener("ended", endedRef.current);
//     endedRef.current = null;
//     setLooping(false);
//   };

//   const awaitEndThenLoop = () => {
//     const v = vidRef.current;
//     if (!v) return;
//     if (v.ended || v.currentTime >= v.duration) {
//       startTailLoop();
//       return;
//     }
//     const h = () => {
//       v.removeEventListener("ended", h);
//       endedRef.current = null;
//       startTailLoop();
//     };
//     endedRef.current = h;
//     v.addEventListener("ended", h);
//   };

//   const poll = () => {
//     if (!polling) return;
//     fetch(NEXT, { headers: { "ngrok-skip-browser-warning": "1" } })
//       .then(async (r) => {
//         const ct = r.headers.get("content-type") || "";
//         log(`${r.status} ${ct}`);
//         if (r.status === 204) return;
//         if (ct.startsWith("video/")) {
//           const buf = await r.arrayBuffer();
//           log(`chunk ${Math.round(buf.byteLength / 1024)} KB`);
//           push(buf);
//           return;
//         }
//         if (ct.includes("application/json")) {
//           const { message } = await r.json();
//           if (message === "streaming ended") endStream();
//         }
//       })
//       .catch((e) => log("err " + e))
//       .finally(() => {
//         if (polling) timer = setTimeout(poll, POLL);
//       });
//   };

//   const endStream = () => {
//     polling = false;
//     clearTimeout(timer);
//     timer = null;
//     if (mediaSource.readyState === "open") mediaSource.endOfStream();
//     setBusy(false);
//     setCanStop(false);
//     log("Stream ended by server.");
//     awaitEndThenLoop();
//   };

//   const manualStop = () => {
//     fetch(STOP).catch(() => {});
//     polling = false;
//     clearTimeout(timer);
//     timer = null;
//     setBusy(false);
//     setCanStop(false);
//     log("Stopped by user.");
//     awaitEndThenLoop();
//   };

//   const start = async () => {
//     if (!text.trim()) {
//       alert("Enter text");
//       return;
//     }
//     stopLoop();
//     setBusy(true);
//     log("Requesting TTS…");
//     try {
//       const tts = await fetch(TTS, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });
//       if (!tts.ok) throw new Error("TTS failed");
//       const { audioUrl } = await tts.json();
//       const blob = await (await fetch(audioUrl)).blob();
//       const fd = new FormData();
//       fd.append("file", blob, "tts.wav");
//       const rs = await fetch(RUN, { method: "POST", body: fd });
//       if (!rs.ok) throw new Error("/run-model-stream failed");

//       mediaSource = new MediaSource();
//       vidRef.current.src = URL.createObjectURL(mediaSource);

//       mediaSource.addEventListener("sourceopen", () => {
//         const mime = [
//           'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
//           'video/mp4; codecs="avc1.64001E, mp4a.40.2"',
//           "video/mp4",
//         ].find((t) => MediaSource.isTypeSupported(t));
//         if (!mime) {
//           log("No supported mime");
//           setBusy(false);
//           return;
//         }
//         sourceBuf = mediaSource.addSourceBuffer(mime);
//         sourceBuf.mode = "segments";
//         sourceBuf.addEventListener("updateend", () => {
//           if (queue.length && !sourceBuf.updating) {
//             if (sourceBuf.buffered.length)
//               sourceBuf.timestampOffset = sourceBuf.buffered.end(
//                 sourceBuf.buffered.length - 1
//               );
//             sourceBuf.appendBuffer(queue.shift());
//           }
//           if (sourceBuf.buffered.length && vidRef.current.paused)
//             vidRef.current.play().catch((e) => log("play " + e));
//         });
//         log("Waiting for first chunk…");
//         polling = true;
//         setCanStop(true);
//         poll();
//       });
//     } catch (e) {
//       log("error " + e);
//       setBusy(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-100 rounded-xl shadow">
//       <h2 className="text-2xl font-semibold text-center mb-4">
//         Live Video Stream
//       </h2>
//       <video ref={vidRef} className="w-1/2 mx-auto rounded shadow mb-4" />
//       <div className="flex gap-3 mb-4">
//         <input
//           className="flex-1 border rounded px-2 py-1"
//           placeholder="Enter text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={start}
//           disabled={busy}
//         >
//           Start
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={manualStop}
//           disabled={!canStop}
//         >
//           Stop
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={stopLoop}
//           disabled={!looping}
//         >
//           Stop Loop
//         </button>
//       </div>
//       <pre className="bg-white border p-2 h-56 overflow-auto whitespace-pre-wrap">
//         {logs}
//       </pre>
//     </div>
//   );
// }

// import React, { useState, useRef } from "react";
// import { EventSourcePolyfill } from "event-source-polyfill";

// const BASE = "https://wise-cunning-wren.ngrok-free.app";
// const RUN = BASE + "/run-model-stream";
// const STREAM = BASE + "/stream-chunks";
// const STOP = BASE + "/stop-watcher";
// const TTS = "http://localhost:5000/api/tts-gc";

// export default function LiveVideoStream() {
//   const [logs, setLogs] = useState("Idle");
//   const [text, setText] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [canStop, setCanStop] = useState(false);
//   const [looping, setLooping] = useState(false);
//   const vidRef = useRef();
//   const esRef = useRef(null);
//   const loopRef = useRef({ active: false, rafId: null });
//   const endedRef = useRef(null);
//   let mediaSource, sourceBuf;
//   let queue = [];
//   const stamp = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
//   const log = (m) => setLogs((p) => `[${stamp()}] ${m}\n` + p);
//   const push = (buf) => {
//     if (sourceBuf.updating || queue.length) queue.push(buf);
//     else {
//       if (sourceBuf.buffered.length)
//         sourceBuf.timestampOffset = sourceBuf.buffered.end(
//           sourceBuf.buffered.length - 1
//         );
//       sourceBuf.appendBuffer(buf);
//     }
//   };
//   const startTailLoop = () => {
//     const v = vidRef.current;
//     if (!v) return;
//     const d = v.duration;
//     if (!d || !isFinite(d)) return;
//     const loopStart = Math.max(0, d - 5);
//     const loopEnd = d - 0.9;
//     const tick = () => {
//       if (!loopRef.current.active) return;
//       if (v.currentTime >= loopEnd) {
//         v.currentTime = loopStart + 0.01;
//         v.play().catch(() => {});
//       }
//       loopRef.current.rafId = requestAnimationFrame(tick);
//     };
//     loopRef.current = { active: true, rafId: null };
//     tick();
//     v.currentTime = loopStart;
//     v.play().catch(() => {});
//     setLooping(true);
//   };
//   const stopLoop = () => {
//     const { active, rafId } = loopRef.current;
//     if (active && rafId !== null) cancelAnimationFrame(rafId);
//     loopRef.current = { active: false, rafId: null };
//     if (endedRef.current && vidRef.current)
//       vidRef.current.removeEventListener("ended", endedRef.current);
//     endedRef.current = null;
//     setLooping(false);
//   };
//   const awaitEndThenLoop = () => {
//     const v = vidRef.current;
//     if (!v) return;
//     if (v.ended || v.currentTime >= v.duration) {
//       startTailLoop();
//       return;
//     }
//     const h = () => {
//       v.removeEventListener("ended", h);
//       endedRef.current = null;
//       startTailLoop();
//     };
//     endedRef.current = h;
//     v.addEventListener("ended", h);
//   };
//   const cleanup = () => {
//     if (esRef.current) {
//       esRef.current.close();
//       esRef.current = null;
//     }
//     setBusy(false);
//     setCanStop(false);
//     awaitEndThenLoop();
//   };
//   const manualStop = () => {
//     fetch(STOP).catch(() => {});
//     cleanup();
//     log("Stopped by user.");
//   };
//   const start = async () => {
//     if (!text.trim()) {
//       alert("Enter text");
//       return;
//     }
//     stopLoop();
//     setBusy(true);
//     log("Requesting TTS…");
//     try {
//       const tts = await fetch(TTS, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });
//       if (!tts.ok) throw new Error("TTS failed");
//       const { audioUrl } = await tts.json();
//       const blob = await (await fetch(audioUrl)).blob();
//       const fd = new FormData();
//       fd.append("file", blob, "tts.wav");
//       const rs = await fetch(RUN, { method: "POST", body: fd });
//       if (!rs.ok) throw new Error("/run-model-stream failed");
//       mediaSource = new MediaSource();
//       vidRef.current.src = URL.createObjectURL(mediaSource);
//       mediaSource.addEventListener("sourceopen", () => {
//         const mime = [
//           'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
//           'video/mp4; codecs="avc1.64001E, mp4a.40.2"',
//           "video/mp4",
//         ].find((t) => MediaSource.isTypeSupported(t));
//         if (!mime) {
//           log("No supported mime");
//           setBusy(false);
//           return;
//         }
//         sourceBuf = mediaSource.addSourceBuffer(mime);
//         sourceBuf.mode = "segments";
//         sourceBuf.addEventListener("updateend", () => {
//           if (queue.length && !sourceBuf.updating) {
//             if (sourceBuf.buffered.length)
//               sourceBuf.timestampOffset = sourceBuf.buffered.end(
//                 sourceBuf.buffered.length - 1
//               );
//             sourceBuf.appendBuffer(queue.shift());
//           }
//           if (sourceBuf.buffered.length && vidRef.current.paused)
//             vidRef.current.play().catch((e) => log("play " + e));
//         });
//         esRef.current = new EventSourcePolyfill(STREAM, {
//           headers: { "ngrok-skip-browser-warning": "1" },
//         });
//         esRef.current.onmessage = async (e) => {
//           let payload = e.data.trim();
//           if (payload.startsWith("data:"))
//             payload = payload.slice(payload.indexOf("{"));
//           let data;
//           try {
//             data = JSON.parse(payload);
//           } catch {
//             return;
//           }
//           if (data.end) {
//             if (mediaSource.readyState === "open") mediaSource.endOfStream();
//             log("Stream ended by server.");
//             cleanup();
//             return;
//           }
//           const r = await fetch(BASE + "/chunks/" + data.chunk, {
//             headers: { "ngrok-skip-browser-warning": "1" },
//           });
//           if (r.ok) {
//             const buf = await r.arrayBuffer();
//             log(`chunk ${Math.round(buf.byteLength / 1024)} KB`);
//             push(buf);
//           }
//         };
//         esRef.current.onerror = () => log("EventSource error");
//         setCanStop(true);
//       });
//     } catch (e) {
//       log("error " + e);
//       setBusy(false);
//     }
//   };
//   return (
//     <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-100 rounded-xl shadow">
//       <h2 className="text-2xl font-semibold text-center mb-4">
//         Live Video Stream
//       </h2>
//       <video ref={vidRef} className="w-1/2 mx-auto rounded shadow mb-4" />
//       <div className="flex gap-3 mb-4">
//         <input
//           className="flex-1 border rounded px-2 py-1"
//           placeholder="Enter text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={start}
//           disabled={busy}
//         >
//           Start
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={manualStop}
//           disabled={!canStop}
//         >
//           Stop
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//           onClick={stopLoop}
//           disabled={!looping}
//         >
//           Stop Loop
//         </button>
//       </div>
//       <pre className="bg-white border p-2 h-56 overflow-auto whitespace-pre-wrap">
//         {logs}
//       </pre>
//     </div>
//   );
// }

// const stopLoop = () => {
//   const { active, raf } = loopR.current;
//   if (active && raf) cancelAnimationFrame(raf);
//   loopR.current = { active: false, raf: null };
//   if (endR.current && vRef.current)
//     vRef.current.removeEventListener("ended", endR.current);
//   endR.current = null;
//   setLoop(false);
// };
// const awaitLoop = () => {
//   const v = vRef.current;
//   if (!v) return;
//   if (v.ended || v.currentTime >= v.duration) {
//     startLoop();
//     return;
//   }
//   const h = () => {
//     v.removeEventListener("ended", h);
//     endR.current = null;
//     startLoop();
//   };
//   endR.current = h;
//   v.addEventListener("ended", h);
// };

//   import React, { useState, useRef } from "react";

//   const BASE = "https://wise-cunning-wren.ngrok-free.app";
//   const RUN = BASE + "/run-model-stream";
//   const STREAM = BASE + "/stream-chunks"; // header will bypass warning
//   const CHUNK = (f) => `${BASE}/chunks/${f}`;
//   const STOP = BASE + "/stop-watcher";
//   const TTS = "http://localhost:5000/api/tts-gc";

//   export default function LiveVideoStream() {
//     /* -------------- state & refs (unchanged) -------------- */
//     const [logs, setLogs] = useState("Idle");
//     const [text, setText] = useState("");
//     const [busy, setBusy] = useState(false);
//     const [canStop, setCanStop] = useState(false);
//     const [looping, setLooping] = useState(false);

//     const vidRef = useRef();
//     const ctrlRef = useRef(null); // AbortController for the stream
//     const loopRef = useRef({ active: false, rafId: null });
//     const endRef = useRef(null);

//     let mediaSource,
//       sourceBuf,
//       queue = [];

//     const ts = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
//     const log = (m) => setLogs((p) => `[${ts()}] ${m}\n` + p);

//     /* -------------- MediaSource helpers (unchanged) -------------- */
//     const push = (buf) => {
//       if (sourceBuf.updating || queue.length) queue.push(buf);
//       else sourceBuf.appendBuffer(buf);
//     };
//     const onUpdateEnd = () => {
//       if (queue.length && !sourceBuf.updating) {
//         if (sourceBuf.buffered.length)
//           sourceBuf.timestampOffset = sourceBuf.buffered.end(
//             sourceBuf.buffered.length - 1
//           );
//         sourceBuf.appendBuffer(queue.shift());
//       }
//       if (sourceBuf.buffered.length && vidRef.current.paused)
//         vidRef.current.play().catch(() => {});
//     };

//     const startLoop = () => {
//       const v = vRef.current;
//       if (!v) return;
//       const d = v.duration;
//       if (!d || !isFinite(d)) return;
//       const s = Math.max(0, d - 5),
//         e = d - 0.9;
//       const tick = () => {
//         if (!loopR.current.active) return;
//         if (v.currentTime >= e) {
//           v.currentTime = s + 0.01;
//           v.play().catch(() => {});
//         }
//         loopR.current.raf = requestAnimationFrame(tick);
//       };
//       loopR.current = { active: true, raf: null };
//       tick();
//       v.currentTime = s;
//       v.play().catch(() => {});
//       setLoop(true);
//     };

//     const startStream = async () => {
//       ctrlRef.current = new AbortController();
//       const res = await fetch(STREAM, {
//         headers: {
//           "ngrok-skip-browser-warning": "1",
//           Accept: "text/event-stream",
//         },
//         signal: ctrlRef.current.signal,
//       });
//       if (!res.ok) {
//         log(`SSE ${res.status}`);
//         return;
//       }

//       const dec = new TextDecoder("utf-8");
//       const reader = res.body.getReader();
//       let buffer = "";
//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;
//         buffer += dec.decode(value, { stream: true });
//         let idx;
//         while ((idx = buffer.indexOf("\n\n")) >= 0) {
//           const raw = buffer.slice(0, idx);
//           buffer = buffer.slice(idx + 2);
//           if (!raw.trim() || raw.startsWith(":")) continue; // comment / ping
//           const [evtLine, dataLine] = raw.split("\n");
//           const ev = evtLine.replace("event:", "").trim();
//           const data = dataLine.replace("data:", "").trim();
//           if (ev === "chunk") fetchChunk(data);
//           else if (ev === "end") stopStream();
//         }
//       }
//     };

//     const fetchChunk = async (name) => {
//       const r = await fetch(CHUNK(name), {
//         headers: { "ngrok-skip-browser-warning": "1" },
//       });
//       if (!r.ok) return;
//       const buf = await r.arrayBuffer();
//       log(`chunk ${Math.round(buf.byteLength / 1024)} KB`);
//       push(buf);
//     };

//     const stopStream = () => {
//       if (ctrlRef.current) ctrlRef.current.abort();
//       if (mediaSource && mediaSource.readyState === "open")
//         mediaSource.endOfStream();
//       setBusy(false);
//       setCanStop(false);
//       awaitLoop();
//       log("Stream ended");
//     };

//     const manualStop = () => {
//       fetch(STOP).catch(() => {});
//       stopStream();
//     };

//     /* -------------- start button -------------- */
//     const start = async () => {
//       if (!text.trim()) {
//         alert("Enter text");
//         return;
//       }
//       // 1. TTS
//       setBusy(true);
//       log("TTS …");
//       const tts = await fetch(TTS, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text }),
//       });
//       if (!tts.ok) {
//         log("TTS failed");
//         setBusy(false);
//         return;
//       }
//       const { audioUrl } = await tts.json();
//       const blob = await (await fetch(audioUrl)).blob();
//       // 2. send audio
//       const fd = new FormData();
//       fd.append("file", blob, "tts.wav");
//       const rs = await fetch(RUN, { method: "POST", body: fd });
//       if (!rs.ok) {
//         log("/run-model-stream failed");
//         setBusy(false);
//         return;
//       }
//       // 3. prepare MediaSource
//       mediaSource = new MediaSource();
//       vidRef.current.src = URL.createObjectURL(mediaSource);
//       mediaSource.addEventListener("sourceopen", () => {
//         const mime =
//           ['video/mp4; codecs="avc1.42E01E, mp4a.40.2"', "video/mp4"].find((t) =>
//             MediaSource.isTypeSupported(t)
//           ) || "";
//         if (!mime) {
//           log("No mime");
//           setBusy(false);
//           return;
//         }
//         sourceBuf = mediaSource.addSourceBuffer(mime);
//         sourceBuf.mode = "segments";
//         sourceBuf.addEventListener("updateend", onUpdateEnd);
//         setCanStop(true);
//         log("waiting first chunk …");
//         startStream(); // ← start SSE
//       });
//     };

//     /* -------------- JSX UI (unchanged except handlers) -------------- */
//     return (
//       <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-100 rounded-xl shadow">
//         <h2 className="text-2xl font-semibold text-center mb-4">
//           Live Video Stream
//         </h2>
//         <video ref={vidRef} className="w-1/2 mx-auto rounded shadow mb-4" />
//         <div className="flex gap-3 mb-4">
//           <input
//             className="flex-1 border rounded px-2 py-1"
//             placeholder="Enter text"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//             onClick={start}
//             disabled={busy}
//           >
//             Start
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//             onClick={manualStop}
//             disabled={!canStop}
//           >
//             Stop
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
//             onClick={stopLoop}
//             disabled={!looping}
//           >
//             Stop Loop
//           </button>
//         </div>
//         <pre className="bg-white border p-2 h-56 overflow-auto whitespace-pre-wrap">
//           {logs}
//         </pre>
//       </div>
//     );
//   }

import React, { useState, useRef } from "react";

const BASE = "https://igdaowy0zqky0n-8000.proxy.runpod.net";
const RUN = BASE + "/run-model-stream";
const STREAM = BASE + "/stream-chunks";
const CHUNK = (f) => `${BASE}/chunks/${f}`;
const STOP = BASE + "/stop-watcher";
const TTS = "http://localhost:5000/api/tts-gc";

export default function LiveVideoStream() {
  const [logs, setLogs] = useState("Idle");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [canStop, setCanStop] = useState(false);

  const videoRef = useRef();
  const esRef = useRef(null);

  let ms, sb;
  let pending = [];
  let offset = 0;

  const log = (m) =>
    setLogs(
      (p) =>
        `[${new Date().toLocaleTimeString("en-GB", {
          hour12: false,
        })}] ${m}\n` + p
    );

  const append = (buf) => {
    if (sb.updating || pending.length) pending.push(buf);
    else {
      sb.timestampOffset = offset;
      sb.appendBuffer(buf);
    }
  };

  const onUpdateEnd = () => {
    offset = sb.buffered.end(sb.buffered.length - 1);
    if (pending.length && !sb.updating) {
      sb.timestampOffset = offset;
      sb.appendBuffer(pending.shift());
    }
    if (sb.buffered.length && videoRef.current.paused)
      videoRef.current.play().catch(() => {});
  };

  const fetchChunk = async (name) => {
    const r = await fetch(CHUNK(name));
    if (!r.ok) return;
    const buf = await r.arrayBuffer();
    log(`chunk ${Math.round(buf.byteLength / 1024)} KB`);
    append(buf);
  };

  const openSSE = () => {
    esRef.current = new EventSource(STREAM);
    esRef.current.addEventListener("chunk", (e) => fetchChunk(e.data.trim()));
    esRef.current.addEventListener("end", closeAll);
    esRef.current.onerror = () => log("SSE error");
  };

  /* ---------- cleanup ---------- */
  const closeAll = () => {
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

  /* ---------- main flow ---------- */
  const start = async () => {
    if (!text.trim()) {
      alert("Enter text");
      return;
    }

    setBusy(true);
    log("Requesting TTS …");
    try {
      const tts = await fetch(TTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!tts.ok) throw Error("TTS");
      const { audioUrl } = await tts.json();
      const blob = await (await fetch(audioUrl)).blob();

      const fd = new FormData();
      fd.append("file", blob, "tts.wav");
      const rs = await fetch(RUN, { method: "POST", body: fd });
      if (!rs.ok) throw Error("/run-model-stream");

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
          return;
        }
        sb = ms.addSourceBuffer(mime);
        sb.mode = "segments"; // keep segments mode
        sb.addEventListener("updateend", onUpdateEnd);
        setCanStop(true);
        log("waiting first chunk …");
        openSSE();
      });
    } catch (e) {
      log("error " + e);
      setBusy(false);
    }
  };

  const stop = () => {
    fetch(STOP).catch(() => {});
    closeAll();
    log("Stopped");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-100 rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Live Video Stream
      </h2>
      <video
        ref={videoRef}
        className="w-1/2 mx-auto rounded shadow mb-4"
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
