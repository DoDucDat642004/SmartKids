"use client";

import Footer from "@/components/clients/Footer";
import Navbar from "@/components/clients/Navbar";
import NavbarPet from "@/components/clients/NavbarPet";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="customer-wrapper relative font-sans"
      style={{ minHeight: "100vh", backgroundColor: "#f0f8ff" }}
    >
      <div className="fixed top-0 left-0 w-full h-48 z-[9999] pointer-events-none overflow-hidden">
        <NavbarPet />
      </div>

      <Navbar />

      <main style={{ flex: 1 }}>{children}</main>

      <Footer />
    </div>
  );
}
