"use client";

import { useState } from "react";
import { createManualBooking } from "@/actions/admin-booking";

type ServiceBase = {
  id: number;
  nama_desain: string;
};

export default function AdminManualBookingModal({
  services,
}: {
  services: ServiceBase[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const result = await createManualBooking(formData);

    if (result.success) {
      setIsOpen(false);
      alert("Pesanan manual berhasil ditambahkan dan stok telah dikunci!");
    } else {
      setErrorMsg(result.error || "Terjadi kesalahan.");
    }

    setIsPending(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-[#3a302a] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#29221d] active:scale-95"
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Input Pesanan Manual
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 px-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#3a302a]">
                  Booking Offline / WA
                </h3>
                <p className="text-sm text-[#7a6f69] mt-1">
                  Pesanan akan otomatis berstatus CONFIRMED & memotong stok web.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#3a302a]">
                  Nama Pelanggan (WA)
                </label>
                <input
                  required
                  type="text"
                  name="nama_customer"
                  placeholder="Misal: Rina (WO) / Budi"
                  className="w-full rounded-xl border border-[#d8d0c8] px-4 py-3 text-sm focus:border-[#c2652a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                />
              </div>

              {/* --- TAMBAHAN BARU: Pengantin & Catatan --- */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3a302a]">
                    Pengantin Pria
                  </label>
                  <input
                    required
                    type="text"
                    name="nama_pengantin_pria"
                    placeholder="Nama Pria"
                    className="w-full rounded-xl border border-[#d8d0c8] px-4 py-3 text-sm focus:border-[#c2652a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3a302a]">
                    Pengantin Wanita
                  </label>
                  <input
                    required
                    type="text"
                    name="nama_pengantin_wanita"
                    placeholder="Nama Wanita"
                    className="w-full rounded-xl border border-[#d8d0c8] px-4 py-3 text-sm focus:border-[#c2652a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#3a302a]">
                  Catatan Khusus (Warna/Bunga)
                </label>
                <textarea
                  name="catatan_tambahan"
                  placeholder="Misal: Warna bunga dominan putih, pakai pita sage green..."
                  rows={2}
                  className="w-full rounded-xl border border-[#d8d0c8] px-4 py-3 text-sm focus:border-[#c2652a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                ></textarea>
              </div>
              {/* ----------------------------------------- */}

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#3a302a]">
                  Desain Hantaran
                </label>
                <select
                  required
                  name="service_id"
                  className="w-full rounded-xl border border-[#d8d0c8] px-4 py-3 text-sm focus:border-[#c2652a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                >
                  <option value="">-- Pilih Desain --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama_desain}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3a302a]">
                    Tanggal Acara
                  </label>
                  <input
                    required
                    type="date"
                    name="event_date"
                    className="w-full rounded-xl border border-[#d8d0c8] px-4 py-3 text-sm focus:border-[#c2652a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3a302a]">
                    Jumlah Box
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="jumlah_box"
                    defaultValue={1}
                    className="w-full rounded-xl border border-[#d8d0c8] px-4 py-3 text-sm focus:border-[#c2652a] focus:outline-none focus:ring-1 focus:ring-[#c2652a]"
                  />
                </div>
              </div>

              <button
                disabled={isPending}
                type="submit"
                className="mt-4 w-full rounded-xl bg-[#c2652a] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#a85522] active:scale-95 disabled:opacity-50"
              >
                {isPending
                  ? "Memproses & Mengunci Stok..."
                  : "Kunci Stok & Simpan Pesanan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
