"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Tag,
  Clock,
  Trophy,
  Info,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA ---
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "PROMO",
    title: "🎁 Ưu đãi đặc biệt: Giảm 50% Gói VIP",
    desc: "Chỉ duy nhất hôm nay! Nâng cấp tài khoản để mở khóa toàn bộ kho tàng truyện tranh và video.",
    time: "30 phút trước",
    isRead: false,
  },
  {
    id: 2,
    type: "REMINDER",
    title: "⏰ Đã đến giờ học bài rồi!",
    desc: "Bé ơi, hãy dành 15 phút ôn tập từ vựng chủ đề 'Animals' để giữ chuỗi Streak 30 ngày nhé.",
    time: "2 giờ trước",
    isRead: false,
  },
  {
    id: 3,
    type: "ACHIEVEMENT",
    title: "🏆 Chúc mừng! Bạn đạt Level 5",
    desc: "Tuyệt vời! Bạn vừa nhận được huy hiệu 'Ong chăm chỉ' và 100 Vàng thưởng.",
    time: "1 ngày trước",
    isRead: true,
  },
  {
    id: 4,
    type: "SYSTEM",
    title: "🔧 Bảo trì hệ thống",
    desc: "Hệ thống sẽ bảo trì nâng cấp từ 02:00 - 04:00 sáng mai. Mong bạn thông cảm.",
    time: "2 ngày trước",
    isRead: true,
  },
  {
    id: 5,
    type: "PROMO",
    title: "Flash Sale: Mua 1 tặng 1",
    desc: "Khi mua vật phẩm trong cửa hàng hôm nay. Nhanh tay lên nào!",
    time: "3 ngày trước",
    isRead: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  // --- ACTIONS ---
  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredList = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // --- HELPER STYLES ---
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "PROMO":
        return { icon: Tag, color: "text-pink-500", bg: "bg-pink-100" };
      case "REMINDER":
        return { icon: Clock, color: "text-amber-500", bg: "bg-amber-100" };
      case "ACHIEVEMENT":
        return { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-100" };
      default:
        return { icon: Info, color: "text-blue-500", bg: "bg-blue-100" };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-24 font-sans">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              Thông Báo{" "}
              <div className="relative">
                <Bell className="text-blue-600 fill-blue-100" size={28} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </div>
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Cập nhật tin tức, khuyến mãi và nhắc nhở học tập.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm"
            >
              <CheckCheck size={16} /> Đánh dấu đã đọc
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
          {/* TABS */}
          <div className="flex items-center border-b border-slate-100 p-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition ${filter === "ALL" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${filter === "UNREAD" ? "bg-blue-50 text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              Chưa đọc{" "}
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto p-2">
            <AnimatePresence mode="popLayout">
              {filteredList.length > 0 ? (
                filteredList.map((item) => {
                  const style = getTypeStyles(item.type);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      className={`group relative p-4 rounded-2xl mb-2 transition-all border ${item.isRead ? "bg-white border-transparent hover:border-slate-100" : "bg-blue-50/40 border-blue-100"}`}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${style.bg} ${style.color}`}
                        >
                          <style.icon size={24} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-8">
                          <div className="flex justify-between items-start mb-1">
                            <h3
                              className={`text-base font-bold ${item.isRead ? "text-slate-700" : "text-slate-900"}`}
                            >
                              {item.title}
                            </h3>
                            <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                              {item.time}
                            </span>
                          </div>
                          <p
                            className={`text-sm leading-relaxed ${item.isRead ? "text-slate-500" : "text-slate-700 font-medium"}`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* Actions (Hover show) */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => deleteNotification(item.id)}
                          className="p-2 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm border border-slate-100 transition"
                          title="Xóa thông báo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Unread Indicator */}
                      {!item.isRead && (
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 w-2.5 h-2.5 bg-blue-500 rounded-full group-hover:opacity-0 transition-opacity"></div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Bell size={40} className="text-slate-300" />
                  </div>
                  <p className="font-bold text-lg">Không có thông báo nào</p>
                  <p className="text-sm">Bạn đã xem hết tất cả tin tức rồi!</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
