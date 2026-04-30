"use client";

import { useState } from "react";
import { markGoodsReceived } from "@/actions/admin";

interface Metadata {
  pengantin_pria?: string;
  pengantin_wanita?: string;
  catatan?: string;
  nama_klien_wo?: string;
  wo_global_note?: string;
  items_received?: string[];
}

export default function AdminBookingActions({
  bookingId,
  metadata,
  currentStatus,
}: {
  bookingId: number;
  metadata: Metadata | null;
  currentStatus: string;
}) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [itemsDraft, setItemsDraft] = useState("");
  const [woGlobalNote, setWoGlobalNote] = useState("");
  const [relatedBookingIdsInput, setRelatedBookingIdsInput] = useState("");
  const [formError, setFormError] = useState("");

  const handleReceive = async () => {
    const daftarBarang = itemsDraft
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 0);

    if (daftarBarang.length === 0) {
      setFormError("Silakan isi minimal satu item barang yang diterima.");
      return;
    }

    const relatedBookingIds = relatedBookingIdsInput
      .split(",")
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((id) => Number.isInteger(id) && id > 0 && id !== bookingId);

    setFormError("");
    setIsPending(true);

    const result = await markGoodsReceived({
      bookingId,
      daftar_barang: daftarBarang,
      wo_global_note: woGlobalNote.trim() || undefined,
      related_booking_ids: relatedBookingIds,
    });

    if (!result.success) {
      setFormError(result.error || "Gagal memproses penerimaan barang.");
      setIsPending(false);
      return;
    }

    setIsReceiveModalOpen(false);
    setIsPending(false);
    setItemsDraft("");
    setWoGlobalNote("");
    setRelatedBookingIdsInput("");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Tombol Detail (Outline) */}
        <button
          onClick={() => setIsDetailModalOpen(true)}
          className="rounded-lg border border-[#c2652a] bg-[#faf5ee] px-3 py-2 text-xs font-bold text-[#c2652a] transition-all hover:bg-[#c2652a] hover:text-white active:scale-95"
        >
          Detail
        </button>

        {/* Tombol Barang Diterima (Solid) */}
        {currentStatus === "PENDING" && (
          <button
            onClick={() => {
              setFormError("");
              setIsReceiveModalOpen(true);
            }}
            disabled={isPending}
            className="rounded-lg bg-[#c2652a] px-3 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#a85522] active:scale-95 disabled:opacity-50"
          >
            {isPending ? "Memproses..." : "Barang Diterima"}
          </button>
        )}
      </div>

      {/* MODAL POP-UP DETAIL */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl transition-transform">
            <div className="mb-4 flex items-center justify-between border-b border-[#d8d0c8]/50 pb-3">
              <h3 className="font-serif text-lg font-medium text-[#3a302a]">
                Detail Pesanan #{bookingId}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
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

              {metadata?.nama_klien_wo && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94] mb-1">
                    Nama Klien WO
                  </p>
                  <div className="rounded-xl border border-[#d8d0c8]/50 bg-white p-3 text-sm text-[#3a302a]">
                    {metadata.nama_klien_wo}
                  </div>
                </div>
              )}

              {metadata?.wo_global_note && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94] mb-1">
                    Catatan Global WO
                  </p>
                  <div className="rounded-xl border border-[#d8d0c8]/50 bg-white p-3 text-sm text-[#3a302a]">
                    {metadata.wo_global_note}
                  </div>
                </div>
              )}

              {metadata?.items_received &&
                metadata.items_received.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#a39a94] mb-1">
                      Daftar Barang Diterima
                    </p>
                    <ul className="space-y-1 rounded-xl border border-[#d8d0c8]/50 bg-white p-3 text-sm text-[#3a302a]">
                      {metadata.items_received.map((item, index) => (
                        <li key={`${item}-${index}`} className="flex gap-2">
                          <span className="text-[#a39a94]">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-full rounded-lg bg-[#d8d0c8]/30 py-2.5 text-sm font-semibold text-[#3a302a] transition hover:bg-[#d8d0c8]/50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#d8d0c8]/60 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-4 border-b border-[#d8d0c8]/50 pb-3">
              <h3 className="font-serif text-lg font-semibold text-[#3a302a]">
                Intake Barang - Booking #{bookingId}
              </h3>
              <p className="mt-1 text-sm text-[#7a6f69]">
                Input daftar barang yang benar-benar diterima dari pelanggan.
              </p>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg border border-[#f5d8d8] bg-[#fdf2f2] px-3 py-2 text-sm text-[#8c3c3c]">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor={`items-${bookingId}`}
                  className="mb-1 block text-sm font-semibold text-[#3a302a]"
                >
                  Daftar Barang Diterima
                </label>
                <textarea
                  id={`items-${bookingId}`}
                  value={itemsDraft}
                  onChange={(event) => setItemsDraft(event.target.value)}
                  rows={6}
                  disabled={isPending}
                  className="w-full rounded-xl border border-[#d8d0c8] bg-white p-3 text-sm text-[#3a302a] outline-none transition focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a]"
                  placeholder={`Tulis satu item per baris\nContoh:\n- Sajadah putih\n- Mukena satin\n- Box mahar`}
                />
              </div>

              <div>
                <label
                  htmlFor={`wo-note-${bookingId}`}
                  className="mb-1 block text-sm font-semibold text-[#3a302a]"
                >
                  Catatan Global WO (Opsional)
                </label>
                <textarea
                  id={`wo-note-${bookingId}`}
                  value={woGlobalNote}
                  onChange={(event) => setWoGlobalNote(event.target.value)}
                  rows={2}
                  disabled={isPending}
                  className="w-full rounded-xl border border-[#d8d0c8] bg-white p-3 text-sm text-[#3a302a] outline-none transition focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a]"
                  placeholder="Misal: Barang WO tiba bersamaan dalam 1 mobil box."
                />
              </div>

              <div>
                <label
                  htmlFor={`related-bookings-${bookingId}`}
                  className="mb-1 block text-sm font-semibold text-[#3a302a]"
                >
                  Booking ID Terkait WO (Opsional)
                </label>
                <input
                  id={`related-bookings-${bookingId}`}
                  value={relatedBookingIdsInput}
                  onChange={(event) =>
                    setRelatedBookingIdsInput(event.target.value)
                  }
                  disabled={isPending}
                  className="w-full rounded-xl border border-[#d8d0c8] bg-white p-3 text-sm text-[#3a302a] outline-none transition focus:border-[#c2652a] focus:ring-1 focus:ring-[#c2652a]"
                  placeholder="Pisahkan dengan koma, contoh: 120, 121, 122"
                />
                <p className="mt-1 text-xs text-[#7a6f69]">
                  Jika diisi, catatan global akan diterapkan ke booking yang
                  ID-nya Anda masukkan.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (isPending) return;
                  setIsReceiveModalOpen(false);
                }}
                className="rounded-lg border border-[#d8d0c8] bg-white px-4 py-2.5 text-sm font-semibold text-[#3a302a] transition hover:bg-[#faf5ee]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReceive}
                disabled={isPending}
                className="rounded-lg bg-[#c2652a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a85522] disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : "Simpan & Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
