"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* SIDEBAR */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* HEADER */}
      <AdminHeader isOpen={isSidebarOpen} />

      {/* MAIN CONTENT */}
      <main
        className={`pt-24 pb-10 px-8 transition-all duration-300 min-h-screen
        ${isSidebarOpen ? "ml-64" : "ml-20"}`}
      >
        {children}
      </main>
    </div>
  );
}
