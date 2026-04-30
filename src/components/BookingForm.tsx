"use client";

import { useActionState, useEffect, useState } from "react";
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
  const [showTermsSuccessAlert, setShowTermsSuccessAlert] = useState(false);
  const [dismissedErrorMessage, setDismissedErrorMessage] = useState<
    string | null
  >(null);

  const isUserMissing = userId === null;
  const currentErrorMessage = state?.error?.trim() ?? "";
  const shouldShowErrorAlert =
    currentErrorMessage.length > 0 &&
    dismissedErrorMessage !== currentErrorMessage;

  useEffect(() => {
    if (!showTermsSuccessAlert) return;

    const timeoutId = window.setTimeout(() => {
      setShowTermsSuccessAlert(false);
    }, 2600);

    return () => window.clearTimeout(timeoutId);
  }, [showTermsSuccessAlert]);

  useEffect(() => {
    if (!shouldShowErrorAlert) return;

    const timeoutId = window.setTimeout(() => {
      setDismissedErrorMessage(currentErrorMessage);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [shouldShowErrorAlert, currentErrorMessage]);

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

      {showTermsSuccessAlert && !state?.error && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-4 top-4 z-60 mx-auto w-full max-w-md"
        >
          <div className="pointer-events-auto overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/95 shadow-[0_16px_35px_rgba(5,80,45,0.18)] backdrop-blur-sm">
            <div className="h-1.5 w-full bg-linear-to-r from-emerald-500 via-lime-500 to-amber-400" />
            <div className="flex items-start gap-3 p-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 010 1.42l-7 7a1 1 0 01-1.42 0l-3-3a1 1 0 011.42-1.42L9 11.586l6.296-6.296a1 1 0 011.408 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-800">
                  Konfirmasi berhasil
                </p>
                <p className="mt-1 text-sm text-emerald-700">
                  Aturan booking sudah disetujui. Pesanan Anda sedang diproses.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {shouldShowErrorAlert && (
        <div
          role="alert"
          aria-live="assertive"
          className="pointer-events-none fixed inset-x-4 top-4 z-70 mx-auto w-full max-w-lg"
        >
          <div className="pointer-events-auto overflow-hidden rounded-2xl border border-rose-200/80 bg-white/95 shadow-[0_16px_35px_rgba(120,24,36,0.2)] backdrop-blur-sm">
            <div className="h-1.5 w-full bg-linear-to-r from-rose-500 via-red-500 to-amber-400" />
            <div className="flex items-start gap-3 p-4">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-8-3a1 1 0 00-1 1v3a1 1 0 102 0V8a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 15z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-rose-800">
                  Booking gagal
                </p>
                <p className="mt-1 text-sm text-rose-700">
                  {currentErrorMessage}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDismissedErrorMessage(currentErrorMessage)}
                className="rounded-full p-1 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                aria-label="Tutup alert error"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

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
                kebijakan butik hantaran.
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
                type="button"
                onClick={(event) => {
                  const form = event.currentTarget.form;
                  if (!form) return;

                  setDismissedErrorMessage(null);
                  setIsTermsModalOpen(false);
                  setShowTermsSuccessAlert(true);
                  form.requestSubmit();
                }}
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
