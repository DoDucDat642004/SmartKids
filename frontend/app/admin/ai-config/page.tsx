"use client";

import { useState } from "react";
import {
  Bot,
  Save,
  RefreshCw,
  MessageSquare,
  Settings,
  Zap,
  ShieldCheck,
  Send,
  Sparkles,
  Cpu,
} from "lucide-react";

export default function AIConfigPage() {
  // Mock Config State
  const [config, setConfig] = useState({
    name: "Mr. Lion 🦁",
    model: "gpt-4o",
    temperature: 0.7,
    systemPrompt: `You are Mr. Lion, a friendly and funny English teacher for kids aged 6-10. 
- Always use simple words.
- Use emojis frequently 🦁🌟.
- Correct their grammar gently if they make mistakes.
- If the kid speaks Vietnamese, reply in Vietnamese but encourage them to speak English.`,
    safetyLevel: "STRICT",
  });

  // State cho Chat Simulator
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "AI", text: "Hello friend! Ready to learn? 🦁" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Giả lập gửi tin nhắn tới AI
  const handleTestSend = () => {
    if (!chatInput.trim()) return;

    // 1. Add User Message
    const newHistory = [...chatHistory, { sender: "USER", text: chatInput }];
    setChatHistory(newHistory);
    setChatInput("");
    setIsTyping(true);

    // 2. Simulate AI Response (Delay giả lập suy nghĩ)
    setTimeout(() => {
      const aiResponse = {
        sender: "AI",
        text: `Wow! "${chatInput}" is a great word! You are so smart! 🌟 (Đây là phản hồi test từ Model ${config.model})`,
      };
      setChatHistory([...newHistory, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col p-6 bg-slate-50/50 overflow-hidden font-sans">
      {/* 1. HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-purple-100 rounded-xl text-purple-600">
              <Bot size={28} />
            </div>
            Cấu hình AI Teacher
          </h1>
          <p className="text-slate-500 font-medium mt-1 ml-1">
            Thiết lập tính cách, giọng điệu và tham số cho trợ lý ảo.
          </p>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-200 transition active:scale-95">
          <Save size={18} /> Lưu Cấu Hình
        </button>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden h-full">
        {/* --- LEFT: CONFIGURATION FORM --- */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
          <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar h-full">
            {/* 1. Model Settings */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Cpu size={16} /> Thông số Model
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                    AI Model Provider
                  </label>
                  <div className="relative">
                    <select
                      value={config.model}
                      onChange={(e) =>
                        setConfig({ ...config, model: e.target.value })
                      }
                      className="w-full border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none appearance-none cursor-pointer transition"
                    >
                      <option value="gpt-4o">GPT-4o (Thông minh nhất)</option>
                      <option value="gpt-3.5-turbo">
                        GPT-3.5 Turbo (Nhanh/Rẻ)
                      </option>
                      <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    </select>
                    <Settings
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase flex justify-between">
                    Sáng tạo (Temperature) <span>{config.temperature}</span>
                  </label>
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200 h-[46px]">
                    <span className="text-[10px] font-bold text-slate-400 pl-2">
                      Chính xác
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 accent-purple-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-slate-400 pr-2">
                      Sáng tạo
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. System Prompt */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Zap size={16} className="text-yellow-500" /> System Prompt (Bộ
                não)
              </h3>
              <div className="relative group">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100 flex items-center gap-1">
                    <Sparkles size={10} /> Prompt Engineering Mode
                  </div>
                </div>
                <textarea
                  className="w-full h-80 p-5 border border-slate-200 rounded-2xl text-sm font-mono text-slate-600 bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none leading-relaxed resize-none transition shadow-inner"
                  value={config.systemPrompt}
                  onChange={(e) =>
                    setConfig({ ...config, systemPrompt: e.target.value })
                  }
                  spellCheck={false}
                />
                <div className="mt-3 flex gap-2 text-xs font-mono text-slate-400">
                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 cursor-copy hover:bg-slate-200">{`{student_name}`}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 cursor-copy hover:bg-slate-200">{`{current_lesson}`}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200 cursor-copy hover:bg-slate-200">{`{user_level}`}</span>
                </div>
              </div>
            </section>

            {/* 3. Safety Settings */}
            <section>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldCheck size={16} className="text-green-500" /> An toàn nội
                dung
              </h3>
              <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 w-fit">
                {["LOW", "MEDIUM", "STRICT"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setConfig({ ...config, safetyLevel: level })}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                      config.safetyLevel === level
                        ? "bg-white text-green-600 shadow-sm border border-slate-100"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* --- RIGHT: PHONE SIMULATOR --- */}
        <div className="w-[380px] shrink-0 flex flex-col items-center justify-center py-4">
          <div className="w-full h-full bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl relative flex flex-col overflow-hidden">
            {/* Phone Header (Notch & Status Bar) */}
            <div className="bg-white/10 backdrop-blur-md absolute top-0 left-0 right-0 h-14 z-20 flex justify-center pt-2">
              <div className="w-24 h-6 bg-black rounded-b-2xl"></div>
            </div>

            {/* App Header */}
            <div className="bg-purple-600 pt-16 pb-4 px-4 shadow-lg z-10">
              <div className="flex flex-col items-center text-white">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-purple-400 shadow-md flex items-center justify-center text-3xl mb-2">
                  🦁
                </div>
                <h3 className="font-bold text-lg">{config.name}</h3>
                <div className="flex items-center gap-1.5 text-purple-200 text-xs font-medium bg-purple-700/50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 bg-[#F0F2F5] p-4 overflow-y-auto space-y-3 custom-scrollbar">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm relative ${
                      msg.sender === "USER"
                        ? "bg-purple-600 text-white rounded-br-sm"
                        : "bg-white text-slate-700 rounded-bl-sm border border-slate-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="bg-white p-3 border-t border-slate-200 flex gap-2 items-end">
              <textarea
                className="flex-1 bg-slate-100 border border-transparent focus:bg-white focus:border-purple-300 rounded-2xl px-4 py-2.5 text-sm outline-none resize-none h-[44px] max-h-20 custom-scrollbar"
                placeholder="Nhập tin nhắn..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  (e.preventDefault(), handleTestSend())
                }
              />
              <button
                onClick={handleTestSend}
                className="w-[44px] h-[44px] bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition shadow-md active:scale-90"
              >
                <Send size={18} className="ml-0.5 mt-0.5" />
              </button>
            </div>

            {/* Refresh Overlay Button */}
            <button
              onClick={() => setChatHistory([])}
              className="absolute top-20 right-4 p-2 bg-white/20 backdrop-blur rounded-full text-white/80 hover:bg-white/40 hover:text-white transition z-20"
              title="Làm mới cuộc trò chuyện"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
