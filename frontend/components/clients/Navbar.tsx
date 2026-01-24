"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  User as UserIcon,
  CreditCard,
  Menu,
  Cat,
  ChevronDown,
  BookOpen,
  Gamepad2,
  Users,
  Lightbulb,
  GraduationCap,
  Target,
  Newspaper,
  Library,
  MessageCircle,
  MonitorPlay,
  Phone,
  ShieldCheck,
  Search,
  X,
  Sparkles,
  Bell, // Icon chuông
  Tag,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { userService } from "@/services/user.service";

// Components
import InventoryModal from "@/components/clients/course/InventoryModal";
import AITutorWidget from "./AITutorWidget";

// --- MOCK NOTIFICATIONS ---
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "🎉 Khuyến mãi 50% Gói VIP",
    desc: "Chỉ duy nhất hôm nay! Nâng cấp ngay để mở khóa toàn bộ tính năng.",
    type: "PROMO",
    read: false,
    time: "2 giờ trước",
  },
  {
    id: 2,
    title: "⏰ Nhắc nhở học tập",
    desc: "Bé ơi, đã đến giờ học bài rồi. Vào học ngay để giữ chuỗi Streak nhé!",
    type: "REMINDER",
    read: false,
    time: "5 giờ trước",
  },
  {
    id: 3,
    title: "🏆 Chúc mừng lên cấp!",
    desc: "Bạn vừa đạt Level 5. Nhận ngay phần thưởng 100 Vàng.",
    type: "SYSTEM",
    read: true,
    time: "1 ngày trước",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // STATE
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotiMenu, setShowNotiMenu] = useState(false); // State cho menu thông báo
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs để click outside
  const menuRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);

  // CONFIG MENU DATA (Giữ nguyên như cũ)
  const navGroups = [
    {
      label: "Học tập",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        {
          name: "Khoá học",
          path: "/courses",
          icon: BookOpen,
          desc: "Lộ trình bài bản",
        },
        {
          name: "Lớp Live",
          path: "/my-classes",
          icon: MonitorPlay,
          desc: "Học trực tuyến",
        },
        {
          name: "Luyện tập",
          path: "/practice",
          icon: Target,
          desc: "Ôn tập kiến thức",
        },
        {
          name: "Đăng ký khóa học",
          path: "/live-tutors",
          icon: Lightbulb,
          desc: "Hỏi đáp 1:1",
        },
      ],
    },
    {
      label: "Vui chơi",
      icon: Gamepad2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        {
          name: "Giải trí",
          path: "/entertainment",
          icon: Gamepad2,
          desc: "Mini-games vui nhộn",
        },
        {
          name: "Nhiệm vụ",
          path: "/missions",
          icon: Sparkles,
          desc: "Săn thưởng mỗi ngày",
        },
        {
          name: "Xếp hạng",
          path: "/leaderboard",
          icon: ShieldCheck,
          desc: "Đua top vinh quang",
        },
        {
          name: "Bạn bè",
          path: "/friends",
          icon: Users,
          desc: "Kết bạn bốn phương",
        },
      ],
    },
    {
      label: "Khám phá",
      icon: Library,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      items: [
        {
          name: "Cộng đồng",
          path: "/community",
          icon: MessageCircle,
          desc: "Diễn đàn trao đổi",
        },
        {
          name: "Blog & Tin",
          path: "/blogs",
          icon: Newspaper,
          desc: "Tin tức giáo dục",
        },
        {
          name: "Cẩm nang",
          path: "/handbook",
          icon: BookOpen,
          desc: "Mẹo học tập hay",
        },
        {
          name: "Từ điển",
          path: "/dictionary",
          icon: Search,
          desc: "Tra cứu nhanh",
        },
      ],
    },
  ];

  // EFFECTS
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          try {
            const res = await userService.getProfile();
            if (res && res.data) setUser({ ...parsed, ...res.data });
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    fetchUser();

    // Click outside handler chung
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notiRef.current && !notiRef.current.contains(event.target)) {
        setShowNotiMenu(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/login");
  };

  const handlePetChange = () => {
    setShowInventory(false);
    window.location.reload();
  };

  // Helper Icon Noti
  const getNotiIcon = (type: string) => {
    switch (type) {
      case "PROMO":
        return <Tag size={16} className="text-white" />;
      case "REMINDER":
        return <Clock size={16} className="text-white" />;
      default:
        return <CheckCircle2 size={16} className="text-white" />;
    }
  };

  const getNotiColor = (type: string) => {
    switch (type) {
      case "PROMO":
        return "bg-red-500 shadow-red-200";
      case "REMINDER":
        return "bg-amber-500 shadow-amber-200";
      default:
        return "bg-blue-500 shadow-blue-200";
    }
  };

  return (
    <>
      <div className="h-20"></div>

      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-slate-200 py-2"
            : "bg-white border-transparent py-3"
        }`}
      >
        <div className="container mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          {/* 1. LOGO */}
          <Link
            href="/home"
            className="flex items-center gap-3 mr-8 shrink-0 group"
          >
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20 group-hover:bg-blue-800 transition-colors transform group-hover:scale-105 duration-300">
              <GraduationCap size={22} strokeWidth={2.5} />
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-blue-700 transition-colors">
                SmartKids
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-400 transition-colors">
                Education System
              </span>
            </div>
          </Link>

          {/* 2. MEGA MENU (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navGroups.map((group, idx) => {
              const isActiveGroup = group.items.some((i) =>
                pathname.startsWith(i.path),
              );
              return (
                <div key={idx} className="relative group px-2 py-2">
                  <button
                    className={`flex items-center gap-1.5 text-sm font-bold transition-all px-4 py-2.5 rounded-full ${
                      isActiveGroup
                        ? `${group.color} ${group.bgColor} shadow-sm ring-1 ring-inset ring-current ring-opacity-10`
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <group.icon size={18} strokeWidth={2.5} />
                    {group.label}
                    <ChevronDown
                      size={14}
                      className="opacity-50 group-hover:rotate-180 transition-transform duration-300"
                    />
                  </button>

                  {/* Dropdown Content */}
                  <div className="absolute top-full left-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out origin-top-left z-[60]">
                    <div className="grid gap-1">
                      {group.items.map((item) => {
                        const isActiveItem = pathname.startsWith(item.path);
                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-start gap-4 p-3 rounded-2xl transition-all group/item ${
                              isActiveItem ? "bg-slate-50" : "hover:bg-slate-50"
                            }`}
                          >
                            <div
                              className={`p-3 rounded-xl transition-colors ${isActiveItem ? "bg-white shadow-sm text-blue-600" : "bg-slate-100 text-slate-500 group-hover/item:bg-white group-hover/item:shadow-sm group-hover/item:text-blue-500"}`}
                            >
                              <item.icon size={20} />
                            </div>
                            <div>
                              <div
                                className={`text-sm font-bold ${isActiveItem ? "text-blue-600" : "text-slate-700 group-hover/item:text-slate-900"}`}
                              >
                                {item.name}
                              </div>
                              <div className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* 3. RIGHT ACTIONS (NOTI & USER) */}
          <div className="flex items-center gap-3 ml-auto">
            {/* --- NOTIFICATION BELL --- */}
            {user && (
              <div className="relative" ref={notiRef}>
                <button
                  onClick={() => {
                    setShowNotiMenu(!showNotiMenu);
                    setShowUserMenu(false); // Close user menu if open
                  }}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${showNotiMenu ? "bg-blue-50 text-blue-600" : "hover:bg-slate-100 text-slate-500"}`}
                >
                  <Bell
                    size={20}
                    className={showNotiMenu ? "animate-tada" : ""}
                  />
                  {/* Badge Count */}
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                </button>

                {/* Dropdown Thông Báo */}
                {showNotiMenu && (
                  <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[80] overflow-hidden">
                    <div className="px-4 py-3 flex justify-between items-center border-b border-slate-50">
                      <h3 className="font-bold text-slate-800">
                        Thông báo mới
                      </h3>
                      <button className="text-xs font-bold text-blue-600 hover:underline">
                        Đánh dấu đã đọc
                      </button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                      {MOCK_NOTIFICATIONS.map((notif) => (
                        <div
                          key={notif.id}
                          className={`flex gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group ${!notif.read ? "bg-blue-50/50" : ""}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg ${getNotiColor(notif.type)}`}
                          >
                            {getNotiIcon(notif.type)}
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`text-sm font-bold mb-1 group-hover:text-blue-600 transition-colors ${!notif.read ? "text-slate-900" : "text-slate-600"}`}
                            >
                              {notif.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {notif.desc}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                              {notif.time}
                            </span>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-slate-50 text-center">
                      <Link
                        href="/notifications"
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                      >
                        Xem tất cả
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* --- USER AVATAR --- */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotiMenu(false); // Close noti menu if open
                  }}
                  className={`flex items-center gap-2 pl-1 pr-1 py-1 rounded-full border transition-all duration-200 group ${
                    showUserMenu
                      ? "border-blue-400 ring-2 ring-blue-100 bg-blue-50"
                      : "border-slate-200 hover:border-blue-300 hover:shadow-md bg-white"
                  }`}
                >
                  <div className="hidden md:flex flex-col items-end mr-2 px-2 text-right">
                    <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate">
                      {user.fullName || "Học viên"}
                    </span>
                    <span className="text-[10px] font-black text-amber-500 flex items-center justify-end gap-1 bg-white px-2 py-0.5 rounded-full border border-amber-100 shadow-sm">
                      <Sparkles size={8} fill="currentColor" />{" "}
                      {user.gold?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="relative w-10 h-10">
                    <div className="w-full h-full rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden group-hover:scale-105 transition-transform">
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.fullName}&background=random`
                        }
                        className="w-full h-full object-cover"
                        alt="Avatar"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 p-3 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right z-[70]">
                    {/* Header Card */}
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-3 flex items-center gap-4 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none"></div>
                      <div className="w-14 h-14 rounded-full bg-white p-0.5 shadow-sm shrink-0 border-2 border-white/20">
                        <img
                          src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${user.fullName}`
                          }
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden relative z-10">
                        <p className="font-bold text-lg truncate leading-tight">
                          {user.fullName}
                        </p>
                        <p className="text-blue-100 text-xs mb-1">
                          Học viên tích cực
                        </p>
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition inline-flex items-center gap-1 backdrop-blur-sm"
                        >
                          Hồ sơ của tôi{" "}
                          <ChevronDown size={10} className="-rotate-90" />
                        </Link>
                      </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Link
                        href="/shop"
                        onClick={() => setShowUserMenu(false)}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-slate-600 hover:text-amber-700 transition group border border-amber-100"
                      >
                        <CreditCard
                          size={24}
                          className="mb-2 text-amber-500 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs font-bold">Cửa hàng</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowInventory(true);
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition group border border-purple-100"
                      >
                        <Cat
                          size={24}
                          className="mb-2 text-purple-500 group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs font-bold">Thú cưng</span>
                      </button>
                    </div>

                    {/* Menu Links */}
                    <div className="space-y-1 mb-3">
                      {[
                        {
                          href: "/parents",
                          icon: ShieldCheck,
                          label: "Góc phụ huynh",
                        },
                        {
                          href: "/subscription",
                          icon: Target,
                          label: "Gói cước VIP",
                          highlight: true,
                        },
                        {
                          href: "/contact",
                          icon: Phone,
                          label: "Liên hệ hỗ trợ",
                        },
                      ].map((link, i) => (
                        <Link
                          key={i}
                          href={link.href}
                          onClick={() => setShowUserMenu(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${link.highlight ? "bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                        >
                          <link.icon
                            size={18}
                            className={
                              link.highlight
                                ? "text-indigo-600"
                                : "text-slate-400"
                            }
                          />{" "}
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-slate-100 my-2 mx-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-sm transition-colors group"
                    >
                      <LogOut
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                      />{" "}
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition text-sm"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2"
                >
                  Đăng ký ngay <ChevronDown size={14} className="-rotate-90" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE MENU (Giữ nguyên) */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            {/* ... Content Mobile Menu như cũ ... */}
            <div className="p-5 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
              <span className="font-extrabold text-xl text-slate-800">
                Menu
              </span>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {/* Mobile Nav Groups */}
              {navGroups.map((group, idx) => (
                <div
                  key={idx}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <h4
                    className={`font-black uppercase text-xs mb-4 flex items-center gap-2 ${group.color.replace("text-", "text-opacity-80 text-")}`}
                  >
                    <group.icon size={16} /> {group.label}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setShowMobileMenu(false)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl text-center border transition-all ${pathname.startsWith(item.path) ? "bg-blue-50 border-blue-200" : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm"}`}
                      >
                        <item.icon
                          className={`mb-2 ${pathname.startsWith(item.path) ? "text-blue-600" : "text-slate-400"}`}
                          size={24}
                          strokeWidth={2}
                        />
                        <span
                          className={`text-xs font-bold ${pathname.startsWith(item.path) ? "text-blue-700" : "text-slate-600"}`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {!user && (
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href="/login"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full py-3 text-center font-bold text-slate-600 mb-3 bg-slate-50 rounded-xl"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setShowMobileMenu(false)}
                    className="block w-full py-3 text-center font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200"
                  >
                    Đăng ký tài khoản
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <InventoryModal
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        currentPetId={user?.equippedPet?._id || user?.equippedPet}
        onEquipSuccess={handlePetChange}
      />
      {user && <AITutorWidget />}
    </>
  );
}
