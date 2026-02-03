"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Keyboard,
  X,
  Send,
  StopCircle,
  Maximize2,
  Minimize2,
  Sparkles,
  GraduationCap,
  Volume2,
  BrainCircuit,
  Eraser,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { chatService } from "@/services/chat.service";

// --- COMPONENT ---
const VoiceVisualizer = ({
  isActive,
  color = "bg-indigo-500",
}: {
  isActive: boolean;
  color?: string;
}) => (
  <div className="flex items-center gap-1 h-8">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        animate={isActive ? { height: [10, 25, 10] } : { height: 5 }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          delay: i * 0.1,
          ease: "easeInOut",
        }}
        className={`w-1.5 rounded-full ${color}`}
      />
    ))}
  </div>
);

export default function AITutorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<"VOICE" | "TEXT">("VOICE");

  const [messages, setMessages] = useState<any[]>([
    {
      role: "ai",
      text: "Chào em! Thầy là AI Tutor. Hôm nay chúng ta sẽ ôn tập phần nào?",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState("");

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Setup Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "vi-VN";
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          handleSend(transcript);
        };
        recognitionRef.current.onend = () => setIsListening(false);
      }
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // 2. Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isExpanded, mode]);

  // 3. Handle Send
  const handleSend = async (msg: string) => {
    if (!msg.trim()) return;
    const userMsg = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setTextInput("");
    setIsLoading(true);

    try {
      const res: any = await chatService.chat(msg, messages);
      const aiReply =
        res.reply || "Thầy chưa nghe rõ câu hỏi, em vui lòng nhắc lại nhé.";
      setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
      speak(aiReply);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Kết nối mạng không ổn định. Em kiểm tra lại nhé! 🌐",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text: string) => {
    if (!synthesisRef.current) return;
    synthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthesisRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      synthesisRef.current?.cancel();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const clearChat = () => {
    if (confirm("Em có chắc muốn xóa lịch sử trò chuyện không?")) {
      setMessages([
        { role: "ai", text: "Lịch sử đã xóa. Chúng ta bắt đầu lại nhé!" },
      ]);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div
            className={
              isExpanded
                ? "fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
                : "fixed bottom-28 right-6 z-[9999] flex flex-col items-end"
            }
          >
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                bg-white shadow-2xl overflow-hidden flex flex-col font-sans border border-slate-200
                ${
                  isExpanded
                    ? "w-full max-w-6xl h-[90vh] rounded-2xl ring-4 ring-slate-700/50"
                    : "w-[400px] h-[600px] rounded-2xl ring-1 ring-slate-200"
                }
              `}
            >
              {/* --- HEADER --- */}
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-inner">
                    <GraduationCap size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                      AI Tutor Pro{" "}
                      <span className="bg-indigo-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Beta
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Trực tuyến
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={clearChat}
                    title="Xóa lịch sử"
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Eraser size={18} />
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  >
                    {isExpanded ? (
                      <Minimize2 size={20} />
                    ) : (
                      <Maximize2 size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-red-900/50 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* --- BODY CHAT --- */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-6">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1 shadow-sm 
                        ${m.role === "ai" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}`}
                    >
                      {m.role === "ai" ? <GraduationCap size={16} /> : "EM"}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`relative p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm
                        ${
                          m.role === "user"
                            ? "bg-white border border-slate-200 text-slate-800 rounded-tr-none"
                            : "bg-indigo-50 border border-indigo-100 text-slate-800 rounded-tl-none"
                        }
                        ${isExpanded ? "text-base px-6 py-4" : ""}
                    `}
                    >
                      {m.text}
                      {/* Audio Icon for AI */}
                      {m.role === "ai" &&
                        i === messages.length - 1 &&
                        !isSpeaking && (
                          <button
                            onClick={() => speak(m.text)}
                            className="absolute -bottom-6 left-0 text-slate-400 hover:text-indigo-600 p-1"
                          >
                            <Volume2 size={14} />
                          </button>
                        )}
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shrink-0">
                      <GraduationCap size={16} />
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-2xl rounded-tl-none border border-indigo-100 flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* --- FOOTER CONTROLS --- */}
              <div className="p-5 bg-white border-t border-slate-200 shrink-0">
                {/* Mode: VOICE */}
                {mode === "VOICE" && (
                  <div className="flex flex-col items-center justify-center gap-4">
                    {/* Visualizer & Status Text */}
                    <div className="h-8 flex items-center justify-center gap-2">
                      {isListening || isSpeaking ? (
                        <>
                          <VoiceVisualizer
                            isActive={true}
                            color={isListening ? "bg-red-500" : "bg-indigo-500"}
                          />
                          <span
                            className={`text-xs font-bold uppercase tracking-wider ${isListening ? "text-red-500" : "text-indigo-500"}`}
                          >
                            {isListening ? "Đang nghe..." : "Đang nói..."}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">
                          Nhấn micro để bắt đầu nói
                        </span>
                      )}
                    </div>

                    {/* Main Action Buttons */}
                    <div className="flex items-center gap-8 w-full justify-center relative">
                      {/* Switch to Text */}
                      <button
                        onClick={() => setMode("TEXT")}
                        className="absolute left-4 p-3 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition"
                      >
                        <Keyboard size={20} />
                      </button>

                      {/* Mic Button */}
                      <button
                        onClick={toggleListening}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
                          isListening
                            ? "bg-red-500 shadow-red-200 ring-4 ring-red-50"
                            : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700 ring-4 ring-indigo-50"
                        }`}
                      >
                        {isListening ? (
                          <StopCircle size={28} color="white" />
                        ) : (
                          <Mic size={28} color="white" />
                        )}
                      </button>

                      {/* Stop Speaking */}
                      {isSpeaking && (
                        <button
                          onClick={() => {
                            synthesisRef.current?.cancel();
                            setIsSpeaking(false);
                          }}
                          className="absolute right-4 p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Mode: TEXT */}
                {mode === "TEXT" && (
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => setMode("VOICE")}
                      className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-600 transition"
                    >
                      <Mic size={20} />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        className="w-full bg-slate-50 rounded-xl pl-4 pr-12 py-3 text-sm outline-none border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-slate-800 placeholder:text-slate-400"
                        placeholder="Nhập câu hỏi của em..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSend(textInput)
                        }
                        disabled={isLoading}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSend(textInput)}
                        disabled={!textInput.trim() || isLoading}
                        className="absolute right-2 top-1.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 transition"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NÚT KÍCH HOẠT (Floating Button) */}
      {!isOpen && (
        <div className="fixed bottom-8 right-8 z-[9998] group">
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100 text-sm font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Hỏi bài tập với AI Tutor ✨
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-t border-r border-slate-100"></div>
          </div>

          {/* Main Trigger */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
              setIsExpanded(false);
            }}
            className="w-16 h-16 bg-indigo-600 rounded-full shadow-xl shadow-indigo-500/40 flex items-center justify-center text-white relative ring-4 ring-white"
          >
            {/* <BrainCircuit size={32} /> */}
            <GraduationCap size={32} />
            <span className="absolute top-0 right-0 flex h-4 w-4 -mt-1 -mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          </motion.button>
        </div>
      )}
    </>
  );
}
