"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  LogOut,
  User,
  BarChart3,
  Settings,
  CreditCard,
  ChevronRight,
  Clock,
  Brain,
  ShieldAlert,
  Delete,
} from "lucide-react";

export default function ParentsPage() {
  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // Dữ liệu giả lập (Mock Data)
  const CORRECT_PIN = "1990"; // Mã PIN mặc định
  const CHILD_INFO = { name: "Tuấn Kiệt", age: 7, level: "Lớp 2" };

  const STATS = {
    totalHours: 3.5,
    weeklyData: [
      { day: "T2", min: 20 },
      { day: "T3", min: 45 },
      { day: "T4", min: 30 },
      { day: "T5", min: 60 },
      { day: "T6", min: 15 },
      { day: "T7", min: 0 },
      { day: "CN", min: 10 },
    ],
    skills: [
      {
        name: "Từ vựng (Vocabulary)",
        score: 85,
        color: "bg-green-500",
        text: "text-green-600",
      },
      {
        name: "Phát âm (Speaking)",
        score: 40,
        color: "bg-red-500",
        text: "text-red-600",
      },
      {
        name: "Nghe hiểu (Listening)",
        score: 65,
        color: "bg-yellow-500",
        text: "text-yellow-600",
      },
    ],
  };

  // --- HANDLERS ---
  const handlePin = (num: string) => {
    setError(false); // Reset lỗi khi nhập lại
    if (num === "clear") {
      setPin((prev) => prev.slice(0, -1));
      return;
    }

    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      // Tự động kiểm tra khi đủ 4 số
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          setTimeout(() => setIsAuthenticated(true), 200); // Delay nhẹ tạo cảm giác mượt
        } else {
          setError(true);
          setTimeout(() => setPin(""), 500); // Reset PIN sau khi báo lỗi
        }
      }
    }
  };

  // --- 1. MÀN HÌNH NHẬP PIN (BẢO MẬT) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm"
        >
          {/* Icon Lock */}
          <div className="flex justify-center mb-8">
            <div
              className={`p-4 rounded-full bg-slate-800 ${error ? "animate-shake" : ""}`}
            >
              <Lock
                size={40}
                className={error ? "text-red-500" : "text-blue-500"}
              />
            </div>
          </div>

          <h2 className="text-white text-center text-xl font-bold mb-8">
            {error ? (
              <span className="text-red-500">
                Sai mã PIN, vui lòng thử lại!
              </span>
            ) : (
              "Nhập PIN Phụ Huynh"
            )}
          </h2>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  i < pin.length
                    ? error
                      ? "bg-red-500 border-red-500"
                      : "bg-blue-500 border-blue-500"
                    : "border-slate-600 bg-transparent"
                }`}
              ></div>
            ))}
          </div>

          {/* NumPad */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handlePin(n.toString())}
                className="h-16 w-full rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-2xl font-bold transition active:scale-95"
              >
                {n}
              </button>
            ))}
            <div /> {/* Empty slot */}
            <button
              onClick={() => handlePin("0")}
              className="h-16 w-full rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-2xl font-bold transition active:scale-95"
            >
              0
            </button>
            <button
              onClick={() => handlePin("clear")}
              className="h-16 w-full rounded-2xl bg-slate-800 hover:bg-red-900/30 text-red-400 flex items-center justify-center transition active:scale-95"
            >
              <Delete size={24} />
            </button>
          </div>

          <Link
            href="/profile"
            className="block text-center text-slate-500 mt-8 text-sm hover:text-white transition"
          >
            ← Quay lại trang hồ sơ
          </Link>
        </motion.div>
      </div>
    );
  }

  // --- 2. MÀN HÌNH DASHBOARD (MAIN) ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div>
              <h1 className="font-bold text-slate-800">Góc Phụ Huynh</h1>
              <p className="text-xs text-slate-500">
                Đang quản lý: <strong>{CHILD_INFO.name}</strong>
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg"
          >
            <LogOut size={16} /> Thoát
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- CỘT TRÁI: BÁO CÁO (Chiếm 2 phần) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. BIỂU ĐỒ THỜI GIAN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" /> Thời gian học tuần
                này
              </h3>
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                Tổng: {STATS.totalHours} giờ
              </span>
            </div>

            {/* Chart Area */}
            <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
              {STATS.weeklyData.map((data, idx) => {
                // Tính chiều cao tương đối (Max 60 phút = 100%)
                const heightPercent = Math.min((data.min / 60) * 100, 100);
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center flex-1 group"
                  >
                    <div className="relative w-full flex justify-end flex-col items-center h-full">
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded transition-opacity mb-1 whitespace-nowrap z-10">
                        {data.min} phút
                      </div>
                      {/* Bar */}
                      <div
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out ${data.min > 0 ? "bg-blue-500 group-hover:bg-blue-600" : "bg-slate-100 h-1"}`}
                        style={{
                          height: `${data.min > 0 ? heightPercent : 2}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400 font-bold mt-2 uppercase">
                      {data.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. PHÂN TÍCH KỸ NĂNG */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Brain size={20} className="text-purple-500" /> Phân tích kỹ năng
            </h3>
            <div className="space-y-6">
              {STATS.skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">
                      {skill.name}
                    </span>
                    <span className={`font-bold ${skill.text}`}>
                      {skill.score}/100
                    </span>
                  </div>
                  {/* Progress Bar Container */}
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${skill.color}`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    {skill.score < 50
                      ? "⚠️ Cần luyện tập thêm"
                      : "✅ Đang làm rất tốt"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: CÀI ĐẶT (Chiếm 1 phần) --- */}
        <div className="space-y-8">
          {/* 1. GÓI CƯỚC (SUBSCRIPTION) */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded border border-white/20">
                  PRO PLAN
                </span>
                <h3 className="text-2xl font-black mt-2">Siêu Anh Hùng</h3>
              </div>
              <div className="bg-white text-indigo-600 p-2 rounded-lg">
                <CreditCard size={24} />
              </div>
            </div>

            <p className="text-indigo-100 text-sm mb-6">
              Hạn sử dụng: <strong>12/2026</strong>
            </p>

            <Link href="/subscription">
              <button className="w-full bg-white text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-50 transition shadow-sm">
                Quản lý gói cước
              </button>
            </Link>
          </div>

          {/* 2. KIỂM SOÁT (CONTROLS) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <ShieldAlert size={20} className="text-orange-500" /> Kiểm soát &
              Giới hạn
            </h3>

            <div className="space-y-5">
              {/* Toggle Item */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Giới hạn 30 phút/ngày
                  </p>
                  <p className="text-xs text-slate-400">
                    Nhắc nhở bé nghỉ ngơi
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Toggle Item */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Khóa game sau 9PM
                  </p>
                  <p className="text-xs text-slate-400">Giúp bé ngủ đúng giờ</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Toggle Item */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">
                    Nhạc nền ứng dụng
                  </p>
                  <p className="text-xs text-slate-400">Tắt nếu ồn ào</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Settings Link */}
          <Link
            href="/settings"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition group cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-slate-600 group-hover:text-blue-600">
              <Settings size={18} /> Cài đặt chung
            </span>
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:text-blue-500"
            />
          </Link>
        </div>
      </main>
    </div>
  );
}
