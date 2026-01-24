"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_MENU } from "./admin-constants";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react"; // Thêm icon ví dụ nếu cần

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminSidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out z-50 flex flex-col border-r border-slate-800 shadow-xl
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* 1. LOGO AREA - Đồng bộ hóa */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800 bg-slate-950 relative overflow-hidden shrink-0">
        <Link
          href="/admin"
          className="flex items-center gap-3 transition-all duration-300"
        >
          {/* Icon Logo luôn hiển thị */}
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50 shrink-0">
            <span className="text-2xl leading-none">
              <GraduationCap />
            </span>
          </div>

          {/* Text Logo chỉ hiện khi mở */}
          <div
            className={`flex flex-col transition-all duration-300 origin-left
            ${isOpen ? "opacity-100 translate-x-0 w-auto" : "opacity-0 -translate-x-4 w-0 overflow-hidden"}`}
          >
            <span className="font-black text-lg text-white tracking-tight whitespace-nowrap">
              SMART<span className="text-blue-500">KIDS</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase whitespace-nowrap">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* 2. MENU SCROLL AREA */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
        {ADMIN_MENU.map((group, idx) => (
          <div key={idx} className="mb-6 px-3">
            {/* Group Label */}
            <div
              className={`transition-all duration-300 overflow-hidden ${isOpen ? "h-auto opacity-100 mb-3" : "h-0 opacity-0 mb-0"}`}
            >
              <h3 className="text-[10px] font-black text-slate-500 uppercase px-3 tracking-widest truncate">
                {group.group}
              </h3>
            </div>

            {/* Separator khi thu nhỏ (thay thế cho Group Label) */}
            {!isOpen && idx !== 0 && (
              <div className="w-8 mx-auto h-[1px] bg-slate-800 my-4" />
            )}

            {/* Menu Items */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center px-3 py-3 rounded-xl transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                          : "hover:bg-slate-800 hover:text-white text-slate-400"
                      }
                      ${!isOpen ? "justify-center" : ""}
                    `}
                  >
                    {/* Tooltip khi thu nhỏ (Hover mới hiện) */}
                    {!isOpen && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg border border-slate-700">
                        {item.name}
                        {/* Mũi tên tooltip */}
                        <div className="absolute top-1/2 right-full -mt-1 -mr-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                      </div>
                    )}

                    {/* Icon */}
                    <span
                      className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                    >
                      {item.icon}
                    </span>

                    {/* Text */}
                    <span
                      className={`font-medium text-sm whitespace-nowrap transition-all duration-300 overflow-hidden
                      ${isOpen ? "ml-3 opacity-100 w-auto" : "ml-0 opacity-0 w-0"}`}
                    >
                      {item.name}
                    </span>

                    {/* Active Indicator (Border Left cho chế độ thu nhỏ) */}
                    {!isOpen && isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. TOGGLE BUTTON */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all active:scale-95"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
}
