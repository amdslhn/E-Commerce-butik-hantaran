"use client";

import { useState } from "react";
import { markGoodsReceived } from "@/actions/admin";

interface Metadata {
  pengantin_pria?: string;
  pengantin_wanita?: string;
  catatan?: string;
}

export default function AdminBookingActions({
  bookingId,
  metadata,
}: {
  bookingId: number;
  metadata: Metadata | null;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleReceive = async () => {
    setIsPending(true);
    await markGoodsReceived(bookingId);
    // Kita tidak perlu setIsPending(false) karena baris ini akan otomatis hilang setelah revalidatePath
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Tombol Detail (Outline) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg border border-[#c2652a] bg-[#faf5ee] px-3 py-2 text-xs font-bold text-[#c2652a] transition-all hover:bg-[#c2652a] hover:text-white active:scale-95"
        >
          Detail
        </button>

        {/* Tombol Terima Barang (Solid) */}
        <button
          onClick={handleReceive}
          disabled={isPending}
          className="rounded-lg bg-[#c2652a] px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#a85522] active:scale-95 disabled:opacity-50"
        >
          {isPending ? "Memproses..." : "Diterima"}
        </button>
      </div>

      {/* MODAL POP-UP DETAIL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl transition-transform">
            <div className="mb-4 flex items-center justify-between border-b border-[#d8d0c8]/50 pb-3">
              <h3 className="font-serif text-lg font-medium text-[#3a302a]">
                Detail Pesanan #{bookingId}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-[#7a6f69] transition hover:bg-[#fdf2f2] hover:text-[#c2652a]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-[#faf5ee] p-4 border border-[#d8d0c8]/40">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94]">
                    Pengantin Pria
                  </p>
                  <p className="text-sm font-medium text-[#3a302a] mt-0.5">
                    {metadata?.pengantin_pria || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94]">
                    Pengantin Wanita
                  </p>
                  <p className="text-sm font-medium text-[#3a302a] mt-0.5">
                    {metadata?.pengantin_wanita || "-"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94] mb-1">
                  Catatan Tambahan
                </p>
                <div className="rounded-xl border border-[#d8d0c8]/50 bg-white p-3 text-sm text-[#7a6f69] min-h-20">
                  {metadata?.catatan ? (
                    metadata.catatan
                  ) : (
                    <span className="italic text-[#a39a94]">
                      Tidak ada catatan dari pelanggan.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full rounded-lg bg-[#d8d0c8]/30 py-2.5 text-sm font-semibold text-[#3a302a] transition hover:bg-[#d8d0c8]/50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
