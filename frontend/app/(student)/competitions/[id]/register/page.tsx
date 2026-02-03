"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  Share2,
  MapPin,
  CheckCircle2,
  Gift,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

// --- MOCK DATA ---
const COMP_DETAIL = {
  id: "C01",
  title: "Đấu Trường Từ Vựng: Unit 5 - Animals",
  banner: "bg-gradient-to-r from-violet-600 to-indigo-600",
  type: "QUIZ",
  status: "UPCOMING", // UPCOMING, HAPPENING, ENDED
  fee: 0, // 0 = Miễn phí
  startTime: "20:00 - 25/11/2023",
  duration: "45 phút",
  participants: 142,
  maxParticipants: 500,
  description:
    "Cuộc thi tranh tài kiến thức từ vựng chủ đề Động vật dành cho học sinh khối 3. Hãy ôn tập thật kỹ và sẵn sàng để giành lấy huy hiệu Vàng!",
  rules: [
    "Bài thi gồm 30 câu hỏi trắc nghiệm.",
    "Thời gian làm bài: 15 phút.",
    "Mỗi câu trả lời đúng: +10 điểm.",
    "Trả lời nhanh (dưới 5s): +2 điểm bonus.",
    "Không được thoát trình duyệt trong quá trình thi.",
  ],
  rewards: [
    {
      rank: "Top 1",
      prize: "Huy hiệu Vàng + 500 XP + Gấu bông SmartKids",
      icon: "🥇",
    },
    { rank: "Top 2-5", prize: "Huy hiệu Bạc + 300 XP", icon: "🥈" },
    { rank: "Top 6-10", prize: "Huy hiệu Đồng + 100 XP", icon: "🥉" },
  ],
};

export default function CompetitionRegisterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  // Xử lý Đăng ký
  const handleRegister = async () => {
    // 1. Nếu có phí -> Chuyển sang Checkout
    if (COMP_DETAIL.fee > 0) {
      router.push(
        `/checkout?type=COMPETITION&id=${COMP_DETAIL.id}&price=${COMP_DETAIL.fee}`,
      );
      return;
    }

    // 2. Nếu miễn phí -> Đăng ký ngay
    setLoading(true);
    // Giả lập API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setIsRegistered(true);
  };

  // Xử lý Vào thi (Sau khi đã đăng ký)
  const handleEnterExam = () => {
    router.push(`/competitions/${params.id}/play`);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans pb-24">
      {/* 1. HERO BANNER */}
      <div
        className={`relative h-64 md:h-80 ${COMP_DETAIL.banner} text-white overflow-hidden`}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

        {/* Navbar Overlay */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition">
            <Share2 size={20} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-10 bg-gradient-to-t from-black/60 to-transparent">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-black uppercase rounded-lg mb-3 shadow-lg">
              {COMP_DETAIL.type === "QUIZ" ? "Trắc nghiệm" : "Hùng biện"}
            </span>
            <h1 className="text-2xl md:text-4xl font-black mb-2 shadow-sm leading-tight">
              {COMP_DETAIL.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium opacity-90">
              <span className="flex items-center gap-1">
                <Calendar size={16} /> {COMP_DETAIL.startTime}
              </span>
              <span className="flex items-center gap-1">
                <MapPin size={16} /> Online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 2. LEFT COLUMN: INFO */}
          <div className="flex-1 space-y-6">
            {/* Overview */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle className="text-blue-500" /> Giới thiệu
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {COMP_DETAIL.description}
              </p>
            </div>

            {/* Rules */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-green-500" /> Thể lệ thi đấu
              </h2>
              <ul className="space-y-3">
                {COMP_DETAIL.rules.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-slate-600 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Rewards */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-3xl border border-orange-100">
              <h2 className="text-lg font-bold text-orange-800 mb-6 flex items-center gap-2">
                <Trophy className="text-orange-500" /> Cơ cấu giải thưởng
              </h2>
              <div className="grid gap-3">
                {COMP_DETAIL.rewards.map((reward, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-orange-100"
                  >
                    <div className="text-3xl">{reward.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        {reward.rank}
                      </p>
                      <p className="font-bold text-slate-800 text-sm">
                        {reward.prize}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: ACTION CARD (Sticky) */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-slate-500 text-xs font-bold uppercase mb-1">
                  Trạng thái
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-black uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Đang mở đăng ký
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Users size={16} /> Đã tham gia
                  </span>
                  <span className="font-bold text-slate-800">
                    {COMP_DETAIL.participants}/{COMP_DETAIL.maxParticipants}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Clock size={16} /> Thời lượng
                  </span>
                  <span className="font-bold text-slate-800">
                    {COMP_DETAIL.duration}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <Gift size={16} /> Lệ phí
                  </span>
                  <span className="font-black text-blue-600 text-lg">
                    {COMP_DETAIL.fee === 0
                      ? "Miễn phí"
                      : `${COMP_DETAIL.fee.toLocaleString()}đ`}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTON */}
              {!isRegistered ? (
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? "Đang xử lý..." : "Đăng ký tham gia ngay"}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center text-sm font-bold border border-green-100 flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} /> Đăng ký thành công!
                  </div>
                  <button
                    onClick={handleEnterExam}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Zap size={20} fill="currentColor" /> Vào phòng thi
                  </button>
                  <p className="text-xs text-center text-slate-400">
                    Phòng thi sẽ mở trước 10 phút
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
