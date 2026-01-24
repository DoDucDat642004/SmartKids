"use client";

import { Bell, Search, Menu } from "lucide-react";

export default function AdminHeader({ isOpen }: { isOpen: boolean }) {
  return (
    <header
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-40 transition-all duration-300 flex items-center justify-between px-6 shadow-sm
      ${isOpen ? "left-64" : "left-20"}`}
    >
      {/* SEARCH BAR */}
      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg w-96">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm học viên, bài học, đơn hàng..."
          className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-blue-600 transition">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200"></div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 pr-3 rounded-full transition">
          <img
            src="https://ui-avatars.com/api/?name=Admin+Supper&background=0D8ABC&color=fff"
            alt="Admin"
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <div className="text-sm">
            <p className="font-bold text-gray-800 leading-none">Admin Supper</p>
            <p className="text-xs text-gray-500 mt-1">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
