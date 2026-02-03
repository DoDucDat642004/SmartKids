"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

// --- MOCK DATA ---
const MOCK_PACKAGES = [
  {
    _id: "pkg_free",
    name: "Bé Tập Sự",
    price: 0,
    originalPrice: 0,
    duration: 9999,
    badge: "",
    icon: "🐣",
    theme: "gray",
    benefits: [
      "Học 2 bài miễn phí mỗi ngày",
      "Truy cập kho từ vựng cơ bản",
      "Tham gia bảng xếp hạng",
    ],
    limitations: [
      "Không có trợ lý AI",
      "Giới hạn bài tập nâng cao",
      "Không có báo cáo chi tiết",
    ],
  },
  {
    _id: "pkg_monthly",
    name: "Nhà Thám Hiểm",
    price: 99000,
    originalPrice: 150000,
    duration: 30,
    badge: "Tiết kiệm",
    icon: "🚀",
    theme: "blue",
    benefits: [
      "Mở khóa TOÀN BỘ bài học",
      "Không giới hạn thời gian học",
      "Báo cáo học tập cơ bản",
      "Tắt quảng cáo",
    ],
    limitations: ["Giới hạn 50 lượt chat AI/ngày"],
  },
  {
    _id: "pkg_yearly",
    name: "Siêu Anh Hùng",
    price: 999000,
    originalPrice: 1800000,
    duration: 365,
    badge: "POPULAR",
    icon: "💎",
    theme: "purple",
    benefits: [
      "Tất cả quyền lợi gói Thám Hiểm",
      "Chat AI không giới hạn",
      "Gia sư 1:1 (2 buổi/tháng)",
      "Bộ quà tặng Sticker độc quyền",
      "Huy hiệu VIP lấp lánh",
    ],
    limitations: [],
  },
];

export default function SubscriptionPage() {
  const router = useRouter(); // Khởi tạo router
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập fetch API
    const fetchPackages = async () => {
      setLoading(true);
      setTimeout(() => {
        setPackages(MOCK_PACKAGES);
        setLoading(false);
      }, 800);
    };
    fetchPackages();
  }, []);

  // Chuyển hướng sang Checkout
  const handleSubscribe = (pack: any) => {
    // Tạo URL params chứa thông tin gói để trang Checkout hiển thị
    const params = new URLSearchParams({
      type: "PACKAGE",
      id: pack._id,
      name: pack.name,
      price: pack.price.toString(),
      desc: `Gói ${pack.name} - Thời hạn ${pack.duration === 365 ? "1 Năm" : "1 Tháng"}`,
      image: pack.icon, // Truyền icon/emoji sang
    });

    // Chuyển hướng
    router.push(`/checkout?${params.toString()}`);
  };

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans pb-20">
      {/* 1. HEADER HERO */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white pt-16 pb-32 px-4 rounded-b-[3rem] text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl animate-bounce">
            💎
          </div>
          <div className="absolute bottom-20 right-20 text-6xl animate-pulse">
            🚀
          </div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold border border-white/20 mb-4 animate-in fade-in slide-in-from-bottom-2">
            ✨ Nâng cấp tài khoản ngay hôm nay
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-md">
            Cửa Hàng Siêu Năng Lực
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 font-medium max-w-2xl mx-auto">
            Mở khóa toàn bộ tính năng, học không giới hạn và nhận huy hiệu VIP
            độc quyền!
          </p>
        </div>
      </div>

      {/* 2. TOGGLE SWITCH */}
      <div className="flex justify-center -mt-8 relative z-20 mb-12">
        <div className="bg-white p-1.5 rounded-full shadow-xl border border-slate-100 flex items-center">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              billing === "monthly"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Theo Tháng
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              billing === "yearly"
                ? "bg-pink-500 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Theo Năm{" "}
            <span className="bg-white text-pink-600 text-[10px] px-1.5 py-0.5 rounded shadow-sm">
              -30%
            </span>
          </button>
        </div>
      </div>

      {/* 3. PRICING CARDS */}
      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
            <p>Đang tải gói cước...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {packages.map((pack) => {
              const isVip = pack.theme === "purple";
              return (
                <div
                  key={pack._id}
                  className={`relative bg-white rounded-3xl transition-all duration-300 flex flex-col h-full border-2 ${
                    isVip
                      ? "border-purple-500 shadow-2xl scale-105 z-10"
                      : "border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {/* Ribbon Badge */}
                  {pack.badge && (
                    <div className="absolute top-0 right-0 left-0 text-center -mt-4">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-black text-white uppercase tracking-wider shadow-md ${
                          isVip
                            ? "bg-gradient-to-r from-pink-500 to-purple-600"
                            : "bg-blue-500"
                        }`}
                      >
                        {pack.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-8 flex-1">
                    <div className="text-5xl mb-4 text-center">{pack.icon}</div>
                    <h3 className="text-2xl font-black text-slate-800 text-center mb-2">
                      {pack.name}
                    </h3>

                    <div className="text-center mb-6">
                      <span className="text-4xl font-black text-slate-900">
                        {formatMoney(pack.price)}
                      </span>
                      {pack.price > 0 && (
                        <span className="text-slate-400 text-sm font-medium">
                          /{pack.duration === 365 ? "năm" : "tháng"}
                        </span>
                      )}
                      {pack.originalPrice > pack.price && (
                        <div className="text-slate-400 text-sm line-through mt-1">
                          {formatMoney(pack.originalPrice)}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 mb-8">
                      {pack.benefits.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 text-sm text-slate-600"
                        >
                          <div
                            className={`p-0.5 rounded-full shrink-0 mt-0.5 ${
                              isVip
                                ? "bg-green-100 text-green-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <Check size={12} strokeWidth={4} />
                          </div>
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                      {pack.limitations?.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 text-sm text-slate-400 opacity-70"
                        >
                          <div className="p-0.5 rounded-full shrink-0 mt-0.5 bg-slate-100">
                            <X size={12} strokeWidth={4} />
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 pt-0 mt-auto">
                    <button
                      onClick={() => handleSubscribe(pack)}
                      disabled={pack.price === 0}
                      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 group ${
                        pack.price === 0
                          ? "bg-slate-100 text-slate-400 cursor-default shadow-none"
                          : isVip
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-200 hover:scale-[1.02]"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
                      }`}
                    >
                      {pack.price === 0 ? "Đang sử dụng" : "Nâng cấp ngay"}
                      {pack.price > 0 && (
                        <ArrowRight
                          size={20}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      )}
                    </button>
                    {isVip && (
                      <p className="text-center text-xs text-purple-500 font-medium mt-3 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> Đảm bảo hoàn tiền trong 7 ngày
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. FOOTER */}
        <div className="mt-16 text-center">
          <Link
            href="/home"
            className="text-slate-500 font-bold hover:text-indigo-600 transition underline underline-offset-4"
          >
            Để sau, quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
