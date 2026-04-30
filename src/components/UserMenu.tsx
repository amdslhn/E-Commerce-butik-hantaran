"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { logoutUser } from "@/actions/logout";

export default function UserMenu({
  userName,
  initial,
  userRole,
}: {
  userName: string;
  initial: string;
  userRole?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isCustomerPortal = userRole !== 3;

  // Menutup dropdown jika user klik di luar area menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Tombol Pemicu Dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full border border-[#d8d0c8]/50 bg-white py-1.5 pl-4 pr-1.5 shadow-sm transition hover:shadow-md focus:outline-none"
      >
        <span className="hidden text-sm font-medium text-[#3a302a] sm:block">
          {userName}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf5ee] text-sm font-bold text-[#c2652a] ring-1 ring-[#c2652a]/20">
          {initial}
        </div>
        {/* Ikon Panah Bawah */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 text-[#7a6f69] mr-1"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Isi Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#d8d0c8]/60 bg-white py-2 shadow-[0_4px_20px_rgba(58,48,42,0.08)] font-sans">
          <div className="px-4 py-2 mb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7a6f69]">
              Akun Saya
            </p>
          </div>
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#3a302a] transition hover:bg-[#faf5ee] hover:text-[#c2652a]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Profil
          </Link>

          {isCustomerPortal && (
            <>
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#3a302a] transition hover:bg-[#faf5ee] hover:text-[#c2652a]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h10.5m-10.5 5.25h10.5m-10.5 5.25h10.5M3.75 6.75h.008v.008H3.75V6.75Zm0 5.25h.008v.008H3.75V12Zm0 5.25h.008v.008H3.75v-.008Z"
                  />
                </svg>
                Booking Baru
              </Link>

              <Link
                href="/pesanan"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#3a302a] transition hover:bg-[#faf5ee] hover:text-[#c2652a]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 19.5V21m0-1.5h18M3 4.5h18M5.25 7.5h13.5a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 .75-.75Zm4.5 3.75h4.5"
                  />
                </svg>
                Tracking Pesanan
              </Link>
            </>
          )}

          <div className="my-1 h-px w-full bg-[#d8d0c8]/50"></div>

          <form action={logoutUser}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#c2652a] transition hover:bg-[#fdf2f2]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              Keluar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
