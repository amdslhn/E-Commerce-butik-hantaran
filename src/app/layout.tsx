// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar"; // <-- IMPORT COMPONENT

export const metadata: Metadata = {
  title: "Butik Hantaran",
  description: "Sistem Sewa Box Hantaran",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased">
        <Navbar /> {/* <-- PASANG DI SINI */}
        {/* Tambahkan padding-top agar konten tidak tertutup navbar yang posisinya 'fixed' */}
        <div className="pt-18">{children}</div>
      </body>
    </html>
  );
}
