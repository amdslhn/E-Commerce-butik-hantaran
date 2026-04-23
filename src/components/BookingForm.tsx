"use client";

import { useActionState, useState } from "react";
import { checkoutBooking } from "@/actions/booking";

type Service = {
  id: number;
  nama_desain: string;
  harga_reguler: number;
  harga_wo: number;
};

const initialState = { success: false, error: "", message: "" };

type BookingFormProps = {
  services: Service[];
  userId: number | null;
  isWOUser?: boolean;
};

export default function BookingForm({
  services,
  userId,
  isWOUser = false,
}: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(
    checkoutBooking,
    initialState,
  );
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const isUserMissing = userId === null;

  const handleOpenTermsModal = () => {
    if (isPending || isUserMissing) return;
    setIsTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    if (isPending) return;
    setIsTermsModalOpen(false);
    setIsTermsAccepted(false);
  };

  return (
    <form
      action={formAction}
      // Card: Padding luas, border tipis hangat, dan ultra-soft shadow
      className="max-w-lg mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,0.04)] border border-[#d8d0c8]/60 space-y-6 font-sans"
    >
      {/* Headline: Menggunakan serif, warna hangat gelap */}
      <h2 className="text-3xl font-serif font-medium text-center text-[#3a302a] tracking-tight mb-2">
        Penyewaan Hantaran
      </h2>

      {state?.error && (
        <div className="p-4 bg-[#fdf2f2] text-[#8c3c3c] border border-[#f5d8d8] rounded-lg text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="p-4 bg-[#f2f7ec] text-[#4a5c3a] border border-[#e0ebd5] rounded-lg text-sm">
          Berhasil! Pesanan Anda sedang diproses.
        </div>
      )}

      {isUserMissing && (
        <div className="p-4 bg-[#fdf2f2] text-[#8c3c3c] border border-[#f5d8d8] rounded-lg text-sm">
          Data user tidak ditemukan di database. Tambahkan minimal 1 user dulu
          untuk testing booking.
        </div>
      )}

      <input type="hidden" name="user_id" value={userId ?? 1} />
      <input
        type="hidden"
        name="tnc_accepted"
        value={isTermsAccepted ? "true" : "false"}
      />

      <div className="space-y-5">
        {/* --- NAMA PENGANTIN --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="nama_pengantin_pria"
              className="text-sm font-medium text-[#3a302a]"
            >
              Pengantin Pria
            </label>
            <input
              type="text"
              id="nama_pengantin_pria"
              name="nama_pengantin_pria"
              required
              disabled={isPending || isUserMissing}
              className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] placeholder-[#a39a94] transition-all disabled:bg-[#faf5ee] disabled:text-[#a39a94]"
              placeholder="Misal: Budi"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="nama_pengantin_wanita"
              className="text-sm font-medium text-[#3a302a]"
            >
              Pengantin Wanita
            </label>
            <input
              type="text"
              id="nama_pengantin_wanita"
              name="nama_pengantin_wanita"
              required
              disabled={isPending || isUserMissing}
              className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] placeholder-[#a39a94] transition-all disabled:bg-[#faf5ee] disabled:text-[#a39a94]"
              placeholder="Misal: Siti"
            />
          </div>
        </div>

        {/* --- CATATAN TAMBAHAN --- */}
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="catatan_tambahan"
            className="text-sm font-medium text-[#3a302a]"
          >
            Catatan (Opsional)
          </label>
          <textarea
            id="catatan_tambahan"
            name="catatan_tambahan"
            rows={2}
            disabled={isPending || isUserMissing}
            className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] placeholder-[#a39a94] transition-all disabled:bg-[#faf5ee] disabled:text-[#a39a94]"
            placeholder="Misal: Warna pita sage green"
          />
        </div>

        {isWOUser && (
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="nama_klien_wo"
              className="text-sm font-medium text-[#3a302a]"
            >
              Nama Klien WO (Opsional)
            </label>
            <input
              type="text"
              id="nama_klien_wo"
              name="nama_klien_wo"
              disabled={isPending || isUserMissing}
              className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] placeholder-[#a39a94] transition-all disabled:bg-[#faf5ee] disabled:text-[#a39a94]"
              placeholder="Misal: Keluarga Bapak Andi"
            />
            <p className="text-xs text-[#7a6f69]">
              Diisi jika pemesanan ini mewakili klien tertentu dari vendor WO.
            </p>
          </div>
        )}

        {/* --- PILIH DESAIN --- */}
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="service_id"
            className="text-sm font-medium text-[#3a302a]"
          >
            Pilih Desain Hantaran
          </label>
          <select
            id="service_id"
            name="service_id"
            required
            disabled={isPending || isUserMissing}
            className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] transition-all disabled:bg-[#faf5ee] disabled:text-[#a39a94]"
          >
            <option value="" className="text-[#a39a94]">
              -- Pilih Desain --
            </option>
            {services.map((svc) => (
              <option key={svc.id} value={svc.id} className="text-[#3a302a]">
                {svc.nama_desain} - Rp
                {svc.harga_reguler.toLocaleString("id-ID")}
              </option>
            ))}
          </select>
        </div>

        {/* --- TANGGAL ACARA --- */}
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="event_date"
            className="text-sm font-medium text-[#3a302a]"
          >
            Tanggal Acara (H-Hari H)
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            required
            disabled={isPending || isUserMissing}
            className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] transition-all disabled:bg-[#faf5ee] disabled:text-[#a39a94]"
          />
        </div>

        {/* --- JUMLAH BOX --- */}
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="jumlah_box"
            className="text-sm font-medium text-[#3a302a]"
          >
            Jumlah Box (Maks 70)
          </label>
          <input
            type="number"
            id="jumlah_box"
            name="jumlah_box"
            min="1"
            max="70"
            required
            disabled={isPending || isUserMissing}
            className="w-full bg-white border border-[#d8d0c8] p-3 rounded-lg focus:ring-1 focus:ring-[#c2652a] focus:border-[#c2652a] outline-none text-[#3a302a] placeholder-[#a39a94] transition-all disabled:bg-[#faf5ee] disabled:text-[#a39a94]"
          />
        </div>
      </div>

      {/* --- TOMBOL SUBMIT --- */}
      <button
        type="button"
        onClick={handleOpenTermsModal}
        disabled={isPending || isUserMissing}
        className="w-full mt-4 bg-[#c2652a] hover:bg-[#a85522] text-white font-medium py-3.5 rounded-lg disabled:opacity-50 transition-colors shadow-sm flex justify-center items-center"
      >
        {isPending ? (
          <span className="animate-pulse">Memproses...</span>
        ) : (
          "Checkout Sekarang"
        )}
      </button>

      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-[#d8d0c8]/50 bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-4 border-b border-[#d8d0c8]/50 pb-3">
              <h3 className="font-serif text-xl font-semibold text-[#3a302a]">
                Syarat & Ketentuan Booking
              </h3>
              <p className="mt-1 text-sm text-[#7a6f69]">
                Mohon baca aturan berikut sebelum melanjutkan pembayaran.
              </p>
            </div>

            <ol className="space-y-3 rounded-xl border border-[#d8d0c8]/50 bg-[#faf5ee] p-4 text-sm text-[#3a302a]">
              <li>
                1. Barang wajib di-drop-off maksimal H-3 sebelum tanggal acara.
              </li>
              <li>
                2. Barang harus di-pick-up paling lambat H-1 sebelum acara.
              </li>
              <li>3. Barang wajib dikembalikan maksimal H+2 setelah acara.</li>
              <li>
                4. Pesanan otomatis dibatalkan jika belum ada konfirmasi sampai
                H-3.
              </li>
              <li>
                5. Kerusakan atau kehilangan barang akan dikenakan denda sesuai
                kebijakan butik.
              </li>
            </ol>

            <label className="mt-5 flex items-start gap-3 rounded-lg border border-[#d8d0c8]/60 bg-white p-3 text-sm text-[#3a302a]">
              <input
                type="checkbox"
                checked={isTermsAccepted}
                onChange={(event) => setIsTermsAccepted(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#c8bfb5] text-[#c2652a] focus:ring-[#c2652a]"
              />
              <span>Saya menyetujui syarat dan ketentuan yang berlaku.</span>
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseTermsModal}
                disabled={isPending}
                className="rounded-lg border border-[#d8d0c8] bg-white px-4 py-2.5 text-sm font-semibold text-[#3a302a] transition hover:bg-[#faf5ee] disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!isTermsAccepted || isPending}
                className="rounded-lg bg-[#c2652a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a85522] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Memproses..." : "Konfirmasi & Bayar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
